import { render, screen, waitFor } from "@testing-library/react";
import { EndpointData } from "~/components/endpoint-data";
import { CrimeDataResponseBody } from "~/pages/api/crime-data";
import data from "~test/api-fixtures/crime-data.json";
import offencesByLev1 from "~test/api-fixtures/crime-data-offs-by-lev1desc.json";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as fetching from "~/utils/fetching";

describe(EndpointData.name, () => {
  const fetchDataMock = vi.spyOn(fetching, "fetchData");

  it("fetches from endpoint and renders data", async () => {
    fetchDataMock.mockResolvedValue(data as CrimeDataResponseBody & object);

    render(<EndpointData endpoint="/api/crime-data" />);

    await waitFor(() => {
      expect(fetchDataMock).toHaveBeenCalledWith("/api/crime-data", "");
    });

    await expect(screen.findAllByTestId("accordion")).resolves.toHaveLength(1);
    await expect(screen.findAllByTestId("accordion-item")).resolves.toHaveLength(61);
  });

  it("renders data with no accordion if not grouped", async () => {
    fetchDataMock.mockResolvedValue(data as CrimeDataResponseBody & object);

    render(<EndpointData endpoint="/api/crime-data" />);

    await waitFor(() => {
      expect(fetchDataMock).toHaveBeenCalledWith("/api/crime-data", "");
    });

    const select = await screen.findByRole<HTMLSelectElement>("combobox", { name: "Group by" });
    await userEvent.selectOptions(select, ["(none)"]);
    expect(select).toHaveValue("");

    await expect(screen.findAllByTestId("row")).resolves.toHaveLength(100);
    expect(screen.queryByTestId("accordion")).not.toBeInTheDocument();
    expect(screen.queryByTestId("accordion-item")).not.toBeInTheDocument();
  });

  it("renders aggregated offence-count by lvl-1-desc when selected as offenceBy", async () => {
    fetchDataMock.mockResolvedValue(
      offencesByLev1 satisfies CrimeDataResponseBody<"Offence Level 1 Description"> & object,
    );

    render(<EndpointData endpoint="/api/crime-data" />);

    const select = await screen.findByRole<HTMLSelectElement>("combobox", { name: "Offences by" });
    await userEvent.selectOptions(select, ["Offence Level 1 Description"]);

    await waitFor(() => {
      expect(fetchDataMock).toHaveBeenCalledWith("/api/crime-data", "offencesBy=Offence+Level+1+Description");
    });

    await expect(screen.findAllByTestId("table")).resolves.toHaveLength(1);
    await expect(screen.findAllByTestId("row")).resolves.toHaveLength(2);
    expect(screen.queryByTestId("accordion-item")).not.toBeInTheDocument();
  });

  it.each([
    { unset: "Offences by", when: "Group by" },
    { unset: "Group by", when: "Offences by" },
  ])("unsets $unset when $when selected", async ({ unset, when }) => {
    render(<EndpointData endpoint="/api/crime-data" />);

    const whenSelect = await screen.findByRole<HTMLSelectElement>("combobox", { name: when });
    await userEvent.selectOptions(whenSelect, [data.allKeys[5]!]);

    const unsetSelect = await screen.findByRole<HTMLSelectElement>("combobox", { name: unset });
    expect(unsetSelect).toHaveValue("");
  });
});

import { render, screen } from "@testing-library/react";

import Home from "~/pages/index";
import { vi } from "vitest";

vi.mock("~/components/endpoint-data");

describe(Home.name, () => {
  it("renders headline", () => {
    render(<Home />);

    expect(screen.getByTestId("main")).toBeInTheDocument();
  });
});

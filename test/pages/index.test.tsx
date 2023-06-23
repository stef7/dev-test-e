import { render, screen } from "@testing-library/react";

import Home from "../../src/pages/index";

describe("App", () => {
  it("renders headline", () => {
    render(<Home />);

    expect(screen.getByTestId("main")).toBeInTheDocument();
  });
});

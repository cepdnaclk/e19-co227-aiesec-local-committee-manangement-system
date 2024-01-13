import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterTagBar from "../index";

describe("FilterTagBar Component", () => {
  const mockData = [
    { status: "open", value: 1 },
    { status: "open", value: 2 },
    { status: "closed", value: 3 },
    { status: "rejected", value: 3 },
  ];

  const tags = ["open", "closed", "rejected", "approved"];

  const setGroupedData = jest.fn();

  it("renders without data", () => {
    render(
      <FilterTagBar
        initialData={[]}
        setGroupedData={() => {}}
        searchProp=""
        tags={[]}
      />
    );
  });

  it("renders with data", () => {
    render(
      <FilterTagBar
        initialData={mockData}
        setGroupedData={() => {}}
        searchProp=""
        tags={[]}
      />
    );
  });

  it.skip("renders tags", () => {
    render(
      <FilterTagBar
        initialData={mockData}
        setGroupedData={() => {}}
        searchProp=""
        tags={tags}
      />
    );
    // css-6od3lo-MuiChip-label
    tags.forEach((tag) => {
      const chip = screen.getByText(tag);
      expect(chip).toBeInTheDocument();
      // expect(chip).toHaveClass("MuiChip-colorDefault");
      // fireEvent.click(chip);
      // expect(chip).toHaveClass("MuiChip-colorSuccess");
      // fireEvent.click(chip);
    });
  });
});

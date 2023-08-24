import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { toBeInTheDocument } from "@testing-library/jest-dom";
import SearchBar from "../index";

describe("SearchBar Component", () => {
  const mockInitialData = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
  ];

  it("render with empty data", () => {
    render(
      <SearchBar initialData={[]} setFilteredData={() => {}} searchProp="" />
    );

    // check if the component renders without errors
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("handle filtering empty data", () => {
    const setFilteredData = jest.fn();

    render(
      <SearchBar
        initialData={[]}
        setFilteredData={setFilteredData}
        searchProp=""
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");

    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "Banana" } });

    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([]);
  });

  it("render with mock data", () => {
    render(
      <>
        <SearchBar
          initialData={mockInitialData}
          setFilteredData={() => {}}
          searchProp="name"
        />
        <ul>
          {mockInitialData.map((item) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
      </>
    );

    // check if the component renders without errors
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();

    // check if the mock data is displayed in the list
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("filters data correctly when typing into the search input", () => {
    const setFilteredData = jest.fn();
    render(
      <SearchBar
        initialData={mockInitialData}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");

    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "Banana" } });

    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([{ id: 2, name: "Banana" }]);
  });

  it("clears the search input when the clear button is clicked", () => {
    render(
      <SearchBar
        initialData={mockInitialData}
        setFilteredData={() => {}}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByLabelText("Clear");

    // Type 'Cherry' into the search input
    fireEvent.change(searchInput, { target: { value: "Cherry" } });

    // Ensure the search input has the correct value
    expect(searchInput).toHaveValue("Cherry");

    // Click the clear button
    fireEvent.click(clearButton);

    // Ensure the search input is cleared
    expect(searchInput).toHaveValue("");
  });
});

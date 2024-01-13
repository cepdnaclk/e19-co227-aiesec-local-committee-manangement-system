import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../index";

describe("SearchBar Component", () => {
  const mockData = [
    { id: 1, name: "Apple", color: "Green" },
    { id: 2, name: "Banana", color: "Yellow" },
    { id: 3, name: "Cherry", color: "Red" },
    { id: 4, name: "Strawberry", color: "Red" },
    { id: 5, name: "Blueberry", color: "Blue" },
  ];

  const setFilteredData = jest.fn();

  it("render with empty data", () => {
    render(
      <SearchBar
        initialData={[]}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    // check if the component renders without errors
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("render with mock data", () => {
    render(
      <>
        <SearchBar
          initialData={mockData}
          setFilteredData={setFilteredData}
          searchProp="name"
        />
        <ul>
          {mockData.map((item) => {
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
    expect(screen.getByText("Strawberry")).toBeInTheDocument();
    expect(screen.getByText("Blueberry")).toBeInTheDocument();
  });

  it("handle filtering empty data", () => {
    render(
      <SearchBar
        initialData={[]}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    // check if the component renders without errors
    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toBeInTheDocument();

    // Type text into the search input and check if the component filters properly
    fireEvent.change(searchInput, { target: { value: "Banana" } });
    expect(setFilteredData).toHaveBeenCalledWith([]);
  });

  it("handle filtering mock data with matching data", () => {
    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");

    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "erry" } });

    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([
      { id: 3, name: "Cherry", color: "Red" },
      { id: 4, name: "Strawberry", color: "Red" },
      { id: 5, name: "Blueberry", color: "Blue" },
    ]);
  });

  it("handle filtering mock data with no matching data", () => {
    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");

    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "Kiwi" } });

    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([]);
  });

  it("clears the search input when the clear button is clicked with no data", () => {
    render(
      <SearchBar
        initialData={[]}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByLabelText("Clear");

    // Ensure the search input has the correct value
    fireEvent.change(searchInput, { target: { value: "Cherry" } });
    expect(searchInput).toHaveValue("Cherry");
    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([]);

    // Click the clear button
    fireEvent.click(clearButton);

    // Ensure the search input is cleared and data is reset
    expect(searchInput).toHaveValue("");
    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([]);
  });

  it("clears the search input when the clear button is clicked with mock data", () => {
    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByLabelText("Clear");

    // Type 'Cherry' into the search input
    fireEvent.change(searchInput, { target: { value: "Cherry" } });

    // Ensure the search input has the correct value
    expect(searchInput).toHaveValue("Cherry");
    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([
      { id: 3, name: "Cherry", color: "Red" },
    ]);

    // Click the clear button
    fireEvent.click(clearButton);

    // Ensure the search input is cleared
    expect(searchInput).toHaveValue("");
    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith(mockData);
  });

  it("clear button is disabled when search text is empty", () => {
    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByLabelText("Clear");

    fireEvent.change(searchInput, { target: { value: "Cherry" } });
    fireEvent.click(clearButton);
    expect(clearButton).toBeDisabled();
  });

  it("resets filtered data when search prop changes", () => {
    let searchProp = "name";

    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp={searchProp}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Red" } });
    expect(setFilteredData).toHaveBeenCalledWith([]);

    searchProp = "color";

    expect(setFilteredData).toHaveBeenCalledWith(mockData);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("handles invalid search props", () => {
    render(
      <SearchBar
        initialData={mockData}
        setFilteredData={setFilteredData}
        searchProp="invalid"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Cherry" } });
    expect(setFilteredData).toHaveBeenCalledWith(mockData);
  });
});

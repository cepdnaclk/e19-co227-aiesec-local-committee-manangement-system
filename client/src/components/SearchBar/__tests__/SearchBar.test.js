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

<<<<<<< Updated upstream
  it("render with empty data", () => {
=======
  const setFilteredData = jest.fn();

  it("works with empty data", () => {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    const searchInput = screen.getByPlaceholderText("Search");

    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "Banana" } });

    // Ensure setFilteredData was called with the filtered data
=======
    // check if the component renders without errors
    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toBeInTheDocument();

    // Type text into the search input and check if the component filters properly
    fireEvent.change(searchInput, { target: { value: "Banana" } });
>>>>>>> Stashed changes
    expect(setFilteredData).toHaveBeenCalledWith([]);
  });

  it("works with mock data", () => {
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
    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toBeInTheDocument();

    // check if the mock data is displayed in the list
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

<<<<<<< Updated upstream
  it("filters data correctly when typing into the search input", () => {
    const setFilteredData = jest.fn();
    render(
      <SearchBar
        initialData={mockInitialData}
=======
  it("filters correctly", () => {
    render(
      <SearchBar
        initialData={mockData}
>>>>>>> Stashed changes
        setFilteredData={setFilteredData}
        searchProp="name"
      />
    );

    const searchInput = screen.getByPlaceholderText("Search");

<<<<<<< Updated upstream
    // Type 'Banana' into the search input
    fireEvent.change(searchInput, { target: { value: "Banana" } });

    // Ensure setFilteredData was called with the filtered data
    expect(setFilteredData).toHaveBeenCalledWith([{ id: 2, name: "Banana" }]);
=======
    // Type text with matching data into the search input and check if the component filters properly
    fireEvent.change(searchInput, { target: { value: "erry" } });
    expect(setFilteredData).toHaveBeenCalledWith([
      { id: 3, name: "Cherry", color: "Red" },
      { id: 4, name: "Strawberry", color: "Red" },
      { id: 5, name: "Blueberry", color: "Blue" },
    ]);

    // Type text with no matching data into the search input and check if the component filters properly
    fireEvent.change(searchInput, { target: { value: "Kiwi" } });
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
    expect(setFilteredData).toHaveBeenCalledWith([]);

    // Click the clear button
    fireEvent.click(clearButton);

    // Ensure the search input is cleared and data is reset
    expect(searchInput).toHaveValue("");
    expect(setFilteredData).toHaveBeenCalledWith([]);
>>>>>>> Stashed changes
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

    // Ensure the search input has the correct value
    fireEvent.change(searchInput, { target: { value: "Cherry" } });
    expect(searchInput).toHaveValue("Cherry");
<<<<<<< Updated upstream
=======
    expect(setFilteredData).toHaveBeenCalledWith([
      { id: 3, name: "Cherry", color: "Red" },
    ]);
>>>>>>> Stashed changes

    // Click the clear button
    fireEvent.click(clearButton);

    // Ensure the search input is cleared and data is reset
    expect(searchInput).toHaveValue("");
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  });
});

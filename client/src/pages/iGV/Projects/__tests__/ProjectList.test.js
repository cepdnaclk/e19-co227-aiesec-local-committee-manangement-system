import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRoute, BrowserRouter, Route } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import ProjectList from "../ProjectList";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "@testing-library/jest-dom";
describe("IGV ProjectList Component", () => {
  it.only("renders loading state while data is loading", () => {
    const mockUserContextValue = {
      privileges: {
        isIGVAdmin: true,
        isIGVUser: true,
      },
    };

    const mockQueryClient = new QueryClient();

    const mockUseQuery = jest.fn(() => ({ isLoading: true }));

    render(
      <>
        <UserContext.Provider value={mockUserContextValue}>
          <QueryClientProvider client={mockQueryClient}>
            <BrowserRouter initialEntries={["/projects"]}>
              <ProjectList />
            </BrowserRouter>
          </QueryClientProvider>
        </UserContext.Provider>
      </>
    );

    // Assert that loading state is displayed
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state when data fetch fails", () => {
    const mockUserContextValue = {
      user: {
        roleId: "LCP", // Set your desired user role here
      },
    };

    const mockUseQuery = jest.fn(() => ({
      isError: true,
      error: "Some error",
    }));

    render(
      <UserContext.Provider value={mockUserContextValue}>
        <BrowserRouter initialEntries={["/projects"]}>
          <ProjectList />
        </BrowserRouter>
      </UserContext.Provider>
    );

    // Assert that error state is displayed
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  // Add more test cases to cover other scenarios and interactions
});

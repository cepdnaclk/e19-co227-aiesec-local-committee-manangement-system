import React from "react";
import {
  waitFor,
  act,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { BrowserRoute, BrowserRouter, Route } from "react-router-dom";

import Login from "../Login";

import "@testing-library/jest-dom";
describe("Login Page", () => {
  // Mock API and navigate functions
  const mockApiCall = jest.fn();
  const mockNavigate = jest.fn();

  jest.mock("../../api/axios", () => ({
    post: mockApiCall,
  }));

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  it("renders the login form", () => {
    render(
      <>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </>
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("submits the login form successfully", async () => {
    render(
      <>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </>
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("Submit");

    // act(() => {
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    // });

    // You may want to use mock functions to simulate a successful API response
    // and check if the user is redirected to the homepage.
    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalled();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  //   it('handles a missing user error', async () => {
  //     render(<Login />);
  //     const emailInput = screen.getByLabelText('Email');
  //     const passwordInput = screen.getByLabelText('Password');
  //     const submitButton = screen.getByText('Submit');

  //     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  //     fireEvent.change(passwordInput, { target: { value: 'password123' });
  //     fireEvent.click(submitButton);

  //     // You may want to use mock functions to simulate an error response
  //     // and check if the error message is displayed.
  //     await waitFor(() => {
  //       expect(mockApiCall).toHaveBeenCalled();
  //       expect(screen.getByText('Missing User')).toBeInTheDocument();
  //     });
  //   });

  //   it('handles a password mismatch error', async () => {
  //     render(<Login />);
  //     const emailInput = screen.getByLabelText('Email');
  //     const passwordInput = screen.getByLabelText('Password');
  //     const submitButton = screen.getByText('Submit');

  //     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  //     fireEvent.change(passwordInput, { target: { value: 'incorrectPassword' });
  //     fireEvent.click(submitButton);

  //     // You may want to use mock functions to simulate an error response
  //     // and check if the error message is displayed.
  //     await waitFor(() => {
  //       expect(mockApiCall).toHaveBeenCalled();
  //       expect(screen.getByText('Password Mismatch')).toBeInTheDocument();
  //     });
  //   });

  //   it('logs out successfully', async () => {
  //     render(<Login />);

  //     // Simulate a user being logged in
  //     const mockUser = {
  //       id: 1,
  //       email: 'test@example.com',
  //       preferredName: 'Test User',
  //       roleId: 1,
  //       frontOfficeId: 1,
  //       departmentId: 1,
  //       backOfficeId: 1,
  //     };
  //     setUser(mockUser);

  //     const logoutButton = screen.getByText('Logout');
  //     fireEvent.click(logoutButton);

  //     // You may want to use mock functions to simulate a successful logout
  //     // and check if the user is redirected to the homepage.
  //     await waitFor(() => {
  //       expect(mockApiCall).toHaveBeenCalled();
  //       expect(mockNavigate).toHaveBeenCalledWith('/');
  //     });
  //   });
});

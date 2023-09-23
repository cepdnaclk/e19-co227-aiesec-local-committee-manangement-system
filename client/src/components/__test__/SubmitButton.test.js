import React from "react";
import { render } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect"; // Import to extend Jest with toBeInTheDocument
import "@testing-library/jest-dom";
import SubmitButton from "../SubmitButton"; // Assuming your component file is named SubmitButton.js

// Mock the useFormikContext function
jest.mock("formik", () => ({
  useFormikContext: jest.fn(),
}));

describe("SubmitButton", () => {
  // Mock the values returned by useFormikContextw
  const mockFormikContext = {
    isSubmitting: false,
    isValid: true,
  };

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it("renders the SubmitButton with the correct attributes when not submitting and isValid", () => {
    // Mock the useFormikContext hook to return the values we need for this test
    jest
      .spyOn(require("formik"), "useFormikContext")
      .mockReturnValue(mockFormikContext);

    const { getByText } = render(<SubmitButton />);

    // Ensure the button is enabled and has the correct text
    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  it("renders the SubmitButton with the correct attributes when submitting and isValid", () => {
    // Mock the useFormikContext hook to return the values we need for this test
    mockFormikContext.isSubmitting = true;
    jest
      .spyOn(require("formik"), "useFormikContext")
      .mockReturnValue(mockFormikContext);

    const { getByText } = render(<SubmitButton />);

    // Ensure the button is disabled and has the correct text
    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("renders the SubmitButton with the correct attributes when not submitting and !isValid", () => {
    // Mock the useFormikContext hook to return the values we need for this test
    mockFormikContext.isValid = false;
    jest
      .spyOn(require("formik"), "useFormikContext")
      .mockReturnValue(mockFormikContext);

    const { getByText } = render(<SubmitButton />);

    // Ensure the button is disabled and has the correct text
    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

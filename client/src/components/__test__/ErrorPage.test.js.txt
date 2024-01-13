import React from "react";
import { render } from "@testing-library/react"; // Import the render function
import ErrorPage from "../ErrorPage";
import "@testing-library/jest-dom"; // Import to extend Jest with toBeInTheDocument

describe("ErrorPage", () => {
  // it('renders an error message when error is provided', () => {
  // 	const error = { message: 'Test error message' };
  // 	const { getByText } = render(<ErrorPage error={error} />);

  // 	// const errorMessage = getByText('An Error has Occurred. Please Retry.');
  // 	// const errorDetail = getByText(`Message: ${error.message}`);

  // 	// expect(errorMessage).toBeInTheDocument();
  // 	// expect(errorDetail).toBeInTheDocument();
  // });

  it("renders without an error message when error is not provided", () => {
    const { queryByText } = render(<ErrorPage />);

    const errorMessage = queryByText("An Error has Occurred. Please Retry.");
    const errorDetail = queryByText("Message:");

    expect(errorMessage).toBeNull();
    expect(errorDetail).toBeNull();
  });
});

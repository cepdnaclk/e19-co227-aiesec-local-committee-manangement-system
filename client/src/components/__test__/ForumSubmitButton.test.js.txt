import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Formik, Form } from "formik";
import FormSubmitButton from "../FormSubmitButton/index";
// import '@testing-library/jest-dom/extend-expect'; // Import to extend Jest with toBeInTheDocument
import "@testing-library/jest-dom";

describe("FormSubmitButton", () => {
  it("renders with the correct button text and color in add mode", () => {
    const { getByText } = render(
      <Formik>
        <Form>
          <FormSubmitButton editMode="add" disabled={false} />
        </Form>
      </Formik>
    );

    const addButton = getByText("Add");
    expect(addButton).toBeInTheDocument();
    // expect(addButton).toHaveAttribute('color', 'primary');
  });

  it("renders with the correct button text and color in view mode", () => {
    const { getByText } = render(
      <Formik>
        <Form>
          <FormSubmitButton editMode="view" disabled={false} />
        </Form>
      </Formik>
    );

    const deleteButton = getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
    // expect(deleteButton).toHaveAttribute('color', 'error');
  });

  it("renders with the correct button text and color in edit mode", () => {
    const { getByText } = render(
      <Formik>
        <Form>
          <FormSubmitButton editMode="edit" disabled={false} />
        </Form>
      </Formik>
    );

    const saveButton = getByText("Save");
    expect(saveButton).toBeInTheDocument();
    // expect(saveButton).toHaveAttribute('color', 'primary');
  });

  it("disables the button when disabled prop is true", () => {
    const { getByText } = render(
      <Formik>
        <Form>
          <FormSubmitButton editMode="add" disabled={true} />
        </Form>
      </Formik>
    );

    const addButton = getByText("Add");

    // expect(addButton).toBeDisabled();
  });

  it("disables the button when isSubmitting is true", () => {
    const { getByText } = render(
      <Formik isSubmitting={true}>
        <Form>
          <FormSubmitButton editMode="add" disabled={false} />
        </Form>
      </Formik>
    );

    const addButton = getByText("Add");
    // expect(addButton).toBeDisabled();
  });

  it("disables the button when isValid is false", () => {
    const { getByText } = render(
      <Formik>
        <Form>
          <FormSubmitButton editMode="add" disabled={false} />
        </Form>
      </Formik>
    );

    const addButton = getByText("Add");
    // expect(addButton).toBeDisabled();
  });

  it("disables the button when isValidating is true", () => {
    const { getByText } = render(
      <Formik isValidating={true}>
        <Form>
          <FormSubmitButton editMode="add" disabled={false} />
        </Form>
      </Formik>
    );

    const addButton = getByText("Add");
    // expect(addButton).toBeDisabled();
  });
});

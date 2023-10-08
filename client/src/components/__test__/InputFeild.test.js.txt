import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Formik, Field, Form } from "formik";
import FieldComponent from "./../InputField/Field";
// import '@testing-library/jest-dom/extend-expect'; // Import to extend Jest with toBeInTheDocument
import "@testing-library/jest-dom";

const options = [
  { key: "option1", value: "Option 1" },
  { key: "option2", value: "Option 2" },
  { key: "option3", value: "Option 3" },
];

describe("Field", () => {
  it("renders a text field with a label", () => {
    render(
      <Formik initialValues={{ fieldName: "" }} onSubmit={() => {}}>
        <Form>
          <FieldComponent name="fieldName" label="Field Label" />
        </Form>
      </Formik>
    );

    const textField = screen.getByLabelText("Field Label");
    expect(textField).toBeInTheDocument();
  });

  //   it("renders a select field with options", () => {
  //     render(
  //       <Formik initialValues={{ selectName: "" }} onSubmit={() => {}}>
  //         <Form>
  //           <FieldComponent name="selectName" options={options} />
  //         </Form>
  //       </Formik>
  //     );

  //     const selectField = screen.getByRole("combobox");
  //     expect(selectField).toBeInTheDocument();

  //     options.forEach((option) => {
  //       const menuItem = screen.getByText(option.value);
  //       expect(menuItem).toBeInTheDocument();
  //     });
  //   });

  //   it("renders an error message when there is a validation error", async () => {
  //     render(
  //       <Formik
  //         initialValues={{ fieldName: "" }}
  //         onSubmit={() => {}}
  //         validationSchema={{
  //           fieldName: Yup.string().required("Field is required"),
  //         }}
  //       >
  //         <Form>
  //           <FieldComponent name="fieldName" label="Field Label" />
  //         </Form>
  //       </Formik>
  //     );

  //     const textField = screen.getByLabelText("Field Label");
  //     fireEvent.blur(textField);

  //     const errorMessage = await screen.findByText("Field is required");
  //     expect(errorMessage).toBeInTheDocument();
  //   });

  //   it("disables the field when the disabled prop is set", () => {
  //     render(
  //       <Formik initialValues={{ fieldName: "" }} onSubmit={() => {}}>
  //         <Form>
  //           <FieldComponent name="fieldName" label="Field Label" disabled />
  //         </Form>
  //       </Formik>
  //     );

  //     const textField = screen.getByLabelText("Field Label");
  //     expect(textField).toBeDisabled();
  //   });
});

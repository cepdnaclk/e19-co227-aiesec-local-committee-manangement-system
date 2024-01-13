import React from "react";

import Field from "./Field";

const InputField = ({ type, ...rest }) => {
  switch (type) {
    case "select":
      return <Field select {...rest} />;
    case "date":
      return (
        <Field
          type={type}
          // Fix: Always keep label at top with date fields to prevent overlapping
          InputLabelProps={{ shrink: true }}
          {...rest}
        />
      );
    default:
      return <Field type={type || "text"} {...rest} />;
  }
};

export default InputField;

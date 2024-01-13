import { Field, useFormikContext } from "formik";
import { TextField } from "@mui/material";

export default function ValidatedPasswordField(props) {
  const { touched, errors } = useFormikContext();

  const { name, label, disabled, ...rest } = props;

  return (
    <Field
      name={name}
      type="password"
      as={TextField}
      label={label}
      variant="outlined"
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      sx={{ m: 1 }}
      size="small"
      fullWidth
      disabled={disabled}
      {...rest}
    />
  );
}

import { Field, useFormikContext } from "formik";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ValidatedDateField(props) {
  const { touched, errors } = useFormikContext();

  const { name, label, disabled, ...rest } = props;

  // TODO implement MUI datepicker component
  // return (
  //   <Field
  //     as={DatePicker}
  //     sx={{ m: 1 }}
  //     fullWidth
  //     size="small"
  //     renderInput={() => (
  //       <TextField
  //         name={name}
  //         label={label}
  //         variant="outlined"
  //         error={touched[name] && Boolean(errors[name])}
  //         helperText={touched[name] && errors[name]}
  //         InputLabelProps={{ shrink: true }}
  //         size="small"
  //         fullWidth
  //         disabled={disabled}
  //         {...rest}
  //       />
  //     )}
  //   />
  // );

  return (
    <Field
      name={name}
      type="date"
      as={TextField}
      label={label}
      variant="outlined"
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      sx={{ m: 1 }}
      fullWidth
      size="small"
      InputLabelProps={{ shrink: true }}
      disabled={disabled}
      {...rest}
    />
  );
}

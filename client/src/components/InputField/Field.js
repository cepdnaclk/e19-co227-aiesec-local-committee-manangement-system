import { Field as FormikField, useFormikContext } from "formik";
import MuiTextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { capitalCase } from "change-case";

const Field = ({
  type,
  name,
  label,
  variant,
  sx,
  size,
  options,
  disabled,
  ...rest
}) => {
  const { touched, errors, isSubmitting } = useFormikContext();
  return (
    <FormikField
      name={name}
      type={type}
      as={MuiTextField}
      // Convert name prop from 'camelCase' to 'Pascal Case'
      // and use it as label if label prop is not explicitly defined
      label={label || capitalCase(name)}
      variant={variant || "outlined"}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      sx={{ m: 1, width: 1, ...sx }}
      size={size || "small"}
      disabled={isSubmitting || disabled}
      {...rest}
    >
      {options
        ? options.map((option) => {
            return (
              <MenuItem key={option.key} value={option.key}>
                {option.value}
              </MenuItem>
            );
          })
        : null}
    </FormikField>
  );
};

export default Field;

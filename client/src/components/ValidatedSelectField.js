import { Field, useFormikContext } from "formik";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function ValidatedSelectField(props) {
  const { touched, errors } = useFormikContext();

  const { name, label, disabled, options, ...rest } = props;

  return (
    <FormControl sx={{ m: 1, width: "100%" }}>
      <InputLabel id={name + "Label"} size="small">
        {label}
      </InputLabel>
      <Field
        labelId={name + "Label"}
        id={name}
        name={name}
        type="text"
        as={Select}
        label={label}
        variant="outlined"
        error={touched[name] && Boolean(errors[name])}
        helperText={touched[name] && errors[name]}
        sx={{ m: 1 }}
        size="small"
        fullWidth
        disabled={disabled}
        {...rest}
      >
        {options?.map((option) => {
          return (
            <MenuItem value={option.key} key={option.key}>
              {option.value}
            </MenuItem>
          );
        })}
      </Field>
    </FormControl>
  );
}

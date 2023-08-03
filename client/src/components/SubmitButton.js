import { useFormikContext } from "formik";
import { Box, Button } from "@mui/material";

export default function SubmitButton() {
  const { isSubmitting, isValid } = useFormikContext();

  return (
    <Box textAlign="right">
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        variant="contained"
        sx={{ m: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
}

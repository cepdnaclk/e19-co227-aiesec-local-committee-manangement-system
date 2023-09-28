import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Typography>404</Typography>
      <Typography>Page Not Found</Typography>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </Button>
    </>
  );
}

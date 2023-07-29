import { AppBar, Stack, Toolbar, Typography, Button } from "@mui/material";

export const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Titile
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit">Login</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

import Login from "./pages/Login/Login";
import UsersView from "./pages/Users/UsersView";
// import UserAdd from "./pages/Users/UserAdd";

import { Routes, Route } from "react-router-dom";

import { AppBar, Stack, Toolbar, Typography, Button } from "@mui/material";

function App() {
  return (
    <div className="App">
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Title
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button href="/" variant="text" disableElevation>
              Home
            </Button>
            <Button href="/users" variant="text" disableElevation>
              Users
            </Button>
            <Button href="/login" variant="text" disableElevation>
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UsersView />} />
      </Routes>
    </div>
  );
}

export default App;

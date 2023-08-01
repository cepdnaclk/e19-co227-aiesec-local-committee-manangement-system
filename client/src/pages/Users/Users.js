import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import UserProfile from "./UserProfile";
import {
  Paper,
  Box,
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../context/UserContext";

const USERS_URL = "/users";

export default function Users() {
  const { token } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  // user profile form visibility
  const [isUserProfileEnabled, setIsUserProfileEnabled] = useState(false);

  const toggleUserProfileEnabled = () => {
    setIsUserProfileEnabled((isUserProfileEnabled) => !isUserProfileEnabled);
  };

  const handleAddUserClick = () => {
    toggleUserProfileEnabled();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.get(USERS_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setUsers(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading users
      console.log(err);
    }
  };

  return (
    <>
      <Box my={3}>
        <Paper>
          <Box mr={2} textAlign="right">
            {isUserProfileEnabled ? (
              <>
                <IconButton onClick={toggleUserProfileEnabled}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={loadUsers}>
                  <RefreshIcon />
                </IconButton>
                <Button onClick={handleAddUserClick}>New User</Button>
              </>
            )}
          </Box>
          {isUserProfileEnabled ? (
            <UserProfile />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>UserName</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      {/* <TableCell>{user.id}</TableCell> */}
                      <TableCell>
                        <a href="/">{user.email}</a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </>
  );
}

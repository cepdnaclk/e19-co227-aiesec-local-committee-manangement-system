import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
// import UserProfile from "./UserProfile";
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

const TERM_URL = "/terms";

export default function Terms() {
  const { token } = useContext(UserContext);

  const [terms, setTerms] = useState([]);

  // user profile form visibility
  const [isTermProfileEnabled, setIsTermProfileEnabled] = useState(false);

  const toggleTermProfileEnabled = () => {
    setIsTermProfileEnabled((isTermProfileEnabled) => !isTermProfileEnabled);
  };

  const handleAddTermClick = () => {
    toggleTermProfileEnabled();
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.get(TERM_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setTerms(response.data);
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
            {isTermProfileEnabled ? (
              <>
                <IconButton onClick={toggleTermProfileEnabled}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={loadTerms}>
                  <RefreshIcon />
                </IconButton>
                <Button onClick={handleAddTermClick}>New Term</Button>
              </>
            )}
          </Box>
          {isTermProfileEnabled ? (
            <p>TODO</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {terms.map((term, index) => (
                    <TableRow key={index}>
                      {/* <TableCell>{user.id}</TableCell> */}
                      <TableCell>
                        <a href="/">{term.title}</a>
                      </TableCell>
                      <TableCell>
                        <a href="/">{term.start_date}</a>
                      </TableCell>
                      <TableCell>
                        <a href="/">{term.end_date}</a>
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

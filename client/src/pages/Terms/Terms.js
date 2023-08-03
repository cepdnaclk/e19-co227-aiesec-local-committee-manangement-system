import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
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
} from "@mui/material";
import TermProfile from "./TermProfile";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../context/UserContext";

const TERM_URL = "/term";

export default function Terms() {
  const { token } = useContext(UserContext);

  const [opt, setOpt] = useState("");
  const [currTerm, setCurrTerm] = useState({});

  const [terms, setTerms] = useState([]);

  // user profile form visibility
  const [isTermProfileEnabled, setIsTermProfileEnabled] = useState(false);

  const toggleTermProfileEnabled = () => {
    setIsTermProfileEnabled((isTermProfileEnabled) => !isTermProfileEnabled);
  };

  const handleAddTermClick = () => {
    setOpt("add");
    toggleTermProfileEnabled();
  };

  const handleViewTermClick = (term) => {
    setOpt("edit");
    console.log(term);
    setCurrTerm(() => term);
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
                <IconButton
                  onClick={() => {
                    loadTerms();
                    toggleTermProfileEnabled();
                  }}
                >
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
            <TermProfile opt={opt} term={currTerm} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Newbie Recruitment Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {terms?.map((term, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleViewTermClick(term)}
                    >
                      <TableCell>{term.title}</TableCell>
                      <TableCell>{term.startDate}</TableCell>
                      <TableCell>{term.endDate}</TableCell>
                      <TableCell>{term.newbieRecruitmentDate}</TableCell>
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

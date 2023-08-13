import React, { useState, useContext, useEffect } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../context/UserContext";

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
  ListItemButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const QUESTIONS_URL = "/question/";

const Question = ({ focusItemId, setSnackbarState, ...rest }) => {
  const [questions, setQuestions] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [buttonPanelMode, setButtonPanelMode] = useState("add");
  const [focusQuestionId, setFocusQuestionId] = useState("");
  const [isLoading, setLoading] = useState(false);
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(QUESTIONS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: { expaId: focusItemId },
      });
      console.log("Payload received: ", response);
      setQuestions(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (textFieldValue.trim().length === 0) {
      setSnackbarState({
        open: true,
        message: "Question cannot be empty",
        severity: "error",
      });
    } else {
      try {
        const submitData = {
          expaId: focusItemId,
          question: textFieldValue,
        };
        const response = await axios.post(QUESTIONS_URL, submitData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setSnackbarState({
          open: true,
          message: "Question Added Successfully!",
          severity: "success",
        });
        loadQuestions();
        setTextFieldValue("");
        setButtonPanelMode("add");
        setFocusQuestionId("");
      } catch (err) {
        setSnackbarState({
          open: true,
          message: "Something Went Wrong",
          severity: "error",
        });
      }
    }
  };
  const handleEdit = async () => {
    if (textFieldValue.trim().length === 0) {
      setSnackbarState({
        open: true,
        message: "Question cannot be empty",
        severity: "error",
      });
    } else {
      try {
        const submitData = {
          expaId: focusItemId,
          questionId: focusQuestionId,
          question: textFieldValue,
        };
        const response = await axios.put(QUESTIONS_URL, submitData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setSnackbarState({
          open: true,
          message: "Question Edited Successfully!",
          severity: "success",
        });
        loadQuestions();
        setTextFieldValue("");
        setButtonPanelMode("add");
        setFocusQuestionId("");
      } catch (err) {
        setSnackbarState({
          open: true,
          message: "Something Went Wrong",
          severity: "error",
        });
      }
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(QUESTIONS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          expaId: focusItemId,
          questionId: focusQuestionId,
        },
      });
      setSnackbarState({
        open: true,
        message: "Question Deleted Successfully!",
        severity: "success",
      });
      loadQuestions();
      setTextFieldValue("");
      setButtonPanelMode("add");
      setFocusQuestionId("");
    } catch (err) {
      setSnackbarState({
        open: true,
        message: "Something Went Wrong",
        severity: "error",
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} textAlign="right">
        <IconButton
          onClick={() => {
            loadQuestions();
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center">
          <TextField
            value={textFieldValue}
            size="small"
            fullWidth
            onChange={(e) => {
              setTextFieldValue(e.target.value);
            }}
          />
          {
            {
              add: (
                <IconButton onClick={handleAdd}>
                  <AddIcon />
                </IconButton>
              ),
              view: (
                <>
                  <IconButton onClick={handleEdit}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            }[buttonPanelMode]
          }
          <IconButton
            onClick={() => {
              setTextFieldValue("");
              setButtonPanelMode("add");
              setFocusQuestionId("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <List>
          {questions
            ? questions.map((question) => (
                <ListItemButton
                  key={question.questionId}
                  selected={question.questionId === focusQuestionId}
                  onClick={() => {
                    setTextFieldValue(question.question);
                    setFocusQuestionId(question.questionId);
                    setButtonPanelMode("view");
                  }}
                >
                  <ListItemText primary={question.question} />
                </ListItemButton>
              ))
            : null}
        </List>
      </Grid>
    </Grid>
  );
};

export default Question;

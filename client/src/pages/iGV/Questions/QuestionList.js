import React, { useState, useContext } from "react";
import {
  useQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../../api/reactQuery";
import { UserContext } from "../../../context/UserContext";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import { useNotify } from "../../../context/NotificationContext";

export default function QuestionList() {
  const { expaId } = useParams();
  const { user } = useContext(UserContext);
  const { notifySuccess, notifyError } = useNotify();
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");

  const [textFieldValue, setTextFieldValue] = useState("");
  const [buttonPanelMode, setButtonPanelMode] = useState("new");
  const [focusQuestionId, setFocusQuestionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = `/igv/questions/${expaId}`;
  const updateQueryKey = ["igv-questions", expaId];
  const keyField = "questionId";
  const questionData = useQuery({
    key: updateQueryKey,
    url,
  });
  const createQuestion = usePostMutation({
    url,
    updateQueryKey,
  });
  const updateQuestion = usePutMutation({
    url: `${url}/${focusQuestionId}`,
    updateQueryKey,
    keyField,
  });
  const deleteQuestion = useDeleteMutation({
    url: `${url}/${focusQuestionId}`,
    updateQueryKey,
    keyField,
  });
  if (questionData.isLoading) return <Loading />;
  if (questionData.isError) return <ErrorPage error={questionData.error} />;

  const reset = () => {
    setTextFieldValue("");
    setButtonPanelMode("new");
    setFocusQuestionId("");
  };

  const handleSubmit = (action) => {
    setIsLoading(true);

    const formData = { question: textFieldValue };
    const props = {
      onSuccess: () => {
        reset();
        notifySuccess(
          action === "new"
            ? "Created"
            : action === "edit"
            ? "Updated"
            : "Deleted"
        );
        setIsLoading(false);
      },
      onError: (err) => {
        notifyError(err.response.data);
        setIsLoading(false);
      },
    };
    if (action === "new") createQuestion.mutate(formData, props);
    if (action === "edit") updateQuestion.mutate(formData, props);
    if (action === "delete") deleteQuestion.mutate(formData, props);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <TextField
              value={textFieldValue}
              size="small"
              fullWidth
              onChange={(e) => {
                setTextFieldValue(e.target.value);
              }}
              disabled={!isAdmin}
            />
            <IconButton
              onClick={() => {
                questionData.refetch();
                reset();
              }}
            >
              <RefreshIcon />
            </IconButton>
            {
              {
                new: (
                  <IconButton
                    onClick={() => {
                      handleSubmit("new");
                    }}
                    disabled={!textFieldValue || isLoading}
                  >
                    <AddIcon />
                  </IconButton>
                ),
                view: (
                  <>
                    <IconButton
                      onClick={() => {
                        handleSubmit("edit");
                      }}
                      disabled={!isAdmin || !textFieldValue || isLoading}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleSubmit("delete");
                      }}
                      disabled={!isAdmin || isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                ),
              }[buttonPanelMode]
            }
            <IconButton onClick={reset}>
              <BackspaceIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <List>
            {questionData.data
              ? questionData.data.map((question) => (
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
    </>
  );
}

import React, { useState } from "react";
import {
  // Formik,
  // Form,
  // FieldArray,
  useFormikContext,
} from "formik";
// import * as yup from "yup";
// import Grid from "@mui/material/Grid";
// import InputField from "../../../components/InputField";
// import ClearIcon from "@mui/icons-material/Clear";
// import AddIcon from "@mui/icons-material/Add";
// import { Editor } from "@tinymce/tinymce-react";
// import CloseIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
import { useQuery, usePostMutation } from "../../../api/reactQuery";
import { useParams } from "react-router-dom";
import { EmailForm } from "../../Emails/Email";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNotify } from "../../../context/NotificationContext";
import Typography from "@mui/material/Typography";

const EmailClient = () => {
  const { notifySuccess, notifyError } = useNotify();
  const { appId } = useParams();
  const [selectedEmailId, setSelectedEmailId] = useState("");

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = `/igv/emails/${appId}`;
  const emailList = useQuery({
    key: ["igv-applicant-email-list", appId],
    url,
  });

  const selectedEmail = useQuery({
    key: ["igv-applicant-email", appId, selectedEmailId],
    url: `${url}/${selectedEmailId}`,
    enabled: Boolean(selectedEmailId),
  });

  const sendEmail = usePostMutation({
    url: "/email/sendEmail",
  });

  if (emailList.isLoading) return <Loading />;
  if (emailList.isError) return <ErrorPage error={emailList.error} />;

  const handleSubmit = (formData, { setSubmitting }) => {
    const submitData = {
      to: selectedEmail.data.to,
      from: selectedEmail.data.from,
      ...formData,
    };
    console.log("I was invoked: ", submitData);
    setSubmitting(true);
    sendEmail.mutate(submitData, {
      onSuccess: (data) => {
        notifySuccess("Sent");
        setSubmitting(false);
      },
      onError: (err) => {
        notifyError(err?.response?.data);
        setSubmitting(false);
      },
    });
  };
  const isFormDisabled = false;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextField
          value={selectedEmailId}
          select
          variant="outlined"
          fullWidth
          size="small"
          disabled={false}
          onChange={(e) => {
            setSelectedEmailId(e.target.value);
          }}
          sx={{ flexGrow: 1 }}
        >
          {emailList?.data
            ? emailList.data.map((email) => {
                return (
                  <MenuItem key={email.id} value={email.id}>
                    {email.name}
                  </MenuItem>
                );
              })
            : null}
        </TextField>
        <IconButton
          onClick={() => {
            selectedEmail.refetch();
          }}
          disabled={!selectedEmailId}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      <Box>
        {selectedEmail.isInitialLoading ? (
          <Loading />
        ) : selectedEmail.isError ? (
          <ErrorPage error={selectedEmail.error} />
        ) : selectedEmail.data ? (
          <Box sx={{ pt: 1 }}>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              To: {selectedEmail.data.to}
            </Typography>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              From: {selectedEmail.data.from}
            </Typography>
            <EmailForm
              initialValues={selectedEmail.data}
              isFormDisabled={false}
              handleSubmit={handleSubmit}
              mode="send"
            />
          </Box>
        ) : null}
      </Box>
    </>
  );
};

function SendButton() {
  const { isSubmitting, isValidating } = useFormikContext();
  return (
    <Button
      type="submit"
      disabled={isSubmitting || isValidating}
      variant="contained"
      sx={{ m: 2 }}
    >
      Send
    </Button>
  );
}

export default EmailClient;

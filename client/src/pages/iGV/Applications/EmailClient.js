import React, { useState } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useParams } from "react-router-dom";
import { EmailForm } from "../../Emails/Email";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
const EmailClient = () => {
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

  if (emailList.isLoading) return <Loading />;
  if (emailList.isError) return <ErrorPage error={emailList.error} />;

  const handleSubmit = () => {};

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
          <EmailForm
            initialValues={selectedEmail.data}
            isFormDisabled={false}
            handleSubmit={handleSubmit}
            SubmitButton={() => <Button type="submit">Send</Button>}
          />
        ) : null}
      </Box>
    </>
  );
};

export default EmailClient;

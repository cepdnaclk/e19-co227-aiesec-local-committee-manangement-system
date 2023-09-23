import React, { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import InputField from "../../../components/InputField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormSubmitButton from "../../../components/FormSubmitButton";
import * as yup from "yup";

import { Formik, Form } from "formik";

import { ApplicantSelected, EseEmailTemplate, PostEseEmail } from "./HttpUtils";
import ErrorPage from "../../../components/ErrorPage";

import { useNotify } from "../../../context/NotificationContext";

const Mail = ({ setEmailModalState }) => {
  /**
 * name: emailData.name,
        subject: emailData.subject,
        body: emailBody,
        cc: emailData.cc,
        bcc: emailData.bcc,
        attachments: JSON.parse(emailData.attachments),
 */
  const { user } = useContext(UserContext);
  console.log(user);
  const { notifySuccess, notifyError } = useNotify();

  const applicantSelected = ApplicantSelected();
  const eseEmailTemplate = EseEmailTemplate();
  const postEseEmail = PostEseEmail();

  if (eseEmailTemplate.isLoading || eseEmailTemplate.isFetching) return <></>;

  if (eseEmailTemplate.isError)
    return <ErrorPage error={eseEmailTemplate.error} />;

  console.log(eseEmailTemplate.data);
  //   return <div>{JSON.stringify(eseEmailTemplate.data, null, 2)}</div>;

  return (
    <>
      <Formik
        initialValues={{
          name: eseEmailTemplate.data.name,
          to: applicantSelected.data.email,
          from: user.email,
          cc: eseEmailTemplate.data.cc,
          bcc: eseEmailTemplate.data.bcc,
          subject: eseEmailTemplate.data.subject,
          body: JSON.stringify(eseEmailTemplate.data.body),
          attachments: eseEmailTemplate.data.attachments,
          //   ...JSON.stringify(eseEmailTemplate.data),
        }}
        validationSchema={yup.object().shape({
          body: yup.string(),
        })}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          const reqData = {
            userEmail: user.email,
            attachments: eseEmailTemplate.data.attachments,
            receiver: applicantSelected.data.email,
            cc: eseEmailTemplate.data.cc,
            bcc: eseEmailTemplate.data.bcc,
            subject: eseEmailTemplate.data.subject,
            body: eseEmailTemplate.data.body,
          };
          postEseEmail.mutate(reqData, {
            onSuccess: () => {
              notifySuccess("Sent");
              setEmailModalState(false);
            },
            onError: (err) => {
              notifyError(err.response.data);
            },
          });
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {(values, isSubmitting) => (
          <>
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* <InputField name="to" label="To" disabled={true} /> */}
                  <Typography variant="h6">To: </Typography>
                  <Typography variant="p">
                    {applicantSelected.data.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {/* <InputField name="from" label="From" disabled={true} /> */}
                  <Typography variant="h6">From: </Typography>
                  <Typography variant="p">{user.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {/* <InputField name="subject" label="Subject" /> */}
                  <Typography variant="h6">Subject: </Typography>
                  <Typography variant="p">
                    {eseEmailTemplate.data.subject}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12}>
                  <InputField type="cc" label="CC" />
                </Grid>
                <Grid item xs={12}>
                  <InputField type="bcc" name="BCC" />
                </Grid> */}
                <Grid item xs={12}>
                  {/* <InputField type="body" label="Body" multiline /> */}
                  <Typography variant="h6">Body: </Typography>
                  <Typography
                    variant="p"
                    dangerouslySetInnerHTML={{
                      __html: eseEmailTemplate.data.body,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <InputField
                    type="attachments"
                    label="Attachments"
                    multiline
                  /> */}
                  <Typography variant="h6">Attachments: </Typography>
                  <Typography variant="p">
                    {eseEmailTemplate.data.attachments.map((attachment) => {
                      return (
                        <Link href={attachment} target="_blank">
                          {attachment}
                        </Link>
                      );
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isSubmitting}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Mail;

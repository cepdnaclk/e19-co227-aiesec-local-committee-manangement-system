import React from "react";

import { useFormikContext, Formik, Form as FormikForm } from "formik";

import Grid from "@mui/material/Grid";

import InputField from "../../components/InputField";
import SubmitButton from "../../components/SubmitButton";

const Form = ({ mode }) => {
  const { values } = useFormikContext();

  return (
    <FormikForm>
      <Grid container spacing={2}>
        <pre>{JSON.stringify(values, null, 2)}</pre>
        <Grid item xs={12}>
          <InputField name="title" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputField type="date" name="startDate" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputField type="date" name="endDate" disabled={!values.startDate} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputField
            type="date"
            name="newbieRecruitmentDate"
            disabled={!values.startDate || !values.endDate}
          />
        </Grid>
        <Grid item xs={12}>
          <SubmitButton mode={mode} />
        </Grid>
      </Grid>
    </FormikForm>
  );
};

export default Form;

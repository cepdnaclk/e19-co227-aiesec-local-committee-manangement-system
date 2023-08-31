import React from "react";

import Grid from "@mui/material/Grid";

import InputField from "../../components/InputField";

const Form = ({ values }) => {
  return (
    <Grid container spacing={2}>
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
    </Grid>
  );
};

export default Form;

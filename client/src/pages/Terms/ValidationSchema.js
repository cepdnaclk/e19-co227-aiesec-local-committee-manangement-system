import * as yup from "yup";

const ValidationSchema = () => {
  return yup.object().shape({
    title: yup
      .string("Invalid")
      .required("Required")
      .matches(/^[0-9]{2}-(Summer|Winter)$/, "Enter a Valid Title"),
    startDate: yup.date("Invalid").required("Required"),
    endDate: yup
      .date("Invalid")
      .required("Required")
      .min(yup.ref("startDate"), "End Date Cannot Predate the Start Date"),
    newbieRecruitmentDate: yup
      .date("Invalid")
      .required("Required")
      .min(
        yup.ref("startDate"),
        "Recruitment Date Cannot Predate the Start Date"
      )
      .max(yup.ref("endDate"), "Recruitment Date Cannot Postdate the End Date"),
  });
};

export default ValidationSchema;

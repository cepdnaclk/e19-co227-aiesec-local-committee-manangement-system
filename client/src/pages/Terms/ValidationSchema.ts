import * as yup from "yup";

const ValidationSchema = yup.object().shape({
  id: yup
    .string()
    .required("Required")
    .matches(/^[0-9]{2}-(Summer|Winter)$/, "Enter a Valid Title"),
  startDate: yup.date().required("Required"),
  endDate: yup
    .date()
    .required("Required")
    .min(yup.ref("startDate"), "End Date Cannot Predate the Start Date"),
  newbieRecruitmentDate: yup
    .date()
    .required("Required")
    .min(yup.ref("startDate"), "Recruitment Date Cannot Predate the Start Date")
    .max(yup.ref("endDate"), "Recruitment Date Cannot Postdate the End Date"),
});

export default ValidationSchema;

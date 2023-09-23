import * as yup from "yup";

const validationSchema = yup.object().shape({
  status: yup.string().required("Required"),
  // Pre-Signup
  firstName: yup.string().required("Required").max(255),
  lastName: yup.string().required("Required").max(255),
  phone: yup.string().max(20).notRequired(),
  email: yup.string().email().required("Required"),
  memberInChargeId: yup.number().required("Required"),
  campaignId: yup.string().max(255).notRequired(),
  // Signup
  sentLinks: yup.string().max(1024).notRequired(),
  signupNotes: yup.string().max(255).notRequired(),
  // Accepted
  opportunityId: yup.string().notRequired().max(7),
  // .test("maxDigits", "Should Contain 7 Digits", (number) =>
  //   //  ignore unset values by returning true for undefined values
  //   number ? String(number).length === 7 : true
  // ),
  opportunityName: yup.string().max(255).notRequired(),
  hostMc: yup.string().max(255).notRequired(),
  hostLc: yup.string().max(255).notRequired(),
  acceptedStartDate: yup.date().notRequired(),
  acceptanceDate: yup.date().notRequired(),
  isEseEmailSent: yup.boolean().notRequired(),
  acceptedNotes: yup.string().max(255).notRequired(),
  // Approved
  approvedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("acceptedStartDate"), "Cannot Predate Accepted Start Date"),
  paymentDate: yup.date().notRequired(),
  paymentAmount: yup.string().notRequired(),
  // .test("maxDecimalPlaces", "Maximum Two Decimal Places", (value) =>
  //   value ? value.split(".")[1]?.length <= 2 : true
  // )
  // .test("maxValue", "Max Value Exceeded", (value) =>
  //   //  ignore unset values by returning true for undefined values
  //   value ? String(value).split(".")[0]?.length <= 10 : true
  // ),
  proofLink: yup.string().max(1024).notRequired(),
  approvedNotes: yup.string().max(255).notRequired(),
  // Realized
  realizedStartDate: yup
    .date()
    .min(yup.ref("approvedDate"), "Cannot Predate Approved Date")
    .notRequired(),
  realizedNotes: yup.string().max(255).notRequired(),
  // Finished
  finishedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("realizedStartDate"), "Cannot Predate Realized Date"),
  // Completed
  completedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("finishedDate"), "Cannot Predate Finished Date"),
  // Approval-Broken
  approvalBreakNote: yup.string().notRequired(),
  // Realization-Broken
  realizationBreakNote: yup.string().notRequired(),
});

export default validationSchema;

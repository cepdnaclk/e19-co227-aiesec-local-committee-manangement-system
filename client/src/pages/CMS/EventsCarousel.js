// import * as React from "react";
// import { useTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MobileStepper from "@mui/material/MobileStepper";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import DescriptionIcon from "@mui/icons-material/Description";
// import EventIcon from "@mui/icons-material/Event";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import SwipeableViews from "react-swipeable-views";
// import { autoPlay } from "react-swipeable-views-utils";
// import { useQuery } from "../../api/reactQuery";
// import Loading from "../Loading";
// import ErrorPage from "../ErrorPage";
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// export default function EventsCarousel() {
//   const url = "/events/upcoming";
//   const events = useQuery({ key: ["upcoming-events-list"], url });
//   const theme = useTheme();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const maxSteps = events?.data?.length;

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStepChange = (step) => {
//     setActiveStep(step);
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column" }}>
//       <Typography variant="h5" sx={{ p: 2 }}>
//         Upcoming Events
//       </Typography>
//       {events.isLoading ? (
//         <Loading />
//       ) : events.isError ? (
//         <ErrorPage error={events.error} />
//       ) : (
//         <>
//           <Box sx={{ flexGrow: 1 }}>
//             <Paper
//               square
//               elevation={0}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: 50,
//                 pl: 2,
//                 bgcolor: "background.default",
//               }}
//             >
//               <Typography>{events.data[activeStep]?.title}</Typography>
//             </Paper>
//             <AutoPlaySwipeableViews
//               axis={theme.direction === "rtl" ? "x-reverse" : "x"}
//               index={activeStep}
//               onChangeIndex={handleStepChange}
//               enableMouseEvents
//             >
//               {events.data?.map((step, index) => (
//                 <div key={step.eventId}>
//                   {Math.abs(activeStep - index) <= 2 ? (
//                     <Box sx={{ display: "flex", flexDirection: "row" }}>
//                       <Box
//                         component="img"
//                         sx={{
//                           height: 350,
//                           display: "block",
//                           maxWidth: 400,
//                           overflow: "hidden",
//                           width: "100%",
//                         }}
//                         src={step?.postLink
//                           .replace(/file\/d\//g, "uc?id=")
//                           .replace(/\/([^/]+)$/, "&export=download")}
//                         alt={step.postLink}
//                       />
//                       <Card sx={{ flexGrow: 1 }}>
//                         <CardContent>
//                           <DescriptionIcon />
//                           <Typography>{step?.eventDescription}</Typography>
//                           <EventIcon />
//                           <Typography>{step?.eventDate}</Typography>
//                         </CardContent>
//                       </Card>
//                     </Box>
//                   ) : null}
//                 </div>
//               ))}
//             </AutoPlaySwipeableViews>
//             <MobileStepper
//               steps={maxSteps}
//               position="static"
//               activeStep={activeStep}
//               nextButton={
//                 <Button
//                   size="small"
//                   onClick={handleNext}
//                   disabled={activeStep === maxSteps - 1}
//                 >
//                   Next
//                   {theme.direction === "rtl" ? (
//                     <KeyboardArrowLeft />
//                   ) : (
//                     <KeyboardArrowRight />
//                   )}
//                 </Button>
//               }
//               backButton={
//                 <Button
//                   size="small"
//                   onClick={handleBack}
//                   disabled={activeStep === 0}
//                 >
//                   {theme.direction === "rtl" ? (
//                     <KeyboardArrowRight />
//                   ) : (
//                     <KeyboardArrowLeft />
//                   )}
//                   Back
//                 </Button>
//               }
//             />
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// }

import React from "react";
import { useQuery } from "../../api/reactQuery";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import DriveLinkConverter from "../../components/DriveLinkConverter";
const GuidelineAccordian = ({ officeId }) => {
  const url = `/${officeId.toLowerCase()}/emails/placeholders`;
  const placeholders = useQuery({
    key: ["placeholders", officeId],
    url,
  });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Guidelines</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">Attaching Images</Typography>
          <Typography variant="p">
            <ol>
              <li key="img-stp-1">
                To attach images to an email first, upload them to Google Drive
              </li>
              <li key="img-stp-2">
                Select the image and click the "Share" button and then click
                "Get link."
              </li>
              <li key="img-stp-3">
                Select "Anyone with the link can view" and then click "Copy
                link."
              </li>
              <li key="img-stp-4">
                Enter the link in the textbox below to get it converted into a
                viewable link
              </li>
              <li key="img-stp-5">
                Add the converted link to the body of the mail
              </li>
            </ol>
          </Typography>
          <DriveLinkConverter />
          <Typography variant="h6">Placeholders</Typography>
          <Typography>
            <ol>
              <li key="plc-stp-1">
                Placeholders can be used to automatically the populate the mail
                with form details
              </li>
              <li key="plc-stp-2">
                To indicate a placeholder wrap it in a pair of square brackets
                [].
              </li>
              <li key="plc-stp-3">Available placeholders:</li>
              {
                <ul>
                  {placeholders?.data?.columns
                    ? JSON.parse(placeholders.data.columns).map(
                        (placeholder) => (
                          <li key={`item-${placeholder}`}>{placeholder}</li>
                        )
                      )
                    : null}
                </ul>
              }
            </ol>
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default GuidelineAccordian;

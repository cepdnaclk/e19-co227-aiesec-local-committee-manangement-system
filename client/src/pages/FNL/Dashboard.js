import React, { useState } from "react";
import { useQuery, usePostMutation } from "../../api/reactQuery";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNotify } from "../../context/NotificationContext";
export default function Dashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <PendingClaims />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RevenueChart />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="IGV" {...a11yProps(0)} />
              <Tab label="OGV" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <IGVClaimTable />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <OGVClaimTable />
          </CustomTabPanel>
        </Box>
      </Grid>
    </Grid>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function IGVClaimTable() {
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const claimList = useQuery({
    key: ["igv-claims"],
    url: "/igv/applications/claims",
  });

  const pendingClaimStats = useQuery({
    key: ["pending-claim-stats"],
    url: "/fnl/pending-claims",
  });

  const revenueList = useQuery({
    key: ["fnl-total-revenue"],
    url: "/fnl/totalRevenue",
  });

  const updateClaimStatus = usePostMutation({
    url: "/igv/applications/claims",
    // removeQueryKeys: [["fnl-total-revenue"], ["pending-claim-stats"]],
  });

  if (claimList.isLoading) return <Loading />;
  if (claimList.isError) return <ErrorPage error={claimList.error} />;

  const itemsWithFalseClaim = claimList.data.filter(
    (item) => !item.claimStatus
  );
  const itemsWithTrueClaim = claimList.data.filter((item) => item.claimStatus);

  return (
    <>
      <Box>
        <Typography variant="h6">PENDING</Typography>
        <List>
          {itemsWithFalseClaim.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.label} />
              <IconButton
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  updateClaimStatus.mutate(
                    { id: item.id, value: true },
                    {
                      onSuccess: () => {
                        pendingClaimStats.refetch();
                        revenueList.refetch();
                        claimList.refetch();
                        notifySuccess("Completed");
                        setIsLoading(false);
                      },
                      onError: (err) => {
                        notifyError(err.message);
                        setIsLoading(false);
                      },
                    }
                  );
                }}
              >
                <CheckIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Typography variant="h6">COMPLETED</Typography>
        <List>
          {itemsWithTrueClaim.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

function OGVClaimTable() {
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const claimList = useQuery({
    key: ["ogv-claims"],
    url: "/ogv/applicants/claims",
  });

  const pendingClaimStats = useQuery({
    key: ["pending-claim-stats"],
    url: "/fnl/pending-claims",
  });

  const revenueList = useQuery({
    key: ["fnl-total-revenue"],
    url: "/fnl/totalRevenue",
  });

  const updateClaimStatus = usePostMutation({
    url: "/ogv/applicants/claims",
    // removeQueryKeys: [["fnl-total-revenue"], ["pending-claim-stats"]],
  });

  if (claimList.isLoading) return <Loading />;
  if (claimList.isError) return <ErrorPage error={claimList.error} />;

  const itemsWithFalseClaim = claimList.data.filter(
    (item) => !item.claimStatus
  );
  const itemsWithTrueClaim = claimList.data.filter((item) => item.claimStatus);

  return (
    <>
      <Box>
        <Typography variant="h6">PENDING</Typography>
        <List>
          {itemsWithFalseClaim.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.label} />
              <IconButton
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  updateClaimStatus.mutate(
                    { id: item.id, value: true },
                    {
                      onSuccess: () => {
                        pendingClaimStats.refetch();
                        revenueList.refetch();
                        claimList.refetch();
                        notifySuccess("Completed");
                        setIsLoading(false);
                      },
                      onError: (err) => {
                        notifyError(err.message);
                        setIsLoading(false);
                      },
                    }
                  );
                }}
              >
                <CheckIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Typography variant="h6">COMPLETED</Typography>
        <List>
          {itemsWithTrueClaim.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

function RevenueChart() {
  const theme = useTheme();
  const paperStyle = {
    background: "#ED8796", // Use your primary color
    padding: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
    borderRadius: "12px",
  };
  const revenueList = useQuery({
    key: ["fnl-total-revenue"],
    url: "/fnl/totalRevenue",
  });

  if (revenueList.isLoading) return <Loading />;
  if (revenueList.isError)
    return <div>Error: {revenueList?.error?.message}</div>;

  return (
    <Paper sx={paperStyle} variant="outlined">
      <Typography variant="h5" gutterBottom>
        TOTAL REVENUE
      </Typography>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: revenueList.data.igv, label: "IGV" },
              { id: 1, value: revenueList.data.igt, label: "IGT" },
              { id: 2, value: revenueList.data.ogv, label: "OGV" },
              { id: 3, value: revenueList.data.ogt, label: "OGT" },
            ],
          },
        ]}
        width={300}
        height={190}
      />
    </Paper>
  );
}

function PendingClaims() {
  const theme = useTheme();
  const paperStyle = {
    background: "#7DC4E4", // Use your primary color
    padding: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
    borderRadius: "12px",
  };
  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1), // Add padding
    // borderBottom: `1px solid ${theme.palette.grey[300]}`, // Add borders
  };

  const pendingClaimStats = useQuery({
    key: ["pending-claim-stats"],
    url: "/fnl/pending-claims",
  });

  if (pendingClaimStats.isLoading) return <Loading />;
  if (pendingClaimStats.isError)
    return <div>Error: {pendingClaimStats?.error?.message}</div>;

  return (
    <>
      <Paper sx={paperStyle} variant="outlined">
        <Typography variant="h5" gutterBottom>
          PENDING CLAIMS
        </Typography>
        <List>
          <ListItem sx={listItemStyle}>
            <Typography variant="subtitle1">IGV</Typography>
            <Typography variant="subtitle1">
              {pendingClaimStats.data["igv"] || 0}
            </Typography>
          </ListItem>
          <ListItem sx={listItemStyle}>
            <Typography variant="subtitle1">OGV</Typography>
            <Typography variant="subtitle1">
              {pendingClaimStats.data["ogv"] || 0}
            </Typography>
          </ListItem>
          <ListItem sx={listItemStyle}>
            <Typography variant="subtitle1">IGT</Typography>
            <Typography variant="subtitle1">
              {pendingClaimStats.data["igt"] || 0}
            </Typography>
          </ListItem>
          <ListItem sx={listItemStyle}>
            <Typography variant="subtitle1">OGT</Typography>
            <Typography variant="subtitle1">
              {pendingClaimStats.data["ogt"] || 0}
            </Typography>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

import React, { useState, useContext } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { UserContext } from "../../../context/UserContext";
import Badge from "./Badge";
import Dialog from "@mui/material/Dialog";
import { Button, DialogActions, DialogContent } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "../../../components/SearchBar";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import { useNotify } from "../../../context/NotificationContext";
export default function BadgeGallery() {
  const { notifySuccess, notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { privileges } = useContext(UserContext);
  const { isPMAdmin } = privileges;
  const [filteredData, setFilteredData] = useState();

  const [mode, setMode] = useState(null);
  const [id, setId] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  // HTTP Utilities
  const url = "/pm/badges";
  const badgeList = useQuery({ key: ["badge-list"], url });

  if (badgeList.isLoading) return <Loading />;
  if (badgeList.isError) return <ErrorPage error={badgeList.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={badgeList.data}
          setFilteredData={setFilteredData}
          searchProp="name"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            badgeList.refetch();
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setMode("new");
          }}
          disabled={!isPMAdmin}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 1, display: "flex" }}>
        {filteredData?.map((badge) => (
          <Card
            onClick={(e) => {
              // TODO
            }}
            key={badge.id}
            onMouseEnter={() => setHoverId(badge.id)}
            onMouseLeave={() => setHoverId(null)}
            sx={{
              position: "relative", // Needed for absolute positioning
              m: 1,
            }}
          >
            <CardActionArea>
              <Box
                sx={{
                  m: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={
                    process.env.REACT_APP_API_SERVER + "/images/" + badge.image
                  }
                  alt={badge.name}
                  sx={{ width: 64, height: 64 }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    // maxWidth: 100, wordWrap: "break-word"
                  }}
                >
                  {badge.name}
                </Typography>
              </Box>
            </CardActionArea>
            {hoverId === badge.id && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <IconButton
                  onClick={() => {
                    setMode("edit");
                    setId(hoverId);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    try {
                      await axios.delete(`${url}/${badge.id}`);
                      queryClient.setQueryData(["badge-list"], (old) => {
                        return old.filter((item) => item.id !== badge.id);
                      });
                      console.log(badge.id);
                      notifySuccess("Deleted");
                    } catch (err) {
                      notifyError(err.message);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Card>
        ))}
      </Box>
      <Dialog
        open={Boolean(mode)}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              color: "rgba(0, 0, 0, 1)",
            },
          },
        }}
      >
        <Box
          sx={
            {
              // backgroundColor: "#ffffff",
              // opacity: 1,
            }
          }
        >
          <IconButton
            onClick={() => {
              setMode(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Badge mode={mode} setMode={setMode} id={id} setId={setId} />
      </Dialog>
    </>
  );
}

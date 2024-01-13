import React, { useState, useEffect } from "react";
import {
  useQuery,
  usePostMutation,
  usePutMutation,
} from "../../../api/reactQuery";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNotify } from "../../../context/NotificationContext";
import badgeAlt from "../../../assets/badge-alt.png";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
// const fileToDataUri = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       resolve(event.target.result);
//     };
//     reader.readAsDataURL(file);
//   });

export default function Badge({ mode, setMode, id, setId }) {
  // HTTP Utils
  const url = "/pm/badges";
  const selectedBadge = useQuery({
    key: ["badge-selected", id],
    url: `${url}/${id}`,
    enabled: mode !== "new",
  });
  const addBadge = usePostMutation({
    url,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const updateBadge = usePutMutation({
    url: `${url}/${id}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    removeQueryKeys: [["badge-selected", id]],
    updateQueryKey: ["badge-list"],
    keyField: "id",
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (selectedBadge?.data?.name && mode === "edit")
      setName(selectedBadge.data.name);
  }, [selectedBadge.isInitialLoading, selectedBadge.isError]);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { notifySuccess, notifyError } = useNotify();

  const inputProps = {
    sx: { m: 1 },
    size: "small",
    fullWidth: true,
  };

  const actionProps = {
    size: "small",
    disabled: isSubmitting,
  };

  const onUpload = (e) => {
    // if (!file) {
    //   setDataUri("");
    //   return;
    // }

    // fileToDataUri(file).then((dataUri) => {
    //   setDataUri(dataUri);
    // });

    setFile(e.target.files[0] || null);
  };

  // useEffect(() => {
  //   console.log(file);
  //   if (file) setPreviewUrl(URL.createObjectURL(file));
  // }, [file]);

  const handleSubmit = async () => {
    if (!name || (mode === "new" && !file)) {
      notifyError("Name or Icon Cannot be Empty");
      return;
    }

    setIsSubmitting(true);
    if (mode === "new") {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);
      await addBadge.mutate(formData, {
        onSuccess: () => {
          notifySuccess("Added succesfully");
        },
        onError: (err) => {
          notifyError(err.message);
        },
      });
    }
    if (mode === "edit") {
      await updateBadge.mutate(
        { name },
        {
          onSuccess: () => {
            notifySuccess("Updated succesfully");
          },
          onError: (err) => {
            notifyError(err.message);
          },
        }
      );
    }

    setIsSubmitting(false);
  };

  if (selectedBadge.isInitialLoading) return <Loading />;
  if (selectedBadge.isError) return <ErrorPage error={selectedBadge.error} />;

  return (
    <Card
      sx={{
        padding: 2,
        maxWidth: 400,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        sx={{
          height: 256,
          width: 256,
          objectFit: "cover",
        }}
      >
        <img
          src={
            mode === "new"
              ? previewUrl
                ? previewUrl
                : badgeAlt
              : process.env.REACT_APP_API_SERVER +
                "/images/" +
                selectedBadge?.data?.image
          }
          alt="Preview"
          style={{ width: "100%", height: "100%" }}
        />
      </CardMedia>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {mode === "view" ? (
            <Typography gutterBottom variant="h5">
              {name}
            </Typography>
          ) : (
            <>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                {...inputProps}
              />
              <TextField
                type="file"
                label="Icon"
                onChange={onUpload}
                // onChange={uploadPicture}
                InputLabelProps={{ shrink: true }}
                {...inputProps}
              />
            </>
          )}
        </Box>
      </CardContent>
      <CardActions>
        {
          {
            new: (
              <Button onClick={handleSubmit} {...actionProps}>
                Add
              </Button>
            ),
            // view: (
            //   <>
            //     <Button
            //       onClick={() => {
            //         setMode("edit");
            //       }}
            //       {...actionProps}
            //     >
            //       Edit
            //     </Button>
            //     <Button {...actionProps}>Delete</Button>
            //   </>
            // ),
            edit: (
              <Button onClick={handleSubmit} {...actionProps}>
                Save
              </Button>
            ),
          }[mode]
        }
      </CardActions>
    </Card>
  );
}

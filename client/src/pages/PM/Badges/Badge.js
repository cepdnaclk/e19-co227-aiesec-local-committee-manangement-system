import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNotify } from "../../../context/NotificationContext";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

export default function Badge({ mode, setMode, id, setId }) {
  const [name, setName] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = useState();
  const uploadPicture = (e) => {
    setState({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      picturePreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile: e.target.files[0],
    });
  };

  const { notifySucces, notifyError } = useNotify();

  const inputProps = {
    sx: { m: 1 },
    size: "small",
    fullWidth: true,
  };

  const actionProps = {
    size: "small",
    disabled: isSubmitting,
  };

  const onChange = (file) => {
    if (!file) {
      setDataUri("");
      return;
    }

    fileToDataUri(file).then((dataUri) => {
      setDataUri(dataUri);
    });
  };

  useEffect(() => {
    console.log(dataUri);
  }, [dataUri]);

  const handleSubmit = async () => {
    // if (!name || !dataUri) notifyError("Name or Icon Cannot be Empty");
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("icon", state.pictureAsFile);

    // console.log(formData.get("icon"));
    const data = await fetch("http://localhost:8081/pm", {
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      body: { msg: "Hello" },
    });
  };

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
      <CardHeader
        action={
          <IconButton
            onClick={() => {
              setMode(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        }
      />
      <CardMedia
        sx={{
          height: 256,
          width: 256,
        }}
        image={dataUri}
        // image={state?.picturePreview}
      />
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
                onChange={(e) => {
                  onChange(e.target.files[0] || null);
                }}
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
            view: (
              <>
                <Button
                  onClick={() => {
                    setMode("edit");
                  }}
                  {...actionProps}
                >
                  Edit
                </Button>
                <Button {...actionProps}>Delete</Button>
              </>
            ),
            edit: (
              <>
                <Button onClick={handleSubmit} {...actionProps}>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setMode("view");
                  }}
                  {...actionProps}
                >
                  Cancel
                </Button>
              </>
            ),
          }[mode]
        }
      </CardActions>
    </Card>
  );
}

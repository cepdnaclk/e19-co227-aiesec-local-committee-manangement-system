import React, { useState } from "react";
import Badge from "./Badge";
import Dialog from "@mui/material/Dialog";
import { Button } from "@mui/material";
export default function BadgeGallery() {
  const [mode, setMode] = useState(null);
  const [id, setId] = useState(null);

  return (
    <>
      <Button
        onClick={() => {
          setMode("new");
        }}
      >
        Test
      </Button>
      <Dialog open={Boolean(mode)}>
        <Badge mode={mode} setMode={setMode} id={id} setId={setId} />
      </Dialog>
    </>
  );
}

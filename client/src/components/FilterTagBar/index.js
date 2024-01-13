import React, { useEffect, useState } from "react";

import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const FilterTagBar = ({ initialData, setGroupedData, searchProp, tags }) => {
  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    if (activeTags && activeTags.length > 0 && initialData) {
      const groupedData = [];
      initialData?.forEach((data) => {
        if (activeTags.includes(data[searchProp])) groupedData.push(data);
      });
      setGroupedData(groupedData);
    } else {
      setGroupedData(initialData);
    }
  }, [activeTags, initialData]);

  // reset tag bar when search prop changes
  useEffect(() => {
    setActiveTags([]);
  }, [searchProp]);

  return (
    <Box sx={{ display: "flex", overflowY: "scroll" }}>
      <Stack direction="row" spacing={2}>
        {tags.map((tag) => {
          return (
            <Chip
              key={`tag-${tag}`}
              label={tag}
              onClick={() => {
                const index = activeTags.indexOf(tag);
                if (index > -1)
                  setActiveTags((old) => old.filter((item) => item !== tag));
                else setActiveTags((old) => [...old, tag]);
              }}
              color={activeTags.includes(tag) ? "success" : undefined}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default FilterTagBar;

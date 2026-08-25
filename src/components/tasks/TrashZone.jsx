import { useDroppable } from "@dnd-kit/core";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

function TrashZone() {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: "trash",
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: "fixed",
        right: {
          xs: 16,
          sm: 24,
        },
        bottom: {
          xs: 16,
          sm: 24,
        },
        zIndex: 1200,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: {
            xs: 70,
            sm: 90,
          },
          height: {
            xs: 70,
            sm: 90,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          transition: "all 0.2s ease",

          backgroundColor: isOver
            ? "error.main"
            : "background.paper",

          color: isOver
            ? "error.contrastText"
            : "error.main",

          transform: isOver
            ? "scale(1.1)"
            : "scale(1)",
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: {
              xs: "28px",
              sm: "34px",
            },
            lineHeight: 1,
          }}
        >
          🗑️
        </Box>

        <Typography
          variant="caption"
          fontWeight="bold"
        >
          Delete
        </Typography>
      </Paper>
    </Box>
  );
}

export default TrashZone;
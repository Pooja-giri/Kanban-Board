import { useDroppable } from "@dnd-kit/core";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function TrashZone() {
  const theme = useTheme();
  const { setNodeRef, isOver } = useDroppable({
    id: "trash",
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: "fixed",
        right: { xs: 20, sm: 32 },
        bottom: { xs: 20, sm: 32 },
        zIndex: 1400,
        pointerEvents: "auto",
        animation: "slideInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "@keyframes slideInUp": {
          "0%": {
            transform: "translateY(100px) scale(0.6)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      <Paper
        elevation={10}
        className={isOver ? "pulse-trash" : ""}
        sx={{
          width: { xs: 80, sm: 96 },
          height: { xs: 80, sm: 96 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backgroundColor: isOver
            ? "#DC2626"
            : theme.palette.mode === "dark"
            ? "#1F2937"
            : "#FFFFFF",
          color: isOver
            ? "#FFFFFF"
            : "#EF4444",
          border: "2px dashed",
          borderColor: isOver ? "#FFFFFF" : "#EF4444",
          transform: isOver ? "scale(1.15) rotate(-3deg)" : "scale(1)",
          boxShadow: isOver
            ? "0 15px 30px rgba(220, 38, 38, 0.5)"
            : "0 10px 25px rgba(239, 68, 68, 0.25)",
        }}
      >
        <DeleteForeverIcon
          sx={{
            fontSize: { xs: 32, sm: 40 },
            transition: "transform 0.2s ease",
            transform: isOver ? "scale(1.2)" : "scale(1)",
          }}
        />

        <Typography
          variant="caption"
          fontWeight={800}
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            mt: 0.2,
          }}
        >
          {isOver ? "Release" : "Trash"}
        </Typography>
      </Paper>
    </Box>
  );
}

export default TrashZone;
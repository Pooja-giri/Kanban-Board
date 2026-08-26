import { Box, CircularProgress, Typography } from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

function PageLoader({ message = "Loading workspace..." }) {
  return (
    <Box
      minHeight="80vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={64}
          thickness={4}
          sx={{
            color: "primary.main",
            animationDuration: "1000ms",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
          }}
        >
          <ViewKanbanIcon sx={{ fontSize: 28 }} />
        </Box>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        fontWeight={500}
        sx={{
          letterSpacing: "0.02em",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

export default PageLoader;
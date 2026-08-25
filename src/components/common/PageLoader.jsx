import {
  Box,
  CircularProgress,
} from "@mui/material";

function PageLoader() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}

export default PageLoader;
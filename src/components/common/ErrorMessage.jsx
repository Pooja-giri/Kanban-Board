import { useState } from "react";
import { Alert, AlertTitle, Box, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

function ErrorMessage({ message, onClose }) {
  const [dismissedMessage, setDismissedMessage] = useState(null);

  const isOpen = Boolean(message && message !== dismissedMessage);

  if (!message) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedMessage(message);
    if (onClose) onClose();
  };

  return (
    <Collapse in={isOpen}>
      <Box sx={{ marginBottom: 3 }}>
        <Alert
          severity="error"
          icon={<ErrorOutlinedIcon fontSize="inherit" />}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            borderRadius: 2.5,
            fontWeight: 500,
            border: "1px solid",
            borderColor: "error.main",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Something went wrong</AlertTitle>
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
}

export default ErrorMessage;
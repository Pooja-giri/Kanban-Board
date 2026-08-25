import { useState } from "react";

import {
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

const generateCaptchaText = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let index = 0; index < 6; index += 1) {
    const randomIndex = Math.floor(
      Math.random() * characters.length
    );

    result += characters[randomIndex];
  }

  return result;
};

function Captcha({ onChange }) {
  const [captcha, setCaptcha] = useState(generateCaptchaText);
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;

    setValue(newValue);

    onChange?.(newValue === captcha);
  };

  const handleRefresh = () => {
    setCaptcha(generateCaptchaText());
    setValue("");

    // A refreshed CAPTCHA should always be considered invalid
    onChange?.(false);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography
        variant="body2"
        sx={{
          marginBottom: 1,
          fontWeight: 500,
        }}
      >
        CAPTCHA
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ marginBottom: 1 }}
      >
        <Box
          sx={{
            minWidth: 130,
            padding: "10px 16px",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: "1.1rem",
            }}
          >
            {captcha}
          </Typography>
        </Box>

        <IconButton
          onClick={handleRefresh}
          aria-label="Refresh CAPTCHA"
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        label="Enter CAPTCHA"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
    </Box>
  );
}

export default Captcha;
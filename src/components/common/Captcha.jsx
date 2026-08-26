import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";

const generateCaptchaText = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let result = "";
  for (let index = 0; index < 6; index += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

function Captcha({ onChange }) {
  const [captcha, setCaptcha] = useState(generateCaptchaText);
  const [value, setValue] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const isValid =
    value.trim().toLowerCase() === captcha.toLowerCase() &&
    value.length === captcha.length;

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    const valid =
      newValue.trim().toLowerCase() === captcha.toLowerCase() &&
      newValue.length === captcha.length;
    onChange?.(valid);
  };

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    const newCaptcha = generateCaptchaText();
    setCaptcha(newCaptcha);
    setValue("");
    onChange?.(false);
  };

  return (
    <Box sx={{ marginTop: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          marginBottom: 1,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            whiteSpace: "nowrap",
          }}
        >
          <SecurityIcon fontSize="small" color="primary" sx={{ display: "inline-flex" }} />
          <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ whiteSpace: "nowrap" }}>
            Security Verification
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          Case-insensitive
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        sx={{ marginBottom: 1.5 }}
      >
        <Box
          sx={{
            flex: 1,
            padding: "12px 18px",
            borderRadius: 2,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
                : "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
            border: "1.5px dashed",
            borderColor: "primary.main",
            textAlign: "center",
            userSelect: "none",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle decorative background noise line */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "-10%",
              right: "-10%",
              height: "2px",
              background: "rgba(99, 102, 241, 0.3)",
              transform: "rotate(-4deg)",
              pointerEvents: "none",
            }}
          />

          <Typography
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: 5, sm: 8 },
              fontSize: "1.25rem",
              fontFamily: "'Courier New', Courier, monospace",
              color: "primary.main",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {captcha}
          </Typography>
        </Box>

        <Tooltip title="Get new code">
          <IconButton
            onClick={handleRefresh}
            aria-label="Refresh CAPTCHA"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
              },
              transition: "transform 0.5s ease",
              transform: isRotating ? "rotate(360deg)" : "rotate(0deg)",
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        placeholder="Enter 6-character code"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        size="small"
        error={Boolean(value && !isValid && value.length >= 6)}
        helperText={
          value && !isValid && value.length >= 6
            ? "Code does not match. Try again or refresh."
            : ""
        }
        InputProps={{
          endAdornment: isValid ? (
            <InputAdornment position="end">
              <CheckCircleIcon color="success" fontSize="small" />
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}

export default Captcha;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import TitleIcon from "@mui/icons-material/Title";
import FlagIcon from "@mui/icons-material/Flag";
import EventIcon from "@mui/icons-material/Event";

import { createTask } from "../../redux/slices/taskSlice";
import { TASK_PRIORITIES } from "../../utils/constants";
import { useThemeContext } from "../../theme/useThemeContext";

function TaskForm({ isOpen, onToggle }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { showNotification } = useThemeContext();

  const tasks = useSelector((state) => state.tasks.tasks);

  const getDefaultDeadline = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: "",
    priority: "medium",
    deadline: getDefaultDeadline(),
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required";
    } else {
      const duplicate = tasks.some(
        (t) =>
          t.name.trim().toLowerCase() ===
          formData.name.trim().toLowerCase()
      );

      if (duplicate) {
        newErrors.name = "A task with this title already exists";
      }
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const newTask = {
        name: formData.name.trim(),
        priority: formData.priority,
        deadline: formData.deadline,
        stage: 0,
      };

      await dispatch(createTask(newTask)).unwrap();

      showNotification(
        `Task "${formData.name.trim()}" created successfully!`,
        "success"
      );

      setFormData({
        name: "",
        priority: "medium",
        deadline: getDefaultDeadline(),
      });

      setErrors({});

      if (onToggle) {
        onToggle(false);
      }
    } catch (err) {
      setErrors({
        name:
          typeof err === "string"
            ? err
            : "Failed to create task",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Collapse in={isOpen !== undefined ? isOpen : true}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 3.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "primary.main",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1E1B4B 0%, #111827 100%)"
              : "linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 30px rgba(0, 0, 0, 0.4)"
              : "0 10px 30px rgba(99, 102, 241, 0.12)",
        }}
      >
        {/* Plus Icon + Create New Task + Close Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
            width: "100%",
          }}
        >
          {/* Plus Icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: 2,
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
            }}
          >
            <AddIcon fontSize="small" />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Create New Task
          </Typography>

          {/* Close Icon - immediately after title */}
          {onToggle && (
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() => onToggle(false)}
                sx={{
                  ml: 0.25,
                  width: 32,
                  height: 32,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Task Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Task Name */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                required
                placeholder="e.g. Design landing page mockup"
                label="Task Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon
                        fontSize="small"
                        color="action"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                required
                label="Priority Level"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                error={Boolean(errors.priority)}
                helperText={errors.priority}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlagIcon
                        fontSize="small"
                        color="action"
                      />
                    </InputAdornment>
                  ),
                }}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            priority === "high"
                              ? "#EF4444"
                              : priority === "medium"
                              ? "#F59E0B"
                              : "#10B981",
                        }}
                      />

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {priority.charAt(0).toUpperCase() +
                          priority.slice(1)}{" "}
                        Priority
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Deadline */}
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                type="date"
                required
                label="Due Date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                error={Boolean(errors.deadline)}
                helperText={errors.deadline}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon
                        fontSize="small"
                        color="action"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              md={1.5}
              sx={{
                display: "flex",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{
                  height: 54,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow:
                    "0 4px 14px rgba(99, 102, 241, 0.35)",
                }}
              >
                {submitting ? "Adding..." : "Add Task"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Collapse>
  );
}

export default TaskForm;
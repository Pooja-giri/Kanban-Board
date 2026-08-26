import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TitleIcon from "@mui/icons-material/Title";
import FlagIcon from "@mui/icons-material/Flag";
import EventIcon from "@mui/icons-material/Event";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

import { updateTask } from "../../redux/slices/taskSlice";
import {
  TASK_PRIORITIES,
  TASK_STAGES,
} from "../../utils/constants";
import { useThemeContext } from "../../theme/useThemeContext";

function EditTaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const { showNotification } = useThemeContext();

  const tasks = useSelector((state) => state.tasks.tasks);

  const [formData, setFormData] = useState({
    name: task.name || "",
    priority: task.priority || "medium",
    deadline: task.deadline || "",
    stage: task.stage !== undefined ? task.stage : 0,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Task title is required");
      return;
    }

    if (!formData.priority) {
      setError("Priority is required");
      return;
    }

    if (!formData.deadline) {
      setError("Deadline date is required");
      return;
    }

    const duplicateTask = tasks.some(
      (existing) =>
        existing.id !== task.id &&
        existing.name.trim().toLowerCase() ===
          formData.name.trim().toLowerCase()
    );

    if (duplicateTask) {
      setError("A task with this title already exists");
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        updateTask({
          id: task.id,
          name: formData.name.trim(),
          priority: formData.priority,
          deadline: formData.deadline,
          stage: Number(formData.stage),
        })
      ).unwrap();

      showNotification(
        `Task "${formData.name.trim()}" updated!`,
        "success"
      );

      onClose();
    } catch (apiError) {
      setError(
        typeof apiError === "string"
          ? apiError
          : "Unable to update the task"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pb: 1.5,
        }}
      >
        {/* Left Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
          }}
        >
          {/* Icon and Edit Task on the SAME LINE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
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
              <EditNoteIcon fontSize="small" />
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Edit Task
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              pl: "48px",
            }}
          >
            Update task details, stage, and deadline
          </Typography>
        </Box>

        {/* Close Button */}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="close"
          sx={{
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          {/* Task Name */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Task Title"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              required
              label="Priority Level"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
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
                <MenuItem
                  key={priority}
                  value={priority}
                >
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
                        priority.slice(1)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Stage */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              required
              label="Workflow Stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ViewColumnIcon
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            >
              {TASK_STAGES.map((stg) => (
                <MenuItem
                  key={stg.id}
                  value={stg.id}
                >
                  {stg.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Deadline */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              required
              label="Due Date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
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
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            fontWeight: 700,
            px: 3,
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </>
  );
}

function EditTaskDialog({ open, task, onClose }) {
  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3.5,
        },
      }}
    >
      <EditTaskForm
        key={task.id}
        task={task}
        onClose={onClose}
      />
    </Dialog>
  );
}

export default EditTaskDialog;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import { updateTask } from "../../redux/slices/taskSlice";
import { TASK_PRIORITIES } from "../../utils/constants";

function EditTaskForm({ task, onClose }) {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks.tasks);

  const [formData, setFormData] = useState(() => ({
    name: task.name,
    priority: task.priority,
    deadline: task.deadline,
  }));

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Task name is required");
      return;
    }

    if (!formData.priority) {
      setError("Priority is required");
      return;
    }

    if (!formData.deadline) {
      setError("Deadline is required");
      return;
    }

    const duplicateTask = tasks.some(
      (existingTask) =>
        existingTask.id !== task.id &&
        existingTask.name.toLowerCase() ===
          formData.name.trim().toLowerCase()
    );

    if (duplicateTask) {
      setError("A task with this name already exists");
      return;
    }

    try {
      await dispatch(
        updateTask({
          id: task.id,
          name: formData.name.trim(),
          priority: formData.priority,
          deadline: formData.deadline,
        })
      ).unwrap();

      onClose();
    } catch (apiError) {
      setError(
        apiError || "Unable to update the task"
      );
    }
  };

  return (
    <>
      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          select
          margin="dense"
          label="Priority"
          name="priority"
          fullWidth
          value={formData.priority}
          onChange={handleChange}
        >
          {TASK_PRIORITIES.map((priority) => (
            <MenuItem
              key={priority}
              value={priority}
            >
              {priority.charAt(0).toUpperCase() +
                priority.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          margin="dense"
          label="Deadline"
          name="deadline"
          fullWidth
          value={formData.deadline}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </DialogActions>
    </>
  );
}

function EditTaskDialog({
  open,
  task,
  onClose,
}) {
  if (!task) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Task</DialogTitle>

      {/* 
        The key is important.

        When task.id changes, React creates a new
        EditTaskForm with fresh initial state.
      */}
      <EditTaskForm
        key={task.id}
        task={task}
        onClose={onClose}
      />
    </Dialog>
  );
}

export default EditTaskDialog;
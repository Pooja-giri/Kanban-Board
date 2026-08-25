import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { createTask } from "../../redux/slices/taskSlice";
import { TASK_PRIORITIES } from "../../utils/constants";

function TaskForm() {
  const dispatch = useDispatch();

  // Get existing tasks from Redux
  const tasks = useSelector((state) => state.tasks.tasks);

  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Task name validation
    if (!formData.name.trim()) {
      newErrors.name = "Task name is required";
    } else {
      // Check whether a task with the same name already exists
      const duplicateTask = tasks.some(
        (task) =>
          task.name.toLowerCase() ===
          formData.name.trim().toLowerCase()
      );

      if (duplicateTask) {
        newErrors.name = "A task with this name already exists";
      }
    }

    // Priority validation
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newTask = {
    name: formData.name.trim(),
    priority: formData.priority,
    deadline: formData.deadline,
    stage: 0,
  };

  try {
    await dispatch(createTask(newTask)).unwrap();

    setFormData({
      name: "",
      priority: "",
      deadline: "",
    });

    setErrors({});
  } catch (error) {
    setErrors({
      name: error,
    });
  }
};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: 3,
        marginBottom: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create New Task
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Task Name */}
        <TextField
          label="Task Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          sx={{
            flex: 1,
            minWidth: 200,
          }}
        />

        {/* Priority */}
        <TextField
          select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          error={Boolean(errors.priority)}
          helperText={errors.priority}
          sx={{
            minWidth: 150,
          }}
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

        {/* Deadline */}
        <TextField
          type="date"
          label="Deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          error={Boolean(errors.deadline)}
          helperText={errors.deadline}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            minWidth: 180,
          }}
        />

        {/* Create Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            minWidth: 140,
          }}
        >
          Create Task
        </Button>
      </Box>
    </Box>
  );
}

export default TaskForm;
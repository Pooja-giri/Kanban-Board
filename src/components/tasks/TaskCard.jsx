import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDraggable } from "@dnd-kit/core";

import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  deleteTask,
  updateTask,
} from "../../redux/slices/taskSlice";

import EditTaskDialog from "./EditTaskDialog";

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };

  const handleMoveBackward = () => {
    if (task.stage === 0) return;

    dispatch(
      updateTask({
        id: task.id,
        stage: task.stage - 1,
      })
    );
  };

  const handleMoveForward = () => {
    if (task.stage === 3) return;

    dispatch(
      updateTask({
        id: task.id,
        stage: task.stage + 1,
      })
    );
  };

  const handleDelete = () => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${task.name}"?`
    );

    if (shouldDelete) {
      dispatch(deleteTask(task.id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <>
      <Card
  ref={setNodeRef}
  style={style}
  elevation={2}
  sx={{
    marginBottom: 2,
    borderRadius: 2,
  }}
>
        <CardContent>
          <Box
  display="flex"
  justifyContent="space-between"
  alignItems="flex-start"
  gap={1}
>
  <Box
    {...attributes}
    {...listeners}
    sx={{
      cursor: "grab",
      display: "flex",
      alignItems: "center",
      gap: 1,
      flex: 1,
      minWidth: 0,
      touchAction: "none",
    }}
  >
    <DragIndicatorIcon
      fontSize="small"
      color="action"
    />

    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{
        wordBreak: "break-word",
      }}
    >
      {task.name}
    </Typography>
  </Box>

  <Chip
    label={task.priority}
    color={getPriorityColor(task.priority)}
    size="small"
  />
</Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginTop: 2,
              color: "text.secondary",
            }}
          >
            <CalendarTodayIcon fontSize="small" />

            <Typography variant="body2">
              {task.deadline}
            </Typography>
          </Stack>

          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ marginTop: 2 }}
          >
            <Tooltip title="Move Back">
              <span>
                <IconButton
                  size="small"
                  onClick={handleMoveBackward}
                  disabled={task.stage === 0}
                >
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Move Forward">
              <span>
                <IconButton
                  size="small"
                  onClick={handleMoveForward}
                  disabled={task.stage === 3}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={() => setEditOpen(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      <EditTaskDialog
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

export default TaskCard;
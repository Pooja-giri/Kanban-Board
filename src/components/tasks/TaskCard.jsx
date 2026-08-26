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
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  deleteTask,
  updateTask,
} from "../../redux/slices/taskSlice";
import { TASK_STAGES } from "../../utils/constants";
import { useThemeContext } from "../../theme/useThemeContext";
import EditTaskDialog from "./EditTaskDialog";

function TaskCard({ task, onDeletePrompt }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { showNotification } = useThemeContext();

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
    opacity: isDragging ? 0.35 : 1,
  };

  const handleMoveBackward = () => {
    if (task.stage === 0) return;

    const newStage = task.stage - 1;

    dispatch(
      updateTask({
        id: task.id,
        stage: newStage,
      })
    );

    showNotification(
      `Moved to ${TASK_STAGES[newStage].title}`
    );
  };

  const handleMoveForward = () => {
    if (task.stage === 3) return;

    const newStage = task.stage + 1;

    dispatch(
      updateTask({
        id: task.id,
        stage: newStage,
      })
    );

    showNotification(
      `Moved to ${TASK_STAGES[newStage].title}`
    );
  };

  const handleDelete = () => {
    if (onDeletePrompt) {
      onDeletePrompt(task);
    } else {
      dispatch(deleteTask(task.id));
      showNotification(
        `Deleted task "${task.name}"`,
        "info"
      );
    }
  };

  const getPriorityDetails = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "#EF4444",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(239, 68, 68, 0.1)",
          icon: (
            <WhatshotIcon
              sx={{
                fontSize: "14px !important",
                color: "#EF4444",
              }}
            />
          ),
          label: "High",
        };

      case "medium":
        return {
          color: "#F59E0B",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(245, 158, 11, 0.1)",
          icon: (
            <WarningAmberIcon
              sx={{
                fontSize: "14px !important",
                color: "#F59E0B",
              }}
            />
          ),
          label: "Medium",
        };

      case "low":
      default:
        return {
          color: "#10B981",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(16, 185, 129, 0.15)"
              : "rgba(16, 185, 129, 0.1)",
          icon: (
            <CheckCircleOutlinedIcon
              sx={{
                fontSize: "14px !important",
                color: "#10B981",
              }}
            />
          ),
          label: "Low",
        };
    }
  };

  const priorityInfo = getPriorityDetails(task.priority);

  const getDeadlineBadge = (deadlineStr) => {
    if (!deadlineStr) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadlineStr);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (deadlineDate - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        label: "Overdue",
        color: "error",
        icon: (
          <AccessTimeIcon
            sx={{ fontSize: "14px !important" }}
          />
        ),
      };
    }

    if (diffDays === 0) {
      return {
        label: "Due Today",
        color: "warning",
        icon: (
          <AccessTimeIcon
            sx={{ fontSize: "14px !important" }}
          />
        ),
      };
    }

    if (diffDays === 1) {
      return {
        label: "Tomorrow",
        color: "info",
        icon: (
          <CalendarTodayIcon
            sx={{ fontSize: "14px !important" }}
          />
        ),
      };
    }

    return {
      label: deadlineStr,
      color: "default",
      icon: (
        <CalendarTodayIcon
          sx={{ fontSize: "14px !important" }}
        />
      ),
    };
  };

  const deadlineBadge = getDeadlineBadge(task.deadline);
  const isCompleted = task.stage === 3;

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        elevation={isDragging ? 6 : 1}
        className="hover-lift"
        sx={{
          /*
           * Keep the card stable inside its column.
           * It will fill the available column width
           * but will not shrink because more tasks are added.
           */
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          flexShrink: 0,
          flexGrow: 0,
          alignSelf: "stretch",

          mb: 2,
          borderRadius: 2.5,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",

          border: "1px solid",
          borderColor: isDragging
            ? "primary.main"
            : "divider",

          backgroundColor:
            theme.palette.mode === "dark"
              ? "#182234"
              : "#FFFFFF",

          transition:
            "box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            backgroundColor: priorityInfo.color,
            borderRadius: "4px 0 0 4px",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2,
            width: "100%",
            boxSizing: "border-box",
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <Box
              display="flex"
              alignItems="flex-start"
              gap={1}
              flex={1}
              minWidth={0}
            >
              {/* Drag Handle */}
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  cursor: isDragging ? "grabbing" : "grab",
                  color: "text.secondary",
                  p: 0.2,
                  mt: 0.2,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 1,
                  touchAction: "none",

                  "&:hover": {
                    color: "primary.main",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>

              {/* Task Title */}
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  minWidth: 0,
                  flex: 1,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  textDecoration: isCompleted
                    ? "line-through"
                    : "none",
                  color: isCompleted
                    ? "text.secondary"
                    : "text.primary",
                  lineHeight: 1.35,
                }}
              >
                {task.name}
              </Typography>
            </Box>

            {/* Priority */}
            <Chip
              icon={priorityInfo.icon}
              label={priorityInfo.label}
              size="small"
              sx={{
                flexShrink: 0,
                height: 22,
                fontSize: "0.7rem",
                fontWeight: 700,
                backgroundColor: priorityInfo.bgColor,
                color: priorityInfo.color,
                border: "1px solid",
                borderColor: `${priorityInfo.color}30`,
              }}
            />
          </Box>

          {/* Due Date */}
          {deadlineBadge && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                mt: 1.5,
                pl: 3.5,
                minWidth: 0,
              }}
            >
              <Chip
                icon={deadlineBadge.icon}
                label={deadlineBadge.label}
                size="small"
                color={deadlineBadge.color}
                variant={
                  deadlineBadge.color === "default"
                    ? "outlined"
                    : "filled"
                }
                sx={{
                  maxWidth: "100%",
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 600,

                  "& .MuiChip-icon": {
                    fontSize: 14,
                  },
                }}
              />
            </Stack>
          )}

          {/* Action Toolbar */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              mt: 1.5,
              pt: 1.2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Move Buttons */}
            <Stack direction="row" spacing={0.5}>
              <Tooltip
                title={
                  task.stage > 0
                    ? `Move back to ${
                        TASK_STAGES[task.stage - 1].title
                      }`
                    : "At first stage"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={handleMoveBackward}
                    disabled={task.stage === 0}
                    sx={{
                      p: 0.5,
                      borderRadius: 1.5,

                      "&:disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip
                title={
                  task.stage < 3
                    ? `Move forward to ${
                        TASK_STAGES[task.stage + 1].title
                      }`
                    : "Task is completed"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={handleMoveForward}
                    disabled={task.stage === 3}
                    sx={{
                      p: 0.5,
                      borderRadius: 1.5,

                      "&:disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {/* Edit and Delete */}
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit Task">
                <IconButton
                  size="small"
                  onClick={() => setEditOpen(true)}
                  sx={{
                    p: 0.5,
                    borderRadius: 1.5,
                    color: "text.secondary",

                    "&:hover": {
                      color: "primary.main",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(99, 102, 241, 0.08)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Task">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{
                    p: 0.5,
                    borderRadius: 1.5,
                    color: "text.secondary",

                    "&:hover": {
                      color: "error.main",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(239, 68, 68, 0.08)",
                    },
                  }}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
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
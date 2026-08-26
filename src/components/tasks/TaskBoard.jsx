import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import {
  deleteTask,
  updateTask,
} from "../../redux/slices/taskSlice";

import { TASK_STAGES } from "../../utils/constants";
import { useThemeContext } from "../../theme/useThemeContext";

import TaskColumn from "./TaskColumn";
import TrashZone from "./TrashZone";

function TaskBoard({
  searchQuery = "",
  priorityFilter = "all",
  sortBy = "default",
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { showNotification } = useThemeContext();

  const tasks = useSelector((state) => state.tasks.tasks);

  const [activeTask, setActiveTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    const task = event.active.data.current?.task;
    setActiveTask(task);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const task = active.data.current?.task;

    if (!task) return;

    // Drop task into trash
    if (over.id === "trash") {
      setTaskToDelete(task);
      setDeleteDialogOpen(true);
      return;
    }

    // Drop task into a stage
    const overType = over.data.current?.type;

    if (overType === "stage") {
      const newStage = over.data.current.stageId;

      if (task.stage !== newStage) {
        dispatch(
          updateTask({
            id: task.id,
            stage: newStage,
          })
        );

        showNotification(
          `Moved "${task.name}" to ${
            TASK_STAGES[newStage]?.title || "new stage"
          }`
        );
      }
    }
  };

  const handleDeletePrompt = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!taskToDelete) return;

    dispatch(deleteTask(taskToDelete.id));

    showNotification(
      `Deleted "${taskToDelete.name}"`,
      "info"
    );

    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery.trim() ||
      task.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      return (
        new Date(a.deadline) -
        new Date(b.deadline)
      );
    }

    if (sortBy === "priority") {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return (
        (priorityOrder[a.priority] || 4) -
        (priorityOrder[b.priority] || 4)
      );
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        {/* Full Width Kanban Board */}
        <Box
          sx={{
            width: "100%",
            minWidth: 0,

            /*
             * Four columns fill the entire available width.
             * Columns do not become narrower when tasks are added.
             */
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },

            gap: {
              xs: 2,
              md: 2.5,
              lg: 3,
            },

            alignItems: "stretch",
          }}
        >
          {TASK_STAGES.map((stage) => {
            const stageTasks = sortedTasks.filter(
              (task) => task.stage === stage.id
            );

            return (
              <Box
                key={stage.id}
                sx={{
                  /*
                   * Important:
                   * Each column always occupies its equal
                   * share of the board width.
                   */
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                  boxSizing: "border-box",

                  /*
                   * Prevent the column from shrinking
                   * because more task cards are added.
                   */
                  flexShrink: 0,

                  alignSelf: "stretch",
                }}
              >
                <TaskColumn
                  stage={stage}
                  tasks={stageTasks}
                  onDeletePrompt={handleDeletePrompt}
                />
              </Box>
            );
          })}
        </Box>

        {/* Show Trash Zone while dragging */}
        {activeTask && <TrashZone />}

        {/* Drag Preview */}
        <DragOverlay>
          {activeTask ? (
            <Card
              elevation={8}
              sx={{
                width: 290,
                maxWidth: "calc(100vw - 32px)",
                borderRadius: 2.5,
                border: "2px solid",
                borderColor: "primary.main",

                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#1E293B"
                    : "#FFFFFF",

                boxShadow:
                  "0 20px 35px rgba(0, 0, 0, 0.3)",

                transform:
                  "rotate(2deg) scale(1.03)",

                cursor: "grabbing",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  "&:last-child": {
                    pb: 2,
                  },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    minWidth={0}
                    flex={1}
                  >
                    <DragIndicatorIcon
                      fontSize="small"
                      color="primary"
                      sx={{ flexShrink: 0 }}
                    />

                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {activeTask.name}
                    </Typography>
                  </Box>

                  <Chip
                    label={activeTask.priority}
                    size="small"
                    color={
                      activeTask.priority === "high"
                        ? "error"
                        : activeTask.priority === "medium"
                        ? "warning"
                        : "success"
                    }
                    sx={{
                      flexShrink: 0,
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 1,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "error.light",
              color: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberIcon />
          </Box>

          <Typography variant="h6" fontWeight={700}>
            Delete Task
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Typography
            variant="body1"
            color="text.primary"
            gutterBottom
          >
            Are you sure you want to permanently delete{" "}
            <strong>"{taskToDelete?.name}"</strong>?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            This action cannot be undone and will remove the
            task from your board.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              fontWeight: 700,
              px: 3,
            }}
          >
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskBoard;
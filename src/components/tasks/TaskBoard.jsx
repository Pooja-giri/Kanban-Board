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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";

import {
  deleteTask,
  updateTask,
} from "../../redux/slices/taskSlice";

import { TASK_STAGES } from "../../utils/constants";
import ErrorMessage from "../../components/common/ErrorMessage";

import TaskColumn from "./TaskColumn";
import TrashZone from "./TrashZone";

function TaskBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  const [activeTask, setActiveTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [error, setError] = useState("");

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
    setError("");
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const task = active.data.current?.task;

    if (!task) {
      return;
    }

    // Drop on Trash
    if (over.id === "trash") {
      setTaskToDelete(task);
      setDeleteDialogOpen(true);
      return;
    }

    // Drop on Stage
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
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (!taskToDelete) return;

    dispatch(deleteTask(taskToDelete.id));

    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <>
  <ErrorMessage message={error} />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <Box>
          <Grid container spacing={3}>
            {TASK_STAGES.map((stage) => {
              const stageTasks = tasks.filter(
                (task) => task.stage === stage.id
              );

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={3}
                  key={stage.id}
                >
                  <TaskColumn
                    stage={stage}
                    tasks={stageTasks}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {activeTask && <TrashZone />}

        <DragOverlay>
          {activeTask ? (
            <Box
              sx={{
                width: 280,
                padding: 2,
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 6,
              }}
            >
              {activeTask.name}
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Task?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{taskToDelete?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskBoard;
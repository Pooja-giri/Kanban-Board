import { useDroppable } from "@dnd-kit/core";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import TaskCard from "./TaskCard";

function TaskColumn({ stage, tasks }) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `stage-${stage.id}`,
    data: {
      type: "stage",
      stageId: stage.id,
    },
  });

  return (
    <Paper
      ref={setNodeRef}
      elevation={isOver ? 4 : 1}
      sx={{
        padding: 2,
        minHeight: 500,
        borderRadius: 2,
        transition: "0.2s",
        border: isOver
          ? "2px solid"
          : "1px solid transparent",
        borderColor: isOver
          ? "primary.main"
          : "transparent",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          marginBottom: 2,
          paddingBottom: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {stage.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {tasks.length} Tasks
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ marginTop: 4 }}
        >
          Drop tasks here
        </Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))
      )}
    </Paper>
  );
}

export default TaskColumn;
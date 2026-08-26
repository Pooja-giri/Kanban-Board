import { useDroppable } from "@dnd-kit/core";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import InboxIcon from "@mui/icons-material/Inbox";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import TaskCard from "./TaskCard";

function TaskColumn({ stage, tasks, onDeletePrompt }) {
  const theme = useTheme();

  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage.id}`,
    data: {
      type: "stage",
      stageId: stage.id,
    },
  });

  const getStageTheme = (stageId) => {
    switch (stageId) {
      case 0: // Backlog
        return {
          color: "#8B5CF6",
          lightBg: theme.palette.mode === "dark" ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
          icon: <InboxIcon fontSize="small" sx={{ color: "#8B5CF6" }} />,
          emptyText: "No backlog items yet",
          emptySub: "New ideas and backlogged tasks will appear here",
        };
      case 1: // To Do
        return {
          color: "#3B82F6",
          lightBg: theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.08)",
          icon: <FormatListBulletedIcon fontSize="small" sx={{ color: "#3B82F6" }} />,
          emptyText: "Ready to work?",
          emptySub: "Move tasks here when ready to start",
        };
      case 2: // Ongoing
        return {
          color: "#F59E0B",
          lightBg: theme.palette.mode === "dark" ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.08)",
          icon: <PlayCircleOutlinedIcon fontSize="small" sx={{ color: "#F59E0B" }} />,
          emptyText: "Nothing in progress",
          emptySub: "Drag a task here to mark it as active",
        };
      case 3: // Done
      default:
        return {
          color: "#10B981",
          lightBg: theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.08)",
          icon: <CheckCircleOutlinedIcon fontSize="small" sx={{ color: "#10B981" }} />,
          emptyText: "No completed tasks yet",
          emptySub: "Finish tasks and drag them here for that sweet victory",
        };
    }
  };

  const stageTheme = getStageTheme(stage.id);

  return (
    <Paper
      ref={setNodeRef}
      elevation={isOver ? 4 : 1}
      sx={{
        p: 2,
        minHeight: 520,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? isOver
              ? "rgba(30, 41, 59, 0.9)"
              : "#111827"
            : isOver
            ? "rgba(241, 245, 249, 0.95)"
            : "#F8FAFC",
        border: "1.5px solid",
        borderColor: isOver
          ? stageTheme.color
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(226, 232, 240, 0.8)",
        boxShadow: isOver ? `0 8px 24px ${stageTheme.color}30` : undefined,
      }}
    >
      {/* Column Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          pb: 1.8,
          mb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.2}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: stageTheme.lightBg,
            }}
          >
            {stageTheme.icon}
          </Box>

          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {stage.title}
          </Typography>
        </Box>

        <Chip
          label={tasks.length}
          size="small"
          sx={{
            height: 22,
            fontWeight: 800,
            fontSize: "0.75rem",
            backgroundColor: stageTheme.lightBg,
            color: stageTheme.color,
            borderRadius: 1.5,
          }}
        />
      </Box>

      {/* Column Task List / Empty State */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        {tasks.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              textAlign: "center",
              borderRadius: 2.5,
              border: "1.5px dashed",
              borderColor: isOver ? stageTheme.color : "divider",
              backgroundColor: isOver ? stageTheme.lightBg : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: stageTheme.lightBg,
                mb: 1.5,
                opacity: 0.85,
              }}
            >
              {stageTheme.icon}
            </Box>
            <Typography variant="body2" fontWeight={700} color="text.primary" gutterBottom>
              {isOver ? "Drop to move here" : stageTheme.emptyText}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 180 }}>
              {isOver ? `Task will be placed in ${stage.title}` : stageTheme.emptySub}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0} sx={{ flex: 1, width: "100%" }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDeletePrompt={onDeletePrompt}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

export default TaskColumn;
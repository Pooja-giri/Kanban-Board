import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";

import { fetchTasks } from "../../redux/slices/taskSlice";
import { TASK_STAGES } from "../../utils/constants";
import PageLoader from "../../components/common/PageLoader";

function Dashboard() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const user = useSelector((state) => state.auth.user);
  const { tasks, loading, hasLoaded } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

  if (loading && !hasLoaded) {
    return <PageLoader message="Loading dashboard insights..." />;
  }

  const totalTasks = tasks.length;
  const backlogTasks = tasks.filter((t) => t.stage === 0).length;
  const todoTasks = tasks.filter((t) => t.stage === 1).length;
  const ongoingTasks = tasks.filter((t) => t.stage === 2).length;
  const completedTasks = tasks.filter((t) => t.stage === 3).length;

  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const mediumPriority = tasks.filter(
    (t) => t.priority === "medium"
  ).length;
  const lowPriority = tasks.filter((t) => t.priority === "low").length;

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate upcoming / overdue tasks
  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingTasks = [...tasks]
    .filter((task) => task.stage !== 3 && task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      subtitle: `${completedTasks} of ${totalTasks} completed`,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      textColor: "#6366F1",
      bgColor:
        theme.palette.mode === "dark"
          ? "rgba(99, 102, 241, 0.12)"
          : "rgba(99, 102, 241, 0.08)",
    },
    {
      title: "In Progress",
      value: ongoingTasks,
      subtitle: "Currently active tasks",
      icon: <HourglassEmptyIcon sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      textColor: "#F59E0B",
      bgColor:
        theme.palette.mode === "dark"
          ? "rgba(245, 158, 11, 0.12)"
          : "rgba(245, 158, 11, 0.08)",
    },
    {
      title: "Completed",
      value: completedTasks,
      subtitle: `${completionRate}% overall completion`,
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      textColor: "#10B981",
      bgColor:
        theme.palette.mode === "dark"
          ? "rgba(16, 185, 129, 0.12)"
          : "rgba(16, 185, 129, 0.08)",
    },
    {
      title: "To Do & Backlog",
      value: backlogTasks + todoTasks,
      subtitle: `${backlogTasks} Backlog, ${todoTasks} Ready`,
      icon: <PendingActionsIcon sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
      textColor: "#0EA5E9",
      bgColor:
        theme.palette.mode === "dark"
          ? "rgba(14, 165, 233, 0.12)"
          : "rgba(14, 165, 233, 0.08)",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "none",
        minWidth: 0,
        flex: 1,
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* Welcome Hero Banner */}
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: "none",
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 3.5,
          position: "relative",
          overflow: "hidden",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1E1B4B 0%, #0F172A 55%, #172554 100%)"
              : "linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 55%, #ECFEFF 100%)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(99, 102, 241, 0.25)"
              : "rgba(99, 102, 241, 0.15)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) 220px",
            },
            gap: 3,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Welcome Content */}
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={
                  <CalendarMonthIcon
                    sx={{ fontSize: "16px !important" }}
                  />
                }
                label={todayFormatted}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(99, 102, 241, 0.1)",
                  color: "primary.main",
                }}
              />

              <Chip
                icon={
                  <TrendingUpIcon
                    sx={{ fontSize: "16px !important" }}
                  />
                }
                label={`${completionRate}% Completed`}
                size="small"
                color="success"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, {user?.name || user?.username || "Friend"}! 👋
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 850,
              }}
            >
              {totalTasks === 0
                ? "Your board is empty. Create your first task to start organizing your workflow effectively."
                : `You have ${ongoingTasks} active task${
                    ongoingTasks === 1 ? "" : "s"
                  } in progress and ${highPriority} high-priority item${
                    highPriority === 1 ? "" : "s"
                  }. Keep up the momentum!`}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<ViewKanbanIcon />}
                component={RouterLink}
                to="/tasks"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                }}
              >
                Open Kanban Board
              </Button>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                component={RouterLink}
                to="/tasks"
                sx={{
                  px: 2.5,
                  fontWeight: 600,
                }}
              >
                Add New Task
              </Button>
            </Stack>
          </Box>

          {/* Completion Ring */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                borderRadius: "50%",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={130}
                thickness={6}
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                }}
              />

              <CircularProgress
                variant="determinate"
                value={completionRate}
                size={130}
                thickness={6}
                sx={{
                  color: "#10B981",
                  position: "absolute",
                  strokeLinecap: "round",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {completionRate}%
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Completed
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* KPI Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {statCards.map((card) => (
          <Card
            key={card.title}
            elevation={2}
            className="hover-lift"
            sx={{
              width: "100%",
              minWidth: 0,
              minHeight: { xs: 150, md: 180 },
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
                gap={2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="text.primary"
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: card.gradient,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 12px ${card.textColor}40`,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Progress Breakdown & Pending Deadlines */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(340px, 1fr)",
          },
          gap: { xs: 2, md: 3 },
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {/* Stage Distribution Breakdown */}
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            minWidth: 0,
            minHeight: 430,
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Task Pipeline Distribution
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Visual breakdown across all 4 kanban workflow stages
              </Typography>
            </Box>

            <Button
              size="small"
              endIcon={<ArrowForwardIcon />}
              component={RouterLink}
              to="/tasks"
              sx={{
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              View Board
            </Button>
          </Box>

          {/* Segmented Distribution Bar */}
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: 14,
                borderRadius: 7,
                overflow: "hidden",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.06)",
                mb: 2,
              }}
            >
              {totalTasks > 0 ? (
                <>
                  <Box
                    sx={{
                      width: `${(backlogTasks / totalTasks) * 100}%`,
                      backgroundColor: "#8B5CF6",
                      transition: "width 0.5s ease",
                    }}
                  />

                  <Box
                    sx={{
                      width: `${(todoTasks / totalTasks) * 100}%`,
                      backgroundColor: "#3B82F6",
                      transition: "width 0.5s ease",
                    }}
                  />

                  <Box
                    sx={{
                      width: `${(ongoingTasks / totalTasks) * 100}%`,
                      backgroundColor: "#F59E0B",
                      transition: "width 0.5s ease",
                    }}
                  />

                  <Box
                    sx={{
                      width: `${(completedTasks / totalTasks) * 100}%`,
                      backgroundColor: "#10B981",
                      transition: "width 0.5s ease",
                    }}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "divider",
                  }}
                />
              )}
            </Box>

            {/* Stage Legend */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
                width: "100%",
              }}
            >
              {[
                {
                  label: "Backlog",
                  count: backlogTasks,
                  color: "#8B5CF6",
                },
                {
                  label: "To Do",
                  count: todoTasks,
                  color: "#3B82F6",
                },
                {
                  label: "Ongoing",
                  count: ongoingTasks,
                  color: "#F59E0B",
                },
                {
                  label: "Done",
                  count: completedTasks,
                  color: "#10B981",
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    minWidth: 0,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={0.5}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        flexShrink: 0,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight={700}>
                    {item.count}

                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      (
                      {totalTasks > 0
                        ? Math.round(
                            (item.count / totalTasks) * 100
                          )
                        : 0}
                      %)
                    </Typography>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Priority Distribution */}
          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              gutterBottom
            >
              Priority Distribution
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 1 }}
            >
              <Chip
                icon={
                  <WhatshotIcon
                    sx={{ color: "#EF4444 !important" }}
                  />
                }
                label={`High: ${highPriority}`}
                sx={{
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(239, 68, 68, 0.08)",
                  color: "error.main",
                  borderColor: "error.main",
                }}
                variant="outlined"
              />

              <Chip
                label={`Medium: ${mediumPriority}`}
                sx={{
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(245, 158, 11, 0.08)",
                  color: "warning.main",
                  borderColor: "warning.main",
                }}
                variant="outlined"
              />

              <Chip
                label={`Low: ${lowPriority}`}
                sx={{
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(16, 185, 129, 0.08)",
                  color: "success.main",
                  borderColor: "success.main",
                }}
                variant="outlined"
              />
            </Stack>
          </Box>
        </Paper>

        {/* Upcoming Tasks & Deadlines */}
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            minWidth: 0,
            minHeight: 430,
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            gap={1}
          >
            <Typography variant="h6" fontWeight={700}>
              Pending Deadlines
            </Typography>

            <Chip
              label={`${upcomingTasks.length} Pending`}
              size="small"
              color="primary"
              sx={{
                fontWeight: 600,
                flexShrink: 0,
              }}
            />
          </Box>

          {upcomingTasks.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
              }}
            >
              <CheckCircleOutlinedIcon
                sx={{
                  fontSize: 48,
                  color: "success.main",
                  mb: 1,
                  opacity: 0.8,
                }}
              />

              <Typography variant="subtitle1" fontWeight={700}>
                All caught up!
              </Typography>

              <Typography variant="body2" color="text.secondary">
                No pending deadlines or tasks awaiting completion.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              {upcomingTasks.map((task) => {
                const isOverdue = task.deadline < todayStr;
                const isToday = task.deadline === todayStr;

                return (
                  <Box
                    key={task.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                      border: "1px solid",
                      borderColor: isOverdue
                        ? "error.main"
                        : isToday
                        ? "warning.main"
                        : "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        sx={{
                          textDecoration:
                            task.stage === 3
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {task.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {TASK_STAGES[task.stage]?.title || "Task"} •{" "}
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              task.priority === "high"
                                ? "#EF4444"
                                : task.priority === "medium"
                                ? "#F59E0B"
                                : "#10B981",
                          }}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={
                        isOverdue
                          ? "Overdue"
                          : isToday
                          ? "Today"
                          : task.deadline
                      }
                      color={
                        isOverdue
                          ? "error"
                          : isToday
                          ? "warning"
                          : "default"
                      }
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}

          <Button
            fullWidth
            variant="outlined"
            component={RouterLink}
            to="/tasks"
            sx={{ mt: 2 }}
          >
            Go to Kanban Board
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;

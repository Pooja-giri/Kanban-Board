import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";

import TaskForm from "../../components/tasks/TaskForm";
import TaskBoard from "../../components/tasks/TaskBoard";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageLoader from "../../components/common/PageLoader";
import { fetchTasks } from "../../redux/slices/taskSlice";

function Tasks() {
  const dispatch = useDispatch();

  const { loading, error, hasLoaded, tasks } = useSelector(
    (state) => state.tasks
  );

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

  const handleRefresh = () => {
    dispatch(fetchTasks());
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    priorityFilter !== "all" ||
    sortBy !== "default";

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
      {/* Top Header & Action Row */}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1fr) auto",
          },
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          gap: 2,
        }}
      >
        {/* Page Title */}
        <Box sx={{ minWidth: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            flexWrap="wrap"
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                letterSpacing: "-0.02em",
              }}
            >
              Kanban Board
            </Typography>

            <Chip
              label={`${tasks.length} total`}
              size="small"
              color="primary"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              maxWidth: 800,
            }}
          >
            Drag and drop tasks across stages, organize by priority, and track
            deadlines
          </Typography>
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
            justifyContent: {
              xs: "space-between",
              md: "flex-end",
            },
          }}
        >
          <Tooltip title="Refresh tasks">
            <IconButton
              onClick={handleRefresh}
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowTaskForm((prev) => !prev)}
            sx={{
              minWidth: {
                xs: 0,
                sm: 140,
              },
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              flex: {
                xs: 1,
                md: "initial",
              },
            }}
          >
            {showTaskForm ? "Close Form" : "New Task"}
          </Button>
        </Stack>
      </Box>

      {/* Error Message */}
      <Box sx={{ width: "100%" }}>
        <ErrorMessage message={error} />
      </Box>

      {/* Collapsible Create Task Form */}
      <Box sx={{ width: "100%" }}>
        <TaskForm
          isOpen={showTaskForm}
          onToggle={setShowTaskForm}
        />
      </Box>

      {/* Filter & Search Toolbar */}
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: "none",
          minWidth: 0,
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(300px, 1fr) auto",
            },
            alignItems: "center",
            gap: {
              xs: 2,
              lg: 3,
            },
          }}
        >
          {/* Search Input */}
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search tasks by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  minHeight: 44,
                },
              }}
            />
          </Box>

          {/* Priority Filter & Sort Toolbar */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: {
                xs: "flex-start",
                lg: "flex-end",
              },
              gap: 1.5,
              minWidth: 0,
            }}
          >
            {/* Priority Filters */}
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  mr: 0.5,
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                Priority:
              </Typography>

              {[
                {
                  id: "all",
                  label: "All",
                },
                {
                  id: "high",
                  label: "High",
                  color: "error",
                },
                {
                  id: "medium",
                  label: "Medium",
                  color: "warning",
                },
                {
                  id: "low",
                  label: "Low",
                  color: "success",
                },
              ].map((p) => (
                <Chip
                  key={p.id}
                  label={p.label}
                  size="small"
                  clickable
                  onClick={() => setPriorityFilter(p.id)}
                  color={
                    priorityFilter === p.id
                      ? p.color || "primary"
                      : "default"
                  }
                  variant={
                    priorityFilter === p.id
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    fontWeight: 600,
                    borderRadius: 1.5,
                    fontSize: "0.75rem",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </Stack>

            {/* Sort By Dropdown */}
            <TextField
              select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 180,
                },
                "& .MuiOutlinedInput-root": {
                  minHeight: 40,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="default">
                Default Order
              </MenuItem>

              <MenuItem value="deadline">
                Due Date (Earliest)
              </MenuItem>

              <MenuItem value="priority">
                Priority (Highest)
              </MenuItem>

              <MenuItem value="name">
                Alphabetical (A-Z)
              </MenuItem>
            </TextField>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={handleClearFilters}
                color="inherit"
                sx={{
                  minHeight: 40,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Board or Loading View */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "none",
          minWidth: 0,
          flex: 1,
          display: "flex",
        }}
      >
        {loading && !hasLoaded ? (
          <Box
            sx={{
              width: "100%",
              flex: 1,
            }}
          >
            <PageLoader message="Loading your task pipeline..." />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "none",
              minWidth: 0,
              flex: 1,
            }}
          >
            <TaskBoard
              searchQuery={searchQuery}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Tasks;
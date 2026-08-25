import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import TaskForm from "../../components/tasks/TaskForm";
import TaskBoard from "../../components/tasks/TaskBoard";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchTasks,
} from "../../redux/slices/taskSlice";

function Tasks() {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    hasLoaded,
  } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

  

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        Task Management
      </Typography>

      <ErrorMessage message={error} />

      <TaskForm />

      {loading && !hasLoaded ? (
        <Box
          display="flex"
          justifyContent="center"
          padding={5}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TaskBoard />
      )}
    </>
  );
}

export default Tasks;
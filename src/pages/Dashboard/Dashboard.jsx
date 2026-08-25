import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import { fetchTasks } from "../../redux/slices/taskSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const {
  tasks,
  loading,
  hasLoaded,
} = useSelector((state) => state.tasks);

useEffect(() => {
  if (!hasLoaded) {
    dispatch(fetchTasks());
  }
}, [dispatch, hasLoaded]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.stage === 3
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.stage !== 3
  ).length;

  const statistics = [
    {
      title: "Total Tasks",
      value: totalTasks,
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
    },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statistics.map((statistic) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={statistic.title}
          >
            <Card>
              <CardContent>
                <Typography
                  color="text.secondary"
                  gutterBottom
                >
                  {statistic.title}
                </Typography>

                <Typography variant="h3">
                  {statistic.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
import { lazy, Suspense } from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/common/AppLayout";
import PageLoader from "./components/common/PageLoader";

const Login = lazy(() =>
  import("./pages/Login/Login")
);

const Register = lazy(() =>
  import("./pages/Register/Register")
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard/Dashboard")
);

const Tasks = lazy(() =>
  import("./pages/tasks/Tasks")
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
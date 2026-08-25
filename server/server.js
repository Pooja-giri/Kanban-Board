import express from "express";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Kanban Board API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";

const router = express.Router();

// Temporary in-memory storage
let tasks = [];

/*
  GET /api/tasks
  Get all tasks
*/
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

/*
  POST /api/tasks
  Create a task
*/
router.post("/", (req, res) => {
  const {
    name,
    priority,
    deadline,
    stage,
  } = req.body;

  // Validation
  if (!name || !priority || !deadline) {
    return res.status(400).json({
      message:
        "Task name, priority and deadline are required",
    });
  }

  // Check duplicate task name
  const duplicateTask = tasks.some(
    (task) =>
      task.name.toLowerCase() === name.trim().toLowerCase()
  );

  if (duplicateTask) {
    return res.status(409).json({
      message:
        "A task with this name already exists",
    });
  }

  const newTask = {
    id: Date.now().toString(),
    name: name.trim(),
    priority,
    deadline,
    stage: Number(stage ?? 0),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

/*
  PATCH /api/tasks/:id
  Update a task
*/
router.patch("/:id", (req, res) => {
  const task = tasks.find(
    (item) => item.id === req.params.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const {
    name,
    priority,
    deadline,
    stage,
  } = req.body;

  // Validate duplicate name when name is being changed
  if (
    name &&
    tasks.some(
      (item) =>
        item.id !== task.id &&
        item.name.toLowerCase() ===
          name.trim().toLowerCase()
    )
  ) {
    return res.status(409).json({
      message:
        "A task with this name already exists",
    });
  }

  if (name !== undefined) {
    task.name = name.trim();
  }

  if (priority !== undefined) {
    task.priority = priority;
  }

  if (deadline !== undefined) {
    task.deadline = deadline;
  }

  if (stage !== undefined) {
    task.stage = Number(stage);
  }

  res.status(200).json(task);
});

/*
  DELETE /api/tasks/:id
  Delete a task
*/
router.delete("/:id", (req, res) => {
  const taskIndex = tasks.findIndex(
    (item) => item.id === req.params.id
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const deletedTask = tasks[taskIndex];

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask,
  });
});

export default router;
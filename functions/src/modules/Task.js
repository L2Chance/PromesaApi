const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const taskController = require("../controller/task.controller");
const authenticateToken = require("../middleware/auth.middleware");
const validateFields = require("../middleware/validation.middleware");

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(authenticateToken);

// Routes
app.post(
  "/",
  validateFields(["uid", "titulo", "fecha", "horarioInicial", "horarioFinal"]),
  taskController.createTask
);
app.get("/", validateFields(["uid", "fecha"]), taskController.getTasksByDate);
app.get("/:uid/today", validateFields(["uid"]), taskController.getTodayTasks);
app.get(
  "/:taskId/duration",
  validateFields(["taskId"]),
  taskController.getTaskTimerDuration
);
app.get("/:uid", validateFields(["uid"]), taskController.getAllTasksByUser);
app.put("/", validateFields(["taskId"]), taskController.updateTask);
app.delete("/", validateFields(["taskId"]), taskController.deleteTask);
app.post(
  "/toggle",
  validateFields(["taskId", "uid"]),
  taskController.toggleCompleteTask
);

// Export the Express app as a single Cloud Function
exports.task = onRequest({ cors: true }, app);

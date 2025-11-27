const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const taskController = require("../controller/task.controller");

const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());

// Routes
app.post("/", taskController.createTask);
app.post("/", taskController.createTask);
app.get("/", taskController.getTasksByDate);
app.get("/:uid", taskController.getAllTasksByUser);
app.put("/", taskController.updateTask);
app.delete("/", taskController.deleteTask);
app.post("/toggle", taskController.toggleCompleteTask);

// Export the Express app as a single Cloud Function
exports.task = onRequest({cors: true}, app);

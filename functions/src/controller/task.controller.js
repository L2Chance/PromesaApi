const taskService = require("../services/task.service");

async function createTask(req, res) {
  try {
    const {uid, ...data} = req.body;
    if (!uid || !data.titulo || !data.fecha || !data.horarioInicial || !data.horarioFinal) {
      return res.status(400).json({error: "Faltan datos requeridos: uid, titulo, fecha, horarioInicial, horarioFinal"});
    }

    const task = await taskService.createTask(uid, data);
    res.status(201).json({success: true, data: task});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function getTasksByDate(req, res) {
  try {
    const {uid, fecha} = req.query;
    if (!uid || !fecha) return res.status(400).json({error: "UID y fecha requeridos"});

    const tasks = await taskService.getTasksByDate(uid, fecha);
    res.status(200).json({success: true, data: tasks});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function getAllTasksByUser(req, res) {
  try {
    const {uid} = req.params;
    if (!uid) return res.status(400).json({error: "UID requerido"});

    const tasks = await taskService.getAllTasksByUser(uid);
    res.status(200).json({success: true, data: tasks});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function updateTask(req, res) {
  try {
    const {taskId, ...data} = req.body;
    if (!taskId) return res.status(400).json({error: "Task ID requerido"});

    const task = await taskService.updateTask(taskId, data);
    res.status(200).json({success: true, data: task});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function deleteTask(req, res) {
  try {
    const {taskId} = req.body;
    if (!taskId) return res.status(400).json({error: "Task ID requerido"});

    await taskService.deleteTask(taskId);
    res.status(200).json({success: true, message: "Tarea eliminada"});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function toggleCompleteTask(req, res) {
  try {
    const {taskId, uid} = req.body;
    if (!taskId || !uid) return res.status(400).json({error: "Task ID y UID requeridos"});

    const task = await taskService.toggleCompleteTask(taskId, uid);
    res.status(200).json({success: true, data: task});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function getTaskTimerDuration(req, res) {
  try {
    const {taskId} = req.params;
    if (!taskId) return res.status(400).json({error: "Task ID requerido"});

    const duration = await taskService.getTaskTimerDuration(taskId);
    res.status(200).json({success: true, data: duration});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function getTodayTasks(req, res) {
  try {
    const {uid} = req.params;
    if (!uid) return res.status(400).json({error: "UID requerido"});

    const tasks = await taskService.getTodayTasks(uid);
    res.status(200).json({success: true, data: tasks});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

module.exports = {
  createTask,
  getTasksByDate,
  getAllTasksByUser,
  updateTask,
  deleteTask,
  toggleCompleteTask,
  getTaskTimerDuration,
  getTodayTasks,
};

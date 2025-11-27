const taskRepository = require("../repositories/task.repository");
const profileService = require("./profile.service");

async function createTask(uid, data) {
  return await taskRepository.create(uid, data);
}

async function getTasksByDate(uid, date) {
  return await taskRepository.getByDate(uid, date);
}

async function getAllTasksByUser(uid) {
  return await taskRepository.getAllByUser(uid);
}

async function updateTask(taskId, data) {
  // Validar que la tarea pertenezca al usuario (se podría hacer aquí o en controller)
  // Por simplicidad asumimos que el controller pasa los datos correctos o que confiamos en el ID
  return await taskRepository.update(taskId, data);
}

async function deleteTask(taskId) {
  // Al borrar una tarea, deberíamos verificar si eso afecta la racha?
  // Si borro la única tarea pendiente, quizás debería darme la racha.
  // Por ahora simple: borrar y ya.
  const task = await taskRepository.getById(taskId);
  if (!task) throw new Error("Tarea no encontrada");

  await taskRepository.delete(taskId);

  // Recalcular racha para ese día por si acaso
  await checkAndUpdateRacha(task.uid, task.fecha);

  return true;
}

async function toggleCompleteTask(taskId, uid) {
  const task = await taskRepository.getById(taskId);
  if (!task) throw new Error("Tarea no encontrada");
  if (task.uid !== uid) throw new Error("No autorizado");

  const newStatus = !task.completada;
  await taskRepository.update(taskId, {completada: newStatus});

  // Verificar racha
  await checkAndUpdateRacha(uid, task.fecha);

  return {...task, completada: newStatus};
}

async function checkAndUpdateRacha(uid, date) {
  const total = await taskRepository.countTotal(uid, date);
  const pending = await taskRepository.countPending(uid, date);

  if (total > 0 && pending === 0) {
    // Todas completas
    await profileService.manageRacha(uid, date, "add");
  } else {
    // Falta alguna o no hay tareas
    // Si no hay tareas, ¿debería contar como racha? Generalmente no.
    // Si hay pendientes, removemos la racha si existía.
    await profileService.manageRacha(uid, date, "remove");
  }
}

async function getTaskTimerDuration(taskId) {
  const task = await taskRepository.getById(taskId);
  if (!task) throw new Error("Tarea no encontrada");

  // Calcular duración en segundos
  const [horaInicio, minutoInicio] = task.horarioInicial.split(":").map(Number);
  const [horaFin, minutoFin] = task.horarioFinal.split(":").map(Number);

  const minutosInicio = horaInicio * 60 + minutoInicio;
  const minutosFin = horaFin * 60 + minutoFin;
  const duracionMinutos = minutosFin - minutosInicio;

  if (duracionMinutos <= 0) {
    throw new Error("El horario final debe ser posterior al horario inicial");
  }

  return {
    taskId: task.id,
    titulo: task.titulo,
    horarioInicial: task.horarioInicial,
    horarioFinal: task.horarioFinal,
    duracionSegundos: duracionMinutos * 60,
    duracionMinutos: duracionMinutos,
    duracionHoras: (duracionMinutos / 60).toFixed(2),
  };
}

async function getTodayTasks(uid) {
  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  return await taskRepository.getByDate(uid, todayDate);
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

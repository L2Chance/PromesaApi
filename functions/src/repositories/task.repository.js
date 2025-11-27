const admin = require("firebase-admin");

const COLLECTION = "tareas";
const db = admin.firestore();

async function create(uid, data) {
  const taskData = {
    uid,
    titulo: data.titulo,
    descripcion: data.descripcion || null,
    fecha: data.fecha, // YYYY-MM-DD
    completada: false,
    creadoEn: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection(COLLECTION).add(taskData);
  return {id: docRef.id, ...taskData};
}

async function getByDate(uid, date) {
  const snapshot = await db.collection(COLLECTION)
      .where("uid", "==", uid)
      .where("fecha", "==", date)
      .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

async function getAllByUser(uid) {
  const snapshot = await db.collection(COLLECTION)
      .where("uid", "==", uid)
      .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

async function getById(taskId) {
  const doc = await db.collection(COLLECTION).doc(taskId).get();
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()};
}

async function update(taskId, data) {
  await db.collection(COLLECTION).doc(taskId).update(data);
  return getById(taskId);
}

async function deleteTask(taskId) {
  await db.collection(COLLECTION).doc(taskId).delete();
  return true;
}

async function countPending(uid, date) {
  const snapshot = await db.collection(COLLECTION)
      .where("uid", "==", uid)
      .where("fecha", "==", date)
      .where("completada", "==", false)
      .get();

  return snapshot.size;
}

async function countTotal(uid, date) {
  const snapshot = await db.collection(COLLECTION)
      .where("uid", "==", uid)
      .where("fecha", "==", date)
      .get();

  return snapshot.size;
}

module.exports = {
  create,
  getByDate,
  getAllByUser,
  getById,
  update,
  delete: deleteTask,
  countPending,
  countTotal,
};

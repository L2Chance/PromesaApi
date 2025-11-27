const admin = require("firebase-admin");
const estado = require("../enums/estadoEnum");

const COLLECTION = "perfiles";
const db = admin.firestore();

async function create(uid, data) {
  const profileData = {
    telefono: data.telefono || null,
    estado: data.estado || estado.Simple,
    diasRacha: data.diasRacha || [],
    fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
    nombreCompleto: data.nombreCompleto || null,
    imagenPerfil: data.imagenPerfil || null,
  };

  await db.collection(COLLECTION).doc(uid).set(profileData);
  return {uid, ...profileData};
}

async function getById(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return {uid: doc.id, ...doc.data()};
}

async function update(uid, data) {
  await db.collection(COLLECTION).doc(uid).update(data);
  return getById(uid);
}

async function deleteProfile(uid) {
  await db.collection(COLLECTION).doc(uid).delete();
  return true;
}

async function addDiaRacha(uid, fecha) {
  await db.collection(COLLECTION).doc(uid).update({
    diasRacha: admin.firestore.FieldValue.arrayUnion(fecha),
  });
  return getById(uid);
}

async function removeDiaRacha(uid, fecha) {
  await db.collection(COLLECTION).doc(uid).update({
    diasRacha: admin.firestore.FieldValue.arrayRemove(fecha),
  });
  return getById(uid);
}

module.exports = {
  create,
  getById,
  update,
  delete: deleteProfile,
  addDiaRacha,
  removeDiaRacha,
};

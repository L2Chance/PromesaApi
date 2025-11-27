const profileRepository = require("../repositories/profile.repository");
const admin = require("firebase-admin");

async function createProfile(uid, data) {
  return await profileRepository.create(uid, data);
}

async function getProfile(uid) {
  const profile = await profileRepository.getById(uid);
  if (!profile) throw new Error("Perfil no encontrado");
  return profile;
}

async function updateProfile(uid, data) {
  return await profileRepository.update(uid, data);
}

async function deleteProfile(uid) {
  // Si tiene imagen, borrarla de Storage
  const profile = await profileRepository.getById(uid);
  if (profile && profile.imagenPerfil) {
    await deleteProfileImage(profile.imagenPerfil);
  }
  return await profileRepository.delete(uid);
}

async function uploadImage(uid, fileBuffer, mimeType) {
  const bucket = admin.storage().bucket();
  const fileName = `perfiles/${uid}/profile-${Date.now()}.jpg`;
  const file = bucket.file(fileName);

  await file.save(fileBuffer, {
    metadata: {contentType: mimeType},
  });

  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  // Actualizar perfil con la nueva URL
  await profileRepository.update(uid, {imagenPerfil: publicUrl});

  return publicUrl;
}

async function deleteProfileImage(imageUrl) {
  try {
    const bucket = admin.storage().bucket();
    // Extraer nombre del archivo de la URL
    const fileName = imageUrl.split(`${bucket.name}/`)[1];
    if (fileName) {
      await bucket.file(fileName).delete();
    }
  } catch (error) {
    console.error("Error borrando imagen:", error);
  }
}

async function manageRacha(uid, fecha, action) {
  if (action === "add") {
    return await profileRepository.addDiaRacha(uid, fecha);
  } else if (action === "remove") {
    return await profileRepository.removeDiaRacha(uid, fecha);
  }
  throw new Error("Acción inválida");
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadImage,
  deleteProfileImage,
  manageRacha,
};

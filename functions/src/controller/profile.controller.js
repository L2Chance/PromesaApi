const profileService = require("../services/profile.service");

async function getProfile(req, res) {
  try {
    const {uid} = req.query;
    if (!uid) return res.status(400).json({error: "UID requerido"});

    const profile = await profileService.getProfile(uid);
    res.status(200).json({success: true, data: profile});
  } catch (error) {
    res.status(error.message === "Perfil no encontrado" ? 404 : 500)
        .json({success: false, error: error.message});
  }
}

async function updateProfile(req, res) {
  try {
    const {uid, ...data} = req.body;
    if (!uid) return res.status(400).json({error: "UID requerido"});

    const profile = await profileService.updateProfile(uid, data);
    res.status(200).json({success: true, data: profile});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function uploadImage(req, res) {
  try {
    const {uid, imageBase64, mimeType} = req.body;
    if (!uid || !imageBase64) return res.status(400).json({error: "Datos incompletos"});

    const buffer = Buffer.from(imageBase64, "base64");
    const url = await profileService.uploadImage(uid, buffer, mimeType || "image/jpeg");

    res.status(200).json({success: true, data: {imageUrl: url}});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

async function manageRacha(req, res) {
  try {
    const {uid, fecha, action} = req.body; // action: 'add' or 'remove'
    if (!uid || !fecha || !action) return res.status(400).json({error: "Datos incompletos"});

    const profile = await profileService.manageRacha(uid, fecha, action);
    res.status(200).json({success: true, data: profile});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadImage,
  manageRacha,
};

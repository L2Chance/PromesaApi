const {onRequest} = require("firebase-functions/v2/https");
const profileController = require("../controller/profile.controller");

exports.getProfile = onRequest({cors: true}, profileController.getProfile);
exports.updateProfile = onRequest({cors: true}, profileController.updateProfile);
exports.uploadProfileImage = onRequest({cors: true, maxInstances: 5}, profileController.uploadImage);
exports.manageRacha = onRequest({cors: true}, profileController.manageRacha);

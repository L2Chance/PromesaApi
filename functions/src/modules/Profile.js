const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const profileController = require("../controller/profile.controller");
const authenticateToken = require("../middleware/auth.middleware");
const validateFields = require("../middleware/validation.middleware");

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(authenticateToken);

// Routes
app.get("/", validateFields(["uid"]), profileController.getProfile);
app.put("/", validateFields(["uid"]), profileController.updateProfile);
app.post(
  "/image",
  validateFields(["uid", "imageBase64"]),
  profileController.uploadImage
);
app.post(
  "/racha",
  validateFields(["uid", "fecha", "action"]),
  profileController.manageRacha
);

// Export the Express app as a single Cloud Function
exports.profile = onRequest({ cors: true }, app);

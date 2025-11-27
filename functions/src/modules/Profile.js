const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const profileController = require("../controller/profile.controller");

const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());

// Routes
app.get("/", profileController.getProfile);
app.put("/", profileController.updateProfile);
app.post("/image", profileController.uploadImage);
app.post("/racha", profileController.manageRacha);

// Export the Express app as a single Cloud Function
exports.profile = onRequest({cors: true}, app);

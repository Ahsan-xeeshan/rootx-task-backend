const express = require("express");
const authMiddleware = require("../../app/middlewares/authMiddleware");
const authController = require("../../app/controllers/authController");

const router = express.Router();

//Auth Routes

router.post("/registration", authController.registerUser);
router.post("/login", authController.signInUser);
router.post("/logout", authMiddleware, authController.logoutUser);

module.exports = router;

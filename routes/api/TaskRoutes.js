const express = require("express");
const authMiddleware = require("../../app/middlewares/authMiddleware");
const taskController = require("../../app/controllers/taskController");

const router = express.Router();

router.post("/create", authMiddleware, taskController.createTask);
router.get("/tasklist/:userId", authMiddleware, taskController.getTasks);
router.put("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);
router.patch("/:id", authMiddleware, taskController.toggleTaskCompletion);

module.exports = router;

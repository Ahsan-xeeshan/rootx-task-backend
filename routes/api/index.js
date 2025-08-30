const express = require("express");
const router = express.Router();
const authRouter = require("./authRoutes");
const taskRouter = require("./TaskRoutes")

router.use("/authentication", authRouter);
router.use("/tasks", taskRouter)

module.exports = router;

const Tasks = require("../models/Tasks");
const Users = require("../models/Users");

const getTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await Tasks.find({ createdBy: userId });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body;

    const task = await Tasks.create({
      title,
      description,
      createdBy: userId,
      dueDate,
      completed: false,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task by ID
    const task = await Tasks.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Toggle the completed field
    task.completed = !task.completed;

    // Save the updated task
    const updatedTask = await task.save();

    res.json({
      message: `Task marked as ${task.completed ? "completed" : "incomplete"}`,
      updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};

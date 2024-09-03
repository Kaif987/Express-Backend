const Todo = require("../models/Todo");
const asyncHandler = require("../middleware/async");
const { createTodoSchema, updateTodoSchema } = require("../zod/schema");

// @desc    Get all todos
// @route   GET /api/v1/todo
// @access  Private

exports.getTodos = asyncHandler(async (req, res, next) => {
  console.log(`get todos`.red);

  const todos = await Todo.find({});

  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
});

// @desc    Get a single todo
// @route   GET /api/v1/todo/:id
// @access  Private

exports.getTodo = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const todo = await Todo.find({
    _id: id,
  });

  if (!todo) {
    res.status(404).json({ success: false, message: "Todo not found" });
  }

  res.status(200).json({ success: true, data: todo });
});

// @desc    Update a todo item
// @route   PUT /api/v1/todo/:id
// @access  Private

exports.updateTodo = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const { success } = updateTodoSchema.safeParse({
    title,
    description,
  });

  if (!success) {
    res.status(400).json({ success: false, message: "Invalid input" });
  }

  const todos = await Todo.findAndUpdate({
    userId: req.user._id,
  });
  res.status(200).json({ success: true, data: todos });
});

// @desc    Delete a todo Item
// @route   DEL /api/v1/todo/:id
// @access  Private

exports.deleteTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404).json({ success: false, message: "Todo not found" });
  }

  await todo.remove();
  res.status(200).json({ success: true, message: "Todo Deleted" });
});

// @desc    Create a todo item
// @route   POST /api/v1/todo
// @access  Private

exports.createTodo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { success } = createTodoSchema.safeParse({
    title,
    description,
  });

  if (!success) {
    res.status(400).json({ success: false, message: "Invalid input" });
  }

  const todo = await Todo.create({
    title,
    description,
    userId: req.user._id,
  });

  res.status(200).json({ success: true, data: todo });
});

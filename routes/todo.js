const router = require("express").Router();
const { protect } = require("../middleware/protect");

const {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo");

router.get("/", protect, getTodos);
router.get("/:id", protect, getTodo);
router.post("/createTodo", protect, createTodo);
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

module.exports = router;

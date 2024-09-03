const schema = require("zod");

exports.loginSchema = schema.object({
  email: schema.string().email(),
  password: schema.string().min(6),
});

exports.registerSchema = schema.object({
  name: schema.string(),
  email: schema.string().email(),
  password: schema.string().min(6),
});

exports.createTodoSchema = schema.object({
  title: schema.string(),
  description: schema.string().optional(),
});

exports.updateTodoSchema = schema.object({
  title: schema.string().optional(),
  description: schema.string().optional(),
});

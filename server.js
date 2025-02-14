const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const coookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const connectDb = require("./config/db");
const xss = require("xss-clean");
const app = express();

app.use(cors());
app.options("*", cors());

// load env vars
dotenv.config({
  path: "./config/config.env",
});

//connect to database
connectDb();
// Route Files
const auth = require("./routes/user");
const todo = require("./routes/todo");

// Body Parser
app.use(express.json());
app.use(coookieParser());

//dev loggin middleware
app.use(morgan("dev"));

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

app.get("/_health", (req, res) => {
  res.status(200).send("ok");
});

// Mount Routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/todo", todo);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold
  );
});

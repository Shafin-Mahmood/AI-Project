const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true
}));

const authRouter = require("./routes/auth.routes.js");
app.use("/api/auth", authRouter);

module.exports = app;
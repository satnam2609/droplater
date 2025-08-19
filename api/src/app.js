const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const fs = require("node:fs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const uri = process.env.MONGO_URI || "mongodb://mongo:27017/pinsaar";

if (!uri) {
  console.log("Please provide the URI as the environment variable");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

app.use(limiter);

app.use("/health", (_req, res) => {
  return res.status(200).json({ message: "OK" });
});

fs.readdirSync("./src/routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

module.exports = app;

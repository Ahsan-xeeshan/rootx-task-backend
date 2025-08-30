require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./app/config/db");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());

//Connect Database
connectDB();

app.use(routes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

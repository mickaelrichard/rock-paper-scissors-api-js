const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notFoundMiddleware = require("./middleware/not-found");
const dotenv = require("dotenv");
const cors = require("cors");

//security mdlw => cannot import packages using import :/
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

//init
dotenv.config();
const app = express();

//db
const connectDB = require("./db/connect");

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

//not found
app.use(notFoundMiddleware);

//start server
const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

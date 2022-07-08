require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

// routers
// const authRouter = require("./routes/auth");
// const orgRouter = require("./routes/org");

const { authRouter, orgRouter } = require("./routes");

const {
  authenticateUser,
  routeNotFoundHandler,
  errorHandler,
} = require("./middlewares");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({ windowMs: 60 * 1000, max: 60 }));

// routes
app.get("/api/v1", (req, res) => {
  res.send("You are all good.");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/org", orgRouter);
app.use(routeNotFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("📗 Connected to MongoDB Atlas.");
    app.listen(port, console.log(`🚀 Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

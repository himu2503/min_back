const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

/*
--------------------------------
Middlewares
--------------------------------
*/

app.use(helmet());

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    success:false,
    message:"Too many requests"
  }

});

app.use(limiter);

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/*
--------------------------------
Test Route
--------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Grievance Management API Running"
  });
});

/*
--------------------------------
Routes
--------------------------------
*/

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

require("./jobs/escalationJob");

/*
--------------------------------
404 Handler
--------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

/*
--------------------------------
Server Start
--------------------------------
*/

const PORT = process.env.PORT || https://min-back.onrender.com;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});

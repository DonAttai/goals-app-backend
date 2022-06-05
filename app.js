const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("The backend of attai-goals-app is running! ");
});

app.use("/api/goals", require("./routes/goal.route"));
app.use("/api/users", require("./routes/user.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

//connect DB
const PORT = process.env.PORT || 8000;
const connectDB = require("./config/db");
connectDB()
  .then(() => {
    console.log("DB Connected...");
    app.listen(PORT, () => console.log(`server started on port:${PORT}`));
  })
  .catch((err) => console.log(err));

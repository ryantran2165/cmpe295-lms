// import dependencies
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// import routes here
const userRoutes = require('./src/routes/user.route');
app.use("/api/v1/users", userRoutes);

// Backend runs on Port 3001
const port = process.env.PORT || 3001;

// Connect to mongoose then start server
mongoose
.connect("mongodb+srv://parmeet54:295mastersGrading@cluster1.2cwsgoy.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
  app.listen(port, () => {
      console.log("Backend is running at port:", port);
    });
  })
.catch(err => {
  console.error("Failed connection to MongoDB: ", err);
})

module.exports = app;
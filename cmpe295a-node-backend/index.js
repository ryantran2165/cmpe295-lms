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

// Backend runs on Port 3000
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Backend is running at port:", port);
  });
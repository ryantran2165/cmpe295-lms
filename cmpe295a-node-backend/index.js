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
const uploadRoute = require('./src/routes/upload.route')
const assgQuizRoute = require('./src/routes/assgQuiz.route');
const courseRoute = require('./src/routes/course.route');

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/assgs", assgQuizRoute);
app.use("/api/v1/courses", courseRoute);


// Serving frontend
app.use(express.static(path.join('/home/ec2-user/cmpe295a-project/cmpe295a-react-2/build/')));


app.get('/*', (req, res) => {
  res.sendFile(path.join('/home/ec2-user/cmpe295a-project/cmpe295a-react-2/build/','index.html'));
});


// Backend runs on Port 3001
const port = process.env.PORT || 3001;

// Connect to mongoose then start server
mongoose
.connect("mongodb+srv://parmeet54:295mastersGrading@cluster1.2cwsgoy.mongodb.net/lmsDB?retryWrites=true&w=majority")
.then(() => {
  app.listen(port, () => {
      console.log("Backend is running at port:", port);
    });
  })
.catch(err => {
  console.error("Failed connection to MongoDB: ", err);
})

module.exports = app;
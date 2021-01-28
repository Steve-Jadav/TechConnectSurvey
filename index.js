const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const port = 3000;

var http = require("http").createServer(app);
var surveyCompletedRouter = require("./routes/surveyCompleted.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", function(req, res) {
});

app.use("/surveyCompleted", surveyCompletedRouter);

app.listen(port, () => {
  console.log(`Survey app running at http://localhost:${port}`);
});

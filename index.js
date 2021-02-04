const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = 3000;

var http = require("http").createServer(app);

// Routes
const surveyCompletedRouter = require("./routes/surveyCompleted.js");
//const neo4jDatabaseRouter = require("./routes/databaseConnection.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", function(req, res) {
});

app.use("/surveyCompleted", surveyCompletedRouter);

app.listen(PORT, () => {
  console.log(`Survey app running at http://localhost:${PORT}`);
});

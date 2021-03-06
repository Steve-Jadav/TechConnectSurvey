const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
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
app.post("/survey", function(req, res) {
  fs.readFile('public/survey.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.send();
    });
});

app.get("/result", function(req, res) {

  if (req.headers.referer == "http://localhost:3000/survey") {
  fs.readFile('public/thankyou.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.send();
    });
  }
  else {
    res.sendStatus(404);
  }

});

/*
app.get("/ecosystem", function(req, res) {
  fs.readFile('public/ecosystem.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.send();
  });
});
*/

app.use("/surveyCompleted", surveyCompletedRouter);

app.listen(PORT, () => {
  console.log(`Survey app running at http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const getUuid = require("uuid-by-string");
const databaseOperations = require("./databaseConnection.js");
const surveyEmailResponseFile = "public/email.html";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stevejadav1998@gmail.com",
    pass: "***"
  }
});

let htmlEmailMessage = "<html><body style='background: black;'><p>Hello there, </p> </br>" +
"You're invited by xyz to fill out this survey. Here's the <a href='http://localhost:3000/'>link</a> to the survey.</body></html>";

router.post("/", function(req, res, next) {

  let likertScales = {
    "name": getUuid(req.body.firstName + " " + req.body.lastName),
    "organizationRole": req.body.organizationRole,
    "techBridge": req.body.techBridge,
    "likertScales": req.body.likertScales,
  };

  delete req.body.likertScales;

  // Store the responses in a temp json file before loading them into neo4j (safe practice incase the database throws errors and you risk loosing the data)
  fs.readFile("contacts.json", function (err, data) {
    if (data == null) {
      var json = [req.body];
    }
    else {
      json = JSON.parse(data);
      json.push(req.body);
    }
    fs.writeFile("contacts.json", JSON.stringify(json), function(err){
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  });


  // Store perception scores
  fs.readFile("perceptionScores.json", function (err, data) {
    if (data == null) {
      json = [likertScales];
    }
    else {
      json = JSON.parse(data);
      json.push(likertScales);
      json = shuffleArray(json);
    }
    fs.writeFile("perceptionScores.json", JSON.stringify(json), function(err){
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  });


  res.send();

  /* Roster insert
  let parentNode = req.body.email;
  let childNode = req.body.email2;
  let relationship = req.body.relationship;

  databaseOperations.rosterInsert(parentNode, childNode, relationship)
                    .then(result => {
                      if (result === true) console.log("Connection created successfully!");
                      else console.log("An error occured while inserting records to Neo4j.");
                    })
                    .catch(error => {
                      console.log(error);
                    }); */

  /*
  let rootNode = req.body.email;
  let childNodes = new Array(req.body.email2, req.body.email3);

  databaseOperations.insertRecords("Researcher", "Researcher", rootNode, childNodes)
                    .then(result => {
                      if (result === true)
                        console.log("Record inserted successfully.");
                      else
                        console.log("An error occured while inserting records to Neo4j.");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                    */

  /* Sending an email =>
  let htmlData = fs.readFileSync(surveyEmailResponseFile, "utf-8");

  var mailOptions = {
    from: "stevejadav1998@gmail.com",
    to: req.body.email,
    subject: "You're Invited for the TechConnect Survey!",
    html: htmlData
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Survey distributed to the given Email-ID.");
    }
  });
  */

});


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = router;

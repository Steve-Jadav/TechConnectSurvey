const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const getUuid = require("uuid-by-string");
const databaseOperations = require("./databaseConnection.js");
const surveyEmailResponseFile = "public/email.html";
const randomString = require("randomstring");

/*
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stevejadav1998@gmail.com",
    pass: "***"
  }
}); 

let htmlEmailMessage = "<html><body style='background: black;'><p>Hello there, </p> </br>" +
"You're invited by xyz to fill out this survey. Here's the <a href='http://localhost:3000/'>link</a> to the survey.</body></html>";
*/

router.post("/", function(req, res, next) {

  req.body["nodeId"] = getUuid(req.body.firstName + req.body.lastName + randomString.generate(2));
  let likertScales = {
    "organizationRole": req.body.organizationRole,
    "likertScales": req.body.likertScales,
  };
  let feedback = { "feedback": req.body.feedback };

  // De-associate likert scales from section-1 and section-2
  delete req.body.likertScales;

  // De-associate feedback from the survey to keep it anonymous
  delete req.body.feedback;

  // Store the responses in a temp json file before loading them into neo4j (safe practice incase the database throws errors and you risk loosing the data)
  fs.readFile("data/contacts.json", function (err, data) {
    if (data == null) {
      var json = [req.body];
    }
    else {
      json = JSON.parse(data);
      json.push(req.body);
    }
    fs.writeFile("data/contacts.json", JSON.stringify(json), function(err){
      if (err) throw err;
    });
  });

  // Store the perception scores in a separate file
  fs.readFile("data/perceptionScores.json", function (err, data) {
    if (data == null) {
      json = [likertScales];
    }
    else {
      json = JSON.parse(data);
      json.push(likertScales);
      json = shuffleArray(json);  // Shuffle the array so that it cannot be compared side-by-side with the contacts.json file.
    }
    fs.writeFile("data/perceptionScores.json", JSON.stringify(json), function(err){
      if (err) throw err;
    });
  });

  // Store the feedback in a separate file
  fs.readFile("data/feedback.json", function (err, data) {
    if (data == null) {
      json = [feedback];
    }
    else {
      json = JSON.parse(data);
      json.push(feedback);
      json = shuffleArray(json);  // Shuffle the array so that it cannot be compared side-by-side with the contacts.json file.
    }
    fs.writeFile("data/feedback.json", JSON.stringify(json), function(err){
      if (err) throw err;
    });
  });

  res.send();


  /* Roster insert 

  // Collect the child nodes (the people mentioned as contacts)
  let childNodes = req.body.section2;
  childNodes["supervisors"] = req.body.supervisors;
  delete req.body.section2;

  // Collect the parent Node (the person who took the survey)
  let parentNode = req.body;

  databaseOperations.rosterInsert(parentNode, childNodes)
                    .then(result => {
                      if (result === true) console.log("Connection created successfully!");
                      else console.log("An error occured while inserting records to Neo4j.");
                    })
                    .catch(error => {
                      console.log(error);
                    }); 

  */
  
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

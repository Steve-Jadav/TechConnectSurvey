const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
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

  console.log(req.body);
  let rootNode = req.body.email;
  let childNodes = new Array(req.body.email2, req.body.email3);

  databaseOperations.insertRecords("Researcher", "Ron", rootNode, childNodes)
                    .then(result => {
                      if (result === true)
                        console.log("Record inserted successfully.");
                      else
                        console.log("An error occured while inserting records to Neo4j.");
                    })
                    .catch(error => {
                      console.log(error);
                    });

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

module.exports = router;

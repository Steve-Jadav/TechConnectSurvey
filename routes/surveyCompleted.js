const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stevejadav1998@gmail.com",
    pass: ""
  }
});

router.post("/", function(req, res, next) {
  console.log(req.body);

  var mailOptions = {
    from: "stevejadav1998@gmail.com",
    to: req.body.email,
    subject: "TechConnect Survey",
    html: "<h2>That was easy!</h2>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Survey distributed to the given email id. " + info.response);
    }
  });

});

module.exports = router;

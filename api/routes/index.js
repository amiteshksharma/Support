const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require('dotenv').config()


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/email', (req, res, next) => {
  const email = req.body.email;
  (async () => {
    console.log(email);
    //Create the information for the client
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID, // ClientID
      process.env.CLIENT_SECRET, // Client Secret
      "https://developers.google.com/oauthplayground" // Redirect URL
    );
  
    //Set the refresh token for the account
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });
  
    //Give access to using the email, sending it from
    //'bringingchange12@gmail.com' 
    const accessToken = oauth2Client.getAccessToken()

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      secure: true,
      auth: {
          type: 'OAuth2',
          user: 'bringingchange12@gmail.com',
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
      }
  });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'We demand change <bringingchange12@gmail.com>', // sender address
      to: "spainrulzs@gmail.com", // list of receivers
      subject: `We Demand Change from ${email}`, // Subject line
      text: "Hello world?", // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  })();
})

module.exports = router;

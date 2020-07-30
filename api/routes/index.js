var express = require('express');
const nodemailer = require("nodemailer");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/email', (req, res, next) => {
//   (async () => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       auth: {
//         user: 'spainrulzs@gmail.com',
//         pass: 'ktechwhiz'
//       }
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: 'spainrulzs@gmail.com', // sender address
//       to: "spainrulzs@gmail.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   })();
// })

module.exports = router;

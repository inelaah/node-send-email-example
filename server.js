var express = require("express"),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

var app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // will be replaced with real "hello" email
          user: 'hello@gmail.com',
          pass: 'password'
      }
  });
  let mailOptions = {
      // will be replaced with real recipient email
      to: 'hr@gmail.com',
      subject: req.body.subject,
      html: '<div><b>Ime:</b>&nbsp;' +  req.body.name +
        '</div><div><b>Email:</b>&nbsp;' +  req.body.email +
        '</div><div><b>Telefon:</b>&nbsp;' +  req.body.mobile +
        '</div><br><div><b>Poruka:</b><br>' +  req.body.message
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.writeHead(301, { Location: 'index.html' });
  res.end();
});

var server = app.listen(8081, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});

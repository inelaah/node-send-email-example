let express = require("express"),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  handlebars = require('handlebars');

let app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var readHTMLFile = function(path, replacements, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            var template = handlebars.compile(html);
            var htmlToSend = template(replacements);
            callback(null, htmlToSend);
        }
    });
};

app.post('/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: 'hello@gmail.com',
          pass: 'test'
      }
  });

  var replacements = {
       username: "John Doe"
  };

  let mailOptions = {
      // should be replaced with real recipient's account
      to: 'info@gmail.com',
      subject: req.body.subject,
  };

  // Get the HTML before sending the email
  readHTMLFile(__dirname + '/templates/email.html', replacements, function(err, html) {

       mailOptions.html = html;
       transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
               return console.log(error);
           }
           console.log('Message %s sent: %s', info.messageId, info.response);
       });

  });

  res.writeHead(301, { Location: 'index.html' });
  res.end();
});

let server = app.listen(8081, function(){
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});

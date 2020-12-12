// requiring dependencies for app
const express = require('express');
const nodemailer = require('nodemailer');
const expressSanitizer = require('express-sanitizer');
const config = require('config');
const app = express.Router();

// setting up various configurations and middlewares
app.use(express.json());
app.use(expressSanitizer());
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    // setting up header for content security policy for allowing site to use javascript and css file from another site
    res.setHeader('Content-Security-Policy', "script-src 'unsafe-inline' https://blowdown-load.herokuapp.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://code.jquery.com; style-src 'unsafe-inline' https://cdn.jsdelivr.net http://localhost:3000 https://blowdown-load.herokuapp.com")
    res.render('contact');
})

app.post('/sendmail', (req, res) => {
    // sanitizing form data
    let sanitizedName = req.sanitize(req.body.name);
    let sanitizedMail = req.sanitize(req.body.mail);
    let sanitizedMessage = req.sanitize(req.body.message);

    let sanitizedData = {
        name: sanitizedName,
        mail: sanitizedMail,
        message: sanitizedMessage
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.get('name'),
          pass: config.get('password')
        }
      });

      let mailOptions = {
        from: sanitizedData.mail,
        to: 'meetkalani2002@gmail.com',
        subject: sanitizedData.name,
        html:`<h1>${sanitizedData.mail}</h1><br><p>${sanitizedData.message}</p>`,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
    res.redirect('/');
})

module.exports = app;
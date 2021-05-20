// requiring dependencies for app
const express = require('express');
const app = express();
const config = require('config');
const helmet = require('helmet');
const download_route = require('./routes/download');
const contact_route = require('./routes/contact');
const port = process.env.PORT || 3000;

// setting up various configurations and middlewares
app.use(helmet());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/download', download_route);
app.use('/contact', contact_route);

// for storing url from the main page's form
let url;

// checking if environment variables are not set
if (!config.get('name') || !config.get('password')) {
    console.error("FATAL ERROR: environment variables are not defined!");
    process.exit(1);
}

// root route handler
app.get('/', (req, res) => {
    // setting up header for content security policy for allowing site to use javascript and css file from another site
    res.setHeader('Content-Security-Policy', "script-src 'unsafe-inline' https://blowdown--load.herokuapp.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://code.jquery.com; style-src 'unsafe-inline' https://cdn.jsdelivr.net http://localhost:3000 https://blowdown--load.herokuapp.com")
    res.render('index');
})

// error route handler
app.get('/:first/:second/:third', (req, res) => {
    // setting up header for content security policy for allowing site to use javascript and css file from another site
    res.setHeader('Content-Security-Policy', "script-src 'unsafe-inline' https://blowdown-load.herokuapp.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://code.jquery.com; style-src 'unsafe-inline' https://cdn.jsdelivr.net http://localhost:3000 https://blowdown-load.herokuapp.com")
    res.render('error-handler');
})

app.listen(port, () => {
    console.log(`Server has started at port ${port}`);
})
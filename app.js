const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const homeRouter = require('./main/routes/home');
const Paragraph = require('./main/models/document');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/paragraphs");



app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

app.set('PORT', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (request, response, next) => {
    response.redirect('/home/index');
    next();
});

app.use('/home', homeRouter);

app.use((resquest, response, next) => {
    var error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, resquest, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
var http = require('http');
var path = require('path');
var express = require('express');

var app = express();

// app.set('port', 80);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.use(express.bodyParser());
// app.use(express.methodOverride());

// Error handling
app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }

    res.render('error', {title: 'Error', error: err});
});

// Routing
app.use(app.router);
app.use(express.static(path.join(__dirname, 'web')));
app.get('/', function(req, res) {
    res.send("Hello");
});

http.createServer(app).listen(80);

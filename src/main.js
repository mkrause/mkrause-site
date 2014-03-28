var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('q-io/fs');

var yaml = require('js-yaml');
var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

var root = path.join(__dirname, '..');

var app = express();

app.set('port', 8000);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../app/templates'));
app.set('view engine', 'ejs');
app.use(express.bodyParser());

// app.use(express.methodOverride());

// Error handling
app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }
    
    res.render('error', {title: 'Error', error: err});
});

express.static.mime.define({'text/css': ['less']});

// Routing

app.use(express.static(path.join(__dirname, '../web')));

app.use(app.router);

app.get('/api/posts', function(req, res) {
    fs.list(path.join(root, 'app/posts'))
        .spread(function() {
            var args = Array.prototype.slice.call(arguments, 0);
            return args.map(function(fileName) {
                return fs.read(path.join(root, 'app/posts', fileName));
            });
        })
        .spread(function() {
            var args = Array.prototype.slice.call(arguments, 0);
            return args.map(function(fileContents) {
                var frontMatterRegex = /---\n([\s\S]*)\n---\n/;
                var matches = fileContents.match(frontMatterRegex);
                
                var params = {};
                if (matches) {
                    var yamlText = matches[1];
                    params = yaml.load(yamlText);
                }
                
                params.body = marked(fileContents.replace(frontMatterRegex, ''));
                
                return params;
            })
        })
        .spread(function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var postList = [];
            
            console.log(args);
            
            args.forEach(function(post) {
                postList.push(post);
            });
            
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(postList));
        });
});

app.get('*', function(req, res) {
    res.render('home');
});

http.createServer(app).listen(app.get('port'));

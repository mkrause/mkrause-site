var http = require('http');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var q = require('q');
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
        // Read the contents of each file
        .invoke('map', function(fileName) {
            return fs.read(path.join(root, 'app/posts', fileName));
        })
        // Wait for all to be resolved
        .then(q.all)
        // Parse each file
        .invoke('map', function(fileContents) {
            var frontMatterRegex = /---\n([\s\S]*)\n---\n/;
            var matches = fileContents.match(frontMatterRegex);
            
            var post = {};
            if (matches) {
                var yamlText = matches[1];
                post = _.defaults(yaml.load(yamlText), {
                    title: '(No title)',
                    date: "0000-00-00",
                    published: false
                });
            }
            
            post.body = marked(fileContents.replace(frontMatterRegex, ''));
            
            return post;
        })
        // Remove any posts not marked as published
        .invoke('filter', function(post) { return post.published; })
        // Combine all posts
        .invoke('reduce', function(posts, elmt) {
            posts.push(elmt);
            return posts;
        }, [])
        // Render as JSON and render
        .then(JSON.stringify)
        .then(function(posts) {
            res.setHeader("Content-Type", "application/json");
            res.send(posts);
        })
        .fail(function(reason) {
            console.error(reason);
        })
        .done();
});

app.get('*', function(req, res) {
    res.render('home');
});

http.createServer(app).listen(app.get('port'));

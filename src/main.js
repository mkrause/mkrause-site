var http = require('http');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var q = require('q');
var fs = require('q-io/fs');

var yaml = require('js-yaml');
var marked = require('marked');

marked.setOptions({
    // sanitize: false
});

var config = require('../app/config/config.js');

var root = path.join(__dirname, '..');

var app = express();

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, '../app/templates'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride()); // Allow HTTP method override using a `_method` param

express.static.mime.define({
    'text/css': ['less']
});
app.use(express.static(path.join(__dirname, '../web')));

app.use(app.router);

// Routes

// Parse a post definition file
function parsePost(fileName, fileContents) {
    var properties = {};
    var propertiesRegex = /---\n([\s\S]*)\n---\n/;
    var propertiesMatches = fileContents.match(propertiesRegex);
    if (propertiesMatches) {
        var yamlText = propertiesMatches[1];
        properties = yaml.load(yamlText);
    }
    
    // Parse the file name for some extra properties
    // Format: "[date]_[id]_[slug].md"
    var fileNameProps = {};
    var fileNameRegex = /^(\d{4})(\d{2})(\d{2})_([^_]+)_(.+)\./;
    var fileNameMatches = fileName.match(fileNameRegex);
    
    fileNameProps.id = fileNameMatches[4];
    fileNameProps.date = fileNameMatches[1]
        + "-" + fileNameMatches[2]
        + "-" + fileNameMatches[3];
    fileNameProps.slug = fileNameMatches[5];
    
    var post = _.defaults(properties, fileNameProps, {
        id: null,
        title: null,
        slug: null,
        date: null,
        published: false
    });
    
    // Parse the body of the file using a Markdown parser
    var bodyMarkdown = fileContents.replace(propertiesRegex, '');
    post.body = marked(bodyMarkdown);
    
    return post;
}

app.get('/api/posts', function(req, res) {
    fs.list(config.postsDir)
        // For each file, read the contents and parse it to a JSON representation
        .invoke('map', function(fileName) {
            var filePath = path.join(config.postsDir, fileName);
            var parseFn = _.partial(parsePost, fileName); // Fill in the first argument
            
            // Read the file and parse it
            return fs.read(filePath).then(parseFn);
        })
        // Wait for everything to be resolved
        .then(q.all)
        // Remove any posts not marked as published
        .invoke('filter', _.matches({ published: true }))
        // Send response
        .then(res.send.bind(res))
        // Error handling
        .fail(function(reason) {
            console.error(reason);
            res.send("Server error, unable to load posts", 500);
        });
});

app.get(['/api/posts/:id', '/api/posts/:id/:slug'], function(req, res) {
    var id = req.route.params.id;
    
    fs.list(config.postsDir)
        // Filter out only those posts that match the given ID (should be one or zero)
        .invoke('filter', function(fileName) {
            var matches = fileName.match(/^\d+_([^_]+)_/);
            var postId = matches[1];
            return postId === id;
        })
        // Parse the file, if any
        .then(function(fileNamesWithId) {
            if (fileNamesWithId.length < 1) {
                throw 404;
            }
            
            // Should only be one matching file
            var fileName = fileNamesWithId[0];
            
            var filePath = path.join(config.postsDir, fileName);
            var parseFn = _.partial(parsePost, fileName); // Fill in the first argument
            return fs.read(filePath).then(parseFn);
        })
        // Send response
        .then(res.send.bind(res))
        // Error handling
        .fail(function(reason) {
            if (reason === 404) {
                res.send("Post not found", 404);
            } else {
                console.error(reason);
                res.send("Server error", 500);
            }
        });
});

// Fallback route
app.get('*', function(req, res) {
    res.render('default', {
        env: config.env
    });
});

http.createServer(app).listen(app.get('port'));

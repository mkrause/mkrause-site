var http = require('http');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var q = require('q');
var fs = require('q-io/fs');

var yaml = require('js-yaml');
var marked = require('marked');

marked.setOptions({
    sanitize: false,
});

var root = path.join(__dirname, '..');

var app = express();

app.set('port', 80);
app.set('view engine', 'ejs');
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
    
    var post = _.defaults(properties, {
        title: "(No title)",
        slug: null,
        date: null,
        published: false
    });
    
    // Fill in the date of the post using the file name as a fallback
    if (!post.date) {
        var dateMatches = fileName.match(/^(\d{4})(\d{2})(\d{2})/);
        if (dateMatches) {
            var date = dateMatches[1]
                + "-" + dateMatches[2]
                + "-" + dateMatches[3];
            post.date = date;
        }
    }
    
    // Use the name of the file as a fallback for the slug
    if (!post.slug) {
        var slugMatches = fileName.match(/^\d+_(.+)\./);
        if (slugMatches) {
            post.slug = slugMatches[1];
        }
    }
    
    // Parse the body of the file using a Markdown parser
    var bodyMarkdown = fileContents.replace(propertiesRegex, '');
    post.body = marked(bodyMarkdown);
    
    return post;
}

app.get('/api/posts', function(req, res) {
    var postsDir = path.join(root, 'app/posts');
    fs.list(postsDir)
        // For each file, read the contents and parse it to a JSON representation
        .invoke('map', function(fileName) {
            var filePath = path.join(postsDir, fileName);
            var parseFn = _.partial(parsePost, fileName); // Fill in the first argument
            
            // Read the file and parse it
            return fs.read(filePath).then(parseFn);
        })
        // Wait for everything to be resolved
        .then(q.all)
        // Remove any posts not marked as published
        .invoke('filter', _.property('published'))
        // Render as JSON and render
        .then(JSON.stringify)
        .then(function(posts) {
            res.setHeader("Content-Type", "application/json");
            res.send(posts);
        })
        // Error handling
        .fail(function(reason) {
            console.error(reason);
            res.send("Server error, unable to load posts", 500);
        })
        .done();
});

// Fallback route
app.get('*', function(req, res) {
    res.render('default');
});

http.createServer(app).listen(app.get('port'));

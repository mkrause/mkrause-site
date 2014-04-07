var http = require('http');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var yaml = require('js-yaml');
var marked = require('marked');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var passLib = Promise.promisifyAll(require('./pass'));

marked.setOptions({
    // sanitize: false
});

var config = require('../app/config/config.js');

var root = path.join(__dirname, '..');

var app = express();

// Server port. Can be overridden using the PORT environment variable
var defaultPort = config.env === 'production' ? 80 : 8000;
app.set('port', process.env.PORT || defaultPort);

app.set('views', path.join(__dirname, '../app/templates'));
app.set('view engine', 'ejs');

app.disable('x-powered-by'); // Disable `X-Powered-By` header
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
function parsePost(fileName, fileBuffer) {
    var fileContents = fileBuffer.toString();
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
        published: false,
        body: null
    });
    
    // Parse the body of the file using a Markdown parser
    var bodyMarkdown = fileContents.replace(propertiesRegex, '');
    post.body = marked(bodyMarkdown);
    
    return post;
}

app.post('/api/authenticate', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    
    var sendFailureResponse = function(reason) {
        res.send("Authentication failed", 401);
    };
    
    if (!config.accounts.hasOwnProperty(email)) {
        sendFailureResponse("Account does not exist");
        return;
    }
    
    var account = config.accounts[email];
    passLib.comparePasswordAsync(password, account.passHash)
        .then(function() {
            // The session data
            var sessData = {
                _token: token,
                email: account.email,
                name: account.name
            };
            
            var token = jwt.sign(sessData, config.secret, { expiresInMinutes: 24 * 60 });
            sessData['_token'] = token;
            
            res.json({ user: sessData });
        })
        .catch(sendFailureResponse);
});

app.get('/api/posts', function(req, res) {
    fs.readdirAsync(config.postsDir)
        // Filter out anything that doesn't look like a post
        .filter(function(fileName) {
            return /\.md$/.test(fileName);
        })
        // For each file, read the contents and parse it to a JSON representation
        .map(function(fileName) {
            var filePath = path.join(config.postsDir, fileName);
            var parseFn = _.partial(parsePost, fileName); // Fill in the first argument
            
            // Read the file and parse it
            return fs.readFileAsync(filePath).then(parseFn);
        })
        // Remove any posts not marked as published
        .filter(_.matches({ published: true }))
        // Sort in reverse chronological order
        .call('sort', function(post1, post2) {
            return Date.parse(post2.date) - Date.parse(post1.date);
        })
        // Send response
        .then(res.json.bind(res))
        // Error handling
        .catch(function(reason) {
            console.error(reason, reason.stack);
            res.send("Server error, unable to load posts", 500);
        });
});

app.get(['/api/posts/:id', '/api/posts/:id/:slug'], function(req, res) {
    var id = req.route.params.id;
    
    fs.readdirAsync(config.postsDir)
        // Filter out anything that doesn't look like a post
        .filter(function(fileName) {
            return /\.md$/.test(fileName);
        })
        // Filter out only those posts that match the given ID (should be one or zero)
        .filter(function(fileName) {
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
            return fs.readFileAsync(filePath).then(parseFn);
        })
        // Send response
        .then(res.json.bind(res))
        // Error handling
        .caught(function(reason) {
            if (reason === 404) {
                res.send("Post not found", 404);
            } else {
                console.error(reason, reason.stack);
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

http.createServer(app).listen(app.get('port'), function() {
    console.log("Running on port " + app.get('port'));
});

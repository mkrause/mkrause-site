
var _ = require('underscore');
var nodeUtil = require('util');
var http = require('http');
var path = require('path');
var express = require('express');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var Feed = require('feed');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var passLib = Promise.promisifyAll(require('./pass'));
var dateFormat = require('dateformat');

var PostsService = require('./services/posts.js');

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

// In development, set up a URL to point to the test suite
if (config.env === 'development') {
    app.use("/tests", express.static(path.join(__dirname, '../tests')));
}

express.static.mime.define({
    'text/css': ['less']
});
//TODO: this seems to crash node in some circumstances, see:
// http://stackoverflow.com/questions/13220565/unhandled-stream-error-in-pipe-from-node-js
app.use(express.static(path.join(__dirname, '../web')));

// Basic logger
app.use(function(req, res, next){
    var log = nodeUtil.format(
        "[%s] %s %s %s (%s)\n",
        (new Date()).toISOString(),
        req.connection.remoteAddress,
        req.method,
        req.url,
        req.headers['user-agent']
    );
    
    fs.appendFile(path.join(config.logDir, 'server.log'), log);
    
    next();
});

/*
// SEO
app.use(function(req, res, next) {
    if (req.query.hasOwnProperty('_escaped_fragment_')) {
        http.get("http://localhost:8999", function(response) {
            response.on('data', function(chunk) {
                res.send(chunk.toString());
            });
        });
    } else {
        next();
    }
});
*/

app.use(app.router);

//
// Routes
//

// Place for the client to send errors (for logging)
app.post('/api/client_error', function(req, res) {
    var log = nodeUtil.format(
        "[%s] Error: \"%s\" in %s on line %s (user agent: %s)\n",
        (new Date()).toISOString(),
        req.body.message,
        req.body.url,
        req.body.line,
        req.body.user_agent
    );
    fs.appendFile(path.join(config.logDir, 'client_errors.log'), log);
    
    res.send("");
});

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
    var postsSv = new PostsService();
    postsSv.getPostList()
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
    var postsSv = new PostsService();
    
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
            var parseFn = _.partial(postsSv.parsePost, fileName); // Fill in the first argument
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

app.get('/feed.xml', function(req, res) {
    var postsSv = new PostsService();
    
    var feed = new Feed({
        title: 'mkrause - Posts',
        link: 'http://mkrause.nl',
        author: {
            name: 'Maikel Krause',
            link: 'https://mkrause.nl'
        }
    });
    
    postsSv.getPostList()
        .then(function(postList) {
            postList.forEach(function(post) {
                feed.addItem({
                    title: post.title,
                    link: 'http://mkrause.nl/posts/' + post.id + '/' + post.slug,
                    description: post.body,
                    date: new Date(post.date)
                });
            });
            
            res.send(feed.render('atom-1.0'));
        })
        .catch(function(reason) {
            console.error(reason);
            res.send("Server error");
        });
});

// Fallback route
app.get('*', function(req, res) {
    res.render('default', {
        env: config.env
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log(nodeUtil.format(
        "\n--- Restart (port: %d) [%s] ---",
        app.get('port'),
        (new Date()).toISOString()
    ));
});

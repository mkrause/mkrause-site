// PhantomJS script to serve SEO-friendly snapshots
// 
// Run using:
// phantomjs --disk-cache=no src/seo_server.js 8999 http://localhost:8000
// 
// http://lawsonry.com/2014/05/diy-angularjs-seo-with-phantomjs-the-easy-way/
// https://github.com/steeve/angular-seo

var system = require('system');

if (system.args.length < 3) {
    console.log("Missing arguments.");
    phantom.exit();
}

var server = require('webserver').create();
var port = parseInt(system.args[1]);
var urlPrefix = system.args[2];

var parse_qs = function(s) {
    var queryString = {};
    var a = document.createElement("a");
    a.href = s;
    a.search.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
    return queryString;
};

var renderHtml = function(url, cb) {
    var page = require('webpage').create();
    page.settings.loadImages = false;
    page.settings.localToRemoteUrlAccessEnabled = true;
    
    // Event handler for when the page calls `window.callPhantom()`
    page.onCallback = function() {
        cb(page.content);
        page.close();
    };
    // page.onConsoleMessage = function(msg, lineNum, sourceId) {
    //     console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    // };
    page.onInitialized = function() {
       page.evaluate(function() {
            // Call the callback ourselves if it hasn't been called after a certain time
            setTimeout(function() {
                window.callPhantom();
            }, 3000);
        });
    };
    page.open(url);
};

server.listen(port, function (request, response) {
    var route = parse_qs(request.url)._escaped_fragment_;
    var url = urlPrefix
        + request.url.slice(1, request.url.indexOf('?'))
        + '#!' + decodeURIComponent(route);
    
    url = urlPrefix;
    
    renderHtml(url, function(html) {
        response.statusCode = 200;
        response.write(html);
        response.write("\n");
        response.close();
    });
});

console.log('Listening on ' + port + '...');
console.log('Press Ctrl+C to stop.');

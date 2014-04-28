
var Promise = require('bluebird');

var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

var server = new SeleniumServer(__dirname + "/server.jar", {
  port: 4444
});

server.start();

var webdriverjs = require('webdriverjs');
var client = webdriverjs.remote({ desiredCapabilities: {browserName: 'phantomjs'} });
client.init();

describe('stub', function() {
    it('should ...', function() {
        var title = null;
        var done = false;
        
        client
            .url('http://mkrause.io')
            .pause(1000)
            .getTitle(function(err, resultTitle) {
                title = resultTitle;
            })
            // .saveScreenshot('./screen.png')
            .call(function() {
                done = true;
            });
        
        waitsFor(function() { return done; }, "completion", 10000);
        
        runs(function() {
            expect(title).toBe("Posts - mkrause");
        });
    });
});

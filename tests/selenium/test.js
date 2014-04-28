
var assert = require("assert");
var webdriverjs = require('webdriverjs');

var client = webdriverjs.remote({ desiredCapabilities: {browserName: 'phantomjs'} });
client.init();

describe('stub', function() {
    this.timeout(10000);
    
    it('should do stuff', function(done) {
        client
            .url('http://mkrause.io')
            .pause(1000)
            .getTitle(function(err, title) {
                assert(title === 'Posts - mkrause');
            })
            // .saveScreenshot('./screen.png')
            .call(done);
    });
});

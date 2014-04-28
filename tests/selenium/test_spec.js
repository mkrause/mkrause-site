
// http://code.google.com/p/selenium/wiki/WebDriverJs#Using_the_Stand-alone_Selenium_Server

var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var util = require('./util.js');

var server = new SeleniumServer(__dirname + "/server.jar", {
  port: 4444
});

server.start();

var driver = new webdriver.Builder()
    .usingServer(server.address())
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

var By = webdriver.By;

// TODO:
// - use PhantomJS (or Karma?)

// http://webdriver.io
// https://www.browserstack.com/automate/node

// driver.getPageSource().then(console.log);
// driver.findElement(By.id('wrapper')).getText().then(console.log);
// driver.findElement(By.tagName('body')).getAttribute('innerHTML').then(console.log);

describe('stub', function() {
    it('should ...', function() {
        var title = null;
        var done = false;
        
        util.pageReady(driver, '/')
            .then(function() {
                return driver.getTitle()
            })
            .then(function(resultTitle) {
                title = resultTitle;
                done = true;
                driver.quit();
            });
        
        waitsFor(function() { return done; }, "completion", 10000);
        
        runs(function() {
            expect(title).toBe("Posts - mkrause");
        });
    });
});

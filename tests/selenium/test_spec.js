
// http://code.google.com/p/selenium/wiki/WebDriverJs#Using_the_Stand-alone_Selenium_Server

var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

console.log(__dirname + "/server.jar");

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


describe('stub', function() {
    it('should ...', function() {
        this.title = null;
        this.done = false;
        
        var that = this;
        driver.get('http://mkrause-site.local:8000').then(function() {
            setTimeout(function() {
                // driver.getPageSource().then(console.log);
                // driver.findElement(By.id('wrapper')).getText().then(console.log);
                // driver.findElement(By.tagName('body')).getAttribute('innerHTML').then(console.log);
                // driver.executeScript("return 2 + 2").then(console.log);
                driver.getTitle().then(function(title) {
                    that.title = title;
                    that.done = true;
                });
                driver.quit();
            }, 2000);
        });
        
        waitsFor(function() {
            return this.done;
        }, "completion", 10000);

        runs(function () {
            expect(this.title).toBe("Posts - mkrause");
        });
    });
});

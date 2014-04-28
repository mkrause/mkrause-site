
var Promise = require('bluebird');

var baseUrl = 'http://mkrause-site.local:8000';

module.exports.pageReady = function(driver, path) {
    return new Promise(function(resolve, reject) {
        var waitUntilReady = function() {
            driver.executeScript("return document.title !== 'mkrause'")
                .then(function(isReady) {
                    if (isReady) {
                        resolve();
                    } else {
                        setTimeout(waitUntilReady, 200);
                    }
                });
        };
        
        driver.get(baseUrl + path)
            .then(waitUntilReady, reject);
    });
};

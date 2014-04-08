
var params = require('./params.js');
var path = require('path');

module.exports = {
    env: params.env,
    logDir: params.logDir,
    postsDir: params.postsDir,
    secret: params.secret,
    accounts: params.accounts
};

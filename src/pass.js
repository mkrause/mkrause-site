
// http://stackoverflow.com/questions/14015677/node-js-encryption-of-passwords
var bcrypt = require('bcrypt');

exports.cryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return callback(err);
        }
        
        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
};

exports.comparePassword = function(password, passHash, callback) {
    bcrypt.compare(password, passHash, function(err, isPasswordMatch) {
        if (err) {
            return callback(err);
        }
        
        if (!isPasswordMatch) {
            return callback("Password doesn't match")
        }
        
        return callback(null, isPasswordMatch);
    });
};

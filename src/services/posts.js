
var _ = require('underscore');
var path = require('path');
var dateFormat = require('dateformat');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var yaml = require('js-yaml');
var marked = require('marked');

marked.setOptions({
    // sanitize: false
});

var config = require('../../app/config/config.js');

function PostsService() {
}

// Parse a post definition file
PostsService.prototype.parsePost = function(fileName, fileBuffer) {
    var fileContents = fileBuffer.toString();
    var properties = {};
    var propertiesRegex = /---\n([\s\S]*)\n---\n/;
    var propertiesMatches = fileContents.match(propertiesRegex);
    if (propertiesMatches) {
        var yamlText = propertiesMatches[1];
        properties = yaml.load(yamlText);
    }
    
    if (properties.date && properties.date.constructor == Date) {
        properties.date = dateFormat(properties.date, 'yyyy-mm-dd');
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
        tags: [],
        published: false,
        body: null,
    });
    
    // Parse the body of the file using a Markdown parser
    var bodyMarkdown = fileContents.replace(propertiesRegex, '');
    post.body = marked(bodyMarkdown);
    
    return post;
};

// Return a promise for a list of post objects
PostsService.prototype.getPostList = function() {
    return fs.readdirAsync(config.postsDir)
        // Filter out anything that doesn't look like a post
        .filter(function(fileName) {
            return /\.md$/.test(fileName);
        })
        // For each file, read the contents and parse it to a JSON representation
        .map(function(fileName) {
            var filePath = path.join(config.postsDir, fileName);
            var parseFn = _.partial(PostsService.prototype.parsePost, fileName); // Fill in the first argument
            
            // Read the file and parse it
            return fs.readFileAsync(filePath).then(parseFn);
        })
        // Remove any posts not marked as published
        .filter(_.matches({ published: true }))
        // Sort in reverse chronological order
        .call('sort', function(post1, post2) {
            return Date.parse(post2.date) - Date.parse(post1.date);
        });
};

module.exports = PostsService;

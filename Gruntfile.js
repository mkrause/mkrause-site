module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: ['Gruntfile.js', 'web/scripts/**/*.js']
        },
        
        mainJsPath: "web/scripts/main.js",
        mainJsBuildPath: "web/build/app.js",
        mainCssPath: "web/style/main.css",
        mainCssBuildPath: "web/build/app.css",
        requirejs: {
            js: {
                options: {
                    name: "main",
                    baseUrl: "web/scripts",
                    mainConfigFile: "web/scripts/require_config.js",
                    out: "<%= mainJsBuildPath %>",
                    // Don't optimize yet, we want to run ngmin first
                    optimize: "none"
                }
            },
            js_almond: {
                options: {
                    name: "../vendor/almond/almond",
                    baseUrl: "web/scripts",
                    include: "main",
                    mainConfigFile: "web/scripts/require_config.js",
                    out: "<%= mainJsBuildPath %>",
                    // Don't optimize yet, we want to run ngmin first
                    optimize: "none",
                    wrap: true,
                    insertRequire: ['main']
                }
            },
            css: {
                options: {
                    cssIn: "<%= mainCssPath %>",
                    out: "<%= mainCssBuildPath %>"
                }
            }
        },
        ngmin: {
            buildMain: {
                src: ["<%= mainJsBuildPath %>"],
                dest: "<%= mainJsBuildPath %>"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildMain: {
                src: "<%= mainJsBuildPath %>",
                dest: "<%= mainJsBuildPath %>"
            }
        },
        less: {
            development: {
                options: {
                    // paths: ["assets/css"]
                },
                files: {
                    "web/build/main.css": "web/style/app.less"
                }
            },
            production: {
                options: {
                    strictImports: true,
                    paths: [
                        "web/style",
                        "web/vendor/bootstrap/dist/css",
                        "web/vendor/font-awesome/css"
                    ],
                    cleancss: true,
                    modifyVars: {
                        // imgPath: '"http://mycdn.com/path/to/images"',
                        // bgColor: 'red'
                    }
                },
                files: {
                    "web/build/app.css": "web/style/main.less"
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    
    // Tasks
    grunt.registerTask('build:js', ['requirejs:js_almond', 'ngmin', 'uglify']);
    grunt.registerTask('build:css', ['less:production']);
    grunt.registerTask('default', ['build:js', 'build:css']);
};

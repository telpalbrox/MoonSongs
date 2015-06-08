var shelljs = require('shelljs');
module.exports = function(grunt) {
    var watchFiles = {
        jsWebFiles: ['web/js/**/*.js'],
        jsServerFiles: ['app/**/*.js', 'config/**/*.js'],
        langFiles: ['web/lang/**/*.json'],
        cssFiles: ['web/css/**/*.css'],
        lessFiles: ['web/less/**/*.less'],
        htmlFiles: ['web/html/**/*.html'],
        mochaTests: ['tests/**/*.js']
    };

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            // Concat all js files
            js: {
                src: ['web/lib/jquery/dist/jquery.js',
                    'web/lib/gsap/src/uncompressed/TweenMax.js',
                    'web/lib/bootstrap/dist/js/bootstrap.js',
                    'web/lib/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
                    'web/lib/id3/dist/id3.js',
                    'web/lib/angular/angular.js',
                    'web/lib/angular-route/angular-route.js',
                    'web/lib/angular-messages/angular-messages.js',
                    'web/lib/angular-ui-router/release/angular-ui-router.js',
                    'web/lib/angular-translate/angular-translate.js',
                    'web/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'web/lib/angular-touch/angular-touch.js',
                    'web/lib/angular-loading-bar/src/loading-bar.js',
                    'web/lib/ng-file-upload/angular-file-upload-all.js',
                    'web/lib/ng-file-upload/angular-file-upload-shim.js',
                    'web/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                    'web/lib/ngFx/dist/ngFxBundle.js',
                    'web/js/**/*.module.js',
                    'web/js/**/*.js'
                ],
                dest: 'public/js/moonSongs.js'
            },
            // Concat all css files
            css: {
                src: ['web/lib/html5-boilerplate/css/normalize.css',
                    'web/lib/html5-boilerplate/css/main.css',
                    'web/lib/fontawesome/css/font-awesome.css',
                    'web/lib/bootstrap/dist/css/bootstrap.css',
                    'web/lib/angular-loading-bar/src/loading-bar.css',
                    'web/css/**/*.css'
                ],
                dest: 'public/css/style.css'
            }
        },
        // Minify css
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['public/css/style.css'],
                    ext: '.css'
                }]
            }
        },
        // Uglify js
        uglify: {
            options: {
                mangle: true,
                compress: {
                    drop_console: true
                }
            },
            js: {
                files: {
                    'public/js/moonSongs.js': ['public/js/moonSongs.js']
                }
            }
        },
        // Clean public/ directory
        clean: {
            js: ['public/js'],
            css: ['public/css', 'public/css/**/*.min.css'],
            html: ['public/index.html', 'public/modals', 'public/templates'],
            fonts: ['public/fonts'],
            img: ['public/img'],
            public: ['public/**'],
            uploads: ['uploads']
        },
        // Copy static html and resources to public/ directory
        sync: {
            fontsBootstrap: {
                files: [{
                    cwd: 'web/lib/bootstrap/dist/fonts',
                    src: [
                        '**'
                    ],
                    dest: 'public/fonts'
                }],
                verbose: true
            },
            fontsAwesome: {
                files: [{
                    cwd: 'web/lib/fontawesome/fonts',
                    src: [
                        '**'
                    ],
                    dest: 'public/fonts'
                }],
                verbose: true
            },
            html: {
                files: [{
                    cwd: 'web/html/',
                    src: [
                        '**'
                    ],
                    dest: 'public/'
                }]
            },
            lang: {
                files: [{
                    cwd: 'web/lang/',
                    src: [
                        '**'
                    ],
                    dest: 'public/lang'
                }]
            },
            img: {
                files: [{
                    cwd: 'web/img/',
                    src: [
                        '**'
                    ],
                    dest: 'public/img/'
                }]
            },
            bootstrapMap: {
                files: [{
                    cwd: 'web/lib/bootstrap/dist/css/',
                    src: ['bootstrap.css.map'],
                    dest: 'public/css'
                }]
            }
        },
        // Check js syntaxy
        jshint: {
            web: ['Gruntfile.js', 'web/js/**/*.js'],
            server: watchFiles.jsServerFiles
        },
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            // Watch any js/css change and re-concat it
            jsWeb: {
                files: watchFiles.jsWebFiles,
                tasks: ['jshint:web', 'concat:js'],
                options: {
                    livereload: true
                }
            },
            jsServer: {
                files: watchFiles.jsServerFiles,
                tasks: ['jshint:server']
            },
            less: {
                files: watchFiles.lessFiles,
                tasks: ['less', 'pleeease', 'concat:css']
            },
            // Watch any html change and re-sync it
            html: {
                files: watchFiles.htmlFiles,
                tasks: ['sync:html'],
                options: {
                    livereload: true
                }
            },
            lang: {
                files: watchFiles.langFiles,
                tasks: ['sync:lang']
            }
        },
        // launchs watch and ionic task at the same time
        concurrent: {
            dev: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    watch: watchFiles.jsServer
                }
            }
        },
        mochaTest: {
            src: watchFiles.mochaTests,
            options: {
                reporter: 'spec',
                require: 'server.js',
                timeout: '10000'
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        ngAnnotate: {
            webClient: {
                files: {

                }
            }
        },
        less: {
            moonsongs: {
                files: {
                    "web/css/app.css": "web/less/app.less"
                }
            }
        },
        pleeease: {
            custom: {
                options: {
                    autoprefixer: {'browsers': ['last 40 versions', 'ios 6']},
                    minifier: false
                },
                files: {
                    'web/css/app.css': 'web/css/app.css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-pleeease');

    // Installs bower dependences
    grunt.registerTask('bower', function() {
        var done = this.async();
        if (!shelljs.which('bower')) {
            grunt.log.error('Bower is not installed');
            return false;
        }
        shelljs.exec('bower install', function() {
            done();
        });
    });

    grunt.registerTask('folders', function() {
        shelljs.mkdir('uploads');
        shelljs.mkdir('music');
    });

    grunt.registerTask('moveMusicTmp', function () {
        shelljs.mv('music/', 'musicTmp/');
        shelljs.mkdir('music');
    });

    grunt.registerTask('moveMusic', function () {
        shelljs.mv('musicTmp/', 'music/');
    });

    // Install bower dependences and build project
    grunt.registerTask('install', ['clean', 'folders', 'bower', 'build']);
    // Build project and uglify
    grunt.registerTask('build', ['jshint', 'less', 'pleeease', 'concat', 'cssmin', 'sync', 'uglify']);
    // Build project without minify and uglify
    grunt.registerTask('build-dev', ['jshint', 'less', 'pleeease', 'concat', 'sync']);
    // Build project and clean dev files
    grunt.registerTask('release', ['install']);
    // Watch server and client files
    grunt.registerTask('dev', ['build-dev', 'concurrent']);
    // Starts server
    grunt.registerTask('start', ['build', 'nodemon']);
    // Tests
    grunt.registerTask('test', ['moveMusicTmp', 'env:test', 'mochaTest', 'clean:music', 'moveMusic']);

};

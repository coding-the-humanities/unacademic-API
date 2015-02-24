module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-6to5');

  var userConfig = require('./build.config.js');

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    clean: [
      '<%= build_dir %>'
    ],

    copy: {
      /* appjs: { */
      /*   src: [ '<%= app_files.js %>' ], */
      /*   dest: '<%= build_dir %>/', */
      /*   cwd: '.', */
      /*   expand: true */
      /* }, */
      fonts: {
        src: [ '<%= app_files.fonts %>' ],
        dest: '<%= build_dir %>/assets/fonts',
        cwd: '.',
        expand: true,
        flatten: true
      },
      css: {
        src: [ '<%= app_files.css %>' ],
        dest: '<%= build_dir %>/assets/css',
        cwd: '.',
        expand: true,
        flatten: true
      },
      images: {
        src: [ '<%= app_files.images %>' ],
        dest: '<%= build_dir %>/assets/img',
        cwd: 'src/assets/img',
        expand: true
      },
      vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    ngAnnotate: {
      files: {
        expand: true,
        src: ['<%= app_files.js %>'],
        dest: '<%= build_dir %>',
        cwd: '.'
      }
    },

    '6to5': {
      dist: {
        files: [{
          expand: true,
          ext: '.js',
          src: [ '<%= app_files.es6 %>' ],
          dest: '.'
        }]
      }
    },

    index: {
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/app/app.js',
          '<%= build_dir %>/src/app/models/models.js',
          '<%= build_dir %>/src/app/common/common.js',
          '<%= build_dir %>/src/app/models/course/course.js',
          '<%= build_dir %>/src/app/content/content.js',
          '<%= build_dir %>/src/app/sidebar/sidebar.js',
          '<%= build_dir %>/src/app/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= build_dir %>/bundle.js',
          '<%= build_dir %>/assets/**/*.css'
        ]
      }
    },
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= test_files.polyfills %>',
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= build_dir %>/src/app/app.js',
          '<%= build_dir %>/src/app/models/models.js',
          '<%= build_dir %>/src/app/common/common.js',
          '<%= build_dir %>/src/app/models/course/course.js',
          '<%= build_dir %>/src/app/content/content.js',
          '<%= build_dir %>/src/app/sidebar/sidebar.js',
          '<%= build_dir %>/src/app/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= build_dir %>/bundle.js',
          '<%= build_dir %>/assets/**/*.css',
          '<%= test_files.js %>'
        ]
      }
    },
    watch: {

      es6: {
        files: [
          '<%= app_files.es6 %>'
        ],
        tasks: ['6to5']
      },

      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['ngAnnotate', 'index']
      },

      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'index:build' ]
      },

      templates: {
        files: [ '<%= app_files.atpl %>' ],
        tasks: [ 'html2js' ]
      },

      sass: {
        files: ['src/sass/**/*.scss'],
        tasks: [ 'sass:build']
      },

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [],
        options: {
          livereload: false
        }
      },
      modules: {
        files: 'src/modules/**/*.js',
        tasks: ['browserify']
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'server/server.js',
          watchedFolders: ['server']
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch'],

        options: {
          logConcurrentOutput: true
        }
      }
    },

    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      }
    },

    browserify: {
      build: {
        src: ['src/modules/modules.js'],
        dest: '<%= build_dir %>/bundle.js',
        options: {
          debug: true
        },
        aliasMappings: [
          {
            cwd: 'src/modules/',
            src: ['**/*.js', '!**/*.spec.js'],
            dest: 'modules/'
          }
        ]
      }
    },

    sass: {
      options: {
        includePaths: require('node-neat').includePaths
      },
      build: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'src/sass/main.scss'
        }
      }
    },

  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask('default', ['build', 'concurrent']);

  grunt.registerTask('build', [
    'clean', 'copy', '6to5', 'ngAnnotate', 'html2js', 'browserify', 'sass', 'index'
  ]);

  function filterForExtension(extension, files) {
    var regex = new RegExp('\\.' + extension + '$'),
      dirRE = new RegExp('^(' + grunt.config('build_dir') + ')\/', 'g');;
    return files.filter(function (file) {
      return file.match(regex);
    }).map(function (file) {
      return file.replace(dirRE, '');
    });
  }

  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var jsFiles = filterForExtension('js', this.filesSrc),
      cssFiles = filterForExtension('css', this.filesSrc);

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });

  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
    var jsFiles = this.filesSrc.filter(function (file) {
      return file.match(/\.js$/);
    });

    grunt.file.copy('karma/karma.conf.tpl.js', grunt.config('build_dir') + '/karma.conf.js', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });
};

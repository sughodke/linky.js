'use strict';

module.exports = function (grunt) {

  // Add the contrib tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Project configuration.
  grunt.initConfig({

    jshint: {
      all: ['lib/*.js', 'test/*.js'],
      options: {
        jshintrc: true
      }
    },

    jsdoc : {
      dist : {
        src: ['lib/*.js', 'test/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/*.js']
      }
    }

  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest']);
};

'use strict'

module.exports = function (grunt) {
    grunt.initConfig({
        babel: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['*.es6'],
                        dest: 'lib',
                        ext: '.js',
                    },
                ]
            },
        },
    })


    grunt.loadNpmTasks('grunt-babel')

    grunt.registerTask('default', [ 'babel:dist', ])
};

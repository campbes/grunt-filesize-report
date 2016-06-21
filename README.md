# grunt-filesize-report
(Very) simple filesize reporter for grunt.

## Synopsis

Primary use was to generate a very simple xml format for use by Jenkins plot plugin.

## Code Example

    grunt.loadNpmTasks('grunt-filesize-report');
     
    grunt.initConfig({
        filesize: {
            options: {
                output: {
                    folder: dirs.reports + '/filesize', .. defaults to './'
                    short: true, //defaults to false - will output full info in the console
                    xml: true, // default is false
                    json: false, //default is false
                    filename: 'myoutput' // defaults to 'filesize-[target].[ext]',
                    thresholds: [102400,204800] // [warning, error] thresholds for individual files
                    totalThresholds: [524288,1048576] // [warning, error] for totals of all files
                    failOnerror: false // fail task when error threshold crossed
                }
            },
            css: {
                files : [{ cwd: '.', src: ['**/*.css'], expand: true}]
            },
            images: {
                files : [{ '.', src: ['**/img/*.*'], expand: true}]
            },
            js: {
                files : [{ cwd: '.', src: ['/js/*.min.js'], expand: true}]
            }
        }      
    });

## Motivation

There are a few good filesize reporters out there, but I wanted one that could output to a file format that I could hook into a jenkins plugin to keep a track of increasing output filesizes. so this outputs to a very simple XML format that the Jenkins Plot Plugin can understand, as well as json if you really want it.

## Installation

npm install grunt-filesize-report

## Contributors

Stuart Campbell ([campbes](https://github.com/campbes))

## License

Released under the [MIT License](http://opensource.org/licenses/MIT)
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  var MultiReporter = require('violation-reporter')(grunt);
  var XMLReporter = require('violation-reporter/tasks/XML')(grunt);
  var pmdReporter = require('violation-reporter/tasks/PmdXML')(grunt, XMLReporter);
  var checkstyleReporter = require('violation-reporter/tasks/CheckstyleXML')(grunt, XMLReporter);
  var jenkinsReporter = require('./JenkinsXML')(grunt, XMLReporter);
  var consoleReporter = require('./Console')(grunt);

  var defaults = {
    fail: true,
    failOn: 'error',
    thresholds: {
      error: 0.5,
      warning: 0.75
    },
    filesizes: {
      size: 102400,
      total: 524288
    }
  };

  function getReporter(files, options) {
    var reporter = new MultiReporter(files, options);
    reporter.addReporter(consoleReporter);
    if (options.pmdXML) {
      reporter.addReporter(pmdReporter);
    }
    if (options.checkstyleXML) {
      reporter.addReporter(checkstyleReporter);
    }
    if (options.jenkinsXML) {
      reporter.addReporter(jenkinsReporter);
    }
    return reporter;
  }

  grunt.registerMultiTask('filesize', 'Analyzes filesizes', function() {

    var done = this.async();

    var files = this.filesSrc || grunt.file.expand(this.file.src);
    var excluded = this.data.exclude;
    var options = this.options(defaults);

    var reporter = getReporter(files, options);


    // Exclude any unwanted files from 'files' array
    if (excluded) {
      grunt.file.expand(excluded).forEach(function(ex){
        files.splice(files.indexOf(ex), 1);
      });
    }

    var results = [];

    function getSeverity(ratio) {
      if (ratio < options.thresholds.error) {
        return 'error';
      } else if (ratio < options.thresholds.warning) {
        return 'warning';
      }
      return 'info';
    }

    function setFailures(severity) {
      if (options.failOn === 'error' && severity !== 'error') {
        return;
      }
      grunt.fail.errorcount++;
    }

    function processAnalysis(analysis, file) {

      var violations = [];
      var ratio;
      var severity;
      var metrics = analysis.metrics;

      Object.keys(metrics).forEach(function(key) {

        ratio = options.filesizes[key] / metrics[key];

        severity = getSeverity(ratio);

        violations.push({
          filepath: file,
          line: 0,
          column: 0,
          name: key,
          rule: key,
          severity: severity,
          message: 'Filesize too large',
          ratio: ratio,
          value: metrics[key]
        });

        setFailures(severity);

      });
      reporter.violations(file, violations);
      results.push(file);
    }

    reporter.start();

    var total = 0;

    files.forEach(function(file) {
      var stat = fs.statSync(file);
      var analysis = {
        metrics: {
          size: stat.size
        }
      };
      processAnalysis(analysis, file);
      total += stat.size;
    });

    processAnalysis({
      metrics : {
        total: total
      }
    }, 'Total');

    reporter.finish();
    done(options.fail === false || this.errorCount === 0);
  });

};
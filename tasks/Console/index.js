var fs = require('fs');

module.exports = function(grunt) {

  function formatSize(num,format) {
    if(format === 'kb') {
      num = num / 1024;
    } else if (format === 'mb') {
      num = num / 1024 / 1024;
    }
    return num.toFixed(2).toString();
  }

  var colors = {
    info: 'green',
    warning: 'yellow',
    error: 'red'
  };
  var widths = [75,10,10,10];
  var sep = '   ';

  var ConsoleReporter = function(filenames, options) {
    this.options = options;
  };

  ConsoleReporter.prototype = {

    violations: function(filepath, violations) {
      var log = this.log;
      violations.forEach(function(data) {
        log(filepath,data);
      });
    },

    start: function() {
      grunt.log.writeln(grunt.log.table(widths, ['File', sep + 'B', sep + 'kB', sep + 'MB']));
    },

    finish: function() {},

    log: function(file,data) {
      grunt.log.writeln(grunt.log.table(widths, [file, sep + data.value.toString(), sep + formatSize(data.value,'kb'), sep + formatSize(data.value,'mb')]) [colors[data.severity]]);
    }

  };

  return ConsoleReporter;
};

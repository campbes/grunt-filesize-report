var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  function formatSize(num) {
    return num.toFixed(2).toString();
  }

  grunt.registerMultiTask("filesize", "", function() {

    var files = this.filesSrc.filter(function (file) {
      return grunt.file.exists(file);
    }).map(function(file){
      var stat = fs.statSync(file);
      return {
        fullpath: path.resolve(file),
        filename: file,
        basename: path.basename(file),
        size: stat.size,
        kb: stat.size / 1024,
        mb: stat.size / 1024 / 1024
      };
    });

    var options = this.options();
    options.output = options.output || {};

    if (options.output.console !== false) {
      var widths = [75,10,10,10];
      var sep = '  ';
      var total = files.map(function(file) {
        return file.size;
      }).reduce(function(a,b) {
        return a + b;
      });
      grunt.log.writeln('==========================');
      grunt.log.writeln('Filesize analysis: '+this.target);
      grunt.log.writeln('==========================');
      grunt.log.writeln(grunt.log.table(widths, ['File', sep + 'B', sep + 'kB', sep + 'MB']));
      grunt.log.writeln();

      if(!options.output.short) {
        files.forEach(function (file) {
          grunt.log.writeln(grunt.log.table(widths, [file.filename, sep + file.size.toString(), sep + formatSize(file.kb), sep + formatSize(file.mb)]));
        });
        grunt.log.writeln();
      }

      grunt.log.writeln(grunt.log.table(widths,['Total',sep+total.toString(),sep+formatSize(total / 1024),sep+formatSize(total / 1024 / 1024)]));
    }

    options.output.filename = options.output.folder + '/' + (options.output.filename || 'filesize-' + this.target);

    if(options.output.folder) {
      grunt.file.mkdir(options.output.folder);
    }

    if (options.output.xml) {
      var str = '<filesizes type="'+this.target+'">';

      files.forEach(function(file) {
        str += '<' + file.basename + '>' + file.size + '</'+file.basename+'>';
      });

      str += '</filesizes>';
      fs.writeFileSync(options.output.filename + '.xml', str);
    }

    if (options.output.json) {
      fs.writeFileSync(options.output.filename + '.json',JSON.stringify(files));
    }

  });

};
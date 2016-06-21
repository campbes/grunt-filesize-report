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
    console.log(options)

    if (options.console !== false) {
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

      if(!options.short) {
        files.forEach(function (file) {
          grunt.log.writeln(grunt.log.table(widths, [file.filename, sep + file.size.toString(), sep + formatSize(file.kb), sep + formatSize(file.mb)]));
        });
        grunt.log.writeln();
      }

      grunt.log.writeln(grunt.log.table(widths,['Total',sep+total.toString(),sep+formatSize(total / 1024),sep+formatSize(total / 1024 / 1024)]));
    }

    options.filename = options.folder + '/' + (options.filename || 'filesize-' + this.target);

    if(options.folder) {
      grunt.file.mkdir(options.folder);
    }

    if (options.xml) {
      var str = '<filesizes type="'+this.target+'">';

      files.forEach(function(file) {
        str += '<' + file.basename + '>' + file.size + '</'+file.basename+'>';
      });

      str += '</filesizes>';
      fs.writeFileSync(options.filename + '.xml', str);
    }

    if (options.json) {
      fs.writeFileSync(options.filename + '.json',JSON.stringify(files));
    }

  });

};
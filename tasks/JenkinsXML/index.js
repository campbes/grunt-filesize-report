var path = require('path');

module.exports = function(grunt, XMLReporter) {
	var jenkinsReporter = function(filenames, options) {
		this.init(options, 'jenkinsXML', __dirname);
	};

	jenkinsReporter.prototype = new XMLReporter();

	jenkinsReporter.prototype.violations = function(filepath, violations) {
		var message = grunt.template.process(this.tpl.violation, {
			data: {
				filepath: path.basename(filepath),
				violations: violations
			}
		});

		this.write(message);
	};

	return jenkinsReporter;
};

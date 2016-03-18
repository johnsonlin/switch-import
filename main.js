var path = require('path');
var fs = require('fs');
var grunt = require('grunt');
var _ = require('lodash');

var root = path.resolve('.');
var aliases = require('./aliases');

var availableArgs = ['-src', '-from'];
var args = process.argv;
var options = {
    from : 'lodash',
    src  : 'src'
};

function getOptions() {
    availableArgs.forEach(function (arg) {
        if (args.indexOf(arg) !== -1) {
            options[arg.substr(1)] = args[args.indexOf(arg) + 1] || '';
        }
    });
    options.patternString = 'import \\{[\\w\\d\\s,]+\\} from \'' + options.from + '\';';
    options.importPattern = new RegExp(options.patternString, 'g');
}


function searchForImport(content) {
    return options.importPattern.test(content);
}

function processAliases(moduleName) {
    return _.get(aliases, options.from + '.' + moduleName, null) || moduleName;
}

function switchImport(content) {
    var matchedImports = content.match(options.importPattern) || [];
    var stringToReplace = [];

    matchedImports.forEach(function (importString) {
        var modulePattern = /\{(.*)\}/g;
        var modules = _.chain(
            (modulePattern.exec(importString) || [])[1]
                .toString()
                .split(',')
                .map(_.trim)
                .map(processAliases)
        )
            .sort()
            .value();

        modules.forEach(function (moduleName) {
            moduleName = _.trim(moduleName);
            stringToReplace.push('import ' + moduleName + ' from \'' + options.from + '/' + moduleName + '\';');
        });

        content = content.replace(importString, stringToReplace.join("\n"));
    });

    return content;
}

function searchAndSwitch() {
    var allJsFiles = grunt.file.expand(root + '/' + options.src + '/**/*.js');

    allJsFiles.forEach(function (filePath) {
        var jsFileContent = grunt.file.read(filePath);
        var searchResult = searchForImport(jsFileContent);

        if (searchResult) {
            try {
                var contentToSave = switchImport(jsFileContent);
                grunt.file.write(filePath, contentToSave);
                grunt.log.writeln('Successfully switched file: ' + filePath);
            } catch (err) {
                grunt.log.writeln('failed to switch file: ' + filePath + 'due to: ' + err.message);
            }
        }
    });
}

getOptions();
searchAndSwitch();

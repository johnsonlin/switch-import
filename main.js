var path = require('path');
var fs = require('fs');
var grunt = require('grunt');
var _ = require('lodash');

var root = path.resolve('.');

var availableArgs = ['-dir', '-from'];
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

function switchImport(content) {
    var matchedImports = content.match(options.importPattern) || [];
    var stringToReplace = [];

    matchedImports.forEach(function (importString) {
        var modulePattern = /\{(.*)\}/g;
        var modules = (modulePattern.exec(importString) || [])[1].toString().split(',').sort();

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
                grunt.file.write(filePath, switchImport(jsFileContent));
                grunt.log.writeln('Successfully switched file: ' + filePath);
            } catch (err) {
                grunt.log.writeln('failed to switch file: ' + filePath + 'due to: ' + err.message);
            }
        }
    });
}

getOptions();
searchAndSwitch();

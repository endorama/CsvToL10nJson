'use strict';

var _        = require('lodash');
var csvParse = require('csv-parse');
var fs       = require('fs');
var fse      = require('fs-extra');
var path     = require('path');
var Q        = require('q');

var errors   = require('./lib/errors');

var defaults = {
  usePrefix: true,
};

module.exports = function (inputFile, outputFolder, options) {

  options = _.assign({}, defaults, options);

  return Q.promise(function (resolve, reject) {
    if (_.isEmpty(inputFile)) {
      return reject(new TypeError('%s cannot be undefined', 'inputFile'));
    }
    if (_.isEmpty(outputFolder)) {
      return reject(new TypeError('%s cannot be undefined', 'outputFolder'));
    }

    if (!fs.existsSync(inputFile)) {
      return reject(new errors.ArgumentError('inputFile should exists'));
    }
    if (!fs.existsSync(outputFolder)) {
      return reject(new errors.ArgumentError('outputFolder should exists'));
    }

    // local vars
    var languages = {};
    var l10n = {};
    var l10nFiles = {};
    // get content from input file
    var csvContent = fs.readFileSync(inputFile);
    // get prefix to apply to output files
    var filePrefix = '';
    if (options.usePrefix) {
      filePrefix = path.basename(inputFile, '.csv') + '-';
    }

    // parse csv
    csvParse(csvContent, function (err, output) {
      if (err) {
        // console.log('error: %s', err);
        return reject(err);
      }

      // separate columns and data
      var columns = output[0];
      var data = _.rest(output);

      // console.log(columns);
      // console.dir(data);

      // get languages
      var c = _.clone(columns);
      var IDColumn = _.findIndex(c, function (v) { return v === 'ID'; }) + 1; // array index starts from 0
      c = _.slice(c, IDColumn);
      // console.log('%d languages found:', c.length);
      _.each(c, function (l, k) {
        // console.log('    - %s', l);
        languages[l] = 2+k;
        l10n[l] = {};
      });
      // console.log(languages)
       
      // put language data into proper language dictionary
      _.each(data, function (d) {
        // d[0]: useless
        var key = d[1];

        _.each(languages, function (l, k) {
          l10n[k][key] = d[l];
        });
      });

      // save language file to destination and check for errors
      _.each(languages, function (l, k) {
        var l10nFilename = path.join(outputFolder, filePrefix+k+'.json');
        fse.writeJsonSync(l10nFilename, l10n[k]);
        if (!fs.existsSync(l10nFilename)) {
          return reject(new Error(l10nFilename+' cannot be created'));
        }
        else {
          l10nFiles[k] = l10nFilename;
        }
      });

      return resolve(l10nFiles);
    });
  });

};

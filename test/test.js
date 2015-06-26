'use strict';

// var q = require('q');
var _    = require('lodash');
var chai = require('chai');
var fs   = require('fs');
var fse  = require('fs-extra');
var path = require('path');

chai.should();
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

var csv2json = require('../index');
var errors   = require('../lib/errors');

describe('CsvToL10nJson', function() {

  var testFilename = 'test';
  var testFile     = __dirname + '/fixtures/' + testFilename + '.csv';
  var outFolder    = '/tmp/csv2json';

  beforeEach(function (){
    fse.removeSync(outFolder);
    fs.mkdirSync(outFolder);
  });

  it('should return a promise', function() {
    return csv2json(undefined, undefined).should.be.a.thenable;
  });

  it('should be rejected when inputFile is empty', function() {
    return csv2json(undefined, undefined).should.eventually.be.rejectedWith(TypeError);
  });
 
  it('should be rejected when outputFolder is empty', function () {
    return csv2json(testFile, undefined).should.eventually.be.rejectedWith(TypeError);
  });

  it('should be rejected when inputFile does not exists', function () {
    return csv2json('path/to/file', outFolder).should.eventually.be.rejectedWith(errors.ArgumentError);
  });

  it('should be rejected when outputFolder does not exists', function () {
    // console.log(csv2json(testFile, '/tmp/does/not/exists'))
    return csv2json(testFile, '/tmp/does/not/exists')
      .should.eventually.be.rejectedWith(errors.ArgumentError);
  });
  
  it('should discard columns until ID', function () {
    return csv2json(__dirname + '/fixtures/test-columns.csv', outFolder).then(function (files) {
      _.keys(files).should.have.length(2);
    });
  });

  it('should create approriate number of files', function () {
    return csv2json(testFile, outFolder).then(function (files) {
      _.keys(files).should.have.length(2);
    });
  });

  it('should create proper files', function () {
    return csv2json(testFile, outFolder).then(function (files) {
      files.should.have.all.keys(['en', 'it']);
      (fs.existsSync(files.en)).should.be.equal(true);
      (fs.existsSync(files.it)).should.be.equal(true);
    });
  });

  it('should prefix files with source file name', function () {
    return csv2json(testFile, outFolder).then(function (files) {
      files.should.have.all.keys(['en', 'it']);

      path.basename(files.en, '.csv').should.startWith(testFilename + '-');
      path.basename(files.it, '.csv').should.startWith(testFilename + '-');
    });
  });
  
  it('should produce correct JSON', function () {
    return csv2json(testFile, outFolder).then(function (files) {
      var data = JSON.parse(fs.readFileSync(files.en, 'utf-8'));
      data.should.be.deep.equal({ title: 'Application Title', subtitle: 'Application Subtitle' });
    });
  });

});

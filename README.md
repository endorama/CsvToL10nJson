# Archive project with security advisory in dependencies

This project has not been used for a long time and is not currently maintaned.  
There are 2 security issues in dependecies:
- csv-parse [CVE-2019-17592](https://nvd.nist.gov/vuln/detail/CVE-2019-17592)
- lodash [CVE-2019-1010266](https://nvd.nist.gov/vuln/detail/CVE-2019-1010266) [CVE-2019-10744](https://github.com/lodash/lodash/pull/4336) [CVE-2018-16487](https://nvd.nist.gov/vuln/detail/CVE-2018-16487)


# CsvToL10nJson
Convert a performatted CSV file to multiple valid localization files

This module converts a single CSV file in a specific format into multiple valid
JSON files to be used with localization libraries.

## Hot it works

It parses the CSV removing all columns **before** a column named **ID**.  
All sequent columns will be considered different languages ( one language per 
column ). Language column name will be the file name created.

## API

`csv2json(inputFile, outputFolder)`

* `inputFile`: path to the CSV localization file
* `outputFolder`: path to the output folder for JSON files

`csv2json` returns a Promise ( [Q library](https://github.com/kriskowal/q) ).  
The `then` callback will receive the list of created files upon completion.

## How to use it

```js
var csv2json   = require('CsvToL10nJson');
var fs         = require('fs');

var csvFile = './csv/Localizations.csv';

csv2json(csvFile, './languages')
  .then(function (files) {
    console.log(files);
  })
  .catch(function (err) {
  });
```

## Example

This CSV:

```csv
Description,ID,en,it
application title,title,Application Title,Titolo applicazione
application subtitle,subtitle,Application Subtitle,Sottotitolo applicazione
```

will produce 2 JSON files `en.json` and `it.json` with this content:

```json
en.json
{
  "title": "Application Title",
  "subtitle": "Application Subtitle"
}

it.json
{
  "title": "Titolo applicazione",
  "subtitle": "Sottotitolo applicazione"
}
```


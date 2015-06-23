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


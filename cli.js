#!/usr/bin/env node

var transform = require('./lib/jsonpath-object-transform.js');
if (process.argv.length != 5) {
    console.error("Must specify the paths to json data and transformation template")
    return
}

var fs = require('fs');
var data = JSON.parse(fs.readFileSync(process.argv[2]).toString());
var template = JSON.parse(fs.readFileSync(process.argv[3]).toString());
var output = process.argv[4];
var transformedJson = transform(data, template);
fs.writeFileSync(output,JSON.stringify(transformedJson, null, 2));

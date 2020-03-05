# jsonpath-object-transform
> Transform an object literal using JSONPath.

[![npm](https://badge.fury.io/js/jsonpath-object-transform.png)](http://badge.fury.io/js/jsonpath-object-transform)

Pulls data from an object literal using JSONPath and generate a new objects based on a template. Each of the template's properties can pull a single property from the source data. You can also apply the JSONPath to the key as well to append values from data into the key name. This version is specialized for CI/CD pipeline where json transformation via config file is part of some CI/CD process like Control-M Jobs as Code.

JSONPath is like XPath for JavaScript objects. To learn the syntax, read the documentation for the [JSONPath](https://www.npmjs.org/package/JSONPath) package on npm and the [original article](http://goessner.net/articles/JsonPath/) by Stefan Goessner.

## Usage
```sh
json-transform /path/to/data.json /path/to/template.json /path/to/output.json
```

data.json
```json
{
  "environment": "TEST",
  "JobA": {
    "Schedule": {
      "Months": [1,2,3,4,5,6,7,8,9,10,11,12],
      "Days": [1],
      "Method": "MONTHLY"
    },
    "Parameters": {
      "Parm1": "/some/path/to/jobfile.txt",
      "Parm2": "/some/path/to/jobOutput.txt"
    },
    "QR" {
      "RESOURCE_1": [1,50],
      "RESOURCE_2": [2,25] 
    }
  }
};
```

template.json
```json
{
  "${environment}SomeJob": {
    "When": "$$.JobA.Schedule",
    "Command": "sh executeJob.sh $1 $2",
    "Arguments": ["$$.JobA.Parameters.Parm1", "$$.JobA.Parameters.Parm2"],
    "$$.JobA.QR": ""
  }
}
```

output.json
```json
{
  "TESTSomeJob": {
    "When": {
      "Months": [1,2,3,4,5,6,7,8,9,10,11,12],
      "Days": [1],
      "Method": "MONTHLY"
    },
    "Command": "sh executeJob.sh $1 $2",
    "Arguments": ["/some/path/to/jobfile.txt", "/some/path/to/jobOutput.txt"],
    "RESOURCE_1": [1,50],
    "RESOURCE_2": [2,25] 
  }
}
```

## Method
```js
jsonPathObjectTransform(data, template);
```
Where `data` and `template` are both a plain `Object`. Returns the transformed `Object`.

## Template Objects
Your template will be an object literal that outlines what the resulting object should look like. Each property will contain a JSONPath `String` or `Array` depending on how many properties from the source data you want to assign to the generated object.

### Pulling a Single Property
```js
{ destination: '$.path.to.source' }
```
Use a `String` on your template property to assign a single object returned from your JSONPath. If your path returns multiple results then only the first is used.

#### Example
```js
var template = {
  foo: '$.example'
};

var data = {
  example: 'bar'
};
```
Result:
```js
{
  foo: 'bar'
}
```

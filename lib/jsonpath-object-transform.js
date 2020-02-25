/*jshint evil:true*/
/*global module, require, define*/

(function (root, factory) {
  'use strict';
    const {JSONPath} = require('jsonpath-plus');
    module.exports = factory(JSONPath);
}(this, function(jsonPath) {
  'use strict';

  /**
   * Step through data object and apply path transforms.
   *
   * @param {object} data
   * @param {object} path
   * @param {object} result
   * @param {string} key
   */
  function walk(data, path, result, key) {
    var fn;
    switch (type(path)) {
      case 'string':
        fn = seekSingle;
        break;

      case 'array':
        fn = seekArray;
        break;

      case 'object':
        fn = seekObject;
        break;
    }

    if (fn) {
      fn(data, path, result, key);
    }
  }

  /**
   * Determine type of object.
   *
   * @param {object} obj
   * @returns {string}
   */
  function type(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj;
  }

  /**
   * Get single property from data object.
   *
   * @param {object} data
   * @param {string} pathStr
   * @param {object} result
   * @param {string} key
   */
  function seekSingle(data, pathStr, result, key) {

    if (typeof(key) !== 'undefined') {
      if(pathStr.indexOf('$$') < 0){
        result[key] = pathStr;
      }else{
        pathStr = pathStr.substring(1, pathStr.length); // remove the extra dollar sign from the path
        var seek = jsonPath({path: pathStr, json: data}) || [];
        result[key] = seek.length ? seek[0] : undefined;
      }
    }
    else {
      if(pathStr.indexOf('$$') < 0){
        result = pathStr;
      }else{
        pathStr = pathStr.substring(1, pathStr.length); // remove the extra dollar sign from the path
        var seek = jsonPath({path: pathStr, json: data}) || [];
        result = seek.length ? seek[0] : undefined;
      }
    }

  }

  /**
   * Get array of properties from data object.
   *
   * @param {object} data
   * @param {array} pathArr
   * @param {object} result
   * @param {string} key
   */
  function seekArray(data, path, result, key) {
    if (typeof result[key] === 'undefined')
      result[key] = [];

    path.forEach(function(item, index) {
      if (type(item) === 'string') {
        var result2 = {"result": ""};
        walk(data, item, result2, "result");
        result[key].push(result2.result);
      }
      else {
        var result2 = {};
        walk(data, item, result2);
        result[key].push(result2);
      }

    });
  }

  /**
   * Get object property from data object.
   *
   * @param {object} data
   * @param {object} pathObj
   * @param {object} result
   * @param {string} key
   */
  function seekObject(data, pathObj, result, key) {
    if (typeof key !== 'undefined') {
      result = result[key] = {};
    }
    Object.keys(pathObj).forEach(function(name) {
      walk(data, pathObj[name], result, name);
    });
  }

  function removeCharAt(string, i) {
    var tmp = string.split(''); // convert to an array
    tmp.splice(i - 1 , 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
    return tmp.join(''); // reconstruct the string
  }

  /**
   * @module jsonpath-object-transform
   * @param {object} data
   * @param {object} path
   * @returns {object}
   */
  return function(data, path) {
    var result = {};

    walk(data, path, result);

    return result;
  };

}));

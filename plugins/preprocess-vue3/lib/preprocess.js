/*
 * preprocess
 * https://github.com/onehealth/preprocess
 *
 * Copyright (c) 2012 OneHealth Solutions, Inc.
 * Written by Jarrod Overson - http://jarrodoverson.com/
 * Licensed under the Apache 2.0 license.
 */

/* 
 * mini for vue
 * Thanks for preprocess
 */

'use strict';

exports.preprocess         = preprocess;

var path  = require('path'),
    fs    = require('fs'),
    os    = require('os'),
    delim = require('./regexrules'),
    XRegExp = require('xregexp'); //3.1.0

function preprocess(src, context, typeOrOptions) {

  src = src.toString();
  context = context || process.env;
  // default values
  var options = {
    fileNotFoundSilentFail: false,
    srcDir: process.cwd(),
    srcEol: getEolType(src),
    type: delim['html']
  };

  // needed for backward compatibility with 2.x.x series
  if (typeof typeOrOptions === 'string') {
    typeOrOptions = {
      type: typeOrOptions
    };
  }

  // needed for backward compatibility with 2.x.x series
  if (typeof context.srcDir === "string") {
    typeOrOptions = typeOrOptions || {};
    typeOrOptions.srcDir = context.srcDir;
  }

  if (typeOrOptions && typeof typeOrOptions === 'object') {
    options.srcDir = typeOrOptions.srcDir || options.srcDir;
    options.fileNotFoundSilentFail = typeOrOptions.fileNotFoundSilentFail || options.fileNotFoundSilentFail;
    options.srcEol = typeOrOptions.srcEol || options.srcEol;
    options.type = delim[typeOrOptions.type] || options.type;
  }

  context = copy(context);

  return preprocessor(src, context, options);
}

function preprocessor(src, context, opts, noRestoreEol) {
 
  src = normalizeEol(src);
  
  var rv = src;
  
  if (opts.type.if) {
    
    opts.type.if.forEach((item)=>{
      rv = replaceRecursive(rv, item, function (startMatches, endMatches, include, recurse) {
        // I need to recurse first, so I don't catch "inner" else-directives
        var recursed = recurse(include);
        // look for the first else-directive
        var matches = opts.type.else && recursed.match(new RegExp(opts.type.else));
        var match = (matches || [""])[0];
        var index = match ? recursed.indexOf(match) : recursed.length;

        var ifBlock = recursed.substring(0, index);
        var elseBlock = recursed.substring(index + match.length); // empty string if no else-directive

        var variant = startMatches[1];
        var test = (startMatches[2] || '').trim();

        switch (variant) {
          case 'if':
            return testPasses(test, context) ? ifBlock : elseBlock;
          case 'ifdef':
            return typeof getDeepPropFromObj(context, test) !== 'undefined' ? ifBlock : elseBlock;
          case 'ifndef':
            return typeof getDeepPropFromObj(context, test) === 'undefined' ? ifBlock : elseBlock;
          default:
            throw new Error('Unknown if variant ' + variant + '.');
        }
      });
      
    })
    
    
  }

  rv = replace(rv, opts.type.echo, function (match, variable) {
    variable = (variable || '').trim();
    // if we are surrounded by quotes, echo as a string
    var stringMatch = variable.match(/^(['"])(.*)\1$/);
    if (stringMatch) return stringMatch[2];

    return getDeepPropFromObj(context, (variable || '').trim());
  });

  if (!noRestoreEol) {
    rv = restoreEol(rv, opts.srcEol);
  }

  return rv;
}

function getEolType(source) {
  var eol;
  var foundEolTypeCnt = 0;

  if (source.indexOf('\r\n') >= 0) {
    eol = '\r\n';
    foundEolTypeCnt++;
  }
  if (/\r[^\n]/.test(source)) {
    eol = '\r';
    foundEolTypeCnt++;
  }
  if (/[^\r]\n/.test(source)) {
    eol = '\n';
    foundEolTypeCnt++;
  }

  if (eol == null || foundEolTypeCnt > 1) {
    eol = os.EOL;
  }

  return eol;
}

function normalizeEol(source, indent) {
  // only process any kind of EOL if indentation has to be added, otherwise replace only non \n EOLs
  if (indent) {
    source = source.replace(/(?:\r?\n)|\r/g, '\n' + indent);
  } else {
    source = source.replace(/(?:\r\n)|\r/g, '\n');
  }

  return source;
}

function restoreEol(normalizedSource, originalEol) {
  if (originalEol !== '\n') {
    normalizedSource = normalizedSource.replace(/\n/g, originalEol);
  }

  return normalizedSource;
}

function replace(rv, rule, processor) {
  var isRegex = typeof rule === 'string' || rule instanceof RegExp;
  var isArray = Array.isArray(rule);

  if (isRegex) {
    rule = [new RegExp(rule,'gmi')];
  } else if (isArray) {
    rule = rule.map(function(subRule){
      return new RegExp(subRule,'gmi');
    });
  } else {
    throw new Error('Rule must be a String, a RegExp, or an Array.');
  }

  return rule.reduce(function(rv, rule){
    return rv.replace(rule, processor);
  }, rv);
}

function replaceRecursive(rv, rule, processor) {
  if(!rule.start || !rule.end) {
    throw new Error('Recursive rule must have start and end.');
  }

  var startRegex = new RegExp(rule.start, 'mi');
  var endRegex = new RegExp(rule.end, 'mi');

  function matchReplacePass(content) {
    var matches = XRegExp.matchRecursive(content, rule.start, rule.end, 'gmi', {
      valueNames: ['between', 'left', 'match', 'right']
    });

    var matchGroup = {
      left: null,
      match: null,
      right: null
    };

    return matches.reduce(function (builder, match) {
      switch(match.name) {
        case 'between':
          builder += match.value;
          break;
        case 'left':
          matchGroup.left = startRegex.exec(match.value);
          break;
        case 'match':
          matchGroup.match = match.value;
          break;
        case 'right':
          matchGroup.right = endRegex.exec(match.value);
          builder += processor(matchGroup.left, matchGroup.right, matchGroup.match, matchReplacePass);
          break;
      }
      return builder;
    }, '');
  }

  return matchReplacePass(rv);
}

function getTestTemplate(test) {
  /*jshint evil:true*/
  test = test || 'true';
  test = test.trim();

  // force single equals replacement
  test = test.replace(/([^=!])=([^=])/g, '$1==$2');

  return new Function("context", "with (context||{}){ return ( " + test + " ); }");
}

function testPasses(test,context) {
  var testFn = getTestTemplate(test);
  return testFn(context, getDeepPropFromObj);
}

function copy(obj) {
  return Object.keys(obj).reduce(function (copyObj, objKey) {
    copyObj[objKey] = obj[objKey];
    return copyObj;
  }, {});
}

function getDeepPropFromObj(obj, propPath) {
  propPath.replace(/\[([^\]+?])\]/g, '.$1');
  propPath = propPath.split('.');

  // fast path, no need to loop if structurePath contains only a single segment
  if (propPath.length === 1) {
    return obj[propPath[0]];
  }

  // loop only as long as possible (no exceptions for null/undefined property access)
  propPath.some(function (pathSegment) {
    obj = obj[pathSegment];
    return (obj == null);
  });

  return obj;
}

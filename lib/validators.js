'use strict';

var _require = require('./brackets'),
    expandScopeBrackets = _require.expandScopeBrackets;

function binsearch(requiredItem, providedList) {
  var min = 0;
  var max = providedList.length - 1;
  var mid = void 0;
  while (min <= max) {
    mid = Math.round(min + (max - min) / 2);
    if (providedList[mid] === requiredItem) {
      return `${providedList[mid]} >> ${requiredItem}`;
    } else if (providedList[mid] < requiredItem) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }
  return false;
}

function validateScopeDefault(required, provided) {
  for (var r = 0; r < required.length; r += 1) {
    var reqd = required[r];
    for (var p = 0; p < provided.length; p += 1) {
      var perm = provided[p];
      if (reqd === perm) {
        return `${perm} >> ${reqd}`;
      }
    }
  }
  // got through all the required and provided to no avail
  return false;
}

// assumes list is sorted
function validateScopeBinsearch(required, provided) {
  for (var r = 0; r < required.length; r += 1) {
    var reqd = required[r];
    var pass = binsearch(reqd, provided);
    if (pass) {
      return pass;
    }
  }

  return false;
}

// Don't use this
function validateScopeWildcard(required, provided) {
  for (var p = 0; p < provided.length; p += 1) {
    var perm = provided[p];

    // preset the regexp
    var permReStr = `^${perm.replace(/\*/g, '.*')}$`;
    var permRe = new RegExp(permReStr);

    for (var r = 0; r < required.length; r += 1) {
      var reqd = required[r];
      // user:* -> user:create, user:view:self
      if (permRe.exec(reqd)) {
        return `${perm} >> ${reqd}`;
      }
    }
  }

  return false;
}

function validateScope(requiredArg, providedArg, options) {
  // fail if nothing provided
  if (!requiredArg || !providedArg) {
    return false;
  }

  // short circuits for special required cases
  if (requiredArg && (requiredArg === 'deny' || requiredArg === 'skip')) {
    return requiredArg;
  }
  if (requiredArg && requiredArg.length === 1 && (requiredArg[0] === 'deny' || requiredArg[0] === 'skip')) {
    return requiredArg[0];
  }

  // no requirements, even if empty provided, means pass
  if (requiredArg.length === 0) {
    return true;
  }

  // check and setup opts
  var opts = options ? options : {};
  var required = requiredArg;
  var provided = providedArg;

  if (opts.expandRequired === true) {
    required = expandScopeBrackets(required);
  }

  if (opts.expandProvided === true) {
    provided = expandScopeBrackets(provided);
  }

  // TODO, sort the provided, then bin search provided
  // required is not likely worth it, but provided definitely will need it

  if (opts.validator) {
    if (typeof opts.validator === 'function') {
      return opts.validator(required, provided);
    } else if (opts.validator === 'default') {
      return validateScopeDefault(required, provided);
    } else if (opts.validator === 'binsearch') {
      provided.sort();
      return validateScopeBinsearch(required, provided);
    } else if (opts.validator === 'binsearch-nosort') {
      return validateScopeBinsearch(required, provided);
    } else if (opts.validator === 'wildcard-i-love-trump') {
      return validateScopeWildcard(required, provided);
    } else {
      throw new Error(`Unknown validator type: '${opts.validator}'`);
    }
  }

  return validateScopeDefault(required, provided);
}

module.exports = {
  binsearch,
  validateScope,
  validateScopeDefault,
  validateScopeBinsearch,
  validateScopeWildcard
};
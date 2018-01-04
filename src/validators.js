const { expandScopeBrackets } = require('./brackets');

function binsearch(requiredItem, providedList) {
  let min = 0;
  let max = providedList.length - 1;
  let mid;
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
  for (let r = 0; r < required.length; r += 1) {
    const reqd = required[r];
    for (let p = 0; p < provided.length; p += 1) {
      const perm = provided[p];
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
  for (let r = 0; r < required.length; r += 1) {
    const reqd = required[r];
    const pass = binsearch(reqd, provided);
    if (pass) {
      return pass;
    }
  }

  return false;
}

// Don't use this
function validateScopeWildcard(required, provided) {
  for (let p = 0; p < provided.length; p += 1) {
    const perm = provided[p];

    // preset the regexp
    const permReStr = `^${perm.replace(/\*/g, '.*')}$`;
    const permRe = new RegExp(permReStr);

    for (let r = 0; r < required.length; r += 1) {
      const reqd = required[r];
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
  if (
    requiredArg &&
    requiredArg.length === 1 &&
    (requiredArg[0] === 'deny' || requiredArg[0] === 'skip')
  ) {
    return requiredArg[0];
  }

  // no requirements, even if empty provided, means pass
  if (requiredArg.length === 0) {
    return true;
  }

  // check and setup opts
  const opts = options ? options : {};
  let required = requiredArg;
  let provided = providedArg;

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
  validateScopeWildcard,
};

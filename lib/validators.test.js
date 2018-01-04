'use strict';

var _require = require('./validators'),
    validateScope = _require.validateScope;

var required = ['red', 'green', 'blue'];
var provided = ['blue', 'orange', 'goldenrod'];
var fail = ['purple', 'orange'];

var required1 = ['red/[green,blue]'];
var required2 = ['red/blue'];

var provided1 = ['[red,green]/blue'];
var provided2 = ['red/blue'];

var scopesEmpty = [''];

function sameLen(required, provided) {
  for (var r = 0; r < required.length; r += 1) {
    var reqd = required[r];
    for (var p = 0; p < provided.length; p += 1) {
      var perm = provided[p];
      if (reqd.length === perm.length) {
        // match so return some information rather than just 'true'
        return `${perm} >> ${reqd}`;
      }
    }
  }
  // got through all the required and provided to no avail
  return false;
};

test('base cases - required w/o provided', function () {
  expect(validateScope(required, null)).toEqual(false);
});
test('base cases - provided w/o required', function () {
  expect(validateScope(null, provided)).toEqual(false);
});
test('base cases - required w/ empty string provided', function () {
  expect(validateScope(required, scopesEmpty)).toEqual(false);
});
test('base cases - required w/ empty array provided', function () {
  expect(validateScope(required, [])).toEqual(false);
});

test('basic cases - no match [...]/[]', function () {
  expect(validateScope(required, fail)).toEqual(false);
});
test('basic cases - match []/[]', function () {
  expect(validateScope([], [])).toEqual(true);
});
test('basic cases - match []/[...]', function () {
  expect(validateScope([], provided)).toEqual(true);
});
test('basic cases - match [...]/[...]', function () {
  expect(validateScope(required, provided)).toEqual('blue >> blue');
});

test('special cases - deny string', function () {
  expect(validateScope('deny', provided)).toEqual('deny');
});
test('special cases - skip string', function () {
  expect(validateScope('skip', provided)).toEqual('skip');
});
test('special cases - deny array elem', function () {
  expect(validateScope(['deny'], provided)).toEqual('deny');
});
test('special cases - skip array elem', function () {
  expect(validateScope(['skip'], provided)).toEqual('skip');
});

test('bracket expansions - options omitted', function () {
  expect(validateScope(required1, provided1)).toEqual(false);
});

test('bracket expansions - requiredScopes - pass', function () {
  expect(validateScope(required1, provided1, {
    expandRequired: true,
    expandProvided: true
  })).toEqual('red/blue >> red/blue');
});
test('bracket expansions - requiredScopes - fail', function () {
  expect(validateScope(required1, provided2, {
    expandRequired: true,
    expandProvided: true
  })).toEqual('red/blue >> red/blue');
});

test('bracket expansions - providedScopes - pass', function () {
  expect(validateScope(required2, provided1, {
    expandRequired: true,
    expandProvided: true
  })).toEqual('red/blue >> red/blue');
});
test('bracket expansions - providedScopes - fail', function () {
  expect(validateScope(required2, provided2, {
    expandRequired: true,
    expandProvided: true
  })).toEqual('red/blue >> red/blue');
});

test('validator options - no options - pass', function () {
  expect(validateScope(required, provided)).toEqual('blue >> blue');
});
test('validator options - no options - fail', function () {
  expect(validateScope(required, fail)).toEqual(false);
});

test('validator options - explicit default - pass', function () {
  expect(validateScope(required, provided, {
    validator: 'default'
  })).toEqual('blue >> blue');
});
test('validator options - explicit default - fail', function () {
  expect(validateScope(required, fail, {
    validator: 'default'
  })).toEqual(false);
});

test('validator options - binsearch - pass', function () {
  expect(validateScope(required, provided, {
    validator: 'binsearch'
  })).toEqual('blue >> blue');
});
test('validator options - binsearch - fail', function () {
  expect(validateScope(required, fail, {
    validator: 'binsearch'
  })).toEqual(false);
});

test('validator options - binsearch-nosort - pass', function () {
  expect(validateScope(required, provided, {
    validator: 'binsearch-nosort'
  })).toEqual('blue >> blue');
});
test('validator options - binsearch-nosort - fail', function () {
  expect(validateScope(required, fail, {
    validator: 'binsearch-nosort'
  })).toEqual(false);
});

test('validator options - wildcard - pass', function () {
  expect(validateScope(required, ['r*'], {
    validator: 'wildcard-i-love-trump'
  })).toEqual('r* >> red');
});
test('validator options - wildcard - fail', function () {
  expect(validateScope(fail, ['r*'], {
    validator: 'wildcard-i-love-trump'
  })).toEqual(false);
});

test('validator options - custom callback - pass', function () {
  expect(validateScope(['dandelion'], provided, {
    validator: sameLen
  })).toEqual('goldenrod >> dandelion');
});
test('validator options - custom callback - fail', function () {
  expect(validateScope(['dandelion'], fail, {
    validator: sameLen
  })).toEqual(false);
});

test('validator options - unknown callback', function () {
  expect(function () {
    validateScope(required, provided, {
      validator: 'unknown'
    });
  }).toThrow();
});
const { validateScope } = require('./validators');

const required = ['red', 'green', 'blue'];
const provided = ['blue', 'orange', 'goldenrod'];
const fail = ['purple', 'orange'];

const required1 = ['red/[green,blue]'];
const required2 = ['red/blue'];

const provided1 = ['[red,green]/blue'];
const provided2 = ['red/blue'];

const scopesEmpty = [''];

function sameLen(required, provided) {
  for (let r = 0; r < required.length; r += 1) {
    const reqd = required[r];
    for (let p = 0; p < provided.length; p += 1) {
      const perm = provided[p];
      if (reqd.length === perm.length) {
        // match so return some information rather than just 'true'
        return `${perm} >> ${reqd}`;
      }
    }
  }
  // got through all the required and provided to no avail
  return false;
}

test('base cases - required w/o provided', () => {
  expect(validateScope(required, null)).toEqual(false);
});
test('base cases - provided w/o required', () => {
  expect(validateScope(null, provided)).toEqual(false);
});
test('base cases - required w/ empty string provided', () => {
  expect(validateScope(required, scopesEmpty)).toEqual(false);
});
test('base cases - required w/ empty array provided', () => {
  expect(validateScope(required, [])).toEqual(false);
});

test('basic cases - no match [...]/[]', () => {
  expect(validateScope(required, fail)).toEqual(false);
});
test('basic cases - match []/[]', () => {
  expect(validateScope([], [])).toEqual(true);
});
test('basic cases - match []/[...]', () => {
  expect(validateScope([], provided)).toEqual(true);
});
test('basic cases - match [...]/[...]', () => {
  expect(validateScope(required, provided)).toEqual('blue >> blue');
});

test('special cases - deny string', () => {
  expect(validateScope('deny', provided)).toEqual('deny');
});
test('special cases - skip string', () => {
  expect(validateScope('skip', provided)).toEqual('skip');
});
test('special cases - deny array elem', () => {
  expect(validateScope(['deny'], provided)).toEqual('deny');
});
test('special cases - skip array elem', () => {
  expect(validateScope(['skip'], provided)).toEqual('skip');
});

test('bracket expansions - options omitted', () => {
  expect(validateScope(required1, provided1)).toEqual(false);
});

test('bracket expansions - requiredScopes - pass', () => {
  expect(
    validateScope(required1, provided1, {
      expandRequired: true,
      expandProvided: true,
    }),
  ).toEqual('red/blue >> red/blue');
});
test('bracket expansions - requiredScopes - fail', () => {
  expect(
    validateScope(required1, provided2, {
      expandRequired: true,
      expandProvided: true,
    }),
  ).toEqual('red/blue >> red/blue');
});

test('bracket expansions - providedScopes - pass', () => {
  expect(
    validateScope(required2, provided1, {
      expandRequired: true,
      expandProvided: true,
    }),
  ).toEqual('red/blue >> red/blue');
});
test('bracket expansions - providedScopes - fail', () => {
  expect(
    validateScope(required2, provided2, {
      expandRequired: true,
      expandProvided: true,
    }),
  ).toEqual('red/blue >> red/blue');
});

test('validator options - no options - pass', () => {
  expect(validateScope(required, provided)).toEqual('blue >> blue');
});
test('validator options - no options - fail', () => {
  expect(validateScope(required, fail)).toEqual(false);
});

test('validator options - explicit default - pass', () => {
  expect(
    validateScope(required, provided, {
      validator: 'default',
    }),
  ).toEqual('blue >> blue');
});
test('validator options - explicit default - fail', () => {
  expect(
    validateScope(required, fail, {
      validator: 'default',
    }),
  ).toEqual(false);
});

test('validator options - binsearch - pass', () => {
  expect(
    validateScope(required, provided, {
      validator: 'binsearch',
    }),
  ).toEqual('blue >> blue');
});
test('validator options - binsearch - fail', () => {
  expect(
    validateScope(required, fail, {
      validator: 'binsearch',
    }),
  ).toEqual(false);
});

test('validator options - binsearch-nosort - pass', () => {
  expect(
    validateScope(required, provided, {
      validator: 'binsearch-nosort',
    }),
  ).toEqual('blue >> blue');
});
test('validator options - binsearch-nosort - fail', () => {
  expect(
    validateScope(required, fail, {
      validator: 'binsearch-nosort',
    }),
  ).toEqual(false);
});

test('validator options - wildcard - pass', () => {
  expect(
    validateScope(required, ['r*'], {
      validator: 'wildcard-i-love-trump',
    }),
  ).toEqual('r* >> red');
});
test('validator options - wildcard - fail', () => {
  expect(
    validateScope(fail, ['r*'], {
      validator: 'wildcard-i-love-trump',
    }),
  ).toEqual(false);
});

test('validator options - custom callback - pass', () => {
  expect(
    validateScope(['dandelion'], provided, {
      validator: sameLen,
    }),
  ).toEqual('goldenrod >> dandelion');
});
test('validator options - custom callback - fail', () => {
  expect(
    validateScope(['dandelion'], fail, {
      validator: sameLen,
    }),
  ).toEqual(false);
});

test('validator options - unknown callback', () => {
  expect(() => {
    validateScope(required, provided, {
      validator: 'unknown',
    });
  }).toThrow();
});

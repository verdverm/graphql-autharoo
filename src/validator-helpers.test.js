const {
  binsearch,
  validateScopeDefault,
  validateScopeBinsearch,
  validateScopeWildcard,
} = require('./validators');

const words = `Lorem ipsum dolor sit amet, dico epicurei ei mea, eam legere nonumes sensibus ut. No mel civibus mentitum ullamcorper. An eam sale homero, zril omnes no mel. Nec in erat praesent maiestatis, in sed doming assueverit. Perpetua adolescens duo ne, cu tale atqui percipitur qui. Qui doming deserunt expetenda ne.`;
const sorted = words.split(' ').sort();

const required = `Jan Feb Mar`.split(' ');

const scopesEmpty = [''];
const scopes1 = `Jan`.split(' ');
const scopes1b = `Feb`.split(' ');
const scopes1c = `Mar`.split(' ');
const scopes2 = `Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec`.split(' ');
const scopes3 = `Feb May Jun Jul Aug Sep Oct Nov Dec`.split(' ');
const scopes4 = `Sep Oct Nov Dec Jan`.split(' ');
const scopes4b = `Sep Oct Feb Nov Dec`.split(' ');
const scopes4c = `Sep Oct Nov Dec Feb`.split(' ');
const scopes5 = `Jun Mar Sep Oct Nov Dec`.split(' ');
const scopes5b = `Mar Sep Oct Nov Dec`.split(' ');
const scopes5c = `Sep Oct Nov Dec Mar`.split(' ');
const scopes6 = `Sep Oct Nov Dec`.split(' ');

test('binary search - n^2 list against self', () => {
  sorted.map(word => {
    expect(binsearch(word, sorted)).toEqual(word + ' >> ' + word);
  });
});

test('binary search - miss at front', () => {
  expect(binsearch('AAA', sorted)).toEqual(false);
});
test('binary search - miss at back', () => {
  expect(binsearch('zzz', sorted)).toEqual(false);
});
test('binary search - miss in middle', () => {
  expect(binsearch('nonexistant', sorted)).toEqual(false);
});

test('validateScopeDefault - basic - pass on first/only', () => {
  expect(validateScopeDefault(required, scopes1)).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});
test('validateScopeDefault - basic - pass on first/first', () => {
  expect(validateScopeDefault(required, scopes2)).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});
test('validateScopeDefault - basic - pass on first/mid', () => {
  expect(validateScopeDefault(required, scopes2)).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});
test('validateScopeDefault - basic - pass on first/last', () => {
  expect(validateScopeDefault(required, scopes4)).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});

test('validateScopeDefault - basic - pass on mid/only', () => {
  expect(validateScopeDefault(required, scopes1b)).toEqual(
    'Feb' + ' >> ' + 'Feb',
  );
});
test('validateScopeDefault - basic - pass on mid/first', () => {
  expect(validateScopeDefault(required, scopes3)).toEqual(
    'Feb' + ' >> ' + 'Feb',
  );
});
test('validateScopeDefault - basic - pass on mid/mid', () => {
  expect(validateScopeDefault(required, scopes4b)).toEqual(
    'Feb' + ' >> ' + 'Feb',
  );
});
test('validateScopeDefault - basic - pass on mid/last', () => {
  expect(validateScopeDefault(required, scopes4c)).toEqual(
    'Feb' + ' >> ' + 'Feb',
  );
});

test('validateScopeDefault - basic - pass on last/only', () => {
  expect(validateScopeDefault(required, scopes1c)).toEqual(
    'Mar' + ' >> ' + 'Mar',
  );
});
test('validateScopeDefault - basic - pass on last/first', () => {
  expect(validateScopeDefault(required, scopes5b)).toEqual(
    'Mar' + ' >> ' + 'Mar',
  );
});
test('validateScopeDefault - basic - pass on last/mid', () => {
  expect(validateScopeDefault(required, scopes5)).toEqual(
    'Mar' + ' >> ' + 'Mar',
  );
});
test('validateScopeDefault - basic - pass on last/last', () => {
  expect(validateScopeDefault(required, scopes5c)).toEqual(
    'Mar' + ' >> ' + 'Mar',
  );
});

test('validateScopeDefault - basic - fail for no match', () => {
  expect(validateScopeDefault(required, scopes6)).toEqual(false);
});

test('validateScopeDefault - providedScope is empty string', () => {
  expect(validateScopeDefault(required, scopesEmpty)).toEqual(false);
});
test('validateScopeDefault - providedScope is empty array', () => {
  expect(validateScopeDefault(required, [])).toEqual(false);
});
test('validateScopeDefault - requiredScope is empty array', () => {
  expect(validateScopeDefault([], scopes4)).toEqual(false);
});
test('validateScopeDefault - both inputs are empty arrays', () => {
  expect(validateScopeDefault([], [])).toEqual(false);
});

test('validateScopeBinsearch - one providedScope element', () => {
  expect(validateScopeBinsearch(required, scopes1.sort())).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});
test('validateScopeBinsearch - many providedScope elements', () => {
  expect(validateScopeBinsearch(required, scopes2.sort())).toEqual(
    'Jan' + ' >> ' + 'Jan',
  );
});
test('validateScopeBinsearch - fail for missing', () => {
  expect(validateScopeBinsearch(required, scopes6.sort())).toEqual(false);
});

test('validateScopeBinsearch - providedScope is empty string', () => {
  expect(validateScopeBinsearch(required, scopesEmpty)).toEqual(false);
});
test('validateScopeBinsearch - providedScope is empty array', () => {
  expect(validateScopeBinsearch(required, [])).toEqual(false);
});
test('validateScopeBinsearch - requiredScope is empty array', () => {
  expect(validateScopeBinsearch([], scopes4)).toEqual(false);
});
test('validateScopeBinsearch - both inputs are empty arrays', () => {
  expect(validateScopeBinsearch([], [])).toEqual(false);
});

const wildcardRequired1 = `admin:view`.split(' ');
const wildcardRequired2 = `admin:view admin:list`.split(' ');
const wildcardRequired3 = `admin:view user:view`.split(' ');
const wildcardRequired4 = `user:view`.split(' ');

const wildcardScopes1 = `admin:list`.split(' ');
const wildcardScopes2 = `admin:*`.split(' ');
const wildcardScopes3 = `admin:* user:*`.split(' ');
const wildcardScopes4 = `admin:view user:*`.split(' ');
const wildcardScopes5 = `admin:list admin:view user:*`.split(' ');
const wildcardScopes6 = `user:* admin:view`.split(' ');

test('validateScopeWildcard - no match', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes1)).toEqual(
    false,
  );
});
test('validateScopeWildcard - req1 - match only', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes2)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req1 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes3)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req1 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes4)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req1 - match mid without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes5)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req1 - match last passing wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes6)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});

test('validateScopeWildcard - req2 - match only', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes1)).toEqual(
    'admin:list' + ' >> ' + 'admin:list',
  );
});
test('validateScopeWildcard - req2 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes2)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req2 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes3)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req2 - match first without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes4)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req2 - match not first without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes5)).toEqual(
    'admin:list' + ' >> ' + 'admin:list',
  );
});
test('validateScopeWildcard - req2 - match last passing wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes6)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});

test('validateScopeWildcard - req3 - fail first without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes1)).toEqual(
    false,
  );
});
test('validateScopeWildcard - req3 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes2)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req3 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes3)).toEqual(
    'admin:*' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req3 - match first without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes4)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req3 - match not first without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes5)).toEqual(
    'admin:view' + ' >> ' + 'admin:view',
  );
});
test('validateScopeWildcard - req3 - match last with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes6)).toEqual(
    'user:*' + ' >> ' + 'user:view',
  );
});
test('validateScopeWildcard - req4 - fail without wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes1)).toEqual(
    false,
  );
});
test('validateScopeWildcard - req4 - fail with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes2)).toEqual(
    false,
  );
});
test('validateScopeWildcard - req4 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes3)).toEqual(
    'user:*' + ' >> ' + 'user:view',
  );
});
test('validateScopeWildcard - req4 - match first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes4)).toEqual(
    'user:*' + ' >> ' + 'user:view',
  );
});
test('validateScopeWildcard - req4 - match not first with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes5)).toEqual(
    'user:*' + ' >> ' + 'user:view',
  );
});
test('validateScopeWildcard - req4 - match last with wildcard', () => {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes6)).toEqual(
    'user:*' + ' >> ' + 'user:view',
  );
});

test('validateScopeWildcard - providedScope is empty string', () => {
  expect(validateScopeWildcard(wildcardRequired1, scopesEmpty)).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', () => {
  expect(validateScopeWildcard(wildcardRequired1, [])).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', () => {
  expect(validateScopeWildcard([], wildcardScopes1)).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', () => {
  expect(validateScopeWildcard([], [])).toEqual(false);
});

'use strict';

var _require = require('./validators'),
    binsearch = _require.binsearch,
    validateScopeDefault = _require.validateScopeDefault,
    validateScopeBinsearch = _require.validateScopeBinsearch,
    validateScopeWildcard = _require.validateScopeWildcard;

var words = `Lorem ipsum dolor sit amet, dico epicurei ei mea, eam legere nonumes sensibus ut. No mel civibus mentitum ullamcorper. An eam sale homero, zril omnes no mel. Nec in erat praesent maiestatis, in sed doming assueverit. Perpetua adolescens duo ne, cu tale atqui percipitur qui. Qui doming deserunt expetenda ne.`;
var sorted = words.split(' ').sort();

var required = `Jan Feb Mar`.split(' ');

var scopesEmpty = [''];
var scopes1 = `Jan`.split(' ');
var scopes1b = `Feb`.split(' ');
var scopes1c = `Mar`.split(' ');
var scopes2 = `Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec`.split(' ');
var scopes3 = `Feb May Jun Jul Aug Sep Oct Nov Dec`.split(' ');
var scopes4 = `Sep Oct Nov Dec Jan`.split(' ');
var scopes4b = `Sep Oct Feb Nov Dec`.split(' ');
var scopes4c = `Sep Oct Nov Dec Feb`.split(' ');
var scopes5 = `Jun Mar Sep Oct Nov Dec`.split(' ');
var scopes5b = `Mar Sep Oct Nov Dec`.split(' ');
var scopes5c = `Sep Oct Nov Dec Mar`.split(' ');
var scopes6 = `Sep Oct Nov Dec`.split(' ');

test('binary search - n^2 list against self', function () {
  sorted.map(function (word) {
    expect(binsearch(word, sorted)).toEqual(word + ' >> ' + word);
  });
});

test('binary search - miss at front', function () {
  expect(binsearch('AAA', sorted)).toEqual(false);
});
test('binary search - miss at back', function () {
  expect(binsearch('zzz', sorted)).toEqual(false);
});
test('binary search - miss in middle', function () {
  expect(binsearch('nonexistant', sorted)).toEqual(false);
});

test('validateScopeDefault - basic - pass on first/only', function () {
  expect(validateScopeDefault(required, scopes1)).toEqual('Jan' + ' >> ' + 'Jan');
});
test('validateScopeDefault - basic - pass on first/first', function () {
  expect(validateScopeDefault(required, scopes2)).toEqual('Jan' + ' >> ' + 'Jan');
});
test('validateScopeDefault - basic - pass on first/mid', function () {
  expect(validateScopeDefault(required, scopes2)).toEqual('Jan' + ' >> ' + 'Jan');
});
test('validateScopeDefault - basic - pass on first/last', function () {
  expect(validateScopeDefault(required, scopes4)).toEqual('Jan' + ' >> ' + 'Jan');
});

test('validateScopeDefault - basic - pass on mid/only', function () {
  expect(validateScopeDefault(required, scopes1b)).toEqual('Feb' + ' >> ' + 'Feb');
});
test('validateScopeDefault - basic - pass on mid/first', function () {
  expect(validateScopeDefault(required, scopes3)).toEqual('Feb' + ' >> ' + 'Feb');
});
test('validateScopeDefault - basic - pass on mid/mid', function () {
  expect(validateScopeDefault(required, scopes4b)).toEqual('Feb' + ' >> ' + 'Feb');
});
test('validateScopeDefault - basic - pass on mid/last', function () {
  expect(validateScopeDefault(required, scopes4c)).toEqual('Feb' + ' >> ' + 'Feb');
});

test('validateScopeDefault - basic - pass on last/only', function () {
  expect(validateScopeDefault(required, scopes1c)).toEqual('Mar' + ' >> ' + 'Mar');
});
test('validateScopeDefault - basic - pass on last/first', function () {
  expect(validateScopeDefault(required, scopes5b)).toEqual('Mar' + ' >> ' + 'Mar');
});
test('validateScopeDefault - basic - pass on last/mid', function () {
  expect(validateScopeDefault(required, scopes5)).toEqual('Mar' + ' >> ' + 'Mar');
});
test('validateScopeDefault - basic - pass on last/last', function () {
  expect(validateScopeDefault(required, scopes5c)).toEqual('Mar' + ' >> ' + 'Mar');
});

test('validateScopeDefault - basic - fail for no match', function () {
  expect(validateScopeDefault(required, scopes6)).toEqual(false);
});

test('validateScopeDefault - providedScope is empty string', function () {
  expect(validateScopeDefault(required, scopesEmpty)).toEqual(false);
});
test('validateScopeDefault - providedScope is empty array', function () {
  expect(validateScopeDefault(required, [])).toEqual(false);
});
test('validateScopeDefault - requiredScope is empty array', function () {
  expect(validateScopeDefault([], scopes4)).toEqual(false);
});
test('validateScopeDefault - both inputs are empty arrays', function () {
  expect(validateScopeDefault([], [])).toEqual(false);
});

test('validateScopeBinsearch - one providedScope element', function () {
  expect(validateScopeBinsearch(required, scopes1.sort())).toEqual('Jan' + ' >> ' + 'Jan');
});
test('validateScopeBinsearch - many providedScope elements', function () {
  expect(validateScopeBinsearch(required, scopes2.sort())).toEqual('Jan' + ' >> ' + 'Jan');
});
test('validateScopeBinsearch - fail for missing', function () {
  expect(validateScopeBinsearch(required, scopes6.sort())).toEqual(false);
});

test('validateScopeBinsearch - providedScope is empty string', function () {
  expect(validateScopeBinsearch(required, scopesEmpty)).toEqual(false);
});
test('validateScopeBinsearch - providedScope is empty array', function () {
  expect(validateScopeBinsearch(required, [])).toEqual(false);
});
test('validateScopeBinsearch - requiredScope is empty array', function () {
  expect(validateScopeBinsearch([], scopes4)).toEqual(false);
});
test('validateScopeBinsearch - both inputs are empty arrays', function () {
  expect(validateScopeBinsearch([], [])).toEqual(false);
});

var wildcardRequired1 = `admin:view`.split(' ');
var wildcardRequired2 = `admin:view admin:list`.split(' ');
var wildcardRequired3 = `admin:view user:view`.split(' ');
var wildcardRequired4 = `user:view`.split(' ');

var wildcardScopes1 = `admin:list`.split(' ');
var wildcardScopes2 = `admin:*`.split(' ');
var wildcardScopes3 = `admin:* user:*`.split(' ');
var wildcardScopes4 = `admin:view user:*`.split(' ');
var wildcardScopes5 = `admin:list admin:view user:*`.split(' ');
var wildcardScopes6 = `user:* admin:view`.split(' ');

test('validateScopeWildcard - no match', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes1)).toEqual(false);
});
test('validateScopeWildcard - req1 - match only', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes2)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req1 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes3)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req1 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes4)).toEqual('admin:view' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req1 - match mid without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes5)).toEqual('admin:view' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req1 - match last passing wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired1, wildcardScopes6)).toEqual('admin:view' + ' >> ' + 'admin:view');
});

test('validateScopeWildcard - req2 - match only', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes1)).toEqual('admin:list' + ' >> ' + 'admin:list');
});
test('validateScopeWildcard - req2 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes2)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req2 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes3)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req2 - match first without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes4)).toEqual('admin:view' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req2 - match not first without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes5)).toEqual('admin:list' + ' >> ' + 'admin:list');
});
test('validateScopeWildcard - req2 - match last passing wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired2, wildcardScopes6)).toEqual('admin:view' + ' >> ' + 'admin:view');
});

test('validateScopeWildcard - req3 - fail first without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes1)).toEqual(false);
});
test('validateScopeWildcard - req3 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes2)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req3 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes3)).toEqual('admin:*' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req3 - match first without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes4)).toEqual('admin:view' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req3 - match not first without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes5)).toEqual('admin:view' + ' >> ' + 'admin:view');
});
test('validateScopeWildcard - req3 - match last with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired3, wildcardScopes6)).toEqual('user:*' + ' >> ' + 'user:view');
});
test('validateScopeWildcard - req4 - fail without wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes1)).toEqual(false);
});
test('validateScopeWildcard - req4 - fail with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes2)).toEqual(false);
});
test('validateScopeWildcard - req4 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes3)).toEqual('user:*' + ' >> ' + 'user:view');
});
test('validateScopeWildcard - req4 - match first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes4)).toEqual('user:*' + ' >> ' + 'user:view');
});
test('validateScopeWildcard - req4 - match not first with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes5)).toEqual('user:*' + ' >> ' + 'user:view');
});
test('validateScopeWildcard - req4 - match last with wildcard', function () {
  expect(validateScopeWildcard(wildcardRequired4, wildcardScopes6)).toEqual('user:*' + ' >> ' + 'user:view');
});

test('validateScopeWildcard - providedScope is empty string', function () {
  expect(validateScopeWildcard(wildcardRequired1, scopesEmpty)).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', function () {
  expect(validateScopeWildcard(wildcardRequired1, [])).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', function () {
  expect(validateScopeWildcard([], wildcardScopes1)).toEqual(false);
});
test('validateScopeWildcard - providedScope is empty string', function () {
  expect(validateScopeWildcard([], [])).toEqual(false);
});
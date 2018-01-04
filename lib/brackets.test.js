'use strict';

/* global test expect: true */

var _require = require('../src/brackets'),
    expandBrackets = _require.expandBrackets,
    expandScopeBrackets = _require.expandScopeBrackets;

var _require2 = require('../src/errors'),
    ParsingError = _require2.ParsingError;

/*
 *
 * expandScopeBrackets
 *
 */

test('falsy identities', function () {
  expect(expandBrackets(null)).toBe(null);
  expect(expandBrackets(undefined)).toBe(undefined);
});

test('identity for various special case strings', function () {
  expect(expandBrackets('')).toEqual(['']);
  expect(expandBrackets('bleepity:bloop/errrp')).toEqual(['bleepity:bloop/errrp']);
  expect(expandBrackets('[]')).toEqual(['']);
});

test('bad input', function () {
  function f(arg) {
    return function () {
      expandBrackets(arg);
    };
  }
  expect(f('[')).toThrowError(ParsingError);
  expect(f(']')).toThrowError(ParsingError);
  expect(f('][')).toThrowError(ParsingError);
  expect(f('[][')).toThrowError(ParsingError);
  expect(f('[]]')).toThrowError(ParsingError);
  expect(f('[]][')).toThrowError(ParsingError);
  expect(f('[[]')).toThrowError(ParsingError);
  expect(f('[]]')).toThrowError(ParsingError);
  expect(f('[[]]')).toThrowError(ParsingError);
});

var singleCasesA = [{ input: 'a[]', output: ['a'] }, { input: '[a]', output: ['a'] }, { input: '[]a', output: ['a'] }];
var singleCasesAB = [{ input: 'a[b]', output: ['ab'] }, { input: 'a[,b]', output: ['a', 'ab'] }, { input: 'a[b,]', output: ['ab', 'a'] }, { input: '[b]a', output: ['ba'] }, { input: '[,b]a', output: ['a', 'ba'] }, { input: '[b,]a', output: ['ba', 'a'] }];
var singleCasesABC = [{ input: 'a[b,c]', output: ['ab', 'ac'] }, { input: 'a[,b,c]', output: ['a', 'ab', 'ac'] }, { input: 'a[b,,c]', output: ['ab', 'a', 'ac'] }, { input: 'a[b,c,]', output: ['ab', 'ac', 'a'] }, { input: '[b,c]a', output: ['ba', 'ca'] }, { input: '[,b,c]a', output: ['a', 'ba', 'ca'] }, { input: '[b,,c]a', output: ['ba', 'a', 'ca'] }, { input: '[b,c,]a', output: ['ba', 'ca', 'a'] }];
var singleCasesABCD = [{ input: 'a[,b,c]d', output: ['ad', 'abd', 'acd'] }, { input: 'a[b,,c]d', output: ['abd', 'ad', 'acd'] }, { input: 'a[b,c,]d', output: ['abd', 'acd', 'ad'] }];

test('single bracket cases - A ', function () {
  for (var i = 0; i < singleCasesA.length; i += 1) {
    var c = singleCasesA[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - AB ', function () {
  for (var i = 0; i < singleCasesAB.length; i += 1) {
    var c = singleCasesAB[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - ABC ', function () {
  for (var i = 0; i < singleCasesABC.length; i += 1) {
    var c = singleCasesABC[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - ABCD ', function () {
  for (var i = 0; i < singleCasesABCD.length; i += 1) {
    var c = singleCasesABCD[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

var doubleCasesA = [{ input: 'a[][]', output: ['a'] }, { input: '[]a[]', output: ['a'] }, { input: '[][]a', output: ['a'] }, { input: '[][a]', output: ['a'] }, { input: '[a][]', output: ['a'] }];
var doubleCasesAB = [{ input: 'a[b][]', output: ['ab'] }, { input: 'a[][b]', output: ['ab'] }];
var doubleCasesABC = [{ input: 'a[b][c]', output: ['abc'] }, { input: '[a]b[c]', output: ['abc'] }, { input: '[a][b]c', output: ['abc'] }];
var doubleCasesABCD = [{ input: 'a[b][c,d]', output: ['abc', 'abd'] }, { input: 'a[b,c][d]', output: ['abd', 'acd'] }, { input: 'a[b,c][d,e]', output: ['abd', 'abe', 'acd', 'ace'] }, { input: '[b,c]a[d,e]', output: ['bad', 'bae', 'cad', 'cae'] }, { input: '[b,c][d,e]a', output: ['bda', 'bea', 'cda', 'cea'] }];

test('double bracket cases - A', function () {
  for (var i = 0; i < doubleCasesA.length; i += 1) {
    var c = doubleCasesA[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - AB', function () {
  for (var i = 0; i < doubleCasesAB.length; i += 1) {
    var c = doubleCasesAB[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - ABC', function () {
  for (var i = 0; i < doubleCasesABC.length; i += 1) {
    var c = doubleCasesABC[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - ABCD', function () {
  for (var i = 0; i < doubleCasesABCD.length; i += 1) {
    var c = doubleCasesABCD[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

/*
 *
 * expandScopeBrackets
 *
 */

test('tests for falsy values', function () {
  expect(expandScopeBrackets(null)).toBe(null);
  expect(expandScopeBrackets(undefined)).toBe(undefined);
});

test('tests special cases', function () {
  expect(expandScopeBrackets([])).toEqual([]);
});

test('tests plain string only input elements', function () {
  expect(expandScopeBrackets(['item'])).toEqual(['item']);
  expect(expandScopeBrackets(['item', 'item2'])).toEqual(['item', 'item2']);
  expect(expandScopeBrackets(['item', 'item2', 'item3'])).toEqual(['item', 'item2', 'item3']);
});
test('test multiple bracketed input elements', function () {
  expect(expandScopeBrackets(['', 'a', 'b[,c]', 'a[b,c]', 'a[b,c][d,e]'])).toEqual(['', 'a', 'b', 'bc', 'ab', 'ac', 'abd', 'abe', 'acd', 'ace']);
});
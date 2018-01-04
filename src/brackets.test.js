/* global test expect: true */

const { expandBrackets, expandScopeBrackets } = require('../src/brackets');
const { ParsingError } = require('../src/errors');

/*
 *
 * expandScopeBrackets
 *
 */

test('falsy identities', () => {
  expect(expandBrackets(null)).toBe(null);
  expect(expandBrackets(undefined)).toBe(undefined);
});

test('identity for various special case strings', () => {
  expect(expandBrackets('')).toEqual(['']);
  expect(expandBrackets('bleepity:bloop/errrp')).toEqual([
    'bleepity:bloop/errrp',
  ]);
  expect(expandBrackets('[]')).toEqual(['']);
});

test('bad input', () => {
  function f(arg) {
    return () => {
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

const singleCasesA = [
  { input: 'a[]', output: ['a'] },
  { input: '[a]', output: ['a'] },
  { input: '[]a', output: ['a'] },
];
const singleCasesAB = [
  { input: 'a[b]', output: ['ab'] },
  { input: 'a[,b]', output: ['a', 'ab'] },
  { input: 'a[b,]', output: ['ab', 'a'] },
  { input: '[b]a', output: ['ba'] },
  { input: '[,b]a', output: ['a', 'ba'] },
  { input: '[b,]a', output: ['ba', 'a'] },
];
const singleCasesABC = [
  { input: 'a[b,c]', output: ['ab', 'ac'] },
  { input: 'a[,b,c]', output: ['a', 'ab', 'ac'] },
  { input: 'a[b,,c]', output: ['ab', 'a', 'ac'] },
  { input: 'a[b,c,]', output: ['ab', 'ac', 'a'] },
  { input: '[b,c]a', output: ['ba', 'ca'] },
  { input: '[,b,c]a', output: ['a', 'ba', 'ca'] },
  { input: '[b,,c]a', output: ['ba', 'a', 'ca'] },
  { input: '[b,c,]a', output: ['ba', 'ca', 'a'] },
];
const singleCasesABCD = [
  { input: 'a[,b,c]d', output: ['ad', 'abd', 'acd'] },
  { input: 'a[b,,c]d', output: ['abd', 'ad', 'acd'] },
  { input: 'a[b,c,]d', output: ['abd', 'acd', 'ad'] },
];

test('single bracket cases - A ', () => {
  for (let i = 0; i < singleCasesA.length; i += 1) {
    let c = singleCasesA[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - AB ', () => {
  for (let i = 0; i < singleCasesAB.length; i += 1) {
    let c = singleCasesAB[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - ABC ', () => {
  for (let i = 0; i < singleCasesABC.length; i += 1) {
    let c = singleCasesABC[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('single bracket cases - ABCD ', () => {
  for (let i = 0; i < singleCasesABCD.length; i += 1) {
    let c = singleCasesABCD[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

const doubleCasesA = [
  { input: 'a[][]', output: ['a'] },
  { input: '[]a[]', output: ['a'] },
  { input: '[][]a', output: ['a'] },
  { input: '[][a]', output: ['a'] },
  { input: '[a][]', output: ['a'] },
];
const doubleCasesAB = [
  { input: 'a[b][]', output: ['ab'] },
  { input: 'a[][b]', output: ['ab'] },
];
const doubleCasesABC = [
  { input: 'a[b][c]', output: ['abc'] },
  { input: '[a]b[c]', output: ['abc'] },
  { input: '[a][b]c', output: ['abc'] },
];
const doubleCasesABCD = [
  { input: 'a[b][c,d]', output: ['abc', 'abd'] },
  { input: 'a[b,c][d]', output: ['abd', 'acd'] },
  { input: 'a[b,c][d,e]', output: ['abd', 'abe', 'acd', 'ace'] },
  { input: '[b,c]a[d,e]', output: ['bad', 'bae', 'cad', 'cae'] },
  { input: '[b,c][d,e]a', output: ['bda', 'bea', 'cda', 'cea'] },
];

test('double bracket cases - A', () => {
  for (let i = 0; i < doubleCasesA.length; i += 1) {
    let c = doubleCasesA[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - AB', () => {
  for (let i = 0; i < doubleCasesAB.length; i += 1) {
    let c = doubleCasesAB[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - ABC', () => {
  for (let i = 0; i < doubleCasesABC.length; i += 1) {
    let c = doubleCasesABC[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

test('double bracket cases - ABCD', () => {
  for (let i = 0; i < doubleCasesABCD.length; i += 1) {
    let c = doubleCasesABCD[i];
    expect(expandBrackets(c.input)).toEqual(c.output);
  }
});

/*
 *
 * expandScopeBrackets
 *
 */

test('tests for falsy values', () => {
  expect(expandScopeBrackets(null)).toBe(null);
  expect(expandScopeBrackets(undefined)).toBe(undefined);
});

test('tests special cases', () => {
  expect(expandScopeBrackets([])).toEqual([]);
});

test('tests plain string only input elements', () => {
  expect(expandScopeBrackets(['item'])).toEqual(['item']);
  expect(expandScopeBrackets(['item', 'item2'])).toEqual(['item', 'item2']);
  expect(expandScopeBrackets(['item', 'item2', 'item3'])).toEqual([
    'item',
    'item2',
    'item3',
  ]);
});
test('test multiple bracketed input elements', () => {
  expect(
    expandScopeBrackets(['', 'a', 'b[,c]', 'a[b,c]', 'a[b,c][d,e]']),
  ).toEqual(['', 'a', 'b', 'bc', 'ab', 'ac', 'abd', 'abe', 'acd', 'ace']);
});

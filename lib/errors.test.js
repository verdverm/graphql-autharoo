'use strict';

var _require = require('./errors'),
    ParsingError = _require.ParsingError,
    ContextError = _require.ContextError,
    AuthorizationError = _require.AuthorizationError;

test('tests and coverage for errors', function () {
  expect(function () {
    throw new ParsingError();
  }).toThrow(ParsingError);
  expect(function () {
    throw new ContextError();
  }).toThrow(ContextError);
  expect(function () {
    throw new AuthorizationError();
  }).toThrow(AuthorizationError);
});
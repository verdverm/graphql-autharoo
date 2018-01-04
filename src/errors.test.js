const { ParsingError, ContextError, AuthorizationError } = require('./errors');

test('tests and coverage for errors', () => {
  expect(() => {
    throw new ParsingError();
  }).toThrow(ParsingError);
  expect(() => {
    throw new ContextError();
  }).toThrow(ContextError);
  expect(() => {
    throw new AuthorizationError();
  }).toThrow(AuthorizationError);
});

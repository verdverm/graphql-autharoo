'use strict';

function ParsingError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[graphql-autharoo] - ParsingError';

  this.message = message;
  this.name = 'ParsingError';
}

function ContextError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[graphql-autharoo] - ContextError: Something is missing from the context object';

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  this.message = `${message} ${args}`;
  this.name = 'ContextError';
}

function AuthorizationError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Permission Denied.';

  this.message = message;
  this.name = 'AuthorizationError';
}

module.exports = {
  ParsingError,
  ContextError,
  AuthorizationError
};
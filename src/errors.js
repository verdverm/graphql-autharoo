function ParsingError(message = '[graphql-autharoo] - ParsingError') {
  this.message = message;
  this.name = 'ParsingError';
}

function ContextError(
  message = '[graphql-autharoo] - ContextError: Something is missing from the context object',
  ...args
) {
  this.message = `${message} ${args}`;
  this.name = 'ContextError';
}

function AuthorizationError(message = 'Permission Denied.') {
  this.message = message;
  this.name = 'AuthorizationError';
}

module.exports = {
  ParsingError,
  ContextError,
  AuthorizationError,
};

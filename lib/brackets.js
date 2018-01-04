'use strict';

var _require = require('./errors'),
    ParsingError = _require.ParsingError;

function expandBrackets(input) {
  if (!input && input !== '') {
    return input;
  }
  // base case
  if (!input.includes('[') || input === '') {
    var _rhp = input.indexOf(']');
    if (_rhp >= 0) {
      throw new ParsingError(`missing '[' for the ']' found at pos ${_rhp}.`);
    }
    return [input];
  }

  // expand brackets
  var lhp = input.indexOf('[');
  var rhp = input.indexOf(']');

  if (rhp === -1 || rhp < lhp) {
    throw new ParsingError(`'[' at pos: ${lhp} is missing its ']' friend.`);
  }

  // TODO manage nesting here

  var lhs = input.substring(0, lhp);
  var mstr = input.substring(lhp + 1, rhp);
  if (mstr.includes('[') || mstr.includes(']')) {
    throw new ParsingError('Nested brackets detected and are not supported yet.');
  }
  var mids = mstr.split(',');
  var rhs = input.substring(rhp + 1);

  // TODO test mids

  // Recursion !!
  rhs = expandBrackets(rhs);

  // interpolate the pieces
  var output = [];
  for (var m = 0; m < mids.length; m += 1) {
    var mid = mids[m];
    for (var r = 0; r < rhs.length; r += 1) {
      var rest = rhs[r];
      output.push(`${lhs}${mid}${rest}`);
    }
  }

  return output;
}

function expandScopeBrackets(scopes) {
  if (!scopes || !scopes.length || scopes.length == 0) {
    return scopes;
  }
  var expanded = [];
  for (var s = 0; s < scopes.length; s += 1) {
    var scope = scopes[s];
    var expansions = expandBrackets(scope);
    expanded = expanded.concat(expansions);
  }
  return expanded;
}

module.exports = {
  expandBrackets,
  expandScopeBrackets
};
const { ParsingError } = require('./errors');

function expandBrackets(input) {
  if (!input && input !== '') {
    return input;
  }
  // base case
  if (!input.includes('[') || input === '') {
    const rhp = input.indexOf(']');
    if (rhp >= 0) {
      throw new ParsingError(`missing '[' for the ']' found at pos ${rhp}.`);
    }
    return [input];
  }

  // expand brackets
  const lhp = input.indexOf('[');
  const rhp = input.indexOf(']');

  if (rhp === -1 || rhp < lhp) {
    throw new ParsingError(`'[' at pos: ${lhp} is missing its ']' friend.`);
  }

  // TODO manage nesting here

  const lhs = input.substring(0, lhp);
  const mstr = input.substring(lhp + 1, rhp);
  if (mstr.includes('[') || mstr.includes(']')) {
    throw new ParsingError(
      'Nested brackets detected and are not supported yet.',
    );
  }
  const mids = mstr.split(',');
  let rhs = input.substring(rhp + 1);

  // TODO test mids

  // Recursion !!
  rhs = expandBrackets(rhs);

  // interpolate the pieces
  const output = [];
  for (let m = 0; m < mids.length; m += 1) {
    const mid = mids[m];
    for (let r = 0; r < rhs.length; r += 1) {
      const rest = rhs[r];
      output.push(`${lhs}${mid}${rest}`);
    }
  }

  return output;
}

function expandScopeBrackets(scopes) {
  if (!scopes || !scopes.length || scopes.length == 0) {
    return scopes;
  }
  let expanded = [];
  for (let s = 0; s < scopes.length; s += 1) {
    const scope = scopes[s];
    const expansions = expandBrackets(scope);
    expanded = expanded.concat(expansions);
  }
  return expanded;
}

module.exports = {
  expandBrackets,
  expandScopeBrackets,
};

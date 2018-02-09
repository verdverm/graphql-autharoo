const { validateScope } = require('./validators');
const { ContextError, AuthorizationError } = require('./errors');

const authSwitch = (scopingList, options) => {
  if (!scopingList || scopingList.length == 0) {
    throw new Error('No scoping list provided to authSwitch');
  }

  // some validation
  scopingList.forEach(elem => {
    if (
      !elem.callback ||
      (typeof elem.callback !== 'function' && elem.callback !== 'next')
    ) {
      throw new Error('Scoping list element has no callback');
    }
  });

  const localScopings = scopingList;
  const opts = options ? options : {};

  return async function(_, __, context, info) {
    // check for the auth object on the context
    if (!context || !context.auth) return new ContextError();
    if (!context.auth.isAuthenticated)
      return new AuthorizationError('Not Authenticated!');

    // add the flattened path
    if (info) {
      let path = [];
      let ipath = info.path;
      while (ipath) {
        path.push(ipath.key);
        ipath = ipath.prev;
      }
      context.auth.path = path;
    }

    // loop ever scoping elements
    let pass = false;
    for (const scoping of localScopings) {
      // / some local vars
      let localRequiredScopes = scoping.requiredScopes;
      let localProvidedScopes = scoping.providedScopes;
      const localCallback = scoping.callback;

      // We've already passed validation, now the work is being passed down the line
      if (pass === 'next') {
        // hot potato
        if (localCallback === 'next') {
          continue;
        }

        // finally, drop into a callback and do some authenticated work
        // seems out of place considering all the checking happens next
        // see below for the initiation of this section of code
        return localCallback(_, __, context, info);
      }

      // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)
      if (localRequiredScopes && typeof localRequiredScopes === 'function') {
        // user the required Scope callback
        localRequiredScopes = await Promise.resolve().then(() =>
          localRequiredScopes(_, __, context, info),
        );
      }
      if (localProvidedScopes && typeof localProvidedScopes === 'function') {
        // user the required Scope callback
        localProvidedScopes = await Promise.resolve().then(() =>
          localProvidedScopes(_, __, context, info),
        );
      }

      // Check that there are requirements, but no scope provided
      const providedScopes = localProvidedScopes
        ? localProvidedScopes
        : context.auth.scopes;
      if (
        localRequiredScopes &&
        localRequiredScopes.length > 0 &&
        !providedScopes
      ) {
        continue;
      }

      // Now check validate the provided scopes against the required scopes
      //   returns false or a string. string can be deny, skip, or the successful scope matching
      pass = validateScope(localRequiredScopes, providedScopes, opts);
      if (pass) {
        // Stop immediately and return bad news
        if (pass === 'deny') {
          return new AuthorizationError();
        }

        // Do nothing and let the pipeline continue
        if (pass === 'skip') {
          pass = false;
          continue;
        }

        // We've passed go, now lets collect 200BTC
        context.auth.validation = pass;

        // leave it for the next guy
        if (localCallback === 'next') {
          pass = 'next';
          continue;
        }

        // or call our callback
        return localCallback(_, __, context, info);
      } // else, pass was false, which is the default, and we look at the next scoping
    } // End scoping loop

    // Otherwise, none of the mappings passed, so return authz error
    return new AuthorizationError();
  };
};

module.exports = {
  authSwitch,
};

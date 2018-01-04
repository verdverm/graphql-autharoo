const { validateScope } = require('./validators');
const { ContextError, AuthorizationError } = require('./errors');

const authBatching = (scopingList, options) => {
  // console.log("scopingList", scopingList, options)
  if (!scopingList || scopingList.length == 0) {
    throw new Error('No scoping list provided to authBatching');
  }

  // console.log("  validating")
  // some validation
  scopingList.forEach(elem => {
    // console.log(" - ", elem)
    if (!elem.providedScopes || typeof elem.providedScopes !== 'function') {
      // console.log("Scoping list element has no providedScopes", elem)
      throw new Error('Scoping list element has no providedScopes');
    }
    if (!elem.callback || typeof elem.callback !== 'function') {
      // console.log("Scoping list element has no callback", elem)
      throw new Error('Scoping list element has no callback');
    }
  });

  const localScopings = scopingList;
  const opts = options ? options : {};

  return async function(sources, args, context, info) {
    // check for the auth object on the context
    if (!context || !context.auth) return new ContextError();
    if (!context.auth.isAuthenticated)
      return new AuthorizationError('Not Authenticated!');

    // check sources conditions
    if (!sources || !sources.length) {
      return new Error(
        'Sources is incorrect, should be an array with at least one element.',
      );
    }

    // prep the final results buffer
    const finalResults = new Array(sources.length);
    finalResults.fill(null);

    // start the remaining sources with the original sources
    let remainingSources = sources.slice(0);

    // loop ever scoping elements
    for (const scoping of localScopings) {
      // console.log("=".repeat(30))
      // / some local vars
      let localRequiredScopes = scoping.requiredScopes;
      let localProvidedScopes = scoping.providedScopes;
      const localCallback = scoping.callback;

      // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)
      if (localRequiredScopes && typeof localRequiredScopes === 'function') {
        // use the supplied requiredScopes callback
        localRequiredScopes = await Promise.resolve().then(() =>
          localRequiredScopes(remainingSources, args, context, info),
        );
      }

      localProvidedScopes = await Promise.resolve().then(() =>
        localProvidedScopes(remainingSources, args, context, info),
      );

      // console.log("start source loop", localRequiredScopes, localProvidedScopes)

      // Now check validate the provided scopes against the required scopes
      //   returns false or a string. string can be deny, skip, or the successful scope matching
      const skippedSources = new Array(sources.length);
      const passedSources = new Array(sources.length);
      for (const sid in remainingSources) {
        const src = remainingSources[sid];

        // is there something at this element?
        if (!src) {
          skippedSources[sid] = null;
          passedSources[sid] = null;
          continue;
        }

        // This is where the actual validation happens, everything else is helper
        const pass = validateScope(
          localRequiredScopes,
          localProvidedScopes[sid],
          opts,
        );
        // console.log(" ? ", sid, src, pass)
        // So, did we validate and pass?
        if (pass) {
          // Immediately send some bad news to the final results
          if (pass === 'deny') {
            finalResults[sid] = new AuthorizationError();
            skippedSources[sid] = null;
            passedSources[sid] = null;
            continue;
          }

          // Do nothing and let the source pass down the pipeline
          if (pass === 'skip') {
            skippedSources[sid] = src;
            passedSources[sid] = null;
            continue;
          }

          // Else we're good
          skippedSources[sid] = null;
          passedSources[sid] = src;
        } else {
          skippedSources[sid] = src;
          passedSources[sid] = null;
        }
      }

      // TODO break out of scoping loop if no remaining sources
      remainingSources = skippedSources;

      // console.log("passedSources", passedSources)
      const passedResults = await localCallback(
        passedSources,
        args,
        context,
        info,
      );
      // console.log("passedResults", passedResults)

      for (const sid in passedResults) {
        if (passedResults[sid] && !finalResults[sid]) {
          // console.log(" + ", sid, passedResults[sid], finalResults[sid])
          finalResults[sid] = passedResults[sid];
        }
        // console.log(" - ", sid, passedResults[sid], finalResults[sid])
      }
      // console.log('loop final', localRequiredScopes, finalResults);
    } // End scoping loop

    // Any null results should have an AuthorizationError ?
    // console.log("-".repeat(30))
    // console.log('FINAL', finalResults);
    // console.log("-".repeat(30))

    let err = new AuthorizationError();
    for (let i = 0; i < finalResults.length; i += 1) {
      if (!finalResults[i]) {
        finalResults[i] = err;
      }
    }
    return finalResults;
  };
};

module.exports = {
  authBatching,
};

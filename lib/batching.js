'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./validators'),
    validateScope = _require.validateScope;

var _require2 = require('./errors'),
    ContextError = _require2.ContextError,
    AuthorizationError = _require2.AuthorizationError;

var authBatching = function authBatching(scopingList, options) {
  // console.log("scopingList", scopingList, options)
  if (!scopingList || scopingList.length == 0) {
    throw new Error('No scoping list provided to authBatching');
  }

  // console.log("  validating")
  // some validation
  scopingList.forEach(function (elem) {
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

  var localScopings = scopingList;
  var opts = options ? options : {};

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sources, args, context, info) {
      var _this = this;

      var finalResults, remainingSources, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, scoping, err, i;

      return regeneratorRuntime.wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!context || !context.auth)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', new ContextError());

            case 2:
              if (context.auth.isAuthenticated) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return', new AuthorizationError('Not Authenticated!'));

            case 4:
              if (!(!sources || !sources.length)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt('return', new Error('Sources is incorrect, should be an array with at least one element.'));

            case 6:

              // prep the final results buffer
              finalResults = new Array(sources.length);

              finalResults.fill(null);

              // start the remaining sources with the original sources
              remainingSources = sources.slice(0);

              // loop ever scoping elements

              _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(scoping) {
                var localRequiredScopes, localProvidedScopes, localCallback, skippedSources, passedSources, sid, src, pass, passedResults, _sid;

                return regeneratorRuntime.wrap(function _loop$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // console.log("=".repeat(30))
                        // / some local vars
                        localRequiredScopes = scoping.requiredScopes;
                        localProvidedScopes = scoping.providedScopes;
                        localCallback = scoping.callback;

                        // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)

                        if (!(localRequiredScopes && typeof localRequiredScopes === 'function')) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 6;
                        return Promise.resolve().then(function () {
                          return localRequiredScopes(remainingSources, args, context, info);
                        });

                      case 6:
                        localRequiredScopes = _context.sent;

                      case 7:
                        _context.next = 9;
                        return Promise.resolve().then(function () {
                          return localProvidedScopes(remainingSources, args, context, info);
                        });

                      case 9:
                        localProvidedScopes = _context.sent;


                        // console.log("start source loop", localRequiredScopes, localProvidedScopes)

                        // Now check validate the provided scopes against the required scopes
                        //   returns false or a string. string can be deny, skip, or the successful scope matching
                        skippedSources = new Array(sources.length);
                        passedSources = new Array(sources.length);
                        _context.t0 = regeneratorRuntime.keys(remainingSources);

                      case 13:
                        if ((_context.t1 = _context.t0()).done) {
                          _context.next = 39;
                          break;
                        }

                        sid = _context.t1.value;
                        src = remainingSources[sid];

                        // is there something at this element?

                        if (src) {
                          _context.next = 20;
                          break;
                        }

                        skippedSources[sid] = null;
                        passedSources[sid] = null;
                        return _context.abrupt('continue', 13);

                      case 20:

                        // This is where the actual validation happens, everything else is helper
                        pass = validateScope(localRequiredScopes, localProvidedScopes[sid], opts);
                        // console.log(" ? ", sid, src, pass)
                        // So, did we validate and pass?

                        if (!pass) {
                          _context.next = 35;
                          break;
                        }

                        if (!(pass === 'deny')) {
                          _context.next = 27;
                          break;
                        }

                        finalResults[sid] = new AuthorizationError();
                        skippedSources[sid] = null;
                        passedSources[sid] = null;
                        return _context.abrupt('continue', 13);

                      case 27:
                        if (!(pass === 'skip')) {
                          _context.next = 31;
                          break;
                        }

                        skippedSources[sid] = src;
                        passedSources[sid] = null;
                        return _context.abrupt('continue', 13);

                      case 31:

                        // Else we're good
                        skippedSources[sid] = null;
                        passedSources[sid] = src;
                        _context.next = 37;
                        break;

                      case 35:
                        skippedSources[sid] = src;
                        passedSources[sid] = null;

                      case 37:
                        _context.next = 13;
                        break;

                      case 39:

                        // TODO break out of scoping loop if no remaining sources
                        remainingSources = skippedSources;

                        // console.log("passedSources", passedSources)
                        _context.next = 42;
                        return localCallback(passedSources, args, context, info);

                      case 42:
                        passedResults = _context.sent;

                        // console.log("passedResults", passedResults)

                        for (_sid in passedResults) {
                          if (passedResults[_sid] && !finalResults[_sid]) {
                            // console.log(" + ", sid, passedResults[sid], finalResults[sid])
                            finalResults[_sid] = passedResults[_sid];
                          }
                          // console.log(" - ", sid, passedResults[sid], finalResults[sid])
                        }
                        // console.log('loop final', localRequiredScopes, finalResults);

                      case 44:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _loop, _this);
              });
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 13;
              _iterator = localScopings[Symbol.iterator]();

            case 15:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 21;
                break;
              }

              scoping = _step.value;
              return _context2.delegateYield(_loop(scoping), 't0', 18);

            case 18:
              _iteratorNormalCompletion = true;
              _context2.next = 15;
              break;

            case 21:
              _context2.next = 27;
              break;

            case 23:
              _context2.prev = 23;
              _context2.t1 = _context2['catch'](13);
              _didIteratorError = true;
              _iteratorError = _context2.t1;

            case 27:
              _context2.prev = 27;
              _context2.prev = 28;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 30:
              _context2.prev = 30;

              if (!_didIteratorError) {
                _context2.next = 33;
                break;
              }

              throw _iteratorError;

            case 33:
              return _context2.finish(30);

            case 34:
              return _context2.finish(27);

            case 35:
              // End scoping loop

              // Any null results should have an AuthorizationError ?
              // console.log("-".repeat(30))
              // console.log('FINAL', finalResults);
              // console.log("-".repeat(30))

              err = new AuthorizationError();

              for (i = 0; i < finalResults.length; i += 1) {
                if (!finalResults[i]) {
                  finalResults[i] = err;
                }
              }
              return _context2.abrupt('return', finalResults);

            case 38:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee, this, [[13, 23, 27, 35], [28,, 30, 34]]);
    }));

    return function (_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();
};

module.exports = {
  authBatching
};
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./validators'),
    validateScope = _require.validateScope;

var _require2 = require('./errors'),
    ContextError = _require2.ContextError,
    AuthorizationError = _require2.AuthorizationError;

var authSwitch = function authSwitch(scopingList, options) {
  if (!scopingList || scopingList.length == 0) {
    throw new Error('No scoping list provided to authSwitch');
  }

  // some validation
  scopingList.forEach(function (elem) {
    if (!elem.callback || typeof elem.callback !== 'function' && elem.callback !== 'next') {
      throw new Error('Scoping list element has no callback');
    }
  });

  var localScopings = scopingList;
  var opts = options ? options : {};

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, __, context, info) {
      var _this = this;

      var pass, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, scoping, _ret;

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

              // loop ever scoping elements
              pass = false;
              _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(scoping) {
                var localRequiredScopes, localProvidedScopes, localCallback, providedScopes;
                return regeneratorRuntime.wrap(function _loop$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // / some local vars
                        localRequiredScopes = scoping.requiredScopes;
                        localProvidedScopes = scoping.providedScopes;
                        localCallback = scoping.callback;

                        // We've already passed validation, now the work is being passed down the line

                        if (!(pass === 'next')) {
                          _context.next = 7;
                          break;
                        }

                        if (!(localCallback === 'next')) {
                          _context.next = 6;
                          break;
                        }

                        return _context.abrupt('return', 'continue');

                      case 6:
                        return _context.abrupt('return', {
                          v: localCallback(_, __, context, info)
                        });

                      case 7:
                        if (!(localRequiredScopes && typeof localRequiredScopes === 'function')) {
                          _context.next = 11;
                          break;
                        }

                        _context.next = 10;
                        return Promise.resolve().then(function () {
                          return localRequiredScopes(_, __, context, info);
                        });

                      case 10:
                        localRequiredScopes = _context.sent;

                      case 11:
                        if (!(localProvidedScopes && typeof localProvidedScopes === 'function')) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 14;
                        return Promise.resolve().then(function () {
                          return localProvidedScopes(_, __, context, info);
                        });

                      case 14:
                        localProvidedScopes = _context.sent;

                      case 15:

                        // Check that there are requirements, but no scope provided
                        providedScopes = localProvidedScopes ? localProvidedScopes : context.auth.scopes;

                        if (!(localRequiredScopes && localRequiredScopes.length > 0 && !providedScopes)) {
                          _context.next = 18;
                          break;
                        }

                        return _context.abrupt('return', 'continue');

                      case 18:

                        // Now check validate the provided scopes against the required scopes
                        //   returns false or a string. string can be deny, skip, or the successful scope matching
                        pass = validateScope(localRequiredScopes, providedScopes, opts);

                        if (!pass) {
                          _context.next = 30;
                          break;
                        }

                        if (!(pass === 'deny')) {
                          _context.next = 22;
                          break;
                        }

                        return _context.abrupt('return', {
                          v: new AuthorizationError()
                        });

                      case 22:
                        if (!(pass === 'skip')) {
                          _context.next = 25;
                          break;
                        }

                        pass = false;
                        return _context.abrupt('return', 'continue');

                      case 25:

                        // We've passed go, now lets collect 200BTC
                        context.auth.validation = pass;

                        // leave it for the next guy

                        if (!(localCallback === 'next')) {
                          _context.next = 29;
                          break;
                        }

                        pass = 'next';
                        return _context.abrupt('return', 'continue');

                      case 29:
                        return _context.abrupt('return', {
                          v: localCallback(_, __, context, info)
                        });

                      case 30:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _loop, _this);
              });
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 9;
              _iterator = localScopings[Symbol.iterator]();

            case 11:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 24;
                break;
              }

              scoping = _step.value;
              return _context2.delegateYield(_loop(scoping), 't0', 14);

            case 14:
              _ret = _context2.t0;
              _context2.t1 = _ret;
              _context2.next = _context2.t1 === 'continue' ? 18 : 19;
              break;

            case 18:
              return _context2.abrupt('continue', 21);

            case 19:
              if (!(typeof _ret === "object")) {
                _context2.next = 21;
                break;
              }

              return _context2.abrupt('return', _ret.v);

            case 21:
              _iteratorNormalCompletion = true;
              _context2.next = 11;
              break;

            case 24:
              _context2.next = 30;
              break;

            case 26:
              _context2.prev = 26;
              _context2.t2 = _context2['catch'](9);
              _didIteratorError = true;
              _iteratorError = _context2.t2;

            case 30:
              _context2.prev = 30;
              _context2.prev = 31;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 33:
              _context2.prev = 33;

              if (!_didIteratorError) {
                _context2.next = 36;
                break;
              }

              throw _iteratorError;

            case 36:
              return _context2.finish(33);

            case 37:
              return _context2.finish(30);

            case 38:
              return _context2.abrupt('return', new AuthorizationError());

            case 39:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee, this, [[9, 26, 30, 38], [31,, 33, 37]]);
    }));

    return function (_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();
};

module.exports = {
  authSwitch
};
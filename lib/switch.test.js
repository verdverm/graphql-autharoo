'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./errors'),
    ContextError = _require.ContextError,
    AuthorizationError = _require.AuthorizationError;

var _require2 = require('./switch'),
    authSwitch = _require2.authSwitch;

test('tests authSwitch bad input', function () {
  function uhoh() {
    authSwitch(null)(null, null, null, null);
  }
  function empty() {
    authSwitch([])(null, null, null, null);
  }

  expect(uhoh).toThrow('No scoping list provided to authSwitch');
  expect(empty).toThrow('No scoping list provided to authSwitch');

  var badResolver = [{
    requiredScopes: ['user:view'],
    providedScopes: ['user:view']
  }];
  function badCall() {
    authSwitch(badResolver)(null, null, null, null);
  }
  expect(badCall).toThrow('Scoping list element has no callback');
});

test('test authSwitch basics', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var resolvers1, resolvers2, resolvers3, resolvers4, resolvers5, resolvers6, resolvers7, context, opts, scopeless;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          resolvers1 = [{
            requiredScopes: ['user:view'],
            providedScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers2 = [{
            requiredScopes: [],
            providedScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers3 = [{
            requiredScopes: [],
            providedScopes: [],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers4 = [{
            requiredScopes: ['user:view'],
            providedScopes: [],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers5 = [{
            requiredScopes: ['admin:view'],
            providedScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers6 = [{
            requiredScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          resolvers7 = [{
            requiredScopes: ['user:[view,list]'],
            providedScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          context = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view']
            }
          };
          opts = {
            expandRequired: true
          };
          scopeless = {
            auth: {
              isAuthenticated: true
            }
          };
          _context.t0 = expect;
          _context.next = 13;
          return authSwitch(resolvers1)({}, {}, context);

        case 13:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toEqual('success');
          _context.t2 = expect;
          _context.next = 18;
          return authSwitch(resolvers2)({}, {}, context);

        case 18:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toEqual('success');
          _context.t4 = expect;
          _context.next = 23;
          return authSwitch(resolvers3)({}, {}, context);

        case 23:
          _context.t5 = _context.sent;
          (0, _context.t4)(_context.t5).toEqual('success');
          _context.t6 = expect;
          _context.next = 28;
          return authSwitch(resolvers4)({}, {}, context);

        case 28:
          _context.t7 = _context.sent;
          _context.t8 = new AuthorizationError();
          (0, _context.t6)(_context.t7).toEqual(_context.t8);
          _context.t9 = expect;
          _context.next = 34;
          return authSwitch(resolvers5)({}, {}, context);

        case 34:
          _context.t10 = _context.sent;
          _context.t11 = new AuthorizationError();
          (0, _context.t9)(_context.t10).toEqual(_context.t11);
          _context.t12 = expect;
          _context.next = 40;
          return authSwitch(resolvers6)({}, {}, context);

        case 40:
          _context.t13 = _context.sent;
          (0, _context.t12)(_context.t13).toEqual('success');
          _context.t14 = expect;
          _context.next = 45;
          return authSwitch(resolvers6)({}, {}, scopeless);

        case 45:
          _context.t15 = _context.sent;
          _context.t16 = new AuthorizationError();
          (0, _context.t14)(_context.t15).toEqual(_context.t16);
          _context.t17 = expect;
          _context.next = 51;
          return authSwitch(resolvers7, opts)({}, {}, context);

        case 51:
          _context.t18 = _context.sent;
          (0, _context.t17)(_context.t18).toEqual('success');

        case 53:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

test('test authSwitch multi', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var resolvers1, resolvers2, resolvers3, superContext, adminContext, userContext, emptyContext, opts, optS;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          resolvers1 = [{
            requiredScopes: ['admin:view'],
            callback: function callback() {
              return 'success admin';
            }
          }, {
            requiredScopes: ['user:view'],
            callback: function callback() {
              return 'success user';
            }
          }, {
            requiredScopes: [],
            callback: function callback() {
              return 'success default';
            }
          }];
          resolvers2 = [{
            requiredScopes: ['admin:view'],
            callback: function callback() {
              return 'success admin';
            }
          }, {
            requiredScopes: ['user:view'],
            callback: function callback() {
              return 'success user';
            }
          }];
          resolvers3 = [{
            requiredScopes: ['[admin,user]:update'],
            callback: function callback() {
              return 'success admin';
            }
          }, {
            requiredScopes: ['user/self:update'],
            callback: function callback() {
              return 'success user';
            }
          }];
          superContext = {
            auth: {
              isAuthenticated: true,
              scopes: ['admin:*']
            }
          };
          adminContext = {
            auth: {
              isAuthenticated: true,
              scopes: ['admin:view', 'user:update']
            }
          };
          userContext = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view', 'user/self:update']
            }
          };
          emptyContext = {
            auth: {
              isAuthenticated: true,
              scopes: ['cant:do:shit']
            }
          };
          opts = {
            expandRequired: true
          };
          optS = {
            expandRequired: true,
            validator: 'wildcard-i-love-trump'
          };
          _context2.t0 = expect;
          _context2.next = 12;
          return authSwitch(resolvers1, optS)({}, {}, superContext);

        case 12:
          _context2.t1 = _context2.sent;
          (0, _context2.t0)(_context2.t1).toEqual('success admin');
          _context2.t2 = expect;
          _context2.next = 17;
          return authSwitch(resolvers1)({}, {}, adminContext);

        case 17:
          _context2.t3 = _context2.sent;
          (0, _context2.t2)(_context2.t3).toEqual('success admin');
          _context2.t4 = expect;
          _context2.next = 22;
          return authSwitch(resolvers1)({}, {}, userContext);

        case 22:
          _context2.t5 = _context2.sent;
          (0, _context2.t4)(_context2.t5).toEqual('success user');
          _context2.t6 = expect;
          _context2.next = 27;
          return authSwitch(resolvers1)({}, {}, emptyContext);

        case 27:
          _context2.t7 = _context2.sent;
          (0, _context2.t6)(_context2.t7).toEqual('success default');
          _context2.t8 = expect;
          _context2.next = 32;
          return authSwitch(resolvers2, optS)({}, {}, superContext);

        case 32:
          _context2.t9 = _context2.sent;
          (0, _context2.t8)(_context2.t9).toEqual('success admin');
          _context2.t10 = expect;
          _context2.next = 37;
          return authSwitch(resolvers2)({}, {}, adminContext);

        case 37:
          _context2.t11 = _context2.sent;
          (0, _context2.t10)(_context2.t11).toEqual('success admin');
          _context2.t12 = expect;
          _context2.next = 42;
          return authSwitch(resolvers2)({}, {}, userContext);

        case 42:
          _context2.t13 = _context2.sent;
          (0, _context2.t12)(_context2.t13).toEqual('success user');
          _context2.t14 = expect;
          _context2.next = 47;
          return authSwitch(resolvers2)({}, {}, emptyContext);

        case 47:
          _context2.t15 = _context2.sent;
          _context2.t16 = new AuthorizationError();
          (0, _context2.t14)(_context2.t15).toEqual(_context2.t16);
          _context2.t17 = expect;
          _context2.next = 53;
          return authSwitch(resolvers3, optS)({}, {}, superContext);

        case 53:
          _context2.t18 = _context2.sent;
          (0, _context2.t17)(_context2.t18).toEqual('success admin');
          _context2.t19 = expect;
          _context2.next = 58;
          return authSwitch(resolvers3, opts)({}, {}, adminContext);

        case 58:
          _context2.t20 = _context2.sent;
          (0, _context2.t19)(_context2.t20).toEqual('success admin');
          _context2.t21 = expect;
          _context2.next = 63;
          return authSwitch(resolvers3, opts)({}, {}, userContext);

        case 63:
          _context2.t22 = _context2.sent;
          (0, _context2.t21)(_context2.t22).toEqual('success user');
          _context2.t23 = expect;
          _context2.next = 68;
          return authSwitch(resolvers3, opts)({}, {}, emptyContext);

        case 68:
          _context2.t24 = _context2.sent;
          _context2.t25 = new AuthorizationError();
          (0, _context2.t23)(_context2.t24).toEqual(_context2.t25);

        case 71:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
})));

test('tests authSwitch context null context', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
  var resolvers, swtch, e1, e2, e3;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          resolvers = [{
            requiredScopes: ['user:view'],
            providedScopes: ['user:view'],
            callback: function callback() {
              return 'success';
            }
          }];
          swtch = authSwitch(resolvers);
          _context3.next = 4;
          return swtch({}, {}, null, {});

        case 4:
          e1 = _context3.sent;

          expect(e1).toEqual(new ContextError());

          _context3.next = 8;
          return swtch({}, {}, {}, {});

        case 8:
          e2 = _context3.sent;

          expect(e2).toEqual(new ContextError());

          _context3.next = 12;
          return swtch({}, {}, { auth: {} }, {});

        case 12:
          e3 = _context3.sent;

          expect(e3).toEqual(new AuthorizationError('Not Authenticated!'));

        case 14:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, undefined);
})));

test('test authSwitch scope callbacks', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  var resolvers, fallbackToAuthScopes, context;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          resolvers = [{
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return 'success';
            }
          }];
          fallbackToAuthScopes = [{
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return null;
            },
            callback: function callback() {
              return 'success';
            }
          }];
          context = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view']
            }
          };
          _context4.t0 = expect;
          _context4.next = 6;
          return authSwitch(resolvers)({}, {}, context, {});

        case 6:
          _context4.t1 = _context4.sent;
          (0, _context4.t0)(_context4.t1).toEqual('success');
          _context4.t2 = expect;
          _context4.next = 11;
          return authSwitch(fallbackToAuthScopes)({}, {}, context, {});

        case 11:
          _context4.t3 = _context4.sent;
          (0, _context4.t2)(_context4.t3).toEqual('success');

        case 13:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, undefined);
})));

test('test authSwitch requiredScope special case - skip', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
  var skip1, skip2, context;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          skip1 = [{
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return "shouldn't get here";
            }
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return 'success';
            }
          }];
          skip2 = [{
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return "shouldn't get here";
            }
          }, {
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return "shouldn't get here";
            }
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return 'success';
            }
          }];
          context = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view']
            }
          };
          _context5.t0 = expect;
          _context5.next = 6;
          return authSwitch(skip1)({}, {}, context, {});

        case 6:
          _context5.t1 = _context5.sent;
          (0, _context5.t0)(_context5.t1).toEqual('success');
          _context5.t2 = expect;
          _context5.next = 11;
          return authSwitch(skip2)({}, {}, context, {});

        case 11:
          _context5.t3 = _context5.sent;
          (0, _context5.t2)(_context5.t3).toEqual('success');

        case 13:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, undefined);
})));

test('test authSwitch requiredScope special case - deny', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
  var deny, context;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          deny = [{
            requiredScopes: function requiredScopes() {
              return ['deny'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return "shouldn't get here";
            }
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return "shouldn't reach success";
            }
          }];
          context = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view']
            }
          };
          _context6.t0 = expect;
          _context6.next = 5;
          return authSwitch(deny)({}, {}, context, {});

        case 5:
          _context6.t1 = _context6.sent;
          _context6.t2 = new AuthorizationError();
          (0, _context6.t0)(_context6.t1).toEqual(_context6.t2);

        case 8:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, undefined);
})));

test('test authSwitch requiredScope special case - next', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
  var next1, next2, context;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          next1 = [{
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: 'next'
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return 'success';
            }
          }];
          next2 = [{
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: 'next'
          }, {
            requiredScopes: function requiredScopes() {
              return ['admin:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: 'next'
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: function providedScopes() {
              return ['user:view'];
            },
            callback: function callback() {
              return 'success';
            }
          }];
          context = {
            auth: {
              isAuthenticated: true,
              scopes: ['user:view']
            }
          };
          _context7.t0 = expect;
          _context7.next = 6;
          return authSwitch(next1)({}, {}, context, {});

        case 6:
          _context7.t1 = _context7.sent;
          (0, _context7.t0)(_context7.t1).toEqual('success');
          _context7.t2 = expect;
          _context7.next = 11;
          return authSwitch(next2)({}, {}, context, {});

        case 11:
          _context7.t3 = _context7.sent;
          (0, _context7.t2)(_context7.t3).toEqual('success');

        case 13:
        case 'end':
          return _context7.stop();
      }
    }
  }, _callee7, undefined);
})));
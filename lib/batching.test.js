'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./errors'),
    ContextError = _require.ContextError,
    AuthorizationError = _require.AuthorizationError;

var _require2 = require('./switch'),
    authSwitch = _require2.authSwitch;

var _require3 = require('./batching'),
    authBatching = _require3.authBatching;

var _require4 = require('./batch-test-data'),
    data = _require4.data;

var id = function id(e) {
  return e && e.id === 0;
};
var mem = function mem(e) {
  return e && e.id % 2 === 0;
};
var pub = function pub(e) {
  return e && e.private === false;
};

// return the auth scopes for every element
var adminProvided = function adminProvided(sources, _, context) {
  var ret = new Array(sources.length);
  ret.fill(context.auth.scopes);
  return ret;
};
// return the auth scope when a property has a value
var idProvided = function idProvided(sources, _, context) {
  return sources.map(function (elem) {
    return id(elem) ? context.auth.scopes : [];
  });
};
// something like membership?
var memberProvided = function memberProvided(sources, _, context) {
  return sources.map(function (elem) {
    return mem(elem) ? context.auth.scopes : [];
  });
};
// public things
var publicProvided = function publicProvided(sources, _, context) {
  return sources.map(function (elem) {
    return pub(elem) ? context.auth.scopes : [];
  });
};
// return a bunch of empty requireds
var nothingProvided = function nothingProvided(sources) {
  return sources.map(function () {
    return [];
  });
};

// return all of the sources, they've already been filtered and this is not likely the full list
var allCallback = function allCallback(sources) {
  return sources;
};
var allError = function allError(sources) {
  var ret = new Array(sources.length);
  ret.fill(new AuthorizationError());
  return ret;
};
// only return elements which are public
var memberCallback = function memberCallback(sources) {
  return sources.map(function (elem) {
    return mem(elem) ? elem : null;
  });
};
var publicCallback = function publicCallback(sources) {
  return sources.map(function (elem) {
    return pub(elem) ? elem : null;
  });
};

var publicMemberCallback = function publicMemberCallback(sources) {
  return sources.map(function (elem) {
    return pub(elem) || mem(elem) ? elem : null;
  });
};

var allResults = data;
var idResults = data.map(function (elem) {
  return id(elem) ? elem : new AuthorizationError();
});
var memberResults = data.map(function (elem) {
  return mem(elem) ? elem : new AuthorizationError();
});
var publicResults = data.map(function (elem) {
  return pub(elem) ? elem : new AuthorizationError();
});
var memberIdResults = data.map(function (elem) {
  return mem(elem) || id(elem) ? elem : new AuthorizationError();
});
var publicIdResults = data.map(function (elem) {
  return pub(elem) || id(elem) ? elem : new AuthorizationError();
});
var publicMemberResults = data.map(function (elem) {
  return pub(elem) || mem(elem) ? elem : new AuthorizationError();
});
var publicMemberIdResults = data.map(function (elem) {
  return pub(elem) || mem(elem) || id(elem) ? elem : new AuthorizationError();
});
var noResults = new Array(data.length).fill(new AuthorizationError());

var scopings = [{
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  providedScopes: nothingProvided,
  callback: function callback() {
    return "shouldn't reach here";
  }
}];

// because paired with noScopeContext
var badScopingNoProvided = [{
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  callback: allCallback
}];

var badScopingNoCallback = [{
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  providedScopes: nothingProvided
}];

var adminContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['admin:view', 'admin:list', 'user:update]']
  }
};

var userContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['user:view', 'user:list', 'user:self:update']
  }
};

var emptyContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['cant:do:shit']
  }
};

var resolvers1 = [{
  requiredScopes: ['admin:view'],
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: idProvided,
  callback: allCallback
}, {
  requiredScopes: [],
  providedScopes: nothingProvided,
  callback: publicCallback
}];

var resolvers2 = [{
  requiredScopes: ['admin:view'],
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: idProvided,
  callback: allCallback
}];

var resolvers3 = [{
  requiredScopes: ['admin:view'],
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: memberProvided,
  callback: allCallback
}, {
  requiredScopes: [],
  providedScopes: nothingProvided,
  callback: publicCallback
}];

var resolvers4 = [{
  requiredScopes: ['admin:view'],
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: memberProvided,
  callback: allCallback
}];

var resolvers5 = [{
  requiredScopes: ['admin:view'],
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: memberProvided,
  callback: allCallback
}, {
  requiredScopes: ['user:view'],
  providedScopes: idProvided,
  callback: allCallback
}];

var resolvers6 = [{
  requiredScopes: function requiredScopes() {
    return ['admin:view'];
  },
  providedScopes: adminProvided,
  callback: allCallback
}, {
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  providedScopes: memberProvided,
  callback: allCallback
}, {
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  providedScopes: idProvided,
  callback: allCallback
}, {
  requiredScopes: function requiredScopes() {
    return ['user:view'];
  },
  providedScopes: publicProvided,
  callback: allCallback
}];

var opts = {
  expandRequired: true
};

test('tests authBatching bad input', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var uhoh, empty, badCall1, badCall2, fn;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          badCall2 = function badCall2() {
            authBatching(badScopingNoCallback)(null, null, null, null);
          };

          badCall1 = function badCall1() {
            authBatching(badScopingNoProvided)(null, null, null, null);
          };

          empty = function empty() {
            authBatching([])(null, null, null, null);
          };

          uhoh = function uhoh() {
            authBatching(null)(null, null, null, null);
          };

          expect(uhoh).toThrow('No scoping list provided to authBatching');
          expect(empty).toThrow('No scoping list provided to authBatching');

          expect(badCall1).toThrow('Scoping list element has no providedScopes');

          expect(badCall2).toThrow('Scoping list element has no callback');

          _context.t0 = expect;
          _context.next = 11;
          return authBatching(scopings)({}, {}, null, {});

        case 11:
          _context.t1 = _context.sent;
          _context.t2 = new ContextError();
          (0, _context.t0)(_context.t1).toEqual(_context.t2);
          _context.t3 = expect;
          _context.next = 17;
          return authBatching(scopings)({}, {}, {}, {});

        case 17:
          _context.t4 = _context.sent;
          _context.t5 = new ContextError();
          (0, _context.t3)(_context.t4).toEqual(_context.t5);
          _context.t6 = expect;
          _context.next = 23;
          return authBatching(scopings)({}, {}, { auth: {} }, {});

        case 23:
          _context.t7 = _context.sent;
          _context.t8 = new AuthorizationError('Not Authenticated!');
          (0, _context.t6)(_context.t7).toEqual(_context.t8);
          fn = authBatching(scopings);
          _context.t9 = expect;
          _context.next = 30;
          return fn(null, {}, userContext, {});

        case 30:
          _context.t10 = _context.sent;
          _context.t11 = new Error('Sources is incorrect, should be an array with at least one element.');
          (0, _context.t9)(_context.t10).toEqual(_context.t11);
          _context.t12 = expect;
          _context.next = 36;
          return fn({}, {}, userContext, {});

        case 36:
          _context.t13 = _context.sent;
          _context.t14 = new Error('Sources is incorrect, should be an array with at least one element.');
          (0, _context.t12)(_context.t13).toEqual(_context.t14);
          _context.t15 = expect;
          _context.next = 42;
          return fn([], {}, userContext, {});

        case 42:
          _context.t16 = _context.sent;
          _context.t17 = new Error('Sources is incorrect, should be an array with at least one element.');
          (0, _context.t15)(_context.t16).toEqual(_context.t17);

        case 45:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

test('test authBatching variation', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = expect;
          _context2.next = 3;
          return authBatching(resolvers1)(data, {}, adminContext);

        case 3:
          _context2.t1 = _context2.sent;
          _context2.t2 = allResults;
          (0, _context2.t0)(_context2.t1).toEqual(_context2.t2);
          _context2.t3 = expect;
          _context2.next = 9;
          return authBatching(resolvers1)(data, {}, userContext);

        case 9:
          _context2.t4 = _context2.sent;
          _context2.t5 = publicIdResults;
          (0, _context2.t3)(_context2.t4).toEqual(_context2.t5);
          _context2.t6 = expect;
          _context2.next = 15;
          return authBatching(resolvers1)(data, {}, emptyContext);

        case 15:
          _context2.t7 = _context2.sent;
          _context2.t8 = publicResults;
          (0, _context2.t6)(_context2.t7).toEqual(_context2.t8);
          _context2.t9 = expect;
          _context2.next = 21;
          return authBatching(resolvers2)(data, {}, adminContext);

        case 21:
          _context2.t10 = _context2.sent;
          _context2.t11 = allResults;
          (0, _context2.t9)(_context2.t10).toEqual(_context2.t11);
          _context2.t12 = expect;
          _context2.next = 27;
          return authBatching(resolvers2)(data, {}, userContext);

        case 27:
          _context2.t13 = _context2.sent;
          _context2.t14 = idResults;
          (0, _context2.t12)(_context2.t13).toEqual(_context2.t14);
          _context2.t15 = expect;
          _context2.next = 33;
          return authBatching(resolvers2)(data, {}, emptyContext);

        case 33:
          _context2.t16 = _context2.sent;
          _context2.t17 = noResults;
          (0, _context2.t15)(_context2.t16).toEqual(_context2.t17);
          _context2.t18 = expect;
          _context2.next = 39;
          return authBatching(resolvers3)(data, {}, adminContext);

        case 39:
          _context2.t19 = _context2.sent;
          _context2.t20 = allResults;
          (0, _context2.t18)(_context2.t19).toEqual(_context2.t20);
          _context2.t21 = expect;
          _context2.next = 45;
          return authBatching(resolvers3)(data, {}, userContext);

        case 45:
          _context2.t22 = _context2.sent;
          _context2.t23 = publicMemberResults;
          (0, _context2.t21)(_context2.t22).toEqual(_context2.t23);
          _context2.t24 = expect;
          _context2.next = 51;
          return authBatching(resolvers3)(data, {}, emptyContext);

        case 51:
          _context2.t25 = _context2.sent;
          _context2.t26 = publicResults;
          (0, _context2.t24)(_context2.t25).toEqual(_context2.t26);
          _context2.t27 = expect;
          _context2.next = 57;
          return authBatching(resolvers4)(data, {}, adminContext);

        case 57:
          _context2.t28 = _context2.sent;
          _context2.t29 = allResults;
          (0, _context2.t27)(_context2.t28).toEqual(_context2.t29);
          _context2.t30 = expect;
          _context2.next = 63;
          return authBatching(resolvers4)(data, {}, userContext);

        case 63:
          _context2.t31 = _context2.sent;
          _context2.t32 = memberResults;
          (0, _context2.t30)(_context2.t31).toEqual(_context2.t32);
          _context2.t33 = expect;
          _context2.next = 69;
          return authBatching(resolvers4)(data, {}, emptyContext);

        case 69:
          _context2.t34 = _context2.sent;
          _context2.t35 = noResults;
          (0, _context2.t33)(_context2.t34).toEqual(_context2.t35);
          _context2.t36 = expect;
          _context2.next = 75;
          return authBatching(resolvers5)(data, {}, adminContext);

        case 75:
          _context2.t37 = _context2.sent;
          _context2.t38 = allResults;
          (0, _context2.t36)(_context2.t37).toEqual(_context2.t38);
          _context2.t39 = expect;
          _context2.next = 81;
          return authBatching(resolvers5)(data, {}, userContext);

        case 81:
          _context2.t40 = _context2.sent;
          _context2.t41 = memberIdResults;
          (0, _context2.t39)(_context2.t40).toEqual(_context2.t41);
          _context2.t42 = expect;
          _context2.next = 87;
          return authBatching(resolvers5)(data, {}, emptyContext);

        case 87:
          _context2.t43 = _context2.sent;
          _context2.t44 = noResults;
          (0, _context2.t42)(_context2.t43).toEqual(_context2.t44);
          _context2.t45 = expect;
          _context2.next = 93;
          return authBatching(resolvers6)(data, {}, adminContext);

        case 93:
          _context2.t46 = _context2.sent;
          _context2.t47 = allResults;
          (0, _context2.t45)(_context2.t46).toEqual(_context2.t47);
          _context2.t48 = expect;
          _context2.next = 99;
          return authBatching(resolvers6)(data, {}, userContext);

        case 99:
          _context2.t49 = _context2.sent;
          _context2.t50 = publicMemberIdResults;
          (0, _context2.t48)(_context2.t49).toEqual(_context2.t50);
          _context2.t51 = expect;
          _context2.next = 105;
          return authBatching(resolvers6)(data, {}, emptyContext);

        case 105:
          _context2.t52 = _context2.sent;
          _context2.t53 = noResults;
          (0, _context2.t51)(_context2.t52).toEqual(_context2.t53);

        case 108:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
})));

test('test authBatching nested', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
  var switchResolver, batchResolver, batchResolver2;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // TODO write actual test, these are dummies

          switchResolver = [{
            requiredScopes: ['admin:view'],
            callback: allCallback
          }, {
            requiredScopes: ['user:view'],
            callback: authBatching(resolvers5)
          }, {
            requiredScopes: [],
            callback: allError
          }];
          _context3.t0 = expect;
          _context3.next = 4;
          return authSwitch(switchResolver)(data, {}, adminContext);

        case 4:
          _context3.t1 = _context3.sent;
          _context3.t2 = allResults;
          (0, _context3.t0)(_context3.t1).toEqual(_context3.t2);
          _context3.t3 = expect;
          _context3.next = 10;
          return authSwitch(switchResolver)(data, {}, userContext);

        case 10:
          _context3.t4 = _context3.sent;
          _context3.t5 = memberIdResults;
          (0, _context3.t3)(_context3.t4).toEqual(_context3.t5);
          _context3.t6 = expect;
          _context3.next = 16;
          return authSwitch(switchResolver)(data, {}, emptyContext);

        case 16:
          _context3.t7 = _context3.sent;
          _context3.t8 = noResults;
          (0, _context3.t6)(_context3.t7).toEqual(_context3.t8);
          batchResolver = [{
            // shortcut for admins to avoid the authBatching process
            requiredScopes: ['admin:view'],
            providedScopes: adminProvided,
            callback: allCallback
          }, {
            // let everything in that isn't admin, and filter batch
            requiredScopes: [],
            providedScopes: nothingProvided,
            callback: authSwitch([{
              requiredScopes: ['user:view'],
              callback: publicMemberCallback
            }, {
              requiredScopes: [],
              callback: publicCallback
            }])
          }];
          _context3.t9 = expect;
          _context3.next = 23;
          return authBatching(batchResolver)(data, {}, adminContext);

        case 23:
          _context3.t10 = _context3.sent;
          _context3.t11 = allResults;
          (0, _context3.t9)(_context3.t10).toEqual(_context3.t11);
          _context3.t12 = expect;
          _context3.next = 29;
          return authBatching(batchResolver)(data, {}, userContext);

        case 29:
          _context3.t13 = _context3.sent;
          _context3.t14 = publicMemberResults;
          (0, _context3.t12)(_context3.t13).toEqual(_context3.t14);
          _context3.t15 = expect;
          _context3.next = 35;
          return authBatching(batchResolver)(data, {}, emptyContext);

        case 35:
          _context3.t16 = _context3.sent;
          _context3.t17 = publicResults;
          (0, _context3.t15)(_context3.t16).toEqual(_context3.t17);
          batchResolver2 = [{
            // shortcut for admins to avoid the authBatching process
            requiredScopes: ['admin:view'],
            providedScopes: adminProvided,
            callback: allCallback
          }, {
            // let everything in that isn't admin, and filter batch
            requiredScopes: [],
            providedScopes: nothingProvided,
            callback: authSwitch([{
              requiredScopes: ['user:view'],
              callback: memberCallback
            }, {
              requiredScopes: [],
              callback: allError
            }])
          }];
          _context3.t18 = expect;
          _context3.next = 42;
          return authBatching(batchResolver2)(data, {}, adminContext);

        case 42:
          _context3.t19 = _context3.sent;
          _context3.t20 = allResults;
          (0, _context3.t18)(_context3.t19).toEqual(_context3.t20);
          _context3.t21 = expect;
          _context3.next = 48;
          return authBatching(batchResolver2)(data, {}, userContext);

        case 48:
          _context3.t22 = _context3.sent;
          _context3.t23 = memberResults;
          (0, _context3.t21)(_context3.t22).toEqual(_context3.t23);
          _context3.t24 = expect;
          _context3.next = 54;
          return authBatching(batchResolver2)(data, {}, emptyContext);

        case 54:
          _context3.t25 = _context3.sent;
          _context3.t26 = noResults;
          (0, _context3.t24)(_context3.t25).toEqual(_context3.t26);

        case 57:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, undefined);
})));

test('test authBatching requiredScope special case - skip', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  var skip1, skip2;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          skip1 = [{
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: nothingProvided,
            callback: allCallback
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: publicProvided,
            callback: publicCallback
          }];
          skip2 = [{
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: nothingProvided,
            callback: allCallback
          }, {
            requiredScopes: function requiredScopes() {
              return ['skip'];
            },
            providedScopes: memberProvided,
            callback: allCallback
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: memberProvided,
            callback: allCallback
          }];
          _context4.t0 = expect;
          _context4.next = 5;
          return authBatching(skip1)(data, {}, userContext, {});

        case 5:
          _context4.t1 = _context4.sent;
          _context4.t2 = publicResults;
          (0, _context4.t0)(_context4.t1).toEqual(_context4.t2);
          _context4.t3 = expect;
          _context4.next = 11;
          return authBatching(skip2)(data, {}, userContext, {});

        case 11:
          _context4.t4 = _context4.sent;
          _context4.t5 = memberResults;
          (0, _context4.t3)(_context4.t4).toEqual(_context4.t5);

        case 14:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, undefined);
})));

test('test authBatching requiredScope special case - deny', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
  var deny;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          deny = [{
            requiredScopes: function requiredScopes() {
              return ['deny'];
            },
            providedScopes: nothingProvided,
            callback: allCallback
          }, {
            requiredScopes: function requiredScopes() {
              return ['user:view'];
            },
            providedScopes: memberProvided,
            callback: allCallback
          }];
          _context5.t0 = expect;
          _context5.next = 4;
          return authBatching(deny, opts)(data, {}, userContext, {});

        case 4:
          _context5.t1 = _context5.sent;
          _context5.t2 = noResults;
          (0, _context5.t0)(_context5.t1).toEqual(_context5.t2);

        case 7:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, undefined);
})));
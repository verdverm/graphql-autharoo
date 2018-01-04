const { ContextError, AuthorizationError } = require('./errors');
const { authSwitch } = require('./switch');
const { authBatching } = require('./batching');

const { data } = require('./batch-test-data');

const id = e => e && e.id === 0;
const mem = e => e && e.id % 2 === 0;
const pub = e => e && e.private === false;

// return the auth scopes for every element
const adminProvided = (sources, _, context) => {
  let ret = new Array(sources.length);
  ret.fill(context.auth.scopes);
  return ret;
};
// return the auth scope when a property has a value
const idProvided = (sources, _, context) => {
  return sources.map(elem => (id(elem) ? context.auth.scopes : []));
};
// something like membership?
const memberProvided = (sources, _, context) => {
  return sources.map(elem => (mem(elem) ? context.auth.scopes : []));
};
// public things
const publicProvided = (sources, _, context) => {
  return sources.map(elem => (pub(elem) ? context.auth.scopes : []));
};
// return a bunch of empty requireds
const nothingProvided = sources => sources.map(() => []);

// return all of the sources, they've already been filtered and this is not likely the full list
const allCallback = sources => {
  return sources;
};
const allError = sources => {
  let ret = new Array(sources.length);
  ret.fill(new AuthorizationError());
  return ret;
};
// only return elements which are public
const memberCallback = sources => {
  return sources.map(elem => (mem(elem) ? elem : null));
};
const publicCallback = sources => {
  return sources.map(elem => (pub(elem) ? elem : null));
};

const publicMemberCallback = sources => {
  return sources.map(elem => (pub(elem) || mem(elem) ? elem : null));
};

const allResults = data;
const idResults = data.map(
  elem => (id(elem) ? elem : new AuthorizationError()),
);
const memberResults = data.map(
  elem => (mem(elem) ? elem : new AuthorizationError()),
);
const publicResults = data.map(
  elem => (pub(elem) ? elem : new AuthorizationError()),
);
const memberIdResults = data.map(
  elem => (mem(elem) || id(elem) ? elem : new AuthorizationError()),
);
const publicIdResults = data.map(
  elem => (pub(elem) || id(elem) ? elem : new AuthorizationError()),
);
const publicMemberResults = data.map(
  elem => (pub(elem) || mem(elem) ? elem : new AuthorizationError()),
);
const publicMemberIdResults = data.map(
  elem =>
    pub(elem) || mem(elem) || id(elem) ? elem : new AuthorizationError(),
);
const noResults = new Array(data.length).fill(new AuthorizationError());

const scopings = [
  {
    requiredScopes: () => ['user:view'],
    providedScopes: nothingProvided,
    callback: () => {
      return "shouldn't reach here";
    },
  },
];

// because paired with noScopeContext
const badScopingNoProvided = [
  {
    requiredScopes: () => ['user:view'],
    callback: allCallback,
  },
];

const badScopingNoCallback = [
  {
    requiredScopes: () => ['user:view'],
    providedScopes: nothingProvided,
  },
];

const adminContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['admin:view', 'admin:list', 'user:update]'],
  },
};

const userContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['user:view', 'user:list', 'user:self:update'],
  },
};

const emptyContext = {
  auth: {
    isAuthenticated: true,
    scopes: ['cant:do:shit'],
  },
};

const resolvers1 = [
  {
    requiredScopes: ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: idProvided,
    callback: allCallback,
  },
  {
    requiredScopes: [],
    providedScopes: nothingProvided,
    callback: publicCallback,
  },
];

const resolvers2 = [
  {
    requiredScopes: ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: idProvided,
    callback: allCallback,
  },
];

const resolvers3 = [
  {
    requiredScopes: ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: memberProvided,
    callback: allCallback,
  },
  {
    requiredScopes: [],
    providedScopes: nothingProvided,
    callback: publicCallback,
  },
];

const resolvers4 = [
  {
    requiredScopes: ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: memberProvided,
    callback: allCallback,
  },
];

const resolvers5 = [
  {
    requiredScopes: ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: memberProvided,
    callback: allCallback,
  },
  {
    requiredScopes: ['user:view'],
    providedScopes: idProvided,
    callback: allCallback,
  },
];

const resolvers6 = [
  {
    requiredScopes: () => ['admin:view'],
    providedScopes: adminProvided,
    callback: allCallback,
  },
  {
    requiredScopes: () => ['user:view'],
    providedScopes: memberProvided,
    callback: allCallback,
  },
  {
    requiredScopes: () => ['user:view'],
    providedScopes: idProvided,
    callback: allCallback,
  },
  {
    requiredScopes: () => ['user:view'],
    providedScopes: publicProvided,
    callback: allCallback,
  },
];

const opts = {
  expandRequired: true,
};

test('tests authBatching bad input', async () => {
  function uhoh() {
    authBatching(null)(null, null, null, null);
  }
  function empty() {
    authBatching([])(null, null, null, null);
  }

  expect(uhoh).toThrow('No scoping list provided to authBatching');
  expect(empty).toThrow('No scoping list provided to authBatching');

  function badCall1() {
    authBatching(badScopingNoProvided)(null, null, null, null);
  }
  expect(badCall1).toThrow('Scoping list element has no providedScopes');

  function badCall2() {
    authBatching(badScopingNoCallback)(null, null, null, null);
  }
  expect(badCall2).toThrow('Scoping list element has no callback');

  expect(await authBatching(scopings)({}, {}, null, {})).toEqual(
    new ContextError(),
  );
  expect(await authBatching(scopings)({}, {}, {}, {})).toEqual(
    new ContextError(),
  );
  expect(await authBatching(scopings)({}, {}, { auth: {} }, {})).toEqual(
    new AuthorizationError('Not Authenticated!'),
  );

  const fn = authBatching(scopings);

  expect(await fn(null, {}, userContext, {})).toEqual(
    new Error(
      'Sources is incorrect, should be an array with at least one element.',
    ),
  );
  expect(await fn({}, {}, userContext, {})).toEqual(
    new Error(
      'Sources is incorrect, should be an array with at least one element.',
    ),
  );
  expect(await fn([], {}, userContext, {})).toEqual(
    new Error(
      'Sources is incorrect, should be an array with at least one element.',
    ),
  );
});

test('test authBatching variation', async () => {
  expect(await authBatching(resolvers1)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers1)(data, {}, userContext)).toEqual(
    publicIdResults,
  );
  expect(await authBatching(resolvers1)(data, {}, emptyContext)).toEqual(
    publicResults,
  );

  expect(await authBatching(resolvers2)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers2)(data, {}, userContext)).toEqual(
    idResults,
  );
  expect(await authBatching(resolvers2)(data, {}, emptyContext)).toEqual(
    noResults,
  );

  expect(await authBatching(resolvers3)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers3)(data, {}, userContext)).toEqual(
    publicMemberResults,
  );
  expect(await authBatching(resolvers3)(data, {}, emptyContext)).toEqual(
    publicResults,
  );

  expect(await authBatching(resolvers4)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers4)(data, {}, userContext)).toEqual(
    memberResults,
  );
  expect(await authBatching(resolvers4)(data, {}, emptyContext)).toEqual(
    noResults,
  );

  expect(await authBatching(resolvers5)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers5)(data, {}, userContext)).toEqual(
    memberIdResults,
  );
  expect(await authBatching(resolvers5)(data, {}, emptyContext)).toEqual(
    noResults,
  );

  expect(await authBatching(resolvers6)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(resolvers6)(data, {}, userContext)).toEqual(
    publicMemberIdResults,
  );
  expect(await authBatching(resolvers6)(data, {}, emptyContext)).toEqual(
    noResults,
  );
});

test('test authBatching nested', async () => {
  // TODO write actual test, these are dummies

  const switchResolver = [
    {
      requiredScopes: ['admin:view'],
      callback: allCallback,
    },
    {
      requiredScopes: ['user:view'],
      callback: authBatching(resolvers5),
    },
    {
      requiredScopes: [],
      callback: allError,
    },
  ];

  expect(await authSwitch(switchResolver)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authSwitch(switchResolver)(data, {}, userContext)).toEqual(
    memberIdResults,
  );
  expect(await authSwitch(switchResolver)(data, {}, emptyContext)).toEqual(
    noResults,
  );

  const batchResolver = [
    {
      // shortcut for admins to avoid the authBatching process
      requiredScopes: ['admin:view'],
      providedScopes: adminProvided,
      callback: allCallback,
    },
    {
      // let everything in that isn't admin, and filter batch
      requiredScopes: [],
      providedScopes: nothingProvided,
      callback: authSwitch([
        {
          requiredScopes: ['user:view'],
          callback: publicMemberCallback,
        },
        {
          requiredScopes: [],
          callback: publicCallback,
        },
      ]),
    },
  ];

  expect(await authBatching(batchResolver)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(batchResolver)(data, {}, userContext)).toEqual(
    publicMemberResults,
  );
  expect(await authBatching(batchResolver)(data, {}, emptyContext)).toEqual(
    publicResults,
  );

  const batchResolver2 = [
    {
      // shortcut for admins to avoid the authBatching process
      requiredScopes: ['admin:view'],
      providedScopes: adminProvided,
      callback: allCallback,
    },
    {
      // let everything in that isn't admin, and filter batch
      requiredScopes: [],
      providedScopes: nothingProvided,
      callback: authSwitch([
        {
          requiredScopes: ['user:view'],
          callback: memberCallback,
        },
        {
          requiredScopes: [],
          callback: allError,
        },
      ]),
    },
  ];

  expect(await authBatching(batchResolver2)(data, {}, adminContext)).toEqual(
    allResults,
  );
  expect(await authBatching(batchResolver2)(data, {}, userContext)).toEqual(
    memberResults,
  );
  expect(await authBatching(batchResolver2)(data, {}, emptyContext)).toEqual(
    noResults,
  );
});

test('test authBatching requiredScope special case - skip', async () => {
  const skip1 = [
    {
      requiredScopes: () => ['skip'],
      providedScopes: nothingProvided,
      callback: allCallback,
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: publicProvided,
      callback: publicCallback,
    },
  ];

  const skip2 = [
    {
      requiredScopes: () => ['skip'],
      providedScopes: nothingProvided,
      callback: allCallback,
    },
    {
      requiredScopes: () => ['skip'],
      providedScopes: memberProvided,
      callback: allCallback,
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: memberProvided,
      callback: allCallback,
    },
  ];

  expect(await authBatching(skip1)(data, {}, userContext, {})).toEqual(
    publicResults,
  );
  expect(await authBatching(skip2)(data, {}, userContext, {})).toEqual(
    memberResults,
  );
});

test('test authBatching requiredScope special case - deny', async () => {
  const deny = [
    {
      requiredScopes: () => ['deny'],
      providedScopes: nothingProvided,
      callback: allCallback,
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: memberProvided,
      callback: allCallback,
    },
  ];

  expect(await authBatching(deny, opts)(data, {}, userContext, {})).toEqual(
    noResults,
  );
});

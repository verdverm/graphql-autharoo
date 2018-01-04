const { ContextError, AuthorizationError } = require('./errors');
const { authSwitch } = require('./switch');

test('tests authSwitch bad input', () => {
  function uhoh() {
    authSwitch(null)(null, null, null, null);
  }
  function empty() {
    authSwitch([])(null, null, null, null);
  }

  expect(uhoh).toThrow('No scoping list provided to authSwitch');
  expect(empty).toThrow('No scoping list provided to authSwitch');

  const badResolver = [
    {
      requiredScopes: ['user:view'],
      providedScopes: ['user:view'],
    },
  ];
  function badCall() {
    authSwitch(badResolver)(null, null, null, null);
  }
  expect(badCall).toThrow('Scoping list element has no callback');
});

test('test authSwitch basics', async () => {
  const resolvers1 = [
    {
      requiredScopes: ['user:view'],
      providedScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers2 = [
    {
      requiredScopes: [],
      providedScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers3 = [
    {
      requiredScopes: [],
      providedScopes: [],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers4 = [
    {
      requiredScopes: ['user:view'],
      providedScopes: [],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers5 = [
    {
      requiredScopes: ['admin:view'],
      providedScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers6 = [
    {
      requiredScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const resolvers7 = [
    {
      requiredScopes: ['user:[view,list]'],
      providedScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const context = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view'],
    },
  };

  const opts = {
    expandRequired: true,
  };

  const scopeless = {
    auth: {
      isAuthenticated: true,
    },
  };

  expect(await authSwitch(resolvers1)({}, {}, context)).toEqual('success');
  expect(await authSwitch(resolvers2)({}, {}, context)).toEqual('success');
  expect(await authSwitch(resolvers3)({}, {}, context)).toEqual('success');
  expect(await authSwitch(resolvers4)({}, {}, context)).toEqual(
    new AuthorizationError(),
  );
  expect(await authSwitch(resolvers5)({}, {}, context)).toEqual(
    new AuthorizationError(),
  );

  expect(await authSwitch(resolvers6)({}, {}, context)).toEqual('success');
  expect(await authSwitch(resolvers6)({}, {}, scopeless)).toEqual(
    new AuthorizationError(),
  );

  expect(await authSwitch(resolvers7, opts)({}, {}, context)).toEqual(
    'success',
  );
});

test('test authSwitch multi', async () => {
  const resolvers1 = [
    {
      requiredScopes: ['admin:view'],
      callback: () => {
        return 'success admin';
      },
    },
    {
      requiredScopes: ['user:view'],
      callback: () => {
        return 'success user';
      },
    },
    {
      requiredScopes: [],
      callback: () => {
        return 'success default';
      },
    },
  ];

  const resolvers2 = [
    {
      requiredScopes: ['admin:view'],
      callback: () => {
        return 'success admin';
      },
    },
    {
      requiredScopes: ['user:view'],
      callback: () => {
        return 'success user';
      },
    },
  ];

  const resolvers3 = [
    {
      requiredScopes: ['[admin,user]:update'],
      callback: () => {
        return 'success admin';
      },
    },
    {
      requiredScopes: ['user/self:update'],
      callback: () => {
        return 'success user';
      },
    },
  ];

  const superContext = {
    auth: {
      isAuthenticated: true,
      scopes: ['admin:*'],
    },
  };

  const adminContext = {
    auth: {
      isAuthenticated: true,
      scopes: ['admin:view', 'user:update'],
    },
  };

  const userContext = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view', 'user/self:update'],
    },
  };

  const emptyContext = {
    auth: {
      isAuthenticated: true,
      scopes: ['cant:do:shit'],
    },
  };

  const opts = {
    expandRequired: true,
  };

  const optS = {
    expandRequired: true,
    validator: 'wildcard-i-love-trump',
  };

  expect(await authSwitch(resolvers1, optS)({}, {}, superContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers1)({}, {}, adminContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers1)({}, {}, userContext)).toEqual(
    'success user',
  );
  expect(await authSwitch(resolvers1)({}, {}, emptyContext)).toEqual(
    'success default',
  );

  expect(await authSwitch(resolvers2, optS)({}, {}, superContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers2)({}, {}, adminContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers2)({}, {}, userContext)).toEqual(
    'success user',
  );
  expect(await authSwitch(resolvers2)({}, {}, emptyContext)).toEqual(
    new AuthorizationError(),
  );

  expect(await authSwitch(resolvers3, optS)({}, {}, superContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers3, opts)({}, {}, adminContext)).toEqual(
    'success admin',
  );
  expect(await authSwitch(resolvers3, opts)({}, {}, userContext)).toEqual(
    'success user',
  );
  expect(await authSwitch(resolvers3, opts)({}, {}, emptyContext)).toEqual(
    new AuthorizationError(),
  );
});

test('tests authSwitch context null context', async () => {
  const resolvers = [
    {
      requiredScopes: ['user:view'],
      providedScopes: ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];
  let swtch = authSwitch(resolvers);

  let e1 = await swtch({}, {}, null, {});
  expect(e1).toEqual(new ContextError());

  let e2 = await swtch({}, {}, {}, {});
  expect(e2).toEqual(new ContextError());

  let e3 = await swtch({}, {}, { auth: {} }, {});
  expect(e3).toEqual(new AuthorizationError('Not Authenticated!'));
});

test('test authSwitch scope callbacks', async () => {
  const resolvers = [
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];
  const fallbackToAuthScopes = [
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => null,
      callback: () => {
        return 'success';
      },
    },
  ];

  const context = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view'],
    },
  };

  expect(await authSwitch(resolvers)({}, {}, context, {})).toEqual('success');
  expect(await authSwitch(fallbackToAuthScopes)({}, {}, context, {})).toEqual(
    'success',
  );
});

test('test authSwitch requiredScope special case - skip', async () => {
  const skip1 = [
    {
      requiredScopes: () => ['skip'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return "shouldn't get here";
      },
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const skip2 = [
    {
      requiredScopes: () => ['skip'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return "shouldn't get here";
      },
    },
    {
      requiredScopes: () => ['skip'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return "shouldn't get here";
      },
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const context = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view'],
    },
  };

  expect(await authSwitch(skip1)({}, {}, context, {})).toEqual('success');
  expect(await authSwitch(skip2)({}, {}, context, {})).toEqual('success');
});

test('test authSwitch requiredScope special case - deny', async () => {
  const deny = [
    {
      requiredScopes: () => ['deny'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return "shouldn't get here";
      },
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return "shouldn't reach success";
      },
    },
  ];

  const context = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view'],
    },
  };

  expect(await authSwitch(deny)({}, {}, context, {})).toEqual(
    new AuthorizationError(),
  );
});

test('test authSwitch requiredScope special case - next', async () => {
  const next1 = [
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: 'next',
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const next2 = [
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: 'next',
    },
    {
      requiredScopes: () => ['admin:view'],
      providedScopes: () => ['user:view'],
      callback: 'next',
    },
    {
      requiredScopes: () => ['user:view'],
      providedScopes: () => ['user:view'],
      callback: () => {
        return 'success';
      },
    },
  ];

  const context = {
    auth: {
      isAuthenticated: true,
      scopes: ['user:view'],
    },
  };

  expect(await authSwitch(next1)({}, {}, context, {})).toEqual('success');
  expect(await authSwitch(next2)({}, {}, context, {})).toEqual('success');
});

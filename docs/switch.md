# authSwitch


`authSwitch` process a GraphQL resolver request by sequentially
checking the required and provided scopes.
When passing conditions are found, the callback is executed.


## Spec

signature: `authSwitch(scopeChain, options)`

returns: `async function(sources, args, context, info)`


```
// setup the resolver chain
const resolverChain = [

  // Some admin only area
  {
    requiredScopes: ['admin:[list,view]'],
    // providedScopes: by default looks for a 'context.auth.scopes' array of strings.
    callback: () => {
      return "success admin"
    }
  },

  // A second scoping for user viewing
  {
    requiredScopes: ['user:list' 'user:view'],
    providedScopes: (sources, args, context, info) => {
      // need to return an array of strings
      return context.auth.userScopes.find(args.id)
    },
    callback: () => {
      return "success user"
    }
  },

  // Default
  {
    requiredScopes: [],
    callback: () => {
      return "success default"
    }
  }

  // If a request falls through, it will get an 'AuthorizationError'
  // The empty bracket clause means that will never happen
])

const options = {
  expandRequired: true
}

// use authSwitch to handle a GraphQL request
// you need to pass the context because it is used internally (see wishlist)

const results = await authSwitch(resolverChain, options)(sources, args, context, info);
```


### Context Object

If no `providedScopes` are provided, then `authSwitch`
looks for a `auth` object on the resolvers context object.
It should have two fields, `isAuthenticated` and `scopes`.

`isAuthuthenticated` is required.
There is an open issue to make this configurable.

`scopes` is any list of strings and should match the permission scheme you use.
There is an open issue to allow permissions to be objects, in addition to the current string implmentation.

```
{
  auth: {
    isAuthenticated: [true/false],
    scopes: ['public:view', 'user:[view,list]', 'self:[view,update,delete]'] },
};
```

## Scope Chain Examples



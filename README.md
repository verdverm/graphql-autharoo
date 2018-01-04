# graphql-autharoo

Authorization helpers for graphql resolvers.

This library will help you handle contextual authorization needs
in your graphql queries, mutations, type and batch resolvers.
At its core, it provides multiplexing and filtering capabilities
for resolving data based on the request, context, and permissions.

Features:

- `authSwitch` helper for selecting the data handler given the context.
- `authBatching` helper for batch resolvers and efficient filtering and resolution of data.
- Flexible `requiredScopes` and `providedScopes` for dynamic permissioning of objects.
- Multiple validators for supporting a wide range of permissions schemes and formats.
- Authentication check prior to authorization and permissions validation.
- All pieces are configurable and pluggable for your specific use cases.
- Passing all tests with 100% code coverage and zero dependencies.

See the full [documentation](./docs) for the details.

### Install

`npm install graphql-autharoo` or `yarn add graphql-autharoo`

`import { authSwitch, authBatching } from 'graphql-autharoo';`

### Examples

##### authSwitch

`authSwitch` process a request by sequentially
checking the required and provided scopes.
When passing conditions are found, the callback is executed.

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


##### authBatching

`authBatching` is designed for handling authorization with batch request processors
like `dataloader` and `graphql-resolve-batch`.
It has nearly identical signature and operation,
sequentially process a request through the scopings like `authSwitch`.
The difference is that the source elements are progressively
authorized, filtered, fulfilled, and reassembled on your behalf.
As the sources move through the chain:

For each stage in the chain:

- Loop ever the remaining source elements
  - Check and filter
    - When the pass authz, they are gathered for the callback
    - When the fail, they are sent directly to the final results with an authz error
    - It they don't pass or aren't denied, they are saved for the next stage
  - Send the passing elements to the callback
    - The callback recieves the partial, filterd sources list.
    - The callback needs to return an array of the same length
    - The output needs to be aligned with the input, ie. the input and output positions in the array should be the same.
  - Get results from the callback
    - Stitch the results into the final results
  - Make the skipped sources the remaining sources and move to the next resolver in the chain

- Any source item making it through all of the stages will get the `AuthorizationError`
- Finally, return the final results aligned to the original source order


signature: `authBatching(scopeChain, options)`

returns: `async function(sources, args, context, info)`

```
const resolverChain = [
  {
    // Admins only
    requiredScopes: () => ['admin:view'],
    // a reusable scope extractor, needs to return an array of arrays of strings (permission list per source element)
    providedScopes: adminProvided,   
    // a reusable callback that returns all matches for sources
    callback: allCallback            
  },
  {
    // Group members only
    requiredScopes: () => ['group:member'],
    // a reusable scope extractor for membership
    providedScopes: memberProvided,  
    // we can almost always return everything because the filtering already happened
    callback: allCallback            
  },
  {
    // User only view
    requiredScopes: () => ['user:view'],
    // a reusable scope extractor for ids
    providedScopes: idProvided,
    // again, return something for every source, what that is is up to you
    callback: allCallback
  },
  {
    // empty brackets mean pass everything, unless unauthenticated
    requiredScopes: () => [],        
    // returns and array of empty arrays the same length as sources
    providedScopes: nothingProvided, 
    // A reusable callback which returns only things with public settings
    callback: publicCallback         
  }

  // Any element of the sources which makes it this far will
  // receive the 'AuthorizationError'
]

```




##### Nesting

Yup, it's definitely turtles from here on down.

```
const switchResolver = [

  // Admin can see everything, so shortcut
  {
    requiredScopes: ['admin:view'],
    callback: (sources) => sources
  },

  // User view, now get more granular
  { 
    requiredScopes: ['user:view'],
    callback: authBatching([
      {
        // only group members
        requiredScopes: ['group:member:view'],
        // return the user scopes per source
        providedScopes: (sources, _, context) => sources.map(s => s.isUserAMember(context.user.id) ? context.auth.scopes : []),
        callback: (sources) => sources
      },
      
      // default - public groups only
      {
        // pass everyting through
        requiredScopes: [],
        // pass everyting through
        providedScopes: (sources) => sources.map(s => []),
        // only return public results
        callback: (sources) => sources.map(s => s.isPublic ? s : null)
      }
    ])
  },

  // No auth, no results
  {
    requiredScopes: [],
    callback: (sources) => sources.map(s => new AuthorizationError())
  }
]

```

### Wishlist

- examples, you can find some here: https://github.com/sysgears/apollo-universal-starter-kit/tree/auth-upgrades
- dataloader integration (maybe just needs to be verified?)
- make the authentication stage configurable
- make expansion callback configurable
- better permission string procession
  - remove no whitespace requirement (easy)
  - nested bracket expansion (easyish)
  - enable variable interpolation (???)
- enable premissions to be objects



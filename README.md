# graphql-autharoo

[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg)](https://github.com/verdverm/graphql-autharoo)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://github.com/verdverm/graphql-autharoo)
[![codecov](https://codecov.io/gh/verdverm/graphql-autharoo/branch/master/graph/badge.svg)](https://codecov.io/gh/verdverm/graphql-autharoo)
[![npm](https://img.shields.io/npm/dw/localeval.svg)](https://github.com/verdverm/graphql-autharoo)
[![Sourcegraph for Repo Reference Count](https://img.shields.io/sourcegraph/rrc/github.com/gorilla/mux.svg)](https://github.com/verdverm/graphql-autharoo)

[![GitHub issues by-label](https://img.shields.io/github/issues/badges/shields/help%20wanted.svg)](https://github.com/verdverm/graphql-autharoo/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![GitHub issues by-label](https://img.shields.io/github/issues/badges/shields/good%20first%20issue.svg)](https://github.com/verdverm/graphql-autharoo/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

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

## Install

```
npm install graphql-autharoo

or 

yarn add graphql-autharoo


and then

import { authSwitch, authBatching } from 'graphql-autharoo';
```

## Examples

### authSwitch

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


### authBatching

`authBatching` is designed for handling authorization with batch request processors
like `dataloader` and `graphql-resolve-batch`.
It has nearly identical signature and operation,
sequentially process a request through the scopings like `authSwitch`.
The difference is that the source elements are progressively
authorized, filtered, fulfilled, and reassembled on your behalf.


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




### Nesting

Yup, it's definitely [turtles from here on down](https://github.com/verdverm/discworld).

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

## Wishlist

- examples, you can find some here: https://github.com/sysgears/apollo-universal-starter-kit/tree/auth-upgrades
- dataloader integration (maybe just needs to be verified?)
- make the authentication stage configurable
- make expansion callback configurable
- better permission string processiny
  - remove no whitespace requirement (easy)
  - nested bracket expansion (easyish)
  - enable variable interpolation (???)
- enable premissions to be objects

Happy Auth'n!



# Documentation

Welcome to the `graphql-autharoo` documentation.

Please let us know if anything is unclear or needs expanding upon. Thank You!

### Scoping Blocks

Both of the auth helpers accept a list of scoping blocks.
As scoping block is an object:

```
{
  requiredScopes: ...,
  providedScopes: ...,
  callback: (sources, args, context, info) => ...
}
```

`requiredScopes` is the list of permissions required for access to this callback.

`providedScopes` is the list of permissions provided for accessing this callback.

`callback` is the function to execute if access is granted by the validator.

All three fields accept functions with the same signature.
Generally, the requiredScopes will be a list that corresponds
to a few permissions specific to the resolver.
The providedScopes is function returning a list of permissions
given the context of the request  (or list of lists if batching).
The callback is always a function and its return should
match the GraphQL response type (unless you do pre/post ETL).
With `authSwitch`, the providedScopes may be omitted and
the helper will look for `context.auth.scopes` for the permissions.
Specifics to each auth helper are described further in their respective documentation.

### authSwitch

`authSwitch` is an authorization multiplexer.
It accepts a list of scoping blocks `[{requiredScopes, providedScopes, callback}, ...]`
with which to process the graphql request.
If the requesting users passes the requirements for a
scoping block, the entire resolver request is delegated to
the associated callback.

[Learn more about authSwitch](./switch.md).

### authBatching

`authBatching` is an authorization filter.
It is designed for batch processing and datum resolving situations.
It too accepts the same style list of scoping blocks.
The difference is that it applies the scoping blocks
on an object-by-object level to each element of the batch source.
That is, each element of the incoming batch sources is independently
authorized, filtered, fulfilled, and reassembled on your behalf.


[Learn more about authBatching](./batching.md).

### Validators

Validators are responsible for comparing and approving permissions.
The accept two lists and return a truthy or falsey value.

[Learn more about validators](./validators.md).


### Permission Scheme

The permission scheme is simple, yet flexible.
Under the hood, the default validators use the string equality check.
You can also use square brackets `[` and `]` to specify comma separated lists
which will be expanded into multiple permission entries.
So `[ "admin:[update,delete]", "user[,/self]:[update,delete]" ]` will become

```
[
  "admin:update",
  "admin:delete",
  "user:update",
  "user/self:update", // notice the empty section before the comma
  "user:delete",
  "user/self:delete"
]
```

As the `requiredScopes`, `providedScopes`, and `validator` callbacks
can all be customized, you are free to dream up any permission scheme.
You can even use objects instead of strings (a great candidate PR!).



### Processing Walkthrough




### Nesting

You can also nest `authSwitch` and `authBatch` in either order.
This enables you to expedite or shortcut given the right circumstances.
From the outer helpers viewpoint,
the nested helper will behave like a scoping stage.
From the nested helpers viewpoint, there is no outer helper,
it is ignorant of this fact.

There are some examples the test files
and on the `auth-upgrades` branch of the
[Apollo-Universal-Starter-Kit](https://github.com/sysgears/apollo-universal-starter-kit/tree/auth-upgrades) repository.


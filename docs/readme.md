# Documentation

Welcome to the `graphql-autharoo` documentation.

Please let us know if anything is unclear or needs expanding upon. Thank You!

### authSwitch

`authSwitch` is an authorization multiplexer.
It accepts a list of scopings (required,provided,success) callbacks.
If the requesting users passes the requirements for a
scoping block, the entire request is delegate to
the associated callback.

[Learn more about authSwitch](./switch.md).

### authBatching

`authBatching` is an authorization filter.
`authSwitch` is an authorization multiplexer.
It is designed for batch processing and resolving situations.
It too accepts a list of scopings (required,provided,success) callbacks.
The difference is that it applies the scopings
on an object-by-object level to each element of the batch source.

[Learn more about authBatching](./batching.md).

### Validators

Validators are responsible for comparing and approving permissions.
The accept two lists and return a truthy or falsey value.

[Learn more about validators](./validators.md).


### Processing Walkthrough


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

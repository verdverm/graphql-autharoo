# Validators

A valdator is responible for comparing the requiredScopes and providedScopes.
It accepts two lists and returns wither a truthy or falsy value.
The library provides three implementations that use stings,
though you are free to inject your own validators
that can use any sheme.

### Spec

The main entrypoint is the function __validateScope__ `function(required, provided, options)`

Options object:

```
{
  expandRequired: [true,false],
  expandProvided: [true,false],
  validator: [token,function]
}
```

The first two options are for simplifying the writing of the permissions.
They expand bracket lists with comma separated values (no whitespace allowed yet).
The expanded list is flattened and provided to the validator.
While the default implementations only deal with strings containing
non-nested square brackets, it should not be difficult to
pass a custom callback via the options object.

The __validator__ option accepts a string token for one of the provided validators,
or a callback function with the signature `function(requiredList, providedList)`.

### Built-in validators

#### Default

A `O(NM)` string equality check.
Used when the validator or options object is omitted,
you can explicitly set it with `"default"`.

#### Binsearch

Sorts the provided list only and then uses binary search
per required scope. It is assumed that `provided >> required`.
(That last string just so happens to be the output of all the built-in validators.
It is truthy while providing information about the successful match)

Specify with `"binsearch"`

#### Binsearch - No Sort

Same as the last but does not sort.
Maybe you want to retrieve records
in ascending order or something...

Specify with `"binsearch-nosort"`

#### Wildcard

Not recommended because who does security with wildcards...

Specify with `"wildcard-i-love-trump"`


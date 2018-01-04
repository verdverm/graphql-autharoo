### authBatching

`authBatching` is an authorization filter.
It is designed for batch processing and resolving situations.
It too accepts a list of scopings (required,provided,success) callbacks.
The difference is that it applies the scopings
on an object-by-object level to each element of the batch source.
It was designed with `graphql-batch-resolve`, but should work with `DataLoader`. (Another good PR!)
It also works with arrays-of-arrays-of-permissions and the sources is assumed to be an array as well.

When processing a batch, `authBatching` progressively
processes the remaining sources with the resolver chain.
As the sources move down the chain,

- Denied sources are assigned an 'AuthorizationError'
- Passing sources are gathered and passed to the current callback
- Indeterminate sources are gathered and passed to the next block.
- If a source makes it through all of the blocks, it is assigned the 'AuthorizationError'

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



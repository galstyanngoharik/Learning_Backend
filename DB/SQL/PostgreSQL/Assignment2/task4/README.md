
### Why GIN Instead of B-tree?

A B-tree index is not well suited for this query because the `@>` operator checks whether an array contains the specified value(s). A GIN index is designed to efficiently search for individual values within composite data types such as arrays.

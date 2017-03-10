## table

This renderer provides a table output for array values using ember-frost-table.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "table"
  }
}
```

#### with columns specified

```json
{
  "model": "foo",
  "renderer": {
    "name": "table",
    "columns": ["foo", "bar", "baz"]
  }
}
```

#### with label overrides for columns

```json
{
  "model": "foo",
  "renderer": {
    "columns": [{"key": "foo", "label": "FOO-LABEL"}],
    "name": "table"
  }
}
```

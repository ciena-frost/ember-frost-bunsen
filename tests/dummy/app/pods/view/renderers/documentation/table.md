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

#### with columns specified (to set an order, or omit some)

```json
{
  "model": "foo",
  "renderer": {
    "name": "table",
    "columns": ["bazz", "foo"]
  }
}
```

#### with label overrides for columns

```json
{
  "model": "foo",
  "renderer": {
    "columns": ["foo", {"key": "bar", "label": "BAR", "bazz"],
    "name": "table"
  }
}
```

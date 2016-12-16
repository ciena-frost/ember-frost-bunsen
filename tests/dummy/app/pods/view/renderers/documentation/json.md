## textarea

This renderer provides a textarea for modifying an Object property as a JSON
string.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "json"
  }
}
```

#### placeholder

```json
{
  "model": "foo",
  "placeholder": "Bar",
  "renderer": {
    "name": "json"
  }
}
```

#### renderer.cols

```json
{
  "model": "foo",
  "renderer": {
    "cols": 4,
    "name": "json"
  }
}
```

#### renderer.rows

```json
{
  "model": "foo",
  "renderer": {
    "name": "json",
    "rows": 4
  }
}
```

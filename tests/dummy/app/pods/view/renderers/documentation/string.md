## string

This renders a text input and is the default renderer for properties with a `type` of `string`.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo"
}
```

#### placeholder

```json
{
  "model": "foo",
  "placeholder": "Bar"
}
```

#### renderer.type

```json
{
  "model": "foo",
  "rendererer": {
    "name": "string",
    "type": "datetime"
  }
}
```

**Note: If you want a password input use the *password* renderer instead of providing `"type": "password"`.**

## datetime

This renders a datetime input.

### Properties
Currently disabled property is not supported. Can disable inputs 
by passing disabled = true to form but not through date-time-picker.
#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime"
  }
}
```

#### options

An `options` object can be used inside of the renderer property to configure various features of the renderer.

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime",
    "options": {
    }
  }
}
```

##### defaultToCurrentDateTime

Default: **true**

The `defaultToCurrentDateTime` option can be used to change the default behavior of the renderer when no value is given.
By default, is no value is given to the renderer, it will display the current date and time. If the
`defaultToCurrentDateTime` option is set to false, the renderer will be blank by default.

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime",
    "options": {
      "defaultToCurrentDateTime": false
    }
  }
}
```
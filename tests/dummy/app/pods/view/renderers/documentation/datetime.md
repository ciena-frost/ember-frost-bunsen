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

##### allowBlank

The `allowBlank` option can be used to explicitly allow a blank value in the datetime renderer. Note that by default,
the renderer will display the current date and time if no value is given to it.

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime",
    "options": {
      "allowBlank": true
    }
  }
}
```

##### defaultToCurrentDateTime

The `defaultToCurrentDateTime` option can be used in conjunction with `allowBlank` to preserve the default functionality
of displaying the current date and time when there is no value given, while still allowing a blank value.

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime",
    "options": {
      "allowBlank": true,
      "defaultToCurrentDateTime": true
    }
  }
}
```
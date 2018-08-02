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

##### timezone

The `timezone` option can be used to add a timezone to the date.
By default, if no value is given to the renderer, it will use a local timezone. If the
`timezone` option is given, the timezone will be shown in the renderer and the value will use
that timezone.

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "datetime",
    "options": {
      "timezone": "+08:00"
    }
  }
}
```
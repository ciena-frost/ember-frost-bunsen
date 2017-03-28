## when

This renderer provides a radio button group that allows for only one option to be selected.

The first radio button can be provided a label and a value both as `strings`. The second radio button contains a date-time picker.

The date-time picker is disabled unless the second radio button is currently selected.

### Properties

#### label
```json
{
  label: 'Bar',
  model: 'foo',
  renderer: {
    name: 'when'
  }
}
```
#### renderer.dateFormat

Change the date format shown in the date-time-picker. The default is `'YYYY-MM-DD'`.

```json
{
  model: 'foo',
  renderer: {
    dateFormat: 'MM-DD-YYYY',
    name: 'when'
  }
}
```

#### renderer.timeFormat

Change the time format shown in the date-time-picker. The default is `'HH:mm:ss'`.

```json
{
  model: 'foo',
  renderer: {
    name: 'when',
    timeFormat: 'HH:mm'
  }
}
```

#### renderer.dateTimeFormat

Change the date-time format sent to the bunsen model. The default is `'YYYY-MM-DDTHH:mm:ssZ'`.

```json
{
  model: 'foo',
  renderer: {
    dateTimeFormat: 'MM-DD-YYYYTHH:mm:ssZ',
    name: 'when'
  }
}
```

#### renderer.label

The label for the first radio button
```json
{
  model: 'foo',
  renderer: {
    label: 'Now',
    name: 'when'
  }
}
```

#### renderer.size

Change what size radio buttons are used. The default size is `small` if not provided. See [ember-frost-core](http://ciena-frost.github.io/ember-frost-core/#/radio) for supported sizes.

```json
{
  model: 'foo',
  renderer: {
    name: 'when',
    size: 'medium'
  }
}
```

#### renderer.value (**REQUIRED**)

The value for the first radio button
```json
{
  model: 'foo',
  renderer: {
    name: 'when',
    value: 'RIGHT_NOW'
  }
}
```

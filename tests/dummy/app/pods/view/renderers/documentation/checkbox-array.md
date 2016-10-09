## checkbox-array

This renderer provides a checkbox array input that allows for mutiple options to be selected.
If the property type is *boolean* this input will render with the buttons `On` and `Off`, otherwise `enum` must be provided with a list of possible options.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "checkbox-array"
  }
}
```

#### renderer.size

Change what size checkboxes are used. See [ember-frost-core](http://ciena-frost.github.io/ember-frost-core/#/checkbox) for supported sizes.

```json
{
  "model": "foo",
  "renderer": {
    "name": "checkbox-array",
    "size": "small"
  }
}
```

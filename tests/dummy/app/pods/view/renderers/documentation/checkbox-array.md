## checkbox-array

This renderer provides a checkbox array input that allows for mutiple options to be selected.

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

#### renderer.choices

Change the checbkox value to be separate from the label. Use this for a static enum driven checkbox array.
Note: Do not use choices and meta simultaneously for the same view model.

```json
{
  "model": "foo",
  "renderer": {
    "name": "checkbox-array",
    "choices": [
      {
        "label": "Should match the corresponding enum item",
        "value": "The new value for the checkbox"
      }
    ]
  }
}
```

#### renderer.meta

Set the checkbox label and value based on the data driven enum. Use this for a data driven driven checkbox array.
Note: Do not use choices and meta simultaneously for the same view model.

```json
{
  "model": "foo",
  "renderer": {
    "name": "checkbox-array",
    "meta": [
      {
        "datum": "Should match the data representation fed into the enum",
        "label": "The label to appear for the checkbox",
        "value": "The new value for the checkbox"
      }
    ]
  }
}
```

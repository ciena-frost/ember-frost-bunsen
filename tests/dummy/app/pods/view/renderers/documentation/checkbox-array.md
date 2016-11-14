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

#### renderer.data

Overrides the enum in the model to use specified label and value.

```json
{
  "model": "foo",
  "renderer": {
    "name": "checkbox-array",
    "data": [
      {
        "label": "The label for the checkbox",
        "value": "The value for the checkbox"
      }
    ]
  }
}
```

#### renderer.selectedValues

Allows checkboxes to be pre-checked. E.g. for retaining checks from query params upon refresh.

```json
{
  "model": "foo",
  "renderer": {
    "name": "checkbox-array",
    "selectedValues": ["values", "of", "selected", "checkboxes"]
  }
}
```

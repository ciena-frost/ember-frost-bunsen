This renderer provides a button group input that allows for only one option to be selected.
If the property type is *boolean* this input will render with the buttons `On` and `Off`, otherwise `enum` must be provided with a list of possible options.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "button-group"
  }
}
```

#### renderer.size

Change what size buttons are used. See [ember-frost-core](http://ciena-frost.github.io/ember-frost-core/#/button) for supported sizes.

```json
{
  "model": "foo",
  "renderer": {
    "name": "button-group",
    "size": "small"
  }
}
```

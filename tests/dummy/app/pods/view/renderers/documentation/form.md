## form

This is the default renderer for objects. It renders an object model with a Bunsen form.

When you configure it to use a plugin, you can create dynamic forms that responds to the current form values.

### Properties

#### plugin

```javascript
{
  model: 'some.model',
  renderer: {
    name: 'form',
    plugin: {
      name: 'plugin-name',
      args: {
        foo: '${./bar}'
      }
    }
  }
}
```

| property   | description   |
|---|---|
| `name`  | The name of the plugin supplied to Bunsen.|
| `args`  | An object that will get passed to the plugin. You can use variable substitution. The variable path is taken relative to the model.

#### How to create a plugin

A plugin is a user-supplied schema generator. It can be used to generate a model and view as well as custom validators.

A plugin is a function which takes a single argument (an object) that can take any shape and it must return a promise.

```javascript
myPlugin: function (arg) {
  // do magic stuff
  return RSVP.resolve({
    model,
    view,
    propagateValidation,
    validators
  })
}
```

##### Plugin response

The plugin must return a promise. A resolved promise should return this object shape.

| property | isRequired | description |
|---|---|---|
| model | false | Generated model schema. If this value is not supplied, the plugin will use the model given in the original view schema. |
| view | false | Generated view schema. If this value is not supplied, the plugin will generate the view. |
| propagateValidation | false | Whether this internal form component should added to it's parent validation. |
| validators | false | List of validators to give this internal form. |

A rejected promise should return an `Error`

```javascript
return RSVP.reject(new Error('Oh my!'))
```

#### Telling Bunsen about your plugins

```javascript
plugins: {
  myPlugin () {
    return RSVP.resolve({})
  }
}
```

```hbs
{{frost-bunsen-form
  ...
  plugins=plugins
}}
```
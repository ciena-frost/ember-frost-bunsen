# 4.1

* **Added** default `onChange` action to `AbstractInput` to reduce code required by consumers.
  Instead of a custom renderer having to define its own `onChange` action it can now just implement
  a function named `parseValue` that takes in the argument `value` as a `string` and returns this
  value parsed in whatever format is desired by the custom component. For example the `NumberInput`
  implements this function like so:

  ```javascript
  parseValue (value) {
    return parseFloat(value)
  }
  ```

# 4.0

## Breaking Changes

* **Removed** `initialValue` from `ember-frost-form` component.
* **Added** `value` to `ember-frost-form` component. Now you can provide an initial value to the form
  by setting `value` instead of `initialValue`. This property is different in the fact that it aims
  to allow the consumer to maintain the value state instead of `ember-frost-bunsen` maintaining it
  for you. If this property is omitted `ember-frost-bunsen` will continue to manage the state as it
  had done previously.
* **Changed** input mixin into a component which changes custom renderers from:

  ```javascript
  import {InputMixin} from 'ember-frost-bunsen'

  export default Ember.Component.extend(InputMixin, {
    // Custom renderer logic goes here…
  })
  ```

  to

  ```javascript
  import {AbstractInput} from 'ember-frost-bunsen'

  export default AbstractInput.extend({
    // Custom renderer logic goes here…
  })
  ```

## Non-Breaking Changes

* Convert internal state management to a Redux store for better maintainability.
* Reorganized code base to be leaner and allow consumers to override the templates.
* Added a few more tests.

# 3.0

## Breaking Changes

* Start consuming [ember-frost-core](https://github.com/ciena-frost/ember-frost-core) instead of:
  * [ember-frost-button](https://github.com/ciena-frost/ember-frost-button)
  * [ember-frost-checkbox](https://github.com/ciena-frost/ember-frost-checkbox)
  * [ember-frost-css-core](https://github.com/ciena-frost/ember-frost-css-core)
  * [ember-frost-icons](https://github.com/ciena-frost/ember-frost-icons)
  * [ember-frost-select](https://github.com/ciena-frost/ember-frost-select)
  * [ember-frost-text](https://github.com/ciena-frost/ember-frost-text)
  * [ember-frost-theme](https://github.com/ciena-frost/ember-frost-theme)
* Change action properties from kebab-case (`on-change`) to camelCase (`onChange`)

# 2.0

## Breaking Changes

* Change action properties from camelCase (`onChange`) to kebab-case (`on-change`)

## Non-Breaking Changes

* Consume [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types) for property validation instead of having own implementation.

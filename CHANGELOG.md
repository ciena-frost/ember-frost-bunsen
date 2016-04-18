# 5.0
## Breaking Changes
* **Removed** support for `PascalCaseCustomRenderers` in view schema definitions
* **Added** support for `kebab-case-custom-renderers` in view schema definitions
  this was done mainly to accommodate a terser DSL in view schemas for built-in
  renderers such as `select` which was added in this version. The goal is to have
  simple built-in renderers be targeted with easy names like `select`, `buckets`, etc
  like they were in UI Schema. UI Schema 2 will follow suit as well.  True custom renderers
  (created in consuming code) can still be addressed either way (based on how the
  consuming code constructs the custom renderers hash), but the kebab-case is encouraged.

* **Added** support for built-in select drop-downs, using `ember-frost-select`.
  Where options are a fixed list (enum), then the options are pulled from the enum definition
  in the Bunsen model JSON Schema for the rendered attribute, like so:

  ***Model Schema***
  ```JSON
  ...
  "someProperty": {
    "type": "string",
    "enum": [
      "foo",
      "bar",
      "fizz",
      "buzz"
    ]
  }
  ...
  ```

  ***View Schema***
  ```JSON
  ...
  {
    "model": "someProperty",
    "renderer": "select"
  }
  ...
  ```

  Where options are a based on an API call, arguments to an `Ember.store.query` call
  (the ember-data model type and queryParam definition) can be specified like so:

  ***Model Schema***
  ```JSON
  ...
  "someProperty": {
    "modelType": "resources",
    "labelAttribute": "label",
    "valueAttribute": "value",
    "query": {
      "resourceTypeId": "someResourceTypeId",
      "q": "domainId:someDomainId"
    }
  }
  ...
  ```

  ***View Schema***
  ```JSON
  ...
  {
    "model": "someProperty",
    "renderer": "select"
  }
  ...
  ```
  In this example, to populate this dropdown, the schema instructs ember-data to query the store for
  "resources", and to use the "query" object to generate it's query string for the call,
  i.e., `?resourceTypeId=someResourceTypeId&q=domainId:someDomainId`

  As well, where the value to populate a query should come from the in-flight form value itself, variables can
  be inserted into the query specification, using either absolute or relative-style JSON paths:

  ***Model Schema***
  ```JSON
  ...
  "resourceTypeId": {
    "type": "string"
  }
  "parentProperty": {
    "type": "object",
    "properties": {
      "childProperty": {
        "type": "string",
        "modelType": "resources",
        "query": {
          "resourceTypeId": "${resourceTypeId}",
          "q": "domainId:${../someSiblingPropertyOfParent}"
        }
      }
    }
  },
  "someSiblingPropertyOfParent": {
    "type": "string"
  }
  ...
  ```
  The above example would get the value for ``${resourceTypeId}`` from the current form's `formValue.resourceTypeId`.
  The value for `${../someDomainId}` would come from `formValue.someSiblingPropertyOfParent`.  This is useful when you need
  the asynchronous query for one value to be informed by another chosen value.

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

* **Changed** `onChange({id, value})` is now `onChange(id, value)` in custom renderers.
* **Removed** `valid` from validation results object so it now contains just `errors` and `warnings`.
  In order to check if it is valid you can simply check `errors.length`.
* **Removed** `state` from input component. Previously custom renderers would often maintain
  the value on `state.value` but in order to continue doing so they must initialize `state` in their
  `init` function like so:

  ```javascript
  init () {
    this._super(...arguments)
    this.set('state', Ember.Object.create({
      value: this.get('value')
    }))
  }
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
* **Changed** action properties from kebab-case (`on-change`) to camelCase (`onChange`)

# 2.0

## Breaking Changes

* **Changed** action properties from camelCase (`onChange`) to kebab-case (`on-change`)

## Non-Breaking Changes

* Consume [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types) for property validation instead of having own implementation.

# 5.12.1

## Non-Breaking Changes

* **Fixed** issue with error state of select inputs as `error` class wasn't being passed to the underlying select component.

# 5.12.0
No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 5.11

## Non-Breaking Changes

* **Added** support for object transforms in view JSON. This is to be used by the select component which allows the following variables in it's template string:

  * `id` – the ID of the form field
  * `index` – the index of the selected item
  * `label` – the label for the selected item
  * `value` – the value of the selected item

  Below is an example:

  ```json
  {
    "model": "languages",
    "renderer": "select",
    "writeTransforms": [
      {
        "object": {
          "bar": "this is a string literal",
          "foo": "this includes template variables: ${id} ${value}"
        }
      }
    ]
  }
  ```

# 5.10

## Non-Breaking Changes

* **Added** support for string transforms in view JSON (both literal and regular expression based). You can add `readTransforms` to mutate the value before it reaches the UI as well as `writeTransforms` to mutate the value going back up to the forms `onChange` event. Below is an example that keeps wordy programming languages in the store while presenting abbreviations in the UI:

  ```json
  {
    "model": "language",
    "readTransforms": [
      {
        "from": "javascript",
        "to": "js"
      },
      {
        "from": "syntactically awesome style sheets",
        "to": "sass"
      }
    ],
    "writeTransforms": [
      {
        "from": "js",
        "to": "javascript"
      },
      {
        "from": "s(a|c)ss",
        "regex": true,
        "to": "syntactically awesome style sheets"
      }
    ]
  }
  ```

# 5.9

## Non-Breaking Changes

* **Added** support for multiple `rootContainer`'s in views. If you specify more than one `rootContainer` then the UI will render tabs for the root containers and show the first tab on load.

# 5.8

## Non-Breaking Changes

* **Added** new property `showAllErrors` to `frost-bunsen-form` component that when true informs bunsen to show all error messages even before there is user interaction. This property defaults to `false` making it backwards compatible.
* **Added** new property `isRequiredError` to required errors returned by the `onValidation` action/property with the value `true` to distinguish which error messages are for missing required fields and which ones are for other errors (i.e. does not meet a length requirement).

# 5.7

# 5.6

## Non-Breaking Changes

* **Added** ability to hide labels for individual array items. You can hide these labels via the `showLabel` property in your view for the array container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "container": "address",
      "showLabel": false
    }
  }
  …
  ```

* **Added** ability to render array items in a compact mode where input(s) are rendered on same line as remove button (as well as sort icon when `sortable` is enabled). To enable the compact mode simply use the `compact` property in your view for the array container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "compact": true,
      "container": "address"
    }
  }
  …
  ```

# 5.5

## Non-Breaking Changes

* **Added** new `button-group` renderer. To learn more about it go to the [demo](http://ciena-frost.github.io/ember-frost-bunsen/#/renderers) and select `button-group` from the select.

# 5.4

## Non-Breaking Changes

* **Added** ability to override built-in renderers by overriding the following renderer keys in the `renderers` property/mapping: `boolean`, `number`, `string`.
* **Added** ability to specify the name of an Ember component as the value of the `renderer` property in your view without having to add it to the `renderers` property/mapping.
* **Fixed** select inputs to only show error messages after blur.

# 5.3

## Non-Breaking Changes

* **Fixed** Clean out null values from initial values when getting set for the first time.

# 5.2

## Non-Breaking Changes
* **Added** support for sortable arrays. You can use this feature by adding `sortable` in your view for the array item container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "container": "address",
      "sortable": true
    }
  }
  …
  ```

# 5.1

## Non-Breaking Changes
* **Added** support for arrays that automatically add an empty item to the end of the list instead of using the `Add Item` button. You can use this feature by adding `autoAdd` in your view for the array item container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "autoAdd": true,
      "container": "address"
    }
  }
  …
  ```

# 5.0

## Breaking Changes
* **Removed** support for `PascalCaseCustomRenderers` in view schema definitions
* **Added** support for `kebab-case-custom-renderers` in view schema definitions
  This was done mainly to accommodate a terser DSL in view schemas for built-in
  renderers such as `select` which was added in this version. The goal is to have
  simple built-in renderers be targeted with easy names like `select`, etc. True custom renderers
  (created in consuming code) can still be addressed either way (based on how the
  consuming code constructs the custom renderers hash), but the kebab-case is encouraged.

## Non-Breaking Changes
* **Added** support for built-in select drop-downs, using `frost-select` from `ember-frost-core`.
  Where options are a fixed list (enum), then the options are pulled from the enum definition
  in the Bunsen model JSON Schema for the rendered attribute, like so:

  ***Model Schema***
  ```json
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
  ```json
  ...
  {
    "model": "someProperty",
    "renderer": "select"
  }
  ...
  ```

  Where options are based on an API call, arguments to an `Ember.store.query` call
  (the ember-data model type and queryParam definition) can be specified like so:

  ***Model Schema***
  ```json
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
  ```json
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
  ```json
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

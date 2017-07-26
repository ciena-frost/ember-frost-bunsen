# ember-frost-bunsen
TWWSDsfas
###### Dependencies

![Ember][ember-img]
[![NPM][npm-img]][npm-url]

###### Health

[![Travis][ci-img]][ci-url]
[![Coveralls][cov-img]][cov-url]

###### Security

[![bitHound][bithound-img]][bithound-url]

* [Tutorial](#Tutorial)
* [Installation](#installation)
* [API](#api)
* [Examples](#examples)
* [Development](#development)

## Tutorial

Start with a step-by-step tutorial on bunsen [here](https://github.com/ciena-frost/bunsen-tutorial)

## Installation

```bash
ember install ember-frost-bunsen
```

## API

### frost-bunsen-detail

| Attribute     | Type                       | Required | Description                              |
| ------------- | -------------------------- | -------- | ---------------------------------------- |
| `bunsenModel` | `Ember.Object` or `object` | Yes      | Value definition                         |
| `bunsenView`  | `Ember.Object` or `object` | No       | View definition                          |
| `onError`     | `Function`                 | No       | Callback for when an error occurs in a sub-component |
| `renderers`   | `Ember.Object` or `object` | No       | Custom renderer template helper mappings |
| `value`       | `Ember.Object` or `object` | No       | Data to render                           |

### frost-bunsen-form

<!--lint disable table-pipe-alignment-->

| Attribute       | Type                       | Required | Description                              |
| --------------- | -------------------------- | -------- | ---------------------------------------- |
| `autofocus`     | `boolean`                  | No       | Whether or not to focus on first input   |
| `bunsenModel`   | `Ember.Object` or `object` | Yes      | Value definition                         |
| `bunsenView`    | `Ember.Object` or `object` | No       | View definition                          |
| `disabled`      | `boolean`                  | No       | Whether or not to disable entire form    |
| `mergeDefaults` | `boolean`                  | No       | Whether to merge form defaults with the initial value |
| `onChange`      | `Function`                 | No       | Callback for when form values change     |
| `onError`       | `Function`                 | No       | Callback for when an error occurs in a sub-component |
| `onValidation`  | `Function`                 | No       | Callback for when form is validated      |
| `renderers`     | `Ember.Object` or `object` | No       | Custom renderer template helper mappings |
| `showAllErrors` | `boolean`                  | No       | Whether or not to show error messages before user interaction occurs |
| `validators`    | `Array<Function>`          | No       | List of custom validation functions      |
| `value`         | `Ember.Object` or `object` | No       | Value to initialize form with            |

<!--lint enable table-pipe-alignment-->

### Callback signatures
#### `onChange`
```js
/**
 * Called whenever the value of the form changes (usually based on user interaction)
 * @param {Object} value - the new value of the form
 */
function onChange (value) {
  // handle the new value
}
```

#### `onError`
```js
/**
 * Called whenever a select renderer encounters an API error or a custom-renderer calls onError
 * @param {String} bunsenId - the bunsenId of the input where the error originated
 * @param {BunsenValidationError[]} errors - an array of errors, they aren't actually validation
 *   errors per-se, but a BunsenValidationError is a convenient format for reporting them
 *   see: https://github.com/ciena-blueplanet/bunsen-core/blob/master/src/typedefs.js#L75-L80
 */
function onError (bunsenId, errors) {
  // Present the errors to the user
}
```

#### `onValidation`
```js
/**
 * Called whenever validation completes after a form value changes, since validation is async,
 * this could be a while after the onChange is called.
 * @param {BunsenValidationResult} result - the result of the validation
 *   see: https://github.com/ciena-blueplanet/bunsen-core/blob/master/src/typedefs.js#L82-L86
 */
function onValidation (result) {
  // Present the errors to the user
}
```

## Examples

* [Invocation](#invocation)
* [Minimal Example](#minimal-example)
* [Nested Properties Example](#nested-properties-example)
* [Data Types Example](#data-types-example)
* [Custom Validation Example](#custom-validation-example)

### Invocation

#### Form View

```handlebars
{{
  frost-bunsen-form
  bunsenModel=model
  bunsenView=view
}}
```

#### Detail View

```handlebars
{{
  frost-bunsen-detail
  bunsenModel=model
  bunsenView=view
  value=value
}}
```

> Note: ALL values, models, and views MUST be valid [JSON](http://www.json.org/). Values are simply the data being represented in the UI which usually come directly from an API response. Models must be valid [JSON Schema](http://json-schema.org/) and views must be valid [view schema](https://github.com/ciena-blueplanet/bunsen-core/tree/master/src/validator/view-schemas). Below we will provide examples of values, models, and views to give you a better idea of how this stuff works.

### Minimal Example

**Value (Data to Render)**

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Model**

```json
{
  "type": "object",
  "properties": {
    "firstName": {"type": "string"},
    "lastName": {"type": "string"}
  }
}
```

**View**

```json
{
  "cellDefinitions": {
    "main": {
      "children": [
        {"model": "firstName"},
        {"model": "lastName"}
      ]
    }
  },
  "cells": {
    "label": "Main",
    "id": "main"
  },
  "type": "form",
  "version": "2.0"
}
```

### Nested Properties Example

**Value (Data to Render)**

```json
{
  "name": {
    "first": "John",
    "last": "Doe"
  }
}
```

**Model**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "object",
      "properties": {
        "first": {"type": "string"},
        "last": {"type": "string"}
      }
    }
  }
}
```

**View**

```json
{
  "cellDefinitions": {
    "main": {
      "children": [
        {"model": "name.first"},
        {"model": "name.last"}
      ]
    }
  },
  "cells": {
    "label": "Main",
    "id": "main"
  },
  "type": "form",
  "version": "2.0"
}
```

### Data Types Example

**Value (Data to Render)**

```json
{
  "name": "John Doe",
  "age": 35,
  "married": true,
  "spouse": {
    "name": "Jane Doe",
    "age": 32
  }
}
```

**Model**

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "number"},
    "married": {"type": "boolean"},
    "spouse": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "age": {"type": "number"}
      }
    }
  }
}
```

**View**

```json
{
  "cellDefinitions": {
    "main": {
      "children": [
        {"model": "name"},
        {"model": "age"},
        {"model": "married"},
        {
          "label": "Spouse's Name",
          "model": "spouse.name"
        },
        {
          "label": "Spouse's Age",
          "model": "spouse.age"
        }
      ]
    }
  },
  "cells": {
    "label": "Main",
    "id": "main"
  },
  "type": "form",
  "version": "2.0"
}
```

> Note: In the above view you will notice we specify *label* for the spouse properties
> to customize the label text rendered in the UI.

### Custom Validation Example

Bunsen will automatically validate types of most fields, and will flag
missing fields.  We can also pass in a list of custom validation
functions which let us add additional conditions.

Validators are functions that return an Ember.RSVP.Promise which resolves to a
POJO which can have one or more error objects.  (This allows async
actions like checking an API.)  These objects specify both the field
path (based on the Bunsen View, in case of nested things) and an error
message:

```javascript
{
  value: {
    errors: [  // can be empty, or contain multiple items
      {
        path: '#/vent',
        message: 'Vent core must be odd-numbered'
      },
      {
        path: '#/blasttype',
        message: 'Blast type must be either "frogs" or "toads"'
      }
    ],
    warnings: []
  }
}
```

#### Bunsen form specification

**Value (Data to Render)**

```json
{
  "palindrome": "tacocat",
}
```

**Model**

```json
{
  "type": "object",
  "properties": {
    "palindrome": {"type": "string"}
  }
}
```

**View**

```json
{
  "cells": [
    {
      "model": "palindrome"
    }
  ],
  "type": "form",
  "version": "2.0"
}
```

#### Provide custom validators

Custom validation functions can access all form values, and may
return multiple error messages (for multiple fields).  Bunsen will
invoke each validator in the `validators` list you give it with the form's current
values (on each change), and collate all of the errors together before
passing to the action you give it as `onValidation`.

```javascript
function palindromeValidator (values) {
  // If missing, a value will be undefined in the values object.
  // Bunsen already flags missing required fields.
  if (values.palindrome !== undefined) {
    const palindrome = (values.palindrome || '').replace(' ', '').toLowerCase()
    const reversed = palindrome.split('').reverse().join('')
    if (palindrome !== reversed) {
      return Ember.RSVP.resolve({
        value: {
          errors: [{
            path: '#/palindrome',
            message: 'Palindrome field does not read the same forwards as backwards'
          }],
          warnings: []
        }
      })
    }
  }
  return Ember.RSVP.resolve({
    value: {
      errors: [],
      warnings: []
    }
  })
}

export default Ember.Component.extend({
  layout: layout,
  classNames: ['palindrome-form'],

  model: bunsenModel,
  view: bunsenView,
  valid: false,
  hasError: Ember.computed.notEmpty('error'),

  validators: [
    palindromeValidator
  ],

  actions: {
    onValidation (e) {
      this.set('valid', e.errors.length === 0)
    }
  }
})
```

When invoking Bunsen, specify the `onValidation` and `validators` options:

```handlebars
{{
  frost-bunsen-form
  bunsenModel=model
  bunsenView=view
  onValidation=(action 'onValidation')
  validators=validators
}}
```

## Development

### Setup

```bash
git clone git@github.com:ciena-frost/ember-frost-bunsen.git
cd ember-frost-bunsen
npm install && bower install
```

### Development Server

A dummy application for development is available under `ember-frost-bunsen/tests/dummy`.
To run the server run `ember server` (or `npm start`) from the root of the repository and
visit the app at [http://localhost:4200](http://localhost:4200).

### Testing

Run `npm test` from the root of the project to run linting checks as well as execute the test suite
and output code coverage.

[bithound-img]: https://www.bithound.io/github/ciena-frost/ember-frost-bunsen/badges/score.svg "bitHound"
[bithound-url]: https://www.bithound.io/github/ciena-frost/ember-frost-bunsen

[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-bunsen.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-bunsen

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-bunsen.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-bunsen

[ember-img]: https://img.shields.io/badge/ember-2.3+-green.svg "Ember 2.3+"

[npm-img]: https://img.shields.io/npm/v/ember-frost-bunsen.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-bunsen

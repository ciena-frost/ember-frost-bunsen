[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-bunsen.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-bunsen
[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-bunsen.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-bunsen
[npm-img]: https://img.shields.io/npm/v/ember-frost-bunsen.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-bunsen

# ember-frost-bunsen <br /> [![Travis][ci-img]][ci-url] [![Coveralls][cov-img]][cov-url] [![NPM][npm-img]][npm-url]

 * [Installation](#installation)
 * [API](#api)
 * [Examples](#examples)
 * [Development](#development)

## Installation
```
ember install ember-frost-bunsen
```

## API
Coming soon…

## Examples

### Form View

```handlebars
{{
  frost-bunsen-form
  model=model
  view=view
}}
```

### Detail View

```handlebars
{{
  frost-bunsen-detail
  model=model
  value=value
  view=view
}}
```

> Note: ALL values, models, and views MUST be valid [JSON](http://www.json.org/). Values are simply the data being represented in the UI which usually come directly from an API response. Models must be valid [JSON Schema](http://json-schema.org/) and views must be valid [view schema](https://github.com/ciena-frost/ember-frost-bunsen/blob/master/addon/components/validator/view-schema.js). Below we will provide examples of values, models, and views to give you a better idea of how this stuff works.

### Minimal Example

**Value**

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
  "version": "1.0",
  "type": "form",
  "rootContainers": {
    "label": "Main",
    "id": "main"
  },
  "containers": [
    {
      "id": "main",
      "rows": [
        [
          {"model": "firstName"},
          {"model": "lastName"},
        ]
      ]
    }
  ]
}
```

### Nested Properties Example

**Value**

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
  "version": "1.0",
  "type": "form",
  "rootContainers": {
    "label": "Main",
    "id": "main"
  },
  "containers": [
    {
      "id": "main",
      "rows": [
        [
          {"model": "name.first"},
          {"model": "name.last"},
        ]
      ]
    }
  ]
}
```

### Data Types Example

**Value**

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
  "version": "1.0",
  "type": "form",
  "rootContainers": {
    "label": "Main",
    "id": "main"
  },
  "containers": [
    {
      "id": "main",
      "rows": [
        [
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
      ]
    }
  ]
}
```

## Development
### Setup
```
git clone git@github.com:ciena-frost/ember-frost-bunsen.git
cd ember-frost-bunsen
npm install && bower install
```

### Development Server
A dummy application for development is available under `ember-frost-bunsen/tests/dummy`.
To run the server run `ember server` (or `npm start`) from the root of the repository and
visit the app at http://localhost:4200.

### Testing
Run `npm test` from the root of the project to run linting checks as well as execute the test suite
and output code coverage.

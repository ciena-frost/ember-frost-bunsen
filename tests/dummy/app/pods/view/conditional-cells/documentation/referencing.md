#Referencing data values
There are 2 ways of refencing data values for cell-conditions: Absolute pathing and relative pathing.
##Absolute pathing
By default, paths for conditions start with at the root object. For example, the value `true` nested in this object:
```javascript
const value = {
  foo: {
    bar: {
      baz: true
    }
  }
}
```
be reached with the path `foo.bar.baz`.

Any item in the data value can be referenced by it's dotted path within the value object, including
##Relative pathing
A cell for a property/element at a given path can reference other properties that share path

```javascript
const value = {
  foo: {
    bar: '',
    baz: true
  },
  bar: ''
}

const model = {
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      properties: {
        bar: {
          type: 'string'
        },
        baz: {
          type: 'boolean',
        }
      }
    },
    bar: {
      type: 'string'
    }
  }
}

const view = {
  type: 'form',
  version: '2.0',
  cells: [{
    model: 'foo',
    children: [{
      model: 'bar', // Represents value.foo.bar
      conditions: [{if: [{'./baz': {equals: true}}]}]
    }, {
      model: 'baz'
    }]
  }, {
    model: 'bar',  // Represents value.bar
    conditions: [{if: [{'./foo.baz': {equals: true}}]}]
  }]
}
```
This can be useful with long and/or complicated paths into deeply nested objects.

This is also useful when dealing with arrays. Since it is often impossible to know the index of the given element of an array containing the data you want to access beforehand, we can use relative paths to access other parts of an array element without using the element's index.

export default {
  properties: {
    bar: {type: 'boolean'},
    baz: {
      enum: [0, 0.5, 1],
      type: 'number'
    },
    foo: {
      enum: ['one', 'two', 'three'],
      type: 'string'
    }
  },
  type: 'object'
}

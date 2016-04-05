const expect = chai.expect
import {beforeEach, describe, it} from 'mocha'
import validatorFactory from 'ember-frost-bunsen/validator/container'

describe('containerValidator', () => {
  let validator, container, result, containers, model, renderers

  beforeEach(() => {
    containers = [
      {
        id: 'main',
        rows: []
      },
      {
        id: 'top',
        rows: []
      },
      {
        id: 'middle',
        rows: []
      },
      {
        id: 'bottom',
        rows: []
      }
    ]

    model = {
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        alias: {type: 'string'}
      }
    }

    renderers = [
      'FooComponent',
      'BarComponent'
    ]

    validator = validatorFactory(containers, model, renderers)
  })

  describe('.validate()', () => {
    describe('when valid', () => {
      beforeEach(() => {
        container = {
          rows: [
            [{model: 'firstName'}],
            [{model: 'lastName'}],
            [{model: 'alias'}]
          ]
        }
        result = validator.validate('#/containers/0', container, model)
      })

      it('returns proper result', () => {
        expect(result).deep.equal({
          errors: [],
          warnings: []
        })
      })
    })

    describe('when extra attributes are given', () => {
      beforeEach(() => {
        container = {
          rows: [
            [{model: 'firstName'}],
            [{model: 'lastName'}],
            [{model: 'alias'}]
          ],
          className: 'col-sm-12',
          defaultClassName: 'col-sm-4',
          foo: 'bar'
        }
        result = validator.validate('#/containers/0', container, model)
      })

      it('returns proper result', () => {
        expect(result).deep.equal({
          errors: [],
          warnings: [
            {
              path: '#/containers/0',
              message: 'Unrecognized attribute "foo"'
            }
          ]
        })
      })
    })

    describe('when cells have bad references', () => {
      beforeEach(() => {
        container = {
          rows: [
            [{model: 'firstName'}, {model: 'lastName', renderer: 'BazComponent'}],
            [{className: 'col-sm-4'}, {model: 'bad-field-name'}],
            [{model: 'alias', renderer: 'FooComponent'}, {container: 'bad-container-name'}],
            [{container: 'top'}, {container: 'bottom', bar: 'baz'}]
          ]
        }
        result = validator.validate('#/containers/0', container, model)
      })

      it('returns proper result', () => {
        expect(result).deep.equal({
          errors: [
            {
              path: '#/containers/0/rows/0/1/renderer',
              message: 'Invalid renderer reference "BazComponent"'
            },
            {
              path: '#/containers/0/rows/1/0',
              message: 'Either "model" or "container" must be defined for each cell.'
            },
            {
              path: '#/containers/0/rows/1/1/model',
              message: 'Invalid model reference "bad-field-name"'
            },
            {
              path: '#/containers/0/rows/2/1/container',
              message: 'Invalid container reference "bad-container-name"'
            }
          ],
          warnings: [
            {
              path: '#/containers/0/rows/3/1',
              message: 'Unrecognized attribute "bar"'
            }
          ]
        })
      })
    })
  })
})

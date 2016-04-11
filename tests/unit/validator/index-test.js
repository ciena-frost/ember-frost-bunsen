const expect = chai.expect
import _ from 'lodash'
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import validate from 'ember-frost-bunsen/validator/index'
// import viewSchema from 'ember-frost-bunsen/validator/view-schema'
// import readmeContents from '!!raw!../../../README.md'
import missingReqAttrs from './fixtures/invalid/missing-required-attributes'
import invalidTypeVersion from './fixtures/invalid/invalid-type-version'
import simpleFormConfig from './fixtures/simple-form'
import simpleFormModel from './fixtures/simple-form-model'
import badContainers from './fixtures/invalid/bad-containers'
import badRootContainers from './fixtures/invalid/bad-root-containers'

describe('validator', function () {
  let result

  // TODO: get test working
  /* describe('README.md view schema', function () {
    let readmeSchema
    beforeEach(function () {
      const lines = readmeContents.split('\n')
      let startIndex = lines.indexOf('<!-- BEGIN view-schema.json -->') + 1
      let endIndex = lines.indexOf('<!-- END view-schema.json -->')
      const trimmedLines = lines.slice(startIndex, endIndex)
      startIndex = trimmedLines.indexOf('```json') + 1
      endIndex = trimmedLines.indexOf('```')
      const jsonLines = trimmedLines.slice(startIndex, endIndex)

      readmeSchema = JSON.parse(jsonLines.join('\n'))
    })

    it('matches the schema used by the code', function () {
      expect(readmeSchema).deep.equal(viewSchema)
    })
  }) */

  describe('.validate()', function () {
    describe('when valid', function () {
      beforeEach(function () {
        result = validate(simpleFormConfig, simpleFormModel)
      })

      it('validates', function () {
        expect(result).to.eql({
          errors: [],
          warnings: []
        })
      })
    })

    describe('when required attributes are missing', function () {
      beforeEach(function () {
        result = validate(missingReqAttrs, simpleFormModel)
      })

      it('reports missing "version"', function () {
        expect(result.errors).to.containSubset([{
          message: 'Field is required.',
          path: '#/version'
        }])
      })

      it('reports missing "type"', function () {
        expect(result.errors).to.containSubset([{
          message: 'Field is required.',
          path: '#/type'
        }])
      })

      it('reports missing "containers"', function () {
        expect(result.errors).to.containSubset([{
          message: 'Field is required.',
          path: '#/containers'
        }])
      })

      it('reports missing "rootContainers"', function () {
        expect(result.errors).to.containSubset([{
          message: 'Field is required.',
          path: '#/rootContainers'
        }])
      })
    })

    describe('when version and type are invalid', function () {
      beforeEach(function () {
        result = validate(invalidTypeVersion, simpleFormModel)
      })

      it('gives error message for invalid "version"', function () {
        expect(result.errors).to.containSubset([{
          path: '#/version',
          message: 'No enum match for: 0.1'
        }])
      })

      it('gives error message for invalid "type"', function () {
        expect(result.errors).to.containSubset([{
          path: '#/type',
          message: 'No enum match for: my-custom-type'
        }])
      })
    })

    describe('when rootContainers are bad', function () {
      let def
      beforeEach(function () {
        def = _.cloneDeep(badRootContainers)
      })

      it('when too many root containers', function () {
        result = validate(def, simpleFormModel)
        expect(result.errors).to.containSubset([{
          path: '#/rootContainers',
          message: 'Array is too long (3), maximum 1'
        }])
      })

      it('when missing "label"', function () {
        def.rootContainers = [def.rootContainers[1]]
        result = validate(def, simpleFormModel)
        expect(result.errors).to.containSubset([{
          path: '#/rootContainers/0/label',
          message: 'Field is required.'
        }])
      })

      it('when invalid "container"', function () {
        def.rootContainers = [def.rootContainers[2]]
        result = validate(def, simpleFormModel)
        expect(result.errors).to.containSubset([{
          path: '#/rootContainers/0',
          message: 'Invalid value "baz" for "container" Valid options are ["foo","bar"]'
        }])
      })
    })

    describe('when container is bad', function () {
      beforeEach(function () {
        result = validate(badContainers, simpleFormModel)
      })

      it('gives error message for missing "rows"', function () {
        expect(result.errors).to.containSubset([{
          path: '#/containers/1/rows',
          message: 'Field is required.'
        }])
      })
    })
  })
})

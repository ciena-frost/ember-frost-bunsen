const expect = chai.expect
import {beforeEach, describe, it} from 'mocha'
import {getDefaultView} from 'ember-frost-bunsen/generator'

import simpleModel from '../fixtures/simple-model'
import simpleView from '../fixtures/simple-view'
import arrayModel from '../fixtures/array-model'
import arrayView from '../fixtures/array-view'
import dependenciesModel from '../fixtures/dependencies-model'
import dependenciesView from '../fixtures/dependencies-view'

describe('getDefaultView()', () => {
  let result
  describe('simple schema', () => {
    beforeEach(() => {
      result = getDefaultView(simpleModel)
    })

    it('creates proper simple layout', () => {
      expect(result).deep.equal(simpleView)
    })
  })

  describe('array schema', () => {
    beforeEach(() => {
      result = getDefaultView(arrayModel)
    })

    it('creates proper array layout', () => {
      expect(result).deep.equal(arrayView)
    })
  })

  describe('dependencies schema', () => {
    beforeEach(() => {
      result = getDefaultView(dependenciesModel)
    })

    it('creates proper dependencies layout', () => {
      expect(result).deep.equal(dependenciesView)
    })
  })
})

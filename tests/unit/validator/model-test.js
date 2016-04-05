const expect = chai.expect
import {beforeEach, describe, it} from 'mocha'
import {validateSubModel} from 'ember-frost-bunsen/validator/model'

describe('model validator', () => {
  let model, result

  describe('validateSubModel()', () => {
    describe('when valid', () => {
      beforeEach(() => {
        model = {
          type: 'string',
          title: 'First Name'
        }
        result = validateSubModel('#/properties/firstName', model)
      })

      it('returns proper result', () => {
        expect(result).to.eql({
          errors: [],
          warnings: []
        })
      })
    })

    describe('when type is wrong', () => {
      beforeEach(() => {
        model = {
          type: 'foo-bar'
        }
        result = validateSubModel('#/properties/firstName', model)
      })

      it('returns proper result', () => {
        const errorMsg = 'Invalid value "foo-bar" for "type" Valid options are ' +
          '["string","object","array","number","boolean"]'

        expect(result).to.eql({
          errors: [
            {
              path: '#/properties/firstName',
              message: errorMsg
            }
          ],
          warnings: []
        })
      })
    })
  })
})

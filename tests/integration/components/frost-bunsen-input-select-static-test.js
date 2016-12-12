import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {afterEach, beforeEach} from 'mocha'
import hbs from 'htmlbars-inline-precompile'
import Ember from 'ember'
const {RSVP} = Ember
import * as listUtils from 'ember-frost-bunsen/list-utils'
import sinon from 'sinon'

const DISPLAY_VALUE = 'The value we want to display'

describeComponent(
  'frost-bunsen-input-select-static',
  'Integration: FrostBunsenInputSelectStatic',
  {
    integration: true
  },
  function () {
    beforeEach(function () {
      sinon.stub(listUtils, 'getDisplayValue', function () {
        return RSVP.resolve(DISPLAY_VALUE)
      })

      this.render(hbs`
        {{frost-bunsen-input-select-static
          bunsenId=bunsenId
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          cellConfig=cellConfig
          errorMessage=errorMessage
          formDisabled=formDisabled
          formHook=formHook
          onChange=onChange
          onError=onError
          readOnly=readOnly
          registerForFormValueChanges=registerForFormValueChanges
          renderers=renderers
          required=required
          showAllErrors=showAllErrors
          unregisterForFormValueChanges=unregisterForFormValueChanges
          value=value
        }}
      `)
    })

    afterEach(function () {
      listUtils.getDisplayValue.restore()
    })

    it('renders the display value of a select', function () {
      expect(this.$()).to.have.length(1)
      expect(this.$('.left-input').text()).to.have.string(DISPLAY_VALUE)
    })
  }
)

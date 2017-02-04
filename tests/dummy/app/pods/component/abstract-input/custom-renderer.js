import Ember from 'ember'
const {RSVP} = Ember
import {AbstractInput} from 'ember-frost-bunsen'
import computed, {readOnly} from 'ember-computed-decorators'

export default AbstractInput.extend({
  classNames: ['frost-field'],
  invalidNames: ['Donald Trump'],

  fullName: '', // local cache used for validation later

  init () {
    this._super(...arguments)
    // this component would like to validate it's own values
    this.registerValidator(this)
  },

  // this method must be implemented in order to support validation on custom-renderers
  validate () {
    const result = {
      value: {}
    }

    if (this.invalidNames.indexOf(this.get('fullName')) !== -1) {
      result.value = {
        errors: [
          {message: 'Invalid name', path: '#/name'}
        ],
        warnings: []
      }
    }

    return RSVP.resolve(result)
  },

  /* eslint-disable complexity */
  @readOnly
  @computed('transformedValue')
  renderValue (name) {
    if (!name) {
      return ''
    }

    const first = name.first || ''
    const last = name.last || ''
    const space = this.get('trailingSpace') || name.last ? ' ' : ''

    return `${first}${space}${last}`
  },
  /* eslint-enable complexity */

  parseValue (target) {
    // this saves the name to use for local validation because you can't rely on
    // formValue to do validation against since it only updates after validation
    this.set('fullName', target.value)
    const parts = target.value.split(' ')
    const trailingSpace = / $/.test(target.value)

    this.set('trailingSpace', trailingSpace)

    return {
      first: parts[0],
      last: (parts.length > 1) ? parts.slice(1).join(' ') : undefined
    }
  }
})

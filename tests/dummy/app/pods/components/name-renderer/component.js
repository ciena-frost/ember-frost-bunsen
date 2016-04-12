import _ from 'lodash'
import computed from 'ember-computed-decorators'
import {AbstractInput} from 'ember-frost-bunsen'

export default AbstractInput.extend({
  classNames: [
    'container-fluid',
    'name-renderer'
  ],

  // FIXME: make readOnly
  @computed('value')
  renderValue (name) {
    let value = ''

    if (!_.isPlainObject(name)) {
      return ''
    }

    if (name.first) {
      value += name.first
    }

    if (name.last) {
      value += ` ${name.last}`
    }

    return value
  },

  parseValue (value) {
    const parts = value.split(' ')
    const first = parts[0]
    const last = (parts.length > 1) ? parts.slice(1).join(' ') : undefined

    return {
      first,
      last
    }
  }
})

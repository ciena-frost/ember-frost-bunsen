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

  actions: {
    onChange (e) {
      const fullName = e.value || e.target.value
      const parts = fullName.split(' ')
      const first = parts[0]
      const last = (parts.length > 1) ? parts.slice(1).join(' ') : undefined
      const onChange = this.get('onChange')
      const value = {
        first,
        last
      }

      if (onChange) {
        onChange(this.get('bunsenId'), value)
      }

      this.set('state.value', value)
    }
  }
})

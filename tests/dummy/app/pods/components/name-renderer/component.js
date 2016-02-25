import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import InputMixin from 'ember-frost-bunsen/mixins/input'

export default Ember.Component.extend(InputMixin, {
  classNames: [
    'container-fluid',
    'name-renderer'
  ],

  @readOnly
  @computed('state.value')
  renderValue: function (name) {
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
    onChange: function (e) {
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
        onChange({
          id: this.get('bunsenId'),
          value
        })
      }

      this.set('state.value', value)
    }
  }
})

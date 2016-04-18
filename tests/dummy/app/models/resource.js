import DS from 'ember-data'

export default DS.Model.extend({
  label: DS.attr('string'),
  type: DS.attr('string')
})

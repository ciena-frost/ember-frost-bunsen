import DS from 'ember-data'

export default DS.Model.extend({
  label: DS.attr('string'),
  models: DS.hasMany('model'),
  value: DS.attr()
})

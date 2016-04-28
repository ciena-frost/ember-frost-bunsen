import DS from 'ember-data'
const {attr, hasMany, Model} = DS

export default Model.extend({
  label: attr('string'),
  models: hasMany('model'),
  view: attr()
})

import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  links: [
    {
      route: 'demo.components',
      title: 'Components'
    },
    {
      route: 'demo.examples',
      title: 'Examples'
    }
  ]
})

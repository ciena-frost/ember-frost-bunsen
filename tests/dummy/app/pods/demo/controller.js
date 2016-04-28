import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  links: [
    {
      route: 'demo.components',
      title: 'Components',
      links: [
        {
          route: 'demo.detail',
          title: 'frost-bunsen-detail'
        },
        {
          route: 'demo.form',
          title: 'frost-bunsen-form'
        }
      ]
    },
    {
      route: 'demo.examples',
      title: 'Examples'
    }
  ]
})

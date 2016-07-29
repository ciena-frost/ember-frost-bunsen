import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  links: [
    {
      route: 'application',
      title: 'Getting Started'
    },
    {
      route: 'component',
      title: 'Components',
      links: [
        {
          route: 'component.detail',
          title: 'frost-bunsen-detail'
        },
        {
          route: 'component.form',
          title: 'frost-bunsen-form'
        }
      ]
    },
    {
      route: 'model',
      title: 'Model',
      links: [
        {
          route: 'model.formats',
          title: 'Formats'
        }
      ]
    },
    {
      route: 'view',
      title: 'View',
      links: [
        {
          route: 'view.renderers',
          title: 'Renderers'
        }
      ]
    },
    {
      route: 'examples',
      title: 'Examples'
    },
    {
      route: 'editor',
      title: 'Editor'
    }
  ]
})

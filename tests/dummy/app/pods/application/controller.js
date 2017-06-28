import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  links: [
    {
      route: 'application',
      title: 'Getting Started'
    },
    {
      title: 'Components',
      links: [
        {
          route: 'component.detail',
          title: 'frost-bunsen-detail'
        },
        {
          route: 'component.form',
          title: 'frost-bunsen-form'
        },
        {
          route: 'component.abstract-input',
          title: 'abstract-input'
        }
      ]
    },
    {
      title: 'Model',
      links: [
        {
          route: 'model.types',
          title: 'Types'
        },
        {
          route: 'model.formats',
          title: 'Formats'
        },
        {
          route: 'model.conditional-properties',
          title: 'Conditional Properties'
        }
      ]
    },
    {
      title: 'View',
      links: [
        {
          route: 'view.renderers',
          title: 'Renderers'
        },
        {
          route: 'view.conditional-cells',
          title: 'Conditional Cells'
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

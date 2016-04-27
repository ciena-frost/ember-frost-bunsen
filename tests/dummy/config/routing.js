module.exports = [
  {
    id: 'demo',
    alias: 'Demo',
    type: 'category',
    route: 'demo',
    path: {
      path: '/'
    },
    items: [
      {
        id: 'components',
        alias: 'Components',
        type: 'route',
        route: 'demo.components'
      },
      {
        id: 'detail',
        alias: 'Detail',
        type: 'route',
        route: 'demo.detail'
      },
      {
        id: 'form',
        alias: 'Form',
        type: 'route',
        route: 'demo.form'
      },
      {
        id: 'examples',
        alias: 'Examples',
        type: 'route',
        route: 'demo.examples'
      }
    ]
  }
]

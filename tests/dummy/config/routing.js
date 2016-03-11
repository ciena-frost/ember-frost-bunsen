module.exports = [
  {
    id: 'demo',
    alias: 'Demo',
    type: 'category',
    route: 'demo',
    path: {
      path: '/'
    },
    items: [{
      id: 'detail',
      alias: 'Detail',
      type: 'route',
      route: 'demo.detail'
    }, {
      id: 'form',
      alias: 'Form',
      type: 'route',
      route: 'demo.form',
    },{
      id: 'detail-update',
      alias: 'Detail Update',
      type: 'route',
      route: 'demo.detail-update',
    }]
  }
]

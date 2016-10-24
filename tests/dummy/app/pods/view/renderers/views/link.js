export default {
  cells: [
    {
      children: [
        {
          label: 'Label',
          model: 'foo',
          renderer: {
            label: 'More…',
            name: 'link'
          }
        },
        {
          label: 'Route',
          model: 'tutorial',
          renderer: {
            name: 'link',
            route: 'tutorial'
          }
        },
        {
          label: 'URL',
          model: 'label',
          renderer: {
            name: 'link',
            url: 'http://ciena.com'
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

export default {
  version: '1.0',
  type: 'form',
  rootContainers: [
    {
      label: 'Main',
      container: 'main'
    }
  ],
  containers: [
    {
      id: 'main',
      rows: [
        [
          {
            model: 'name',
            container: 'name'
          }
        ],
        [
          {
            model: 'addresses',
            item: {
              container: 'addresses'
            }
          }
        ]
      ]
    },
    {
      id: 'name',
      rows: [
        [
          {
            model: 'first'
          }
        ],
        [
          {
            model: 'last'
          }
        ]
      ]
    },
    {
      id: 'addresses',
      rows: [
        [
          {
            model: 'street'
          }
        ],
        [
          {
            model: 'city'
          }
        ],
        [
          {
            model: 'state'
          }
        ],
        [
          {
            model: 'zip'
          }
        ]
      ]
    }
  ]
}

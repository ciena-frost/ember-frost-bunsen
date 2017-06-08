export default {
  cells: [
    {
      children: [
        {
          children: [
            {
              label: 'Provision time',
              model: 'provisionTime',
              renderer: {
                label: 'Now',
                name: 'when',
                value: 'RIGHT_NOW'
              }
            }
          ]
        },
        {
          children: [
            {
              label: 'Deprovision time',
              model: 'deprovisionTime',
              renderer: {
                label: 'Never',
                name: 'when',
                value: 'NOT_EVER'
              }
            }
          ]
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

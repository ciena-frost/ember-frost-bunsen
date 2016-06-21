export default {
  version: '1.0',
  type: 'form',

  containers: [
    {
      id: 'main',
      rows: [
        [{model: 'firstName'}],
        [{model: 'lastName'}],
        [{
          model: 'alias',
          readTransforms: [
            {
              from: '@kernelthekat',
              to: 'Cutest Cat Ever!'
            }
          ],
          writeTransforms: [
            {
              from: 'Cute Cat',
              to: '@kernelthekat'
            }
          ]
        }]
      ]
    }
  ],

  rootContainers: [{label: 'Main', container: 'main'}]
}

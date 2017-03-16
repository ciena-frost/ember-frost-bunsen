export default {
  cells: [
    {
      children: [
        {
          label: 'Simple',
          model: 'things',
          renderer: {
            name: 'table'
          }
        },
        {
          label: 'With column overrides',
          model: 'things',
          renderer: {
            name: 'table',
            columns: [
              'bazz',
              'foo'
            ]
          }
        },
        {
          label: 'With column & label overrides',
          model: 'things',
          renderer: {
            name: 'table',
            columns: [
              'foo',
              {
                key: 'bar',
                label: 'BAR'
              },
              'bazz'
            ]
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

export default {
  cells: [
    {
      children: [
        {
          model: 'things',
          renderer: {
            name: 'table',
            columns: [
              'foo',
              {
                key: 'bar',
                label: 'BAR'
              },
              'baz'
            ]
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

export default {
  cells: [
    {
      children: [
        {
          model: 'foo',
          renderer: {
            name: 'date'
          }
        },
        {
          model: 'bar',
          renderer: {
            defaultToCurrentDate: true,
            name: 'date'
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

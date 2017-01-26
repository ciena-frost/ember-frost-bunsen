export default {
  cells: [
    {
      children: [
        {
          model: 'foo',
          renderer: {
            name: 'select'
          }
        },
        {
          model: 'item',
          renderer: {
            name: 'select',
            options: {
              endpoint: 'http://data.consumerfinance.gov/api/views.json',
              labelAttribute: 'name',
              recordsPath: '',
              valueAttribute: 'id'
            }
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

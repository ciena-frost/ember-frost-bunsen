export default {
  cells: [
    {
      children: [
        {
          label: 'Country',
          model: 'queryWithCountries',
          renderer: {
            name: 'autocomplete',
            options: {
              debounceInterval: 300
            }
          },
          placeholder: 'Type a country name'
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}

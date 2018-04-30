export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
      children: [
        {
          label: 'Autocomplete with countries',
          model: 'queryExampleWithCountries',
          renderer: {
            name: 'autocomplete'
          }
        }
      ]
    }
  }
}

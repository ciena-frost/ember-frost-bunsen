export default {
  type: 'object',
  properties: {
    queryExampleWithCountries: {
      type: 'string',
      modelType: 'country',
      valueAttribute: 'id',
      labelAttribute: 'name',
      query: {
        p: 'name:$filter'
      }
    }
  },
  required: ['queryExampleWithCountries']
}

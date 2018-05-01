export default {
  properties: {
    queryWithCountries: {
      type: 'string',
      modelType: 'country',
      valueAttribute: 'id',
      labelAttribute: 'name',
      query: {
        p: 'name:$filter'
      }
    }
  },
  type: 'object'
}

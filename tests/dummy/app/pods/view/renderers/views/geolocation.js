export default {
  cells: [
    {
      model: 'address',
      renderer: {
        name: 'geolocation',
        refs: {
          address: '${./address}',
          city: '${./city}',
          country: '${./country}',
          latitude: '${./latitude}',
          longitude: '${./longitude}',
          postalCode: '${./postalCode}',
          state: '${./state}'
        }
      }
    }
  ],
  type: 'form',
  version: '2.0'
}

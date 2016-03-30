module.exports = {
  afterInstall: function () {
    return this.addBowerPackageToProject('z-schema', '3.16.1')
      .then(() => {
        return this.addAddonsToProject({
          packages: [
            {name: 'ember-frost-core', target: '^0.0.13'},
            {name: 'ember-frost-select', target: '^1.3.1'}
          ]
        })
      })
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
}

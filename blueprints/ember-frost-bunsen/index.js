module.exports = {
  afterInstall: function () {
    return this.addBowerPackageToProject('z-schema', '3.16.1')
      .then(() => {
        return this.addAddonsToProject({
          packages: [
            {name: 'ember-frost-theme', target: '^1.2.0'},
            {name: 'ember-frost-text', target: '^1.2.0'},
            {name: 'ember-frost-button', target: '^1.4.0'},
            {name: 'ember-frost-checkbox', target: '^1.1.1'},
            {name: 'ember-frost-icons', target: '^1.4.0'}
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

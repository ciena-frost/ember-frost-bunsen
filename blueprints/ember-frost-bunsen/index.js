module.exports = {
  afterInstall: function () {
    return this.addBowerPackageToProject('z-schema', '3.16.1')
      .then(() => {
        return this.addAddonsToProject({
          packages: [
            {name: 'ember-browserify', target: '^1.1.8'},
            {name: 'ember-frost-core', target: '>=0.0.14 <2.0.0'},
            {name: 'ember-lodash', target: '>=0.0.6 <2.0.0'},
            {name: 'ember-prop-types', target: '^1.1.0'},
            {name: 'ember-redux', target: '^1.0.0'}
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

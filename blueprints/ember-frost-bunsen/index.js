module.exports = {
  afterInstall: function () {
    return this.addPackagesToProject([
      {name: 'redux', target: '^3.4.0'},
      {name: 'redux-thunk', target: '^2.0.1'}
    ])
      .then(() => {
        return this.addAddonsToProject({
          packages: [
            {name: 'ember-browserify', target: '^1.1.8'},
            {name: 'ember-cli-moment-shim', target: '^2.0.0'},
            {name: 'ember-frost-core', target: '>=0.11.10 <2.0.0'},
            {name: 'ember-frost-tabs', target: '^2.0.2'},
            {name: 'ember-lodash', target: '>=0.0.6 <2.0.0'},
            {name: 'ember-moment', target: '7.0.0-beta.3'},
            {name: 'ember-prop-types', target: '^2.0.0'},
            {name: 'ember-redux', target: '^1.0.0'},
            {name: 'ember-sortable', target: '^1.8.1'},
            {name: 'ember-z-schema', target: '>=0.1.2 <=2.0.0'}
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

module.exports = {
  afterInstall: function () {
    return this.addPackagesToProject([
      {name: 'redux', target: '^3.4.0'},
      {name: 'redux-thunk', target: '^2.0.1'}
    ])
      .then(() => {
        return this.addAddonsToProject({
          packages: [
            {name: 'ember-browserify', target: '^1.1.11'},
            {name: 'ember-bunsen-core', target: '>=0.6.15 <=2.0.0'},
            {name: 'ember-frost-core', target: '>=0.22.0 <2.0.0'},
            {name: 'ember-frost-fields', target: '>=0.2.0 <2.0.0'},
            {name: 'ember-frost-tabs', target: '^2.0.2'},
            {name: 'ember-lodash-shim', target: '>=0.1.8 <2.0.0'},
            {name: 'ember-prop-types', target: '^2.2.3'},
            {name: 'ember-redux', target: '^1.0.0'},
            {name: 'ember-sortable', target: '^1.8.1'}
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

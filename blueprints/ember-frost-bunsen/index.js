const addonsToAdd = {
  packages: [
    {name: 'ember-ajax', target: '^2.5.2'},
    {name: 'ember-bunsen-core', target: '0.16.2'},
    {name: 'ember-frost-core', target: '^1.7.2'},
    {name: 'ember-frost-fields', target: '^4.0.0'},
    {name: 'ember-frost-popover', target: '^4.0.1'},
    {name: 'ember-frost-tabs', target: '^5.0.0'},
    {name: 'ember-getowner-polyfill', target: '^1.0.1'},
    {name: 'ember-lodash-shim', target: '^1.0.0'},
    {name: 'ember-prop-types', target: '^3.0.2'},
    {name: 'ember-redux-shim', target: '^1.0.1'},
    {name: 'ember-redux-thunk-shim', target: '^1.1.0'},
    {name: 'ember-spread', target: '^1.0.0'},
    {name: 'ember-sortable', target: '^1.8.1'}
  ]
}

const packagesToRemove = [
  'ember-redux-thunk'
]
  .map((packageName) => {
    return {name: packageName}
  })

module.exports = {
  afterInstall: function () {
    return this.removePackagesFromProject(packagesToRemove)
      .then(this.addAddonsToProject.bind(this, addonsToAdd))
      .then(() => {
        const isAddon = this.project.isEmberCLIAddon()
        const pathPrefix = isAddon ? 'tests/dummy/' : ''

        return this.insertIntoFile(
          `${pathPrefix}app/styles/app.scss`,
          "@import './ember-frost-bunsen';"
        )
      })
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
}

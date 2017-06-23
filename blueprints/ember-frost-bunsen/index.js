const addonsToAdd = {
  packages: [
    {name: 'ember-frost-date-picker', target: '^7.1.0'},
    {name: 'ember-frost-fields', target: '^4.0.0'},
    {name: 'ember-frost-table', target: '^1.0.0'}
  ]
}

const packagesToRemove = [
  'ember-bunsen-core',
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
          "@import 'ember-frost-bunsen';"
        )
      })
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
}

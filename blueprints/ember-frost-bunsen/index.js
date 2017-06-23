const blueprintHelper = require('ember-frost-core/blueprint-helper')

const addonsToAdd = [
  {name: 'ember-frost-date-picker', target: '^7.1.0'},
  {name: 'ember-frost-fields', target: '^4.0.0'},
  {name: 'ember-frost-table', target: '^1.0.0'}
]

const packagesToRemove = [
  'ember-bunsen-core',
  'ember-redux-thunk'
]
  .map((packageName) => {
    return {name: packageName}
  })

module.exports = {
  afterInstall: function (options) {
    return this.removePackagesFromProject(packagesToRemove)
      .then(() => {
        // Get the packages installed in the consumer app/addon. Packages that are already installed in the consumer within
        // the required semver range will not be re-installed or have blueprints re-run.
        const consumerPackages = blueprintHelper.consumer.getPackages(options)

        // Get the packages to install (not already installed) from a list of potential packages
        return blueprintHelper.packageHandler.getPkgsToInstall(addonsToAdd, consumerPackages).then((pkgsToInstall) => {
          if (pkgsToInstall.length !== 0) {
            // Call the blueprint hook
            return this.addAddonsToProject({
              packages: pkgsToInstall
            })
          }
        })
      })
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

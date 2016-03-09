module.exports = {
  afterInstall: function () {
    var blueprint = this
    return blueprint.addBowerPackageToProject('z-schema', '3.16.1')
      .then(function () {
        return blueprint.addAddonsToProject({
          packages: [
            {name: 'ember-frost-theme', target: '^1.2.0'}
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

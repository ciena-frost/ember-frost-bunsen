const addBunsenStyleImport = function (project) {
  const isAddon = project.isEmberCLIAddon()
  const pathPrefix = isAddon ? 'tests/dummy/' : ''

  return this.insertIntoFile(
    `${pathPrefix}app/styles/app.scss`,
    "@import 'ember-frost-bunsen';"
  )
}

module.exports = {
  afterInstall: function () {
    return addBunsenStyleImport(this.project)
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
}

export {
  addBunsenStyleImport
}

module.exports = {
  afterInstall: function () {
    const isAddon = this.project.isEmberCLIAddon()
    const pathPrefix = isAddon ? 'tests/dummy/' : ''

    return this.insertIntoFile(
      `${pathPrefix}app/styles/app.scss`,
      "@import 'ember-frost-bunsen';"
    )
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
}

module.exports = {
  extends: 'frost-standard',
  rules: {
    "ocd/sort-import-declarations": [
      2,
      {
        localPrefixes: [
          "../",
          "./",
          "dummy/",
          "ember-frost-bunsen"
        ]
      }
    ]
  }
}

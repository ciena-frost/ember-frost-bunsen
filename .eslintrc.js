module.exports = {
  extends: 'frost-standard',
  rules: {
    "no-template-curly-in-string": "off",
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

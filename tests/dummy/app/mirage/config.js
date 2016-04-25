import _ from 'lodash'
import config from '../config/environment'

export default function () {
  if (config && config.mirageNamespace) {
    this.namespace = config.mirageNamespace
  }

  ;[
    'models',
    'values',
    'views',
    'resources'
  ].forEach((key) => {
    const pluralizedKey = Ember.String.pluralize(key)

    this.get(`/${key}`, function (db, request) {
      let items = db[pluralizedKey]

      if ('modelId' in request.queryParams) {
        const modelId = request.queryParams.modelId

        items = items.filter((item) => {
          return item.modelIds ? item.modelIds.indexOf(modelId) !== -1 : false
        })
      }

      if ('p' in request.queryParams) {
        const pQueries = request.queryParams.p.split(',')
        _.each(pQueries, (query) => {
          let [attr, value] = query.split(':')
          items = items.filter((item) => {
            return item[attr] ? item[attr].toLowerCase().indexOf(value.toLowerCase()) !== -1 : false
          })
        })
      }

      return {
        [key]: items
      }
    })

    this.get(`/${key}/:id`, function (db, request) {
      return {
        [key]: _.find(db[pluralizedKey], {
          id: request.params.id
        })
      }
    })
  })
}

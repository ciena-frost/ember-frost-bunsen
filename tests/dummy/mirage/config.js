import Ember from 'ember'

import config from '../config/environment'

export default function () {
  if (config && config.mirageNamespace) {
    this.namespace = config.mirageNamespace
  }

  this.get('/countries', function ({db}, request) {
    let search = request.queryParams.p
    search = search ? search.replace('name:', '') : null

    const countries = db.countries
      .filter((country) => {
        if (search && country.name.indexOf(search) === -1) {
          return false
        }

        return true
      })
      .slice(0, 5)

    return {
      countries
    }
  })

  this.get('/resources', function ({db}, request) {
    let search = request.queryParams.p
    search = search ? search.replace('label:', '') : null

    const resources = db.resources
      .filter((resource) => {
        if (search && resource.label.indexOf(search) === -1) {
          return false
        }

        return true
      })
      .slice(0, 5)

    return {
      resources
    }
  })

  this.get('/nodes', function ({db}, request) {
    const nodes = db.nodes
    return {
      nodes
    }
  })

  ;[
    'models',
    'values',
    'views'
  ].forEach((key) => {
    const pluralizedKey = Ember.String.pluralize(key)

    this.get(`/${key}`, function ({db}, request) {
      let items = db[pluralizedKey]

      if ('modelId' in request.queryParams) {
        const modelId = request.queryParams.modelId

        items = items.filter((item) => modelId === item.id)
      }

      if ('p' in request.queryParams) {
        const pQueries = request.queryParams.p.split(',')
        pQueries.foreach((query) => {
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

    this.get(`/${key}/:id`, function ({db}, request) {
      return {
        [key]: db[pluralizedKey].find((item) => item.id === request.params.id)
      }
    })
  })

  this.passthrough()
  this.passthrough('http://data.consumerfinance.gov/api/**')
  this.passthrough('http://www.mapquestapi.com/**')
}

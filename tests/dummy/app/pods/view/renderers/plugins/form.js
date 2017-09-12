import Ember from 'ember'
const {RSVP} = Ember

export default function (store) {
  return {
    fetch: ({schemaType}) => {
      return store.query('model', {modelId: schemaType})
        .then((models) => {
          return {
            model: models.objectAt(0).get('model')
          }
        })
    },
    autoGenerate: ({name, type}) => {
      return RSVP.resolve({
        model: {
          type: 'object',
          properties: {
            [name]: {
              type
            }
          }
        }
      })
    }
  }
}

export default {
  definitions: {
    parent: {
      properties: {
        countryOfBirth: {
          labelAttribute: 'name',
          modelType: 'country',
          type: 'string',
          valueAttribute: 'id'
        },
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        middleName: {type: 'string'},
        stateOfBirth: {type: 'string'}
      },
      required: [
        'countryOfBirth',
        'firstName',
        'lastName'
      ],
      type: 'object'
    },
    spouse: {
      properties: {
        address: {type: 'string'},
        city: {type: 'string'},
        country: {
          labelAttribute: 'name',
          modelType: 'country',
          type: 'string',
          valueAttribute: 'id'
        },
        countryOfBirth: {
          labelAttribute: 'name',
          modelType: 'country',
          type: 'string',
          valueAttribute: 'id'
        },
        dateOfBirth: {type: 'string'},
        father: {
          '$ref': '#/definitions/parent',
          type: 'object'
        },
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        lastNameAtBirth: {type: 'string'},
        middleName: {type: 'string'},
        mother: {
          '$ref': '#/definitions/parent',
          type: 'object'
        },
        state: {type: 'string'},
        stateOfBirth: {type: 'string'},
        zipCode: {type: 'string'}
      },
      required: [
        'address',
        'city',
        'country',
        'countryOfBirth',
        'dateOfBirth',
        'firstName',
        'lastName',
        'state',
        'stateOfBirth',
        'zipCode'
      ],
      type: 'object'
    }
  },
  properties: {
    bride: {
      '$ref': '#/definitions/spouse',
      type: 'object'
    },
    groom: {
      '$ref': '#/definitions/spouse',
      type: 'object'
    }
  },
  required: [
    'bride',
    'groom'
  ],
  type: 'object'
}

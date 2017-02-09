export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'alias',
          conditions: [{
            if: [{
              firstName: {equals: 'Bruce'},
              lastName: {equals: 'Wayne'}
            }, {
              firstName: {equals: 'Clark'},
              lastName: {equals: 'Kent'}
            }, {
              firstName: {equals: 'Peter'},
              lastName: {equals: 'Parker'}
            }]
          }]

        },
        {
          model: 'firstName',
          label: 'First'
        },
        {
          model: 'lastName'
        },
        {
          model: 'onlyChild'
        }
      ]
    }
  }
}

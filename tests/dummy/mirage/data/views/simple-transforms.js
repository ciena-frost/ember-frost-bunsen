export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      label: 'Main',
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'alias'
        },
        {
          model: 'firstName',
          label: 'First',
          transforms: {
            read: [
              {from: '^Alexander$', regex: true, to: 'Alex'},
              {from: '^Christopher$', regex: true, to: 'Chris'},
              {from: '^Matthew$', regex: true, to: 'Matt'},
              {from: '^Johnathan$', regex: true, to: 'John'},
              {from: '^Samantha$', regex: true, to: 'Sam'}
            ],
            write: [
              {from: '^Alex$', regex: true, to: 'Alexander'},
              {from: '^Chris$', regex: true, to: 'Christopher'},
              {from: '^Matt$', regex: true, to: 'Matthew'},
              {from: '^John$', regex: true, to: 'Johnathan'},
              {from: '^Sam$', regex: true, to: 'Samantha'}
            ]
          }
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

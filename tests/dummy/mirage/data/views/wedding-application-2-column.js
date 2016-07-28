export default {
  cellDefinitions: {
    address: {
      label: 'Address',
      children: [
        {model: 'address'},
        {model: 'city'},
        {model: 'state'},
        {model: 'country'},
        {model: 'zipCode'}
      ]
    },
    bride: {
      collapsible: true,
      children: [
        {extends: 'details'},
        {extends: 'address'},
        {extends: 'parents'}
      ]
    },
    details: {
      label: 'Details',
      children: [
        {model: 'firstName'},
        {model: 'middleName'},
        {
          label: 'Current last name',
          model: 'lastName'
        },
        {
          label: 'Last name at birth (if different)',
          model: 'lastNameAtBirth'
        },
        {model: 'dateOfBirth'},
        {model: 'countryOfBirth'},
        {model: 'stateOfBirth'}
      ]
    },
    father: {
      children: [
        {model: 'firstName'},
        {model: 'middleName'},
        {model: 'lastName'},
        {model: 'stateOfBirth'},
        {model: 'countryOfBirth'}
      ]
    },
    groom: {
      collapsible: true,
      children: [
        {extends: 'details'},
        {extends: 'address'},
        {extends: 'parents'}
      ]
    },
    main: {
      children: [
        {
          extends: 'groom',
          model: 'groom'
        },
        {
          extends: 'bride',
          model: 'bride'
        }
      ]
    },
    mother: {
      children: [
        {model: 'firstName'},
        {model: 'middleName'},
        {model: 'lastName'},
        {model: 'stateOfBirth'},
        {model: 'countryOfBirth'}
      ]
    },
    parents: {
      children: [
        {
          extends: 'father',
          model: 'father'
        },
        {
          extends: 'mother',
          model: 'mother'
        }
      ]
    }
  },
  cells: [{
    label: 'Main',
    extends: 'main'
  }],
  type: 'form',
  version: '2.0'
}

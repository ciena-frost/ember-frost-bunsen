export default {
  cellDefinitions: {
    main: {
      children: [
        {
          children: [
            {
              model: 'severity',
              renderer: {
                name: 'checkbox-array'
              }
            }
          ],
          label: 'Severity',
          collapsible: true
        },
        {
          children: [
            {
              model: 'serviceAffecting',
              renderer: {
                choices: [
                  {
                    label: 'Yes',
                    value: 'SERVICE_AFFECTING'
                  },
                  {
                    label: 'No',
                    value: 'NON_SERVICE_AFFECTING'
                  }
                ],
                name: 'checkbox-array'
              }
            }
          ],
          label: 'Service affecting',
          collapsible: true
        },
        {
          children: [
            {
              model: 'deviceType',
              renderer: {
                meta: [
                  {
                    datum: 'CN6500',
                    label: '6500',
                    value: 'CN6500'
                  },
                  {
                    datum: 'NUAGE',
                    label: 'Nuage',
                    value: 'nuage'
                  }
                ],
                name: 'checkbox-array'
              }
            }
          ],
          label: 'Device type',
          collapsible: true
        }
      ],
      label: 'Refine by'
    }
  },
  cells: [
    {
      extends: 'main'
    }
  ],
  type: 'form',
  version: '2.0'
}

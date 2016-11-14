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
                name: 'checkbox-array',
                data: [
                  {
                    label: 'Yes',
                    value: 'SERVICE_AFFECTING'
                  },
                  {
                    label: 'No',
                    value: 'NON_SERVICE_AFFECTING'
                  }
                ]
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
                name: 'checkbox-array',
                selectedValues: ['6500']
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

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
                labels: {
                  'SERVICE_AFFECTING': 'Yes',
                  'NON_SERVICE_AFFECTING': 'No'
                }
              }
            }
          ],
          label: 'Service affecting',
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

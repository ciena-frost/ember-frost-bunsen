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
          model: 'name'
        },
        {
          model: 'email'
        },
        {
          model: 'paymentInfo',
          renderer: {
            choices: [
              {
                label: 'Electronic funds transfer',
                value: 'useEft'
              },
              {
                label: 'Credit card',
                value: 'useCreditCard'
              },
              {
                label: 'PayPal',
                value: 'usePayPal'
              }
            ],
            name: 'property-chooser'
          },
          label: 'Payment Type'
        }, {
          conditions: [{
            if: [{
              'paymentInfo.useEft': {greaterThan: ''}
            }],
            then: {
              label: 'Electronic Funds Transfer Payment Info',
              children: [{
                model: 'paymentInfo.routingNumber',
                dependsOn: 'paymentInfo.useEft'
              }, {
                model: 'paymentInfo.accountNumber',
                dependsOn: 'paymentInfo.useEft'
              }]
            }
          }, {
            if: [{
              'paymentInfo.useCreditCard': {greaterThan: ''}
            }],
            then: {
              label: 'Credit Card Payment Info',
              children: [{
                dependsOn: 'paymentInfo.useCreditCard',
                model: 'paymentInfo.creditCardNumber'
              }, {
                dependsOn: 'paymentInfo.useCreditCard',
                model: 'paymentInfo.ccv'
              }]
            }
          }, {
            if: [{
              'paymentInfo.usePayPal': {greaterThan: ''}
            }],
            then: {
              label: 'PayPal Payment Info',
              children: [{
                dependsOn: 'paymentInfo.usePayPal',
                model: 'paymentInfo.payPalUsername'
              }, {
                dependsOn: 'paymentInfo.usePayPal',
                model: 'paymentInfo.payPalPassword'
              }]
            }
          }]
        }
      ]
    }
  }

}

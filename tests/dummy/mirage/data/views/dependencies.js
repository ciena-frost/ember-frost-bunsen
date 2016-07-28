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
        },
        {
          model: 'paymentInfo.routingNumber',
          dependsOn: 'paymentInfo.useEft'
        },
        {
          model: 'paymentInfo.accountNumber',
          dependsOn: 'paymentInfo.useEft'
        },
        {
          model: 'paymentInfo.creditCardNumber',
          dependsOn: 'paymentInfo.useCreditCard'
        },
        {
          label: 'CCV',
          model: 'paymentInfo.ccv',
          dependsOn: 'paymentInfo.useCreditCard'
        },
        {
          label: 'PayPal username',
          model: 'paymentInfo.payPalUsername',
          dependsOn: 'paymentInfo.usePayPal'
        },
        {
          label: 'PayPal password',
          model: 'paymentInfo.payPalPassword',
          dependsOn: 'paymentInfo.usePayPal'
        }
      ]
    }
  }
}

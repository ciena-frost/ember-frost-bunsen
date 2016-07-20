export default {
  version: '1.0',
  type: 'form',
  rootContainers: [
    {
      label: 'Main',
      container: 'main'
    }
  ],
  containers: [
    {
      id: 'main',
      rows: [
        [
          {
            model: 'name'
          }
        ],
        [
          {
            model: 'email'
          }
        ],
        [
          {
            model: 'paymentInfo',
            container: 'paymentInfo'
          }
        ]
      ]
    },
    {
      id: 'paymentInfo',
      rows: [
        [
          {
            model: 'useEft'
          }
        ],
        [
          {
            model: 'useCreditCard'
          }
        ],
        [
          {
            model: 'usePayPal'
          }
        ],
        [
          {
            model: 'routingNumber',
            dependsOn: 'useEft'
          }
        ],
        [
          {
            model: 'accountNumber',
            dependsOn: 'useEft'
          }
        ],
        [
          {
            model: 'creditCardNumber',
            dependsOn: 'useCreditCard'
          }
        ],
        [
          {
            model: 'ccv',
            dependsOn: 'useCreditCard'
          }
        ],
        [
          {
            model: 'payPalUsername',
            dependsOn: 'usePayPal'
          }
        ],
        [
          {
            model: 'payPalPassword',
            dependsOn: 'usePayPal'
          }
        ]
      ]
    }
  ]
}

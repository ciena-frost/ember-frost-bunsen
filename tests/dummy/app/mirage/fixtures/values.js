export default [
  {
    id: 'John',
    modelIds: ['simple'],
    label: 'John',
    value: {
      firstName: 'John',
      lastName: 'Christianson',
      alias: 'Little Johnny Christmas',
      onlyChild: true,
      age: 40
    }
  },
  {
    id: 'Dependencies',
    label: 'Dependencies',
    modelIds: ['dependencies'],
    value: {
      name: 'Johnny Appleseed',
      email: 'ja@gmail.com',
      paymentInfo: {
        useEf: 'No',
        useCreditCard: '5555 5555 5555 5555',
        usePayPal: 'No'
      }
    }
  },
  {
    id: 'complex',
    label: 'Complex',
    modelIds: ['complex'],
    value: {
      network: {
        host: {
          name: 'SomeHost',
          interfaces: [{
            name: 'SomeInterface',
            adminState: 'no'
          }]
        },
        firewall: {
          name: 'SomeFirewall',
          interfaces: [{
            name: 'SomeOtherInterface',
            adminState: 'no'
          }, {
            name: 'SomeThirdInterface',
            adminState: 'no'
          }]
        }
      }
    }
  },
  {
    id: 'array',
    label: 'Array',
    modelIds: ['array'],
    value: {
      addresses: [
        {
          street: '1060 West Addison Street',
          city: 'Chicago',
          state: 'IL',
          zip: '55555'
        }
      ],
      name: {
        first: 'Elwood',
        last: 'Blues'
      }
    }
  }
]

export default [
  {
    id: 'array',
    label: 'Array',
    model: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          title: 'Full name',
          properties: {
            first: {
              type: 'string'
            },
            last: {
              type: 'string'
            }
          },
          required: ['first', 'last']
        },
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              street: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              zip: {
                type: 'string'
              }
            },
            required: ['street', 'city', 'state', 'zip']
          },
          minItems: 1
        }
      },
      required: ['name', 'addresses']
    }
  },
  {
    id: 'complex',
    label: 'Complex',
    model: {
      definitions: {
        interface: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            adminState: {type: 'string'}
          },
          required: ['name', 'adminState']
        },
        element: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            interfaces: {
              type: 'array',
              items: {
                type: 'object',
                '$ref': '#/definitions/interface'
              }
            }
          },
          required: ['name', 'interfaces']
        }
      },
      type: 'object',
      properties: {
        network: {
          type: 'object',
          properties: {
            host: {
              type: 'object',
              '$ref': '#/definitions/element'
            },
            firewall: {
              type: 'object',
              '$ref': '#/definitions/element'
            }
          },
          required: ['host', 'firewall']
        }
      },
      required: ['network']
    }
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    model: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        paymentInfo: {
          type: 'object',
          properties: {
            useEft: {
              type: 'string'
            },
            useCreditCard: {
              type: 'string'
            },
            usePayPal: {
              type: 'string'
            }
          },
          dependencies: {
            useEft: {
              type: 'object',
              properties: {
                routingNumber: {
                  type: 'string'
                },
                accountNumber: {
                  type: 'string'
                }
              },
              required: ['routingNumber', 'accountNumber']
            },
            useCreditCard: {
              type: 'object',
              properties: {
                creditCardNumber: {
                  type: 'string'
                },
                ccv: {
                  type: 'string'
                }
              },
              required: ['creditCardNumber', 'ccv']
            },
            usePayPal: {
              type: 'object',
              properties: {
                payPalUsername: {
                  type: 'string'
                },
                payPalPassword: {
                  type: 'string'
                }
              },
              required: ['payPalUsername', 'payPalPassword']
            }
          }
        }
      }
    }
  },
  {
    id: 'l3vpn',
    label: 'L3VPN (Blank)',
    model: {
      type: 'object',
      properties: {
        productId: {
          type: 'string'
        },
        desiredOrchState: {
          type: 'string'
        },
        label: {
          type: 'string'
        },
        discovered: {
          type: 'boolean'
        },
        properties: {
          additionalProperties: false,
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            'customer-name': {
              type: 'string'
            },
            service: {
              additionalProperties: false,
              type: 'object',
              properties: {
                'svc-bandwidth': {
                  type: 'string'
                }
              }
            },
            endpoints: {
              type: 'array',
              items: {
                additionalProperties: false,
                type: 'object',
                properties: {
                  nodeId: {
                    type: 'string'
                  },
                  nodeTypeGroup: {
                    type: 'string'
                  },
                  extension: {
                    additionalProperties: false,
                    type: 'object',
                    properties: {
                      interface: {
                        additionalProperties: false,
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          dot1q: {
                            type: 'string'
                          },
                          'second-dot1q': {
                            type: 'string'
                          },
                          address: {
                            type: 'string'
                          }
                        }
                      },
                      vrf: {
                        additionalProperties: false,
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          'address-family': {
                            type: 'array',
                            items: {
                              additionalProperties: false,
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string'
                                },
                                af: {
                                  additionalProperties: false,
                                  type: 'object',
                                  properties: {
                                    import: {
                                      additionalProperties: false,
                                      type: 'object',
                                      properties: {
                                        'route-target': {
                                          type: 'string'
                                        }
                                      }
                                    },
                                    export: {
                                      additionalProperties: false,
                                      type: 'object',
                                      properties: {
                                        'route-target': {
                                          type: 'string'
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  attachment: {
                    additionalProperties: false,
                    type: 'object',
                    properties: {
                      connection: {
                        additionalProperties: false,
                        type: 'object',
                        properties: {
                          ipv4: {
                            additionalProperties: false,
                            type: 'object',
                            properties: {
                              'subnet-prefix': {
                                type: 'string'
                              }
                            }
                          },
                          'routing-protocols': {
                            additionalProperties: false,
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string'
                                },
                                bgp: {
                                  additionalProperties: false,
                                  type: 'object',
                                  properties: {
                                    'as-number': {
                                      type: 'string'
                                    },
                                    'address-family': {
                                      type: 'string'
                                    },
                                    'route-distinguisher': {
                                      type: 'string'
                                    },
                                    vrf: {
                                      type: 'string'
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    id: 'l3vpn-defaults',
    label: 'L3VPN (Defaults)',
    model: {
      type: 'object',
      properties: {
        productId: {
          type: 'string'
        },
        desiredOrchState: {
          type: 'string',
          default: 'active',
          editable: false
        },
        label: {
          type: 'string'
        },
        discovered: {
          type: 'boolean',
          default: false,
          editable: false
        },
        properties: {
          additionalProperties: false,
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            'customer-name': {
              type: 'string'
            },
            service: {
              additionalProperties: false,
              type: 'object',
              properties: {
                'svc-bandwidth': {
                  type: 'string',
                  default: '50000000'
                }
              }
            },
            endpoints: {
              type: 'array',
              items: {
                additionalProperties: false,
                type: 'object',
                properties: {
                  nodeId: {
                    type: 'string'
                  },
                  nodeTypeGroup: {
                    type: 'string',
                    default: '/typeGroups/Cisco'
                  },
                  extension: {
                    additionalProperties: false,
                    type: 'object',
                    properties: {
                      interface: {
                        additionalProperties: false,
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            default: 'GigabitEthernet0/7/0/3.300020'
                          },
                          dot1q: {
                            type: 'string',
                            default: '20'
                          },
                          'second-dot1q': {
                            type: 'string',
                            default: '3000'
                          },
                          address: {
                            type: 'string',
                            default: '192.168.250.1/30'
                          }
                        }
                      },
                      vrf: {
                        additionalProperties: false,
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          'address-family': {
                            type: 'array',
                            items: {
                              additionalProperties: false,
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  default: 'bgp'
                                },
                                af: {
                                  additionalProperties: false,
                                  type: 'object',
                                  properties: {
                                    import: {
                                      additionalProperties: false,
                                      type: 'object',
                                      properties: {
                                        'route-target': {
                                          type: 'string',
                                          default: '65000:1'
                                        }
                                      }
                                    },
                                    export: {
                                      additionalProperties: false,
                                      type: 'object',
                                      properties: {
                                        'route-target': {
                                          type: 'string',
                                          default: '65000:1'
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  'attachment': {
                    'additionalProperties': false,
                    type: 'object',
                    properties: {
                      'connection': {
                        'additionalProperties': false,
                        type: 'object',
                        properties: {
                          'ipv4': {
                            'additionalProperties': false,
                            type: 'object',
                            properties: {
                              'subnet-prefix': {
                                type: 'string',
                                default: '10.10.11.0/24'
                              }
                            }
                          },
                          'routing-protocols': {
                            'additionalProperties': false,
                            type: 'array',
                            'items': {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  default: 'bgp'
                                },
                                'bgp': {
                                  'additionalProperties': false,
                                  type: 'object',
                                  properties: {
                                    'as-number': {
                                      type: 'string',
                                      default: '100'
                                    },
                                    'address-family': {
                                      type: 'string',
                                      default: 'ipv4-unicast'
                                    },
                                    'route-distinguisher': {
                                      type: 'string',
                                      default: '65000:1'
                                    },
                                    'vrf': {
                                      type: 'string',
                                      default: 'Windstream'
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    id: 'simple',
    label: 'Simple',
    model: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        alias: {
          type: 'string',
          title: 'Nickname'
        },
        onlyChild: {
          type: 'boolean'
        },
        age: {
          type: 'number',
          title: 'Age'
        }
      },
      required: ['lastName']
    }
  }
]

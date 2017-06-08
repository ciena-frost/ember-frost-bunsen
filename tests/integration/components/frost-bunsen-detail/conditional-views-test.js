import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

function renderWithValue (context, value) {
  context.set('value', value)
  context.render(hbs`{{frost-bunsen-form
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    hook=hook
    value=value
  }}`)
}

describe('Integration: frost-bunsen-form / views with conditions', function () {
  setupComponentTest('forms with conditions', {
    integration: true
  })
  describe('simple views with conditionals', function () {
    beforeEach(function () {
      this.setProperties({
        hook: 'ember-frost-bunsen-form',
        bunsenModel: {
          properties: {
            tagType: {
              type: 'string'
            },
            tag: {
              type: 'string'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cellDefinitions: {
            tagType: {
              model: 'tagType'
            },
            tag: {
              model: 'tag',
              conditions: [{
                if: [{
                  'tagType': {equals: 'tagged'}
                }]
              }]
            }
          },
          cells: [{
            children: [
              {extends: 'tagType'},
              {extends: 'tag'}
            ]
          }],
          type: 'form',
          version: '2.0'
        }
      })

      return wait()
    })

    it('hides cells when conditions are not met', function () {
      renderWithValue(this, {
        tagType: 'untagged'
      })
      return wait().then(() => {
        const $inputs = this.$('.frost-bunsen-input-text')
        expect($inputs).to.have.length(1)
      })
    })

    it('shows cells when conditions are met', function () {
      renderWithValue(this, {
        tagType: 'tagged',
        tag: 'some-tag'
      })
      return wait().then(() => {
        const $inputs = this.$('.frost-bunsen-input-text')
        expect($inputs).to.have.length(2)
      })
    })
  })
  describe('complex views with conditionals', function () {
    beforeEach(function () {
      this.setProperties({
        hook: 'ember-frost-bunsen-form',
        bunsenModel: {
          'required': [
            'label',
            'properties'
          ],
          'type': 'object',
          'properties': {
            'label': {
              'type': 'string'
            },
            'discovered': {
              'type': 'boolean'
            },
            'properties': {
              'type': 'object',
              'properties': {
                'functionality': {
                  'type': 'object',
                  'properties': {
                    'nestedNs': {
                      'type': 'boolean',
                      'default': false
                    },
                    'scaling': {
                      'type': 'boolean',
                      'default': false
                    },
                    'affinities': {
                      'type': 'boolean',
                      'default': false
                    },
                    'pnf': {
                      'type': 'boolean',
                      'default': false
                    },
                    'streamlined': {
                      'type': 'boolean',
                      'default': true
                    }
                  }
                },
                'designer': {
                  'type': 'string'
                },
                'nsdInvariantId': {
                  'type': 'string'
                },
                'nsdIdentifier': {
                  'type': 'string'
                },
                'version': {
                  'type': 'string'
                },
                'nsDf': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'nsInstantiationLevel': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'description': {
                              'type': 'string'
                            },
                            'vnfToLevelMapping': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'numberOfInstances': {
                                    'type': 'integer'
                                  },
                                  'vnfProfileId': {
                                    'type': 'string'
                                  }
                                },
                                'required': [
                                  'numberOfInstances',
                                  'vnfProfileId'
                                ]
                              }
                            },
                            'nsToLevelMapping': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'nsProfileId': {
                                    'type': 'string'
                                  },
                                  'numberOfInstances': {
                                    'type': 'integer'
                                  }
                                },
                                'required': [
                                  'nsProfileId',
                                  'numberOfInstances'
                                ]
                              }
                            },
                            'nsLevelId': {
                              'type': 'string'
                            },
                            'virtualLinkToLevelMapping': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'bitRateRequirements': {
                                    'type': 'object',
                                    'properties': {
                                      'leaf': {
                                        'type': 'number'
                                      },
                                      'root': {
                                        'type': 'number'
                                      }
                                    },
                                    'required': [
                                      'root'
                                    ]
                                  },
                                  'virtualLinkProfileId': {
                                    'type': 'string'
                                  }
                                },
                                'required': [
                                  'virtualLinkProfileId'
                                ]
                              }
                            }
                          },
                          'required': [
                            'nsLevelId'
                          ]
                        }
                      },
                      'affinityOrAntiAffinityGroup': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'affinityOrAntiAffinity': {
                              'type': 'string',
                              'enum': [
                                'AFFINITY',
                                'ANTI_AFFINITY'
                              ]
                            },
                            'groupId': {
                              'type': 'string'
                            },
                            'scope': {
                              'type': 'string',
                              'enum': [
                                'NFVI_NODE',
                                'RESOURCE_ZONE',
                                'ZONE_GROUP',
                                'NFVI-POP'
                              ]
                            }
                          },
                          'required': [
                            'affinityOrAntiAffinity',
                            'groupId',
                            'scope'
                          ]
                        }
                      },
                      'flavourKey': {
                        'type': 'string'
                      },
                      'virtualLinkProfile': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'minBitrateRequirements': {
                              'type': 'object',
                              'properties': {
                                'leaf': {
                                  'type': 'number'
                                },
                                'root': {
                                  'type': 'number'
                                }
                              },
                              'required': [
                                'root'
                              ]
                            },
                            'affinityOrAntiAffinityGroupId': {
                              'type': 'array',
                              'items': {
                                'type': 'string'
                              }
                            },
                            'maxBitrateRequirements': {
                              'type': 'object',
                              'properties': {
                                'leaf': {
                                  'type': 'number'
                                },
                                'root': {
                                  'type': 'number'
                                }
                              },
                              'required': [
                                'root'
                              ]
                            },
                            'virtualLinkDescId': {
                              'type': 'string'
                            },
                            'localAffinityOrAntiAffinityRule': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'affinityOrAntiAffinity': {
                                    'type': 'string',
                                    'enum': [
                                      'AFFINITY',
                                      'ANTI_AFFINITY'
                                    ]
                                  },
                                  'scope': {
                                    'type': 'string',
                                    'enum': [
                                      'NFVI_NODE',
                                      'RESOURCE_ZONE',
                                      'ZONE_GROUP',
                                      'NFVI-POP'
                                    ]
                                  }
                                },
                                'required': [
                                  'affinityOrAntiAffinity',
                                  'scope'
                                ]
                              }
                            },
                            'flavourId': {
                              'type': 'string'
                            },
                            'virtualLinkProfileId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'flavourId',
                            'maxBitrateRequirements',
                            'minBitrateRequirements',
                            'virtualLinkDescId',
                            'virtualLinkProfileId'
                          ]
                        }
                      },
                      'scalingAspect': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'description': {
                              'type': 'string'
                            },
                            'name': {
                              'type': 'string'
                            },
                            'nsScaleLevel': {
                              'type': 'array',
                              'items': {
                                'type': 'string'
                              }
                            },
                            'nsScalingAspectId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'description',
                            'name',
                            'nsScaleLevel',
                            'nsScalingAspectId'
                          ]
                        }
                      },
                      'vnfProfile': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'affinityOrAntiAffinityGroupId': {
                              'type': 'array',
                              'items': {
                                'type': 'string'
                              }
                            },
                            'nsOrVnfProfile': {
                              'type': 'object',
                              'properties': {}
                            },
                            'localAffinityOrAntiAffinityRule': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'affinityOrAntiAffinity': {
                                    'type': 'string',
                                    'enum': [
                                      'AFFINITY',
                                      'ANTI_AFFINITY'
                                    ]
                                  },
                                  'scope': {
                                    'type': 'string',
                                    'enum': [
                                      'NFVI_NODE',
                                      'RESOURCE_ZONE',
                                      'ZONE_GROUP',
                                      'NFVI-POP'
                                    ]
                                  }
                                },
                                'required': [
                                  'affinityOrAntiAffinity',
                                  'scope'
                                ]
                              }
                            },
                            'flavourId': {
                              'type': 'string'
                            },
                            'maxNumberOfInstances': {
                              'type': 'integer'
                            },
                            'nsVirtualLinkConnectivity': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'cpdId': {
                                    'type': 'array',
                                    'items': {
                                      'type': 'string'
                                    }
                                  },
                                  'virtualLinkProfileId': {
                                    'type': 'string'
                                  }
                                },
                                'required': [
                                  'cpdId',
                                  'virtualLinkProfileId'
                                ]
                              }
                            },
                            'instantiationLevel': {
                              'type': 'string'
                            },
                            'vnfProfileId': {
                              'type': 'string'
                            },
                            'minNumberOfInstances': {
                              'type': 'integer'
                            },
                            'vnfdId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'flavourId',
                            'maxNumberOfInstances',
                            'minNumberOfInstances',
                            'nsOrVnfProfile',
                            'nsVirtualLinkConnectivity',
                            'vnfProfileId',
                            'vnfdId'
                          ]
                        }
                      },
                      'nsProfile': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'affinityOrAntiaffinityGroupId': {
                              'type': 'array',
                              'items': {
                                'type': 'string'
                              }
                            },
                            'nsProfileId': {
                              'type': 'string'
                            },
                            'nsOrVnfProfile': {
                              'type': 'object',
                              'properties': {}
                            },
                            'maxNumberOfInstances': {
                              'type': 'integer'
                            },
                            'nsInstantiationLevelId': {
                              'type': 'string'
                            },
                            'nsdId': {
                              'type': 'string'
                            },
                            'minNumberOfInstances': {
                              'type': 'integer'
                            },
                            'nsDfId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'maxNumberOfInstances',
                            'minNumberOfInstances',
                            'nsDfId',
                            'nsOrVnfProfile',
                            'nsProfileId',
                            'nsdId'
                          ]
                        }
                      },
                      'pnfProfile': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'pnfProfileId': {
                              'type': 'string'
                            },
                            'pnfVirtualLinkConnectivity': {
                              'type': 'array',
                              'items': {
                                'type': 'object',
                                'properties': {
                                  'cpdId': {
                                    'type': 'array',
                                    'items': {
                                      'type': 'string'
                                    }
                                  },
                                  'virtualLinkProfileId': {
                                    'type': 'string'
                                  }
                                },
                                'required': [
                                  'cpdId',
                                  'virtualLinkProfileId'
                                ]
                              }
                            },
                            'pnfdId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'pnfProfileId',
                            'pnfVirtualLinkConnectivity',
                            'pnfdId'
                          ]
                        }
                      },
                      'dependencies': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      },
                      'defaultNsInstantiationLevelId': {
                        'type': 'string'
                      },
                      'nsDfId': {
                        'type': 'string'
                      }
                    },
                    'required': [
                      'flavourKey',
                      'nsDfId',
                      'nsInstantiationLevel'
                    ]
                  }
                },
                'sapd': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'sapAddressAssignment': {
                        'type': 'boolean'
                      },
                      'associatedWith': {
                        'type': 'string',
                        'enum': [
                          'CPD',
                          'VLD'
                        ]
                      },
                      'cpd': {
                        'type': 'object',
                        'properties': {
                          'description': {
                            'type': 'string'
                          },
                          'layerProtocol': {
                            'type': 'array',
                            'items': {
                              'type': 'string',
                              'enum': [
                                'Ethernet',
                                'IPv4',
                                'IPv6'
                              ]
                            }
                          },
                          'cpdRole': {
                            'type': 'string'
                          },
                          'metadata': {
                            'type': 'object',
                            'properties': {}
                          },
                          'cpdId': {
                            'type': 'string'
                          }
                        },
                        'required': [
                          'cpdId',
                          'layerProtocol'
                        ]
                      },
                      'nsVirtualLinkDescId': {
                        'type': 'string'
                      },
                      'associatedCpdId': {
                        'type': 'string'
                      }
                    },
                    'required': [
                      'associatedWith',
                      'cpd',
                      'sapAddressAssignment'
                    ]
                  }
                },
                'cpdPool': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'cpdId': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      },
                      'cpdPoolId': {
                        'type': 'string'
                      }
                    },
                    'required': [
                      'cpdId',
                      'cpdPoolId'
                    ]
                  }
                },
                'virtualLinkDesc': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'vitualLinkDescProvider': {
                        'type': 'string'
                      },
                      'security': {
                        'type': 'object',
                        'properties': {
                          'algorithm': {
                            'type': 'string'
                          },
                          'certificate': {
                            'type': 'string',
                            'enum': [
                              'TYPE_UNDEFINED_IN_MODEL'
                            ]
                          },
                          'signature': {
                            'type': 'string'
                          }
                        },
                        'required': [
                          'algorithm',
                          'signature'
                        ]
                      },
                      'virtuaLinkDescVersion': {
                        'type': 'string'
                      },
                      'virtualLinkDf': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'flavourId': {
                              'type': 'string'
                            },
                            'qos': {
                              'type': 'object',
                              'properties': {
                                'priority': {
                                  'type': 'integer'
                                },
                                'qoS': {
                                  'type': 'object',
                                  'properties': {
                                    'latency': {
                                      'type': 'number'
                                    },
                                    'packetDelayVariation': {
                                      'type': 'number'
                                    },
                                    'packetLossRatio': {
                                      'type': 'number'
                                    }
                                  },
                                  'required': [
                                    'latency',
                                    'packetDelayVariation'
                                  ]
                                }
                              },
                              'required': [
                                'qoS'
                              ]
                            },
                            'serviceAvaibilityLevel': {
                              'type': 'string',
                              'enum': [
                                'LEVEL_1',
                                'LEVEL_2',
                                'LEVEL_3'
                              ]
                            }
                          },
                          'required': [
                            'flavourId'
                          ]
                        }
                      },
                      'virtualLinkDesc': {
                        'type': 'object',
                        'properties': {
                          'connectivityType': {
                            'type': 'object',
                            'properties': {
                              'flowPattern': {
                                'type': 'string',
                                'enum': [
                                  'Line',
                                  'Tree',
                                  'Mesh'
                                ]
                              },
                              'layerProtocol': {
                                'type': 'string',
                                'enum': [
                                  'IPV4',
                                  'IPV6'
                                ]
                              }
                            },
                            'required': [
                              'layerProtocol'
                            ]
                          },
                          'description': {
                            'type': 'string'
                          },
                          'testAccess': {
                            'type': 'array',
                            'items': {
                              'type': 'string',
                              'enum': [
                                'NONE',
                                'MONITORING',
                                'LOOPBACKS'
                              ]
                            }
                          },
                          'virtualLinkDescId': {
                            'type': 'string'
                          }
                        },
                        'required': [
                          'connectivityType',
                          'virtualLinkDescId'
                        ]
                      },
                      'metadata': {
                        'type': 'object',
                        'properties': {}
                      }
                    },
                    'required': [
                      'virtuaLinkDescVersion',
                      'virtualLinkDesc',
                      'virtualLinkDf'
                    ]
                  }
                },
                'monitoredInfo': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'monitorType': {
                        'type': 'string',
                        'enum': [
                          'MONITORING_PARM',
                          'VNF_INDICATOR'
                        ]
                      },
                      'monitoringParameter': {
                        'type': 'object',
                        'properties': {
                          'monitoringParameterId': {
                            'type': 'string'
                          },
                          'name': {
                            'type': 'string'
                          },
                          'performanceMetric': {
                            'type': 'string'
                          }
                        },
                        'required': [
                          'monitoringParameterId',
                          'performanceMetric'
                        ]
                      },
                      'vnfIndicatorInfo': {
                        'type': 'object',
                        'properties': {
                          'vnfIndicator': {
                            'type': 'string'
                          },
                          'vnfdId': {
                            'type': 'string'
                          }
                        },
                        'required': [
                          'vnfIndicator',
                          'vnfdId'
                        ]
                      }
                    },
                    'required': [
                      'monitorType'
                    ]
                  }
                },
                'pnfdId': {
                  'type': 'array',
                  'items': {
                    'type': 'string'
                  }
                },
                'vnffgd': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'nfpd': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'cpd': {
                              'type': 'array',
                              'items': {
                                'type': 'string'
                              }
                            },
                            'nfpRule': {
                              'type': 'object',
                              'properties': {}
                            },
                            'nfpdId': {
                              'type': 'string'
                            }
                          },
                          'required': [
                            'cpd',
                            'nfpdId'
                          ]
                        }
                      },
                      'virtualLinkDescId': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      },
                      'vnffgdId': {
                        'type': 'string'
                      },
                      'pnfdId': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      },
                      'cpdPoolId': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      },
                      'vnfdId': {
                        'type': 'array',
                        'items': {
                          'type': 'string'
                        }
                      }
                    },
                    'required': [
                      'cpdPoolId',
                      'virtualLinkDescId',
                      'vnfdId',
                      'vnffgdId'
                    ]
                  }
                },
                'vnfdId': {
                  'type': 'array',
                  'items': {
                    'type': 'string'
                  }
                },
                'nestedNsdId': {
                  'type': 'array',
                  'items': {
                    'type': 'string'
                  }
                }
              },
              'required': [
                'functionality'
              ]
            }
          }
        },
        bunsenView: {
          'type': 'form',
          'version': '2.0',
          'cells': [
            {
              'label': 'General',
              'extends': 'general'
            },
            {
              'label': 'Network Functions',
              'extends': 'nfs'
            },
            {
              'label': 'Connectivity',
              'extends': 'connectivity'
            },
            {
              'label': 'Forwarding',
              'extends': 'forwarding'
            },
            {
              'label': 'Scaling',
              'extends': 'scaling'
            },
            {
              'label': 'Flavors',
              'extends': 'flavors'
            }
          ],
          'cellDefinitions': {
            'general': {
              'children': [
                {
                  'label': 'Resource',
                  'extends': 'resource'
                },
                {
                  'label': 'Functionality',
                  'model': 'properties.functionality',
                  'extends': 'functionality'
                },
                {
                  'label': 'NS Info',
                  'extends': 'nsInfo'
                }
              ]
            },
            'nfs': {
              'children': [
                {
                  'model': 'properties.vnfdId',
                  'label': 'VNFD Ids'
                },
                {
                  'model': 'properties.pnfdId',
                  'label': 'PNFD Ids',
                  'description': 'References the PNFD of a constituent PNF.',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.pnf': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'properties.nestedNsdId',
                  'label': 'Nested NSD Ids',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.nestedNs': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'connectivity': {
              'children': [
                {
                  'model': 'properties.virtualLinkDesc',
                  'label': 'Virtual link descriptors',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'vl'
                    }
                  }
                },
                {
                  'model': 'properties.sapd',
                  'label': 'SAPDs',
                  'description': 'Provides the descriptors of SAPs of the NS.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'sapd'
                    }
                  }
                }
              ]
            },
            'forwarding': {
              'children': [
                {
                  'model': 'properties.cpdPool',
                  'label': 'CPD Pools',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'cpdPool'
                    }
                  }
                },
                {
                  'model': 'properties.vnffgd',
                  'label': 'VNF Forwarding Graph Descs',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'vnffgd'
                    }
                  }
                }
              ]
            },
            'scaling': {
              'children': [
                {
                  'model': 'properties.monitoredInfo',
                  'label': 'Monitored Info',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'monitoredInfo'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.scaling': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'flavors': {
              'children': [
                {
                  'model': 'properties.nsDf',
                  'label': 'Deployment Flavors',
                  'description': 'Identifies a deployment flavor within the scope of an NSD.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'deploymentFlavors'
                    }
                  }
                }
              ]
            },
            'resource': {
              'children': [
                {
                  'model': 'label'
                }
              ]
            },
            'functionality': {
              'children': [
                {
                  'model': 'streamlined',
                  'description': 'Show streamlined forms omitting uncommon options.',
                  'classNames': {
                    'cell': 'one-third'
                  }
                },
                {
                  'model': 'pnf',
                  'description': 'Show PNF related fields on forms.',
                  'classNames': {
                    'cell': 'one-third'
                  }
                },
                {
                  'model': 'nestedNs',
                  'description': 'Show nested NS related fields on forms.',
                  'classNames': {
                    'cell': 'one-third'
                  }
                },
                {
                  'model': 'affinities',
                  'description': 'Show affinity or anti-affinity placement fields on forms.',
                  'classNames': {
                    'cell': 'one-third'
                  }
                },
                {
                  'model': 'scaling',
                  'description': 'Show scaling-related fields on forms.',
                  'classNames': {
                    'cell': 'one-third'
                  }
                }
              ]
            },
            'nsInfo': {
              'children': [
                {
                  'model': 'properties.nsdIdentifier',
                  'label': 'Identifier',
                  'description': 'Identifier of this NSD class. It globally uniquely identifies an instance of the NSD.'
                },
                {
                  'model': 'properties.designer',
                  'label': 'Designer',
                  'description': 'Identifies the designer of the NSD.'
                },
                {
                  'model': 'properties.version',
                  'label': 'Version',
                  'description': 'Identifies the version of the NSD.'
                },
                {
                  'model': 'properties.nsdInvariantId',
                  'label': 'NSD invariant id'
                }
              ]
            },
            'sapd': {
              'children': [
                {
                  'model': 'cpd',
                  'description': 'Common CPD parameters.',
                  'extends': 'cpdCommon'
                },
                {
                  'model': 'sapAddressAssignment',
                  'label': 'SAP address assignment',
                  'renderer': {
                    'name': 'button-group',
                    'size': 'small'
                  }
                },
                {
                  'model': 'associatedWith',
                  'label': 'Associated with',
                  'description': 'SAPD is associated either with an CPD or a VLD.'
                },
                {
                  'model': 'nsVirtualLinkDescId',
                  'label': 'VL descriptor id',
                  'conditions': [
                    {
                      'if': [
                        {
                          'associatedWith': {
                            'equals': 'VLD'
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'associatedCpdId',
                  'label': 'CPD id',
                  'conditions': [
                    {
                      'if': [
                        {
                          'associatedWith': {
                            'equals': 'CPD'
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'vl': {
              'children': [
                {
                  'model': 'virtualLinkDesc.virtualLinkDescId',
                  'label': 'Id',
                  'description': 'Identifies a VL descriptor within the VNFD.'
                },
                {
                  'model': 'virtualLinkDesc.description',
                  'label': 'Description'
                },
                {
                  'model': 'vitualLinkDescProvider',
                  'label': 'VL descriptor provider',
                  'description': 'Defines the organization generating the VLD.'
                },
                {
                  'model': 'virtuaLinkDescVersion',
                  'label': 'VL descriptor version',
                  'description': 'Specifies the version of the VLD.'
                },
                {
                  'model': 'virtualLinkDf',
                  'label': 'VLD flavors',
                  'description': 'Specifies properties for instantiating a VL according to a specific flavor.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'vldf'
                    }
                  }
                },
                {
                  'model': 'virtualLinkDesc.connectivityType',
                  'label': 'Connectivity type',
                  'description': 'Specifies the protocol exposed by a VL and the flow pattern supported by the VL.',
                  'children': [
                    {
                      'model': 'layerProtocol',
                      'label': 'Layer protocol'
                    },
                    {
                      'model': 'flowPattern',
                      'label': 'Flow pattern',
                      'description': 'Identifies the flow pattern of the connectivity (Line, Tree, Mesh, etc.).',
                      'conditions': [
                        {
                          'unless': [
                            {
                              'properties.functionality.streamlined': {
                                'equals': true
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'virtualLinkDesc.testAccess',
                  'label': 'Test access',
                  'conditions': [
                    {
                      'unless': [
                        {
                          'properties.functionality.streamlined': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'vnffgd': {
              'children': [
                {
                  'model': 'vnffgdId',
                  'label': 'Id',
                  'description': 'Identifies a VNF forwarding graph descriptor within the NSD.'
                },
                {
                  'model': 'vnfdId',
                  'label': 'VNFD ids'
                },
                {
                  'model': 'pnfdId',
                  'label': 'PNFD ids',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.pnf': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'virtualLinkDescId',
                  'label': 'VL descriptor ids'
                },
                {
                  'model': 'cpdPoolId',
                  'label': 'CPD pool ids'
                },
                {
                  'model': 'nfpd',
                  'label': 'NFPD',
                  'description': 'Identifies this deployment flavor within a VLD.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'nfp'
                    }
                  }
                }
              ]
            },
            'monitoredInfo': {
              'children': [
                {
                  'model': 'monitorType',
                  'label': 'Monitor type',
                  'description': 'Monitored data is either a monitoring parameter or a VNF indicator.'
                },
                {
                  'model': 'vnfIndicatorInfo',
                  'label': 'VNF indicator info',
                  'description': 'Uniquely identifies the VNF Indicator.',
                  'conditions': [
                    {
                      'if': [
                        {
                          'associatedWith': {
                            'equals': 'VNF_INDICATOR'
                          }
                        }
                      ]
                    }
                  ],
                  'children': [
                    {
                      'model': 'vnfdId',
                      'label': 'VNFD id',
                      'description': 'Identifies a VNFD.'
                    },
                    {
                      'model': 'vnfIndicator',
                      'label': 'Id',
                      'description': 'Identifies a VNF indicator within the VNFD.'
                    }
                  ]
                },
                {
                  'model': 'monitoringParameter',
                  'label': 'Monitoring parameter',
                  'conditions': [
                    {
                      'if': [
                        {
                          'associatedWith': {
                            'equals': 'MONITORING_PARM'
                          }
                        }
                      ]
                    }
                  ],
                  'children': [
                    {
                      'model': 'monitoringParameterId',
                      'label': 'Id',
                      'description': 'Unique identifier of this monitoring parameter.'
                    },
                    {
                      'model': 'name',
                      'label': 'Name',
                      'description': 'Human readable name of the monitoring parameter.'
                    },
                    {
                      'model': 'performanceMetric',
                      'label': 'Performance metric'
                    }
                  ]
                }
              ]
            },
            'cpdPool': {
              'children': [
                {
                  'model': 'cpdPoolId',
                  'label': 'Id'
                },
                {
                  'model': 'cpdId',
                  'label': 'CPD ids'
                }
              ]
            },
            'nfp': {
              'children': [
                {
                  'model': 'nfpdId',
                  'label': 'Id',
                  'description': 'Identifies a network forwarding path descriptor within a VNFFGD.'
                },
                {
                  'model': 'nfpRule',
                  'label': 'NFP rule'
                },
                {
                  'model': 'cpd',
                  'label': 'CPD ids'
                }
              ]
            },
            'deploymentFlavors': {
              'children': [
                {
                  'model': 'nsDfId',
                  'label': 'Id',
                  'description': 'Identifies this NS deployment flavor within the NSD.'
                },
                {
                  'model': 'flavourKey',
                  'label': 'Flavor key'
                },
                {
                  'model': 'affinityOrAntiAffinityGroup',
                  'label': '(Anti)Affinity groups',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'affinityOrAntiAffinityGroup'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'virtualLinkProfile',
                  'label': 'VL profiles',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'vlProfile'
                    }
                  }
                },
                {
                  'model': 'vnfProfile',
                  'label': 'VNF profiles',
                  'description': 'VNF Profile to be used for the NS flavor.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'vnfProfile'
                    }
                  }
                },
                {
                  'model': 'pnfProfile',
                  'label': 'PNF profiles',
                  'description': 'PNF profile to be used for the NS flavor.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'pnfProfile'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.pnf': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'nsProfile',
                  'label': 'Nested NS profiles',
                  'description': 'Nested NS Profile to be used for the NS flavor.',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'nsProfile'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.nestedNs': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'nsInstantiationLevel',
                  'label': 'NS instantiation levels',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'nsLevel'
                    }
                  }
                },
                {
                  'model': 'defaultNsInstantiationLevelId',
                  'label': 'Default NS instantiation level id'
                },
                {
                  'model': 'scalingAspect',
                  'label': 'Scaling Aspects',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'scalingAspect'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.scaling': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'dependencies',
                  'label': 'Dependency ids',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'dependency'
                    }
                  },
                  'conditions': [
                    {
                      'unless': [
                        {
                          'properties.functionality.streamlined': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'vnfProfile': {
              'children': [
                {
                  'model': 'vnfProfileId',
                  'label': 'Id',
                  'description': 'Uniquely identifies a VNF profile within the DF.'
                },
                {
                  'model': 'vnfdId',
                  'label': 'VNFD id',
                  'description': 'References a VNFD.'
                },
                {
                  'model': 'flavourId',
                  'label': 'Flavor id',
                  'description': 'Identifies a flavour within the VNFD.'
                },
                {
                  'model': 'instantiationLevel',
                  'label': 'Instantiation level'
                },
                {
                  'model': 'minNumberOfInstances',
                  'label': 'Minimum number of instances'
                },
                {
                  'model': 'maxNumberOfInstances',
                  'label': 'Maximum number of instances'
                },
                {
                  'model': 'localAffinityOrAntiAffinityRule',
                  'label': 'Local (Anti)Affinity rule',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'localAffinityOrAntiAffinityRule'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'affinityOrAntiAffinityGroupId',
                  'label': '(Anti)Affinity group ids',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'nsVirtualLinkConnectivity',
                  'label': 'NS VL connectivity',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'nsVlConnectivity'
                    }
                  }
                }
              ]
            },
            'pnfProfile': {
              'children': [
                {
                  'model': 'pnfProfileId',
                  'label': 'Id',
                  'description': 'Uniquely identifies a PNF profile within the DF.'
                },
                {
                  'model': 'pnfdId',
                  'label': 'PNFD id',
                  'description': 'References a PNFD.'
                },
                {
                  'model': 'pnfVirtualLinkConnectivity',
                  'label': 'NS VL connectivity',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'nsVlConnectivity'
                    }
                  }
                }
              ]
            },
            'nsProfile': {
              'children': [
                {
                  'model': 'nsProfileId',
                  'label': 'Id',
                  'description': 'Uniquely identifies an NS profile within the DF.'
                },
                {
                  'model': 'nsdId',
                  'label': 'NSD id',
                  'description': 'Identifies the NSD applicable to NS instantiated according to this profile.'
                },
                {
                  'model': 'nsDfId',
                  'label': 'NSDF id',
                  'description': 'Identifies the applicable NS DF within the scope of the NSD.'
                },
                {
                  'model': 'nsInstantiationLevelId',
                  'label': 'NS instantiation level id'
                },
                {
                  'model': 'minNumberOfInstances',
                  'label': 'Minimum number of instances'
                },
                {
                  'model': 'maxNumberOfInstances',
                  'label': 'Maximum number of instances'
                },
                {
                  'model': 'affinityOrAntiaffinityGroupId',
                  'label': '(Anti)Affinity group ids',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'vlProfile': {
              'children': [
                {
                  'model': 'virtualLinkProfileId',
                  'label': 'Id',
                  'description': 'Uniquely identifies a VL profile within the DF.'
                },
                {
                  'model': 'virtualLinkDescId',
                  'label': 'VLD id',
                  'description': 'Uniquely references a VLD.'
                },
                {
                  'model': 'flavourId',
                  'label': 'Flavor id',
                  'description': 'Identifies a flavour within the VLD.'
                },
                {
                  'model': 'localAffinityOrAntiAffinityRule',
                  'label': 'Local (Anti)Affinity rule',
                  'arrayOptions': {
                    'itemCell': {
                      'extends': 'localAffinityOrAntiAffinityRule'
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'affinityOrAntiAffinityGroupId',
                  'label': '(Anti)Affinity group ids',
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.affinities': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'maxBitrateRequirements',
                  'label': 'Maximum bitrate requirements',
                  'extends': 'bitrateReqs',
                  'conditions': [
                    {
                      'unless': [
                        {
                          'properties.functionality.streamlined': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'model': 'minBitrateRequirements',
                  'label': 'Minimum bitrate requirements',
                  'extends': 'bitrateReqs',
                  'conditions': [
                    {
                      'unless': [
                        {
                          'properties.functionality.streamlined': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'nsVlConnectivity': {
              'children': [
                {
                  'model': 'virtualLinkProfileId',
                  'label': 'VL profile id',
                  'description': 'Reference an NS VL profile.'
                },
                {
                  'model': 'cpdId',
                  'label': 'CPD ids'
                }
              ]
            },
            'localAffinityOrAntiAffinityRule': {
              'children': [
                {
                  'model': 'affinityOrAntiAffinity',
                  'label': '(Anti)Affinity',
                  'description': 'Specifies the type of the rule: "affinity" or "anti-affinity".'
                },
                {
                  'model': 'scope',
                  'label': 'Scope',
                  'description': 'Specifies whether the scope of the rule is an NFVI-node, an NFVI-PoP, etc.'
                }
              ]
            },
            'nsLevel': {
              'children': [
                {
                  'model': 'nsLevelId',
                  'label': 'Id',
                  'description': 'Uniquely identifies an NS level within the DF.'
                },
                {
                  'model': 'description',
                  'label': 'Description',
                  'description': 'Human readable description of the NS level.'
                },
                {
                  'model': 'vnfToLevelMapping',
                  'label': 'VNF to level mapping',
                  'arrayOptions': {
                    'itemCell': {
                      'children': [
                        {
                          'model': 'vnfProfileId',
                          'label': 'VNF profile id',
                          'description': 'Identifies the profile to be used for a VNF involved in an NS level.'
                        },
                        {
                          'model': 'numberOfInstances',
                          'label': 'Number of instances'
                        }
                      ]
                    }
                  }
                },
                {
                  'model': 'virtualLinkToLevelMapping',
                  'label': 'VL to level mapping',
                  'arrayOptions': {
                    'itemCell': {
                      'children': [
                        {
                          'model': 'virtualLinkProfileId',
                          'label': 'VL profile id',
                          'description': 'Identifies the profile to be used for a VL involved in an NS level.'
                        },
                        {
                          'model': 'bitRateRequirements',
                          'label': 'Bitrate requirements',
                          'extends': 'bitrateReqs'
                        }
                      ]
                    }
                  }
                },
                {
                  'model': 'nsToLevelMapping',
                  'label': 'NS to level mapping',
                  'arrayOptions': {
                    'itemCell': {
                      'children': [
                        {
                          'model': 'nsProfileId',
                          'label': 'NS profile id',
                          'description': 'Identifies the profile to be used for a nested NS involved in the NS level.'
                        },
                        {
                          'model': 'numberOfInstances',
                          'label': 'Number of instances'
                        }
                      ]
                    }
                  },
                  'conditions': [
                    {
                      'if': [
                        {
                          'properties.functionality.nestedNs': {
                            'equals': true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'dependency': {
              'children': [
                {
                  'model': 'primaryId',
                  'label': 'Primary id'
                },
                {
                  'model': 'secondaryId',
                  'label': 'Secondary id'
                }
              ]
            },
            'scalingAspect': {
              'children': [
                {
                  'model': 'nsScalingAspectId',
                  'label': 'Id',
                  'description': 'Uniquely identifies the NS scaling aspect in an NSD.'
                },
                {
                  'model': 'name',
                  'label': 'Name',
                  'description': 'Provides a human readable name of the NS scaling aspect.'
                },
                {
                  'model': 'description',
                  'label': 'Description',
                  'description': 'Provides a human readable description of the NS scaling aspect.'
                },
                {
                  'model': 'nsScaleLevel',
                  'label': 'NS scale level ids'
                }
              ]
            },
            'affinityOrAntiAffinityGroup': {
              'children': [
                {
                  'model': 'groupId',
                  'label': 'Id',
                  'description': 'Identifier of the AffinityOrAntiAffinity group.'
                },
                {
                  'model': 'scope',
                  'label': 'Scope'
                },
                {
                  'model': 'affinityOrAntiAffinity',
                  'label': 'Affinity or Anti-Affinity'
                }
              ]
            },
            'vldf': {
              'children': [
                {
                  'model': 'flavourId',
                  'label': 'Id',
                  'description': 'Identifies this deployment flavor within a VLD.'
                },
                {
                  'model': 'qos',
                  'label': 'QoS',
                  'description': 'Specifies quality of service parameters applicable to a VL.',
                  'children': [
                    {
                      'model': 'qoS.latency',
                      'label': 'Latency',
                      'description': 'Specifies the maximum latency in ms.'
                    },
                    {
                      'model': 'qoS.packetDelayVariation',
                      'label': 'Packet delay variation',
                      'description': 'Specifies the maximum jitter in ms.'
                    },
                    {
                      'model': 'qoS.packetLossRatio',
                      'label': 'Packet loss ratio',
                      'description': 'Specifies the maximum packet loss ratio.'
                    },
                    {
                      'model': 'priority',
                      'label': 'Priority'
                    }
                  ]
                },
                {
                  'model': 'serviceAvaibilityLevel',
                  'label': 'Id'
                }
              ]
            },
            'bitrateReqs': {
              'children': [
                {
                  'model': 'root',
                  'label': 'Root'
                },
                {
                  'model': 'leaf',
                  'label': 'Leaf'
                }
              ]
            },
            'cpdCommon': {
              'children': [
                {
                  'model': 'cpdId',
                  'label': 'Id',
                  'description': 'Identifier of the CPD.'
                },
                {
                  'model': 'cpdRole',
                  'label': 'Role'
                },
                {
                  'model': 'description',
                  'label': 'Description'
                },
                {
                  'model': 'layerProtocol'
                }
              ]
            }
          }
        }
      })

      return wait()
    })
    it('handles cases with multiple cell configs extending a cell definition', function () {
      renderWithValue(this, {
        includeTags: true,
        aTags: [{tagType: 'foo', tag: 'bar'}],
        bTags: [{tagType: 'baz', tag: 'quux'}]
      })

      return wait().then(() => {
        const $inputs = this.$('.frost-field')
        expect($inputs).to.have.length(10)
      })
    })
  })
})

#### Properties

---------------
| Name | Type | Description |
| ---- | ---- | ----------- |
| `bunsenId` | `String` | The path to the model |
| `bunsenModel` | `Ember.Object` | The model being referenced |
| `cellConfig` | `Object` | The view cell definition |
| `disabled` | `Boolean` | Whether the form is disabled |
| `renderErrorMessage` | `String` | The error message to display |
| `renderLabel` | `String` | The displayable label to display |
| `showRequiredLabel` | `Boolean` | Whether to show the required label |
| `transformedValue` | `any` | The input value after any transformations have been applied |
| `value` | `any` | String | The raw input value |

#### Methods

------------

#### parseValue

Used to parse the user-supplied value of the component

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
|`data` | `Event` | The event passed to the default `handleChange` action |

#### Callbacks

--------------

#### onChange

*Inform the consumer that the value has changed*

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `bunsenId` | `String` | The path to the model being changed |
| `value` | `any` | The new value |

<br />
#### registerForFormValueChanges

*Used to listen to changes to the entire form*

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `component` | `Ember.Component` | The component being registered |

<br />
#### registerValidator

*Enable hooks into the validator system*

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
|`component` | `Ember.Component` | The component being registered |

<br />
#### triggerValidation

*Invoke this callback to trigger validation*

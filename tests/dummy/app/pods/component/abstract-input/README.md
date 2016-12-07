#### Properties

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

| Name | Parameters | Description |
| ---- | ---------- | ----------- |
| `parseValue` | | Used to parse the user-supplied value of the component |
||`data` | The event passed to the default `handleChange` action |

#### Callbacks

| Name | Parameters | Description |
| ---- | ---------- | ----------- |
| `onChange` || Inform the consumer that the value has changed |
|| `bunsenId` | The path to the model being changed |
|| `value` | The new value |
| `registerForFormValueChanges` || Used to listen to changes to the entire form | |      | || `component` | The component being registered |
|| `registerValidator` || Enable hooks into the validator system |
|| `component` | The component being registered |
| `triggerValidation` | | Invoke this callback to trigger validation |

#### Properties

##### `autofocus` : *boolean*

Whether or not to focus on first input in form

##### **[required]** `bunsenModel` : *Ember.Object or object*

Model definition

##### `bunsenView` : *Ember.Object or Object*

View definition

##### `disabled` : *boolean*

Whether or not to disable entire form

##### `onChange(formValue)` : *Function*

Callback for when form values change

##### `onValidation(validationResults)` : *Function*

Callback for when form is validated

##### `renderers` : *Ember.Object or object*

Custom renderer template helper mappings

##### `showAllErrors` : *boolean*

Whether or not to show all errors even before the user interacts with the form. The default value is `false`.

##### `validateOnVisibilityChange` : *boolean*

Whether or not to trigger validation when the page loses and regains focus. The default value is `true`.

##### `validators` : *Array<Function>*

List of custom validation functions

##### `value` : *Ember.Object or object*

Value to initialize form with

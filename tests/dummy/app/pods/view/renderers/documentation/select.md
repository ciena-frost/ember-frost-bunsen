## select

This renderer provides a select input that allows for only one option to be selected.
This is the default renderer when the model contains the property `enum` or the property `modelType`.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo"
}
```

#### placeholder

```json
{
  "model": "foo",
  "placeholder": "Select something…"
}
```

### Querying Data

The model and view can be configured to fetch the select options from the server.

```js
// Model schema
{
  "modelType": "<ember-data-model>"
  "query": {
    "label": "$filter"
  }
}
```

This maps to an Ember Data query,

```js
this.get('store').query('modelType', {
  label: "$filter"
})`
```

Use `$filter` as a placeholder for the text the user types into the `select` input. Optionally, you can reference other fields from the form value.

```js
// Model schema
{
  "modelType": "<ember-data-model>"
  "query": {
    "label": "$filter",
    "type": "${./type}"
  }
}
```

### Local Filtering vs Server Filtering

By default, `select` issues a request on every `onInput` with the `$filter` set appropriately so you can filter the results on the server. If your server does support filtering or if the results are small enough, you can enable local filtering.


```js
// UI schema 2
{
  model: 'foo',
  renderer: {
    name: 'select',
    localFiltering: true
  }
}
```

### Static Select Options

Sometimes, it is necessary populate the list with static options which are then merged with the results from the server. Many times it is also required to provided user-friendly labels if the `enum` values are not user-friendly enough. You can configure this data like so.

```js
// UI schema 2
{
  model: 'foo',
  renderer: {
    name: 'select',
    data: [{
      label: 'Custom Option',
      value: 'custom_option'
    }]
  }
}
```

If you use this option, it will replace the list of options sourced from `enum` but `enum` is still required for validation.

### None Option

If the only extra option you need is `None`, you can toggle that on. It will appear before your other options and it will not replace the options sourced from `enum`.

```js
// UI schema 2
{
  model: 'foo',
  renderer: {
    name: 'select',
    none: {
      label: 'Your label', // defaults to 'None'
      present: true,
      value: 'Your value', // defaults to ''
    }
  }
}
```

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


#### width

Sometimes you find yourself with some really long data, and the automatic truncation features of the select component aren't helping, or are obscuring the data in user-unfriendly ways. Other times you have an Enum of very short values (e.g., ['HTTP', 'FTP', 'UDP']), and that big ol' select just looks silly.  In these cases you can tell Bunsen to force the select element's width.

```js
// UI schema 2
{
  model: 'foo',
  renderer: {
    name: 'select',
    width: 500
  }
}
```

Note: It's entirely possible that width restrictions set on the `.frost-bunsen-left-input` or other wrapper CSS classes in your consuming app my still act to limit the select component's horizontal size.

### Querying Data

The model and view can be configured to fetch the select options from the
server using Ember Data or an API endpoint directly.

#### Ember Data

In order to use Ember Data you must have the appropriate Ember Data model,
adapter, and serializer in your app to properly map an API endpoint into
data Ember Data understands. Assuming you have a basic understanding of that
this example will show you how to wire bunsen up to your Ember Data model.

**Model**

```json
{
  "modelType": "<ember-data-model>",
  "query": {
    "label": "$filter"
  }
}
```

This maps to an Ember Data query,

```js
this.get('store').query('modelType', {
  label: "$filter"
})
```

Use `$filter` as a placeholder for the text the user types into the `select` input. Optionally, you can reference other fields from the form value.

**Model**

```json
{
  "modelType": "<ember-data-model>",
  "query": {
    "label": "$filter",
    "type": "${./type}"
  }
}
```

When using a paged API, the initial value from the form might not be included in the regular query,
causing the select to appear blank even though the form has the value set. If this is a concern, set `queryForCurrentValue`
to execute a second API call to make sure the current value is included in the select options and can be displayed correctly.

*Note: This second API call is made with `store.findRecord()`, which requires that the value be a record id.

 **Model**

 ```json
 {
   "modelType": "<ember-data-model>",
   "query": {
     "label": "$filter",
     "type": "${./type}"
   },
   "queryForCurrentValue": true
 }
 ```

#### API Endpoint

This lets you specify an endpoint directly in which to fetch the data. The first
option you'll need to set is `endpoint` which is the URL to the API you want to
fetch data from. Similar to the Ember Data options you can configure the `query`
option which gets mapped to query parameters on your endpoint and supports
the template approach to reference other properties. Next you need to tell
bunsen where in the response the data lives, which is achieved via the
`recordsPath` option. If the API response is a literal array of records you can
set this to an empty string, otherwise it is the path to the records which could
be something like: `data.records`. Once we know where to find the records you
provide the `labelAttribute` and `valueAttribute` properties just like for the
Ember Data scenario to inform us which properties in the records to use for the
label and value respectively.

> Note: You can specify these options in the model, view, or both. Bunsen will
merge the options from the two places with the view options taking precedence
over the model options.

**Model**

```json
{
  "properties": {
    "item": {
      "type": "string"
    }
  },
  "type": "object"
}
```

**View Cell**

```json
{
  "model": "item",
  "renderer": {
    "name": "select",
    "options": {
      "endpoint": "http://data.consumerfinance.gov/api/views.json",
      "labelAttribute": "name",
      "recordsPath": "",
      "valueAttribute": "id"
    }
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

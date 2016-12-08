## geolocation

This renders an address input with geolocation lookup support. This renderer
uses MapQuest's geolocation services under the hood. In order to leverage this
functionality your Ember application will need to configure a MapQuest API key
in it's environment or directly in the bunsen view itself. In order to configure
this API key once for your entire app you'll need to add the following to your
environment configuration (`config/environment.js`):

```js
module.exports = function (environment) {
  var ENV = {
    // The rest of your configuration goes here…
    'ember-frost-bunsen': {
      MAPQUEST_API_KEY: process.env.MAPQUEST_API_KEY
    }
  }
```

> Note: You can get a developer API key [here](https://developer.mapquest.com/).


### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "geolocation"
  }
}
```

#### renderer.apiKey

If you choose not to set the API key for the entire app, you can pass it
directly in your view with this property.

```json
{
  "model": "foo",
  "renderer": {
    "apiKey": "<your-api-key-goes-here>",
    "name": "geolocation"
  }
}
```

#### renderer.refs

Documentation coming soon…

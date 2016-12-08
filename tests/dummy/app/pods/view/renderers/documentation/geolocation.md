## geolocation

This renders an address input with geolocation lookup support.

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

> Note: this is a required property and should be your developer API key for the
> service being used to perform the lookup. Currently this is a MapQuest API key
> but may be extended in the future to support other services as well.

[Get a MapQuest developer API key](https://developer.mapquest.com/)

{
  "model": "foo",
  "renderer": {
    "apiKey": "<your-api-key-goes-here>",
    "name": "geolocation"
  }
}

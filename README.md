# js-instrument

![Screenshot](screenshot.png "Screenshot")

A Web Extension version of [OpenWPM](https://github.com/citp/OpenWPM) and
[Privacy Badger](https://github.com/EFForg/privacybadger) code for detecting
which APIs are being used ... for fingerprinting.

Specifically started from [this version of OpenWPM
content.js](https://github.com/citp/OpenWPM/blob/1b0bafbba5bf9fd3d9049d013a7e589e12cc6fc3/automation/Extension/firefox/data/content.js)

This extension simply display the API calls in the console - it does not store
anything in a database. If you need all that good stuff, you should really look
into OpenWPM - it's good people.

## Run it

You should really use the [`web-ext`](https://www.npmjs.com/package/web-ext)
tool - it's great. After you've installed it globally ...

```
cd js-instrument
web-ext run
```

In the Firefox browser that opens:

1. Open the Web Console tool
2. Navigate to any page
3. Observe the "Successfully started all instrumentation." line

You should also see lots of output in the format: `type: logCall ; msg:
<Object> ; msg.value: `

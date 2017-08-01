const URL = require('url-parse')

class WebRequestListener {
  constructor (shouldStoreParams) {
    this.storeParams = shouldStoreParams
    this.data = {}
    const req = browser.webRequest // eslint-disable-line no-undef
    req.onBeforeRequest.addListener(this.handleBeforeRequest, undefined, ['requestBody'])
    req.onBeforeSendHeaders.addListener(this.handleBeforeSendHeaders, undefined, ['requestHeaders'])
  }
  logTuple (src, dest, paramKey, paramValue) {
    if (!this.data.hasOwnProperty(dest)) { // if not seen dest before
      this.data[dest] = { // create entry for this dest
        'detected_times': 0,
        's_domain_list': [],
        'tuples': []
      }
    }
    this.data[dest]['detected_times'] += 1
    if (this.data[dest]['s_domain_list'].indexOf(src) === -1) { // if new src
      this.data[dest]['s_domain_list'].push(src)
    }
    if (this.storeParams) {
      this.data[dest]['tuples'].push({src, dest, paramKey, paramValue})
    }
  }
  examineUrl (urlString, originUrlString) {
    const parsedUrl = new URL(urlString, undefined, true) // parse query
    const parsedOriginUrl = new URL(originUrlString)
    const src = parsedOriginUrl.hostname
    const dest = parsedUrl.hostname
    if (src === dest) {
      return false // ignore if this is a 1st party request
    }
    for (let key in Object.keys(parsedUrl.query)) {
      this.logTuple(src, dest, key, parsedUrl.query[key])
    }
    return true
  }
  examinePostBody (body) {
    // TODO:
  }
  examineHeader (header) { // parse through header, log any parameters found
    // TODO:
  }
  handleBeforeRequest (details) { // for getting url and POST body
    const is3rdParty = this.examineUrl(details.url, details.originUrl)
    if (is3rdParty) {
      if (details.method === 'POST') {
        this.examinePostBody(details.requestBody)
      }
    }
  }
  handleBeforeSendHeaders (details) { // for getting Headers and Cookies
    const is3rdParty = this.examineUrl(details.url, details.originUrl)
    if (is3rdParty) {
      this.examineHeader(details.requestHeaders)
    }
  }
}

const listener = new WebRequestListener(true) // eslint-disable-line no-unused-vars

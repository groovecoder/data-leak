const URL = require('url-parse')

class WebRequestListener {
  constructor (shouldStoreParams) {
    this.storeParams = shouldStoreParams
    this.data = {}
    this.tabHost = []
    const req = browser.webRequest // eslint-disable-line no-undef
    const match = {urls: ['*://*/*']}
    req.onBeforeRequest.addListener(this.handleBeforeRequest.bind(this), match, ['requestBody'])
    req.onBeforeSendHeaders.addListener(this.handleBeforeSendHeaders.bind(this), match, ['requestHeaders'])
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

  checkIf3rdParty (details, src, dest) {
    const tabId = details.tabId
    if (details.frameId === 0) { // if top frame
      this.tabHost[tabId] = src
    }
    return (this.tabHost[tabId] === dest)
  }

  examineUrl (details) {
    const parsedUrl = new URL(details.url, undefined, true) // parse query
    const parsedOriginUrl = new URL(details.originUrl)
    const src = parsedOriginUrl.hostname
    const dest = parsedUrl.hostname
    if (this.checkIf3rdParty(details, src, dest)) {
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
    const is3rdParty = this.examineUrl(details)
    if (is3rdParty) {
      if (details.method === 'POST') {
        this.examinePostBody(details.requestBody)
      }
    }
  }
  handleBeforeSendHeaders (details) { // for getting Headers and Cookies
    const is3rdParty = this.examineUrl(details)
    if (is3rdParty) {
      this.examineHeader(details.requestHeaders)
    }
  }
}

const listener = new WebRequestListener(true) // eslint-disable-line no-unused-vars

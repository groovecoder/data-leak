function makeEventReport(event_name){
    return async function ({url,responseHeaders: headers}) {
        // TODO: storage this
        return {responseHeaders: headers};
    }
}

const filter = {
    urls:["<all_urls>"],
    types:['xmlhttprequest']
};

const headerOptions = ["responseHeaders", "blocking"]

chrome.webRequest.onHeadersReceived.addListener(
    makeEventReport('onHeadersReceived'), filter, headerOptions
);

function makeRequestReport(event_name, browswer){
    return async function (request) {
        // TODO: storage this
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    makeRequestReport('onBeforeRequest'), filter
);


// onBeforeSendHeaders

/* Main content script for extension
 * 2021 Ross Jacobs 
 */

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("FIND_DISCUSSIONS_EXTN: started with event", event)
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, async (tabs) => {
        const tab = tabs[0];
        const fullUrl = tab.url || tab.pendingUrl;  // If url isn't available, page is still loading
        if (fullUrl && fullUrl.startsWith("http")) {
            // remove search and heash from url
            const urlObj = new URL(fullUrl)
            const url = urlObj.protocol+'//'+urlObj.host+urlObj.pathname
            await runExtn(url)
        } else {
            console.error(`Tab url for tab ID ${tab.id} not found`)
        }
    });
});
    
async function runExtn(url: string) {
    // Dynamic imports per https://stackoverflow.com/a/53033388/
    const hnJsUrl = chrome.runtime.getURL("build/hn.js");
    const hn = await import(hnJsUrl);
    const redditJsUrl = chrome.runtime.getURL("build/reddit.js");
    const reddit = await import(redditJsUrl);
    const stackExchangeJsUrl = chrome.runtime.getURL("build/stackexchange.js");
    const stackExchange = await import(stackExchangeJsUrl);
    const utilsJsUrl = chrome.runtime.getURL("build/utils.js");
    const utils = await import(utilsJsUrl);

    let all_results: any = [];
    console.log("Reading info for url:" + url)
    try {
        const HN_ALGOLIA_DEFAULT_LIMIT = 30
        const hn_results = await hn.searchHN(url, ["story"], HN_ALGOLIA_DEFAULT_LIMIT);
        all_results = all_results.concat(hn_results)
    } catch(err) { console.log("Unable to fetch hacker news results." + err) }
    try {
        const reddit_results = await reddit.search_reddit(url, ["post"], "top");
        all_results = all_results.concat(reddit_results)
    } catch(err) { console.log("Unable to fetch reddit results." + err) }
    try {
        const se_results = await stackExchange.search_stack_exchange(url, ["question", "answer"], "activity", ["stackoverflow"]);
        all_results = all_results.concat(se_results)
    } catch(err) { console.log("Unable to fetch stack exchange results." + err) }
    console.log(all_results)
    if (all_results.length > 0) {
        // filter out 0 comment discussions
        all_results = all_results.filter((r: any) => r.comment_count > 0);
        // sort descending
        all_results = all_results.sort((a: any, b: any) => {return b.comment_count - a.comment_count});
    }
    await chrome.browserAction.setBadgeText({text: all_results.length.toString()});
    await chrome.browserAction.setBadgeBackgroundColor({color: "#666666"});
    let newHTML = ""
    for (const r of all_results) {
        newHTML += utils.generateLine(r);
    }
    if (all_results.length > 0) {
        if (all_results[0].comment_count >= 50) {
            const logo = chrome.runtime.getURL("media/logo_128.png");
            chrome.notifications.create({
                type: 'basic',
                iconUrl: logo,
                title: 'Large discussion',
                message: 'A post about this url has >= 50 comments',
                priority: 2
            })
        }
        const thead = `<thead><th>Site</th><th>Date</th><th>👍</th><th>💬</th><th>Link</th></thead>`
        newHTML = `<table>${thead}<tbody>${newHTML}</tbody></table>`
    } else {
        newHTML = "No discussions found."
    }

    const div = document.createElement("div");
    div.innerHTML = newHTML
    document.body.appendChild(div);
    // You can't open a link from a popup, so ask chrome to open new tabs
    const links = document.getElementsByTagName("a");
    for (let i=0; i < links.length; i++) {
        const ln = links[i];
        ln.onclick = () => {chrome.tabs.create({active: false, url: ln.href});};
    }
}

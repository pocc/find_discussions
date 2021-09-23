/* Main content script for extension
 * 2021 Ross Jacobs 
 */

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("FIND_DISCUSSIONS_EXTN: started with event", event)
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, async (tabs) => {
        const tab = tabs[0];
        const url = tab.url || tab.pendingUrl;  // If url isn't available, page is still loading
        if (url) {
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

    const limit = 3 // sane default limit for requests
    let all_results: any = [];
    console.log("Reading info for url:" + url)
    try {
        const hn_results = await hn.searchHN(url, ["story"], limit);
        all_results = all_results.concat(hn_results)
    } catch(err) { console.log("Unable to fetch hacker news results." + err) }
    try {
        const reddit_results = await reddit.search_reddit(url, ["post"], limit, "top");
        all_results = all_results.concat(reddit_results)
    } catch(err) { console.log("Unable to fetch reddit results." + err) }
    try {
        const se_results = await stackExchange.search_stack_exchange(url, ["question", "answer"], limit, "activity", ["stackoverflow"]);
        all_results = all_results.concat(se_results)
    } catch(err) { console.log("Unable to fetch stack exchange results." + err) }
    console.log(all_results)

    // Choose top 3 results by comments, descending order
    all_results = all_results.sort((a: any, b: any) => {return b.comment_count - a.comment_count});
    const top3_results = all_results.slice(0, 3);
    await chrome.browserAction.setBadgeText({text: top3_results.length.toString()});
    await chrome.browserAction.setBadgeBackgroundColor({color: "#666666"});
    let newHTML = ""
    for (const r of top3_results) {
        newHTML += utils.generateLine(r);
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

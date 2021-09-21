/* Main content script for extension
 * 2021 Ross Jacobs 
 */
(async () => {
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
    const url = window.location.href;
    let all_results: any = [];
    console.log("Reading info for url:" + url)
    try {
        const hn_results = await hn.searchHN(url, ["post"], limit);
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
    let newHTML = ""
    for (const r of top3_results) {
        newHTML += utils.generateLine(r);
    }

    const div = document.createElement("div");
    div.innerHTML = newHTML
    div.setAttribute('style', "margin-left: 10%;")
    document.body.insertBefore(div, document.body.firstChild);
})();

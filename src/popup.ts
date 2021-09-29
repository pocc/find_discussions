/* Main content script for extension
 * 2021 Ross Jacobs 
 */

import {forumPost} from 'index'

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("FIND_DISCUSSIONS_EXTN: started with event", event)
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, async (tabs) => {
        const tab = tabs[0];
        const fullUrl = tab.url || tab.pendingUrl;  // If url isn't available, page is still loading
        if (fullUrl && fullUrl.startsWith("http")) {
            // remove hash from url
            const urlObj = new URL(fullUrl)
            const url = urlObj.protocol+'//'+urlObj.host+urlObj.pathname+urlObj.search
            chrome.runtime.sendMessage({url: url}, async (resp: {data: forumPost[]}) => {
                await runExtn(url, resp.data)
            });
        } else {
            console.log(`FIND_DISCUSSIONS_EXTN: Tab url for tab ID ${tab.id} not found`)
            const div = document.createElement("div");
            div.innerHTML = `<pre>${fullUrl}</pre><p>is not a valid webpage (http:// or https://). Try browsing around to get results.</p>`
            document.body.appendChild(div);
        }
    });
});
    
async function runExtn(url: string, all_results: forumPost[]) {
    // Dynamic imports per https://stackoverflow.com/a/53033388/
    const utilsJsUrl = chrome.runtime.getURL("build/utils.js");
    const utils = await import(utilsJsUrl);

    let newHTML = `Search <input type="text" id="filter" name="filter" size="72"><br>`
    for (const r of all_results) {
        newHTML += utils.generateLine(r);
    }
    if (all_results.length > 0) {
        const thead = `<thead><th>Site</th><th>Date</th><th>👍</th><th>💬</th><th>Link</th></thead>`
        newHTML = `<table>${thead}<tbody>${newHTML}</tbody></table>`
    } else {
        newHTML += "No discussions found."
    }

    const div = document.createElement("div");
    div.innerHTML = newHTML
    document.body.appendChild(div);
    (document.getElementById("filter") as any).value = url;
    // You can't open a link from a popup, so ask chrome to open new tabs
    const links = document.getElementsByTagName("a");
    for (let i=0; i < links.length; i++) {
        const ln = links[i];
        ln.onclick = () => {chrome.tabs.create({active: false, url: ln.href});};
    }
}

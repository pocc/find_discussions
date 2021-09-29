/* Main content script for extension
 * 2021 Ross Jacobs 
 */

import {forumPost} from 'index'

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("FIND_DISCUSSIONS_EXTN: started with event", event)
    chrome.runtime.sendMessage({event: "popup clicked"}, async (resp: {url: string, forumposts: forumPost[]}) => {
        await runExtn(resp.url, resp.forumposts)
        /*if (resp.url.startsWith('http')) {

        } else {
            console.log(`FIND_DISCUSSIONS_EXTN: URL ${resp.url} did not have a valid tab`)
            const div = document.createElement("div");
            div.innerHTML = `<pre>${resp.url}</pre><p>is not a valid webpage (http:// or https://). Try browsing around to get results.</p>`
            document.body.appendChild(div);
        }*/
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

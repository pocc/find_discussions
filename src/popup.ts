/* Main content script for extension
 * 2021 Ross Jacobs 
 */

import {forumPost} from 'index'

document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("FIND_DISCUSSIONS_EXTN: started with event", event)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  // Set input filter to existing url
        const activeURL = tabs[0].url;
        (document.getElementById("filter") as HTMLInputElement).value = activeURL || "no active tab url";
    });
    const inputEl = document.getElementById('filter') as HTMLInputElement;
    inputEl.addEventListener('submit', newURLInInput);
    popupClicked()
});

function newURLInInput() {
    const newURL = (document.getElementById('filter') as HTMLInputElement).value;
    chrome.runtime.sendMessage({event: "new url in input", url: newURL}, async (resp: {forumposts: forumPost[]}) => {
        await runExtn(resp.forumposts);
    });
}

function popupClicked() {
    chrome.runtime.sendMessage({event: "popup clicked", url: ""}, async (resp: {forumposts: forumPost[]}) => {
        await runExtn(resp.forumposts);
    });
}

async function runExtn(all_results: forumPost[]) {
    // Dynamic imports per https://stackoverflow.com/a/53033388/
    const utilsJsUrl = chrome.runtime.getURL("build/utils.js");
    const utils = await import(utilsJsUrl);

    let newRowHTML = ''
    for (const r of all_results) {
        newRowHTML += utils.generateLine(r);
    }
    if (all_results.length > 0) {
        const thead = `<thead><th>Site</th><th>Date</th><th>👍</th><th>💬</th><th>Link</th></thead>`;
        const newTableHTML = `<table>${thead}<tbody>${newRowHTML}</tbody></table>`;
        (document.getElementById('results') as HTMLElement).innerHTML = newTableHTML;
        // You can't open a link from a popup, so ask chrome to open new tabs
        const links = document.getElementsByTagName("a");
        for (let i=0; i < links.length; i++) {
            const ln = links[i];
            ln.onclick = () => {chrome.tabs.create({active: false, url: ln.href});};
        }    
    } else {
        (document.getElementById('results') as HTMLElement).innerHTML = `<p>No results found</p>`;
    }
}

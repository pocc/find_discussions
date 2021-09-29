/* Background script:
 *   - send web requests
 *   - cache results to local storage
 *   - coordinate communication between other scripts
 * 
 * The model of communication should be:
 *   1. Sender is triggered (Content script loads on page load OR extension popup is clicked on)
 *   2. The sender sends a message with the url to the background script
 *   3. Background script checks cache to see if this url has been checked within the past day
 *   4. If not, query online APIs with fetch
 *   5. Send notification if there are discussions >= 10 comments within the last 3 years
 *   6. If sender was popup, return data
 * 
 * This requires a persistent background script to receive this data.
 * 
 * Message type in index.d.ts
 */

import {forumPost} from 'index'

// Set up background script on extension load
/* Extn Cache is 
{
    '2020-01-01': {
        'https://example.com': [
            forumPost,
            ...
        ]
    }
}
*/

type globalCache = {[isodate: string]: {[url: string]: forumPost[]}}
let EXTN_CACHE: globalCache = Object()
let URLS_NOTIFIED: string[] = [] // Don't notify twice for the same URL
let CURR_NOTIFICATION_ID = '';
let CURR_LARGEST_DISCUSSION = '';
const getISODate = () => new Date().toISOString().substr(0,10)
const isDomain = (url: string) => new URL(url).pathname === '/'
let INIT_ISODATE = getISODate()
chrome.browserAction.setBadgeBackgroundColor({color: "#666666"}, ()=>{});
reCreateMenu([{url: chrome.extension.getURL(''), title: "Find Discussions Extension"} as forumPost]) // Set a default menu


// Run on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({"install_unixtime": new Date().getTime()}, () => {
        console.log('Find Discussions extension has been installed.');
    });
});

chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        setURLData(request.url).then(() => {
            const isoToday = getISODate();
            console.log("Popup is calling background script and sees this extension storage", EXTN_CACHE);
            sendResponse({data: EXTN_CACHE[isoToday][request.url]});

        });
        return true;
    }
);

/*chrome.contextMenus.onClicked.addListener((info, tab: chrome.tabs.Tab) => {
    console.log("Context menu", info, "tabs", tab)
    const urlObj = new URL((tab as any).url);
    const url = urlObj.protocol+'//'+urlObj.host+urlObj.pathname+urlObj.search
    createMenu(url)
})*/


function reCreateMenu(postList: forumPost[]) {
    chrome.contextMenus.removeAll(() => {
        let counter = 0;
        for (const post of postList) {
            counter += 1;
            chrome.contextMenus.create({
                id: "find_discussions" + counter.toString(),
                documentUrlPatterns: ["*://*/*"],
                contexts: ['all'], 
                onclick: (_, __) => chrome.tabs.create({active: true, url: post.url}),
                title: post.title
            });
        }
    });
}

chrome.webRequest.onBeforeRequest.addListener(
    (webRequest) => {
        // No feedback loops (don't react to requests made by this extension)
        const inspectingOwnTraffic = chrome.runtime.getURL('') === (webRequest.initiator || "") + "/"
        if (!inspectingOwnTraffic) {
            console.log(`${chrome.runtime.getURL('')}: Intercepted web request from "${webRequest.initiator}" for "${webRequest.url}"`, webRequest);
            setURLData(webRequest.url) // async
        }
    },
    {
        urls: ["http://*/*", "https://*/*"],
        types: ['main_frame']
    }
);

/* Respond to the user's clicking one of the buttons on a notification.*/
chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
    if (notifId === CURR_NOTIFICATION_ID) {
        if (btnIdx === 0) {
            chrome.tabs.create({active: true, url: CURR_LARGEST_DISCUSSION})
        } else if (btnIdx === 1) {
            alert("settings not implemented");
        }
    }
});

// For a given URL, get data, set it to global cache, and return url data
async function setURLData(url: string) {
    const isoToday = getISODate();
    const isCached = Object.keys(EXTN_CACHE).length > 0 && Object.keys(EXTN_CACHE[isoToday]).includes(url)
    if (isCached) {
        console.log(`Using cache for "${url}".`)
        const results = EXTN_CACHE[isoToday][url]
        chrome.browserAction.setBadgeText({text: results.length.toString()}, ()=>{});
    } else {
        // ISO date is YYYY-MM-DD
        const results = await queryForumAPIs(url);
        let dayCache = Object();
        if (Object.keys(EXTN_CACHE).includes(isoToday)) {
            dayCache = EXTN_CACHE[isoToday]
        }
        dayCache[url] = results
        EXTN_CACHE[isoToday] = dayCache;
        if (isoToday !== INIT_ISODATE) { // filter out non today cache
            Object.keys(EXTN_CACHE)
                .filter(key => isoToday !== key)
                .forEach(key => delete EXTN_CACHE[key]);                  
        }
        chrome.browserAction.setBadgeText({text: results.length.toString()}, ()=>{});
    }
    console.log(`${chrome.runtime.getURL('')} storage :`, EXTN_CACHE)
    const hasDiscussions = EXTN_CACHE[isoToday][url].length > 0
    if (hasDiscussions) {
        const firstResult: forumPost = EXTN_CACHE[isoToday][url][0];
        CURR_LARGEST_DISCUSSION = firstResult.url;
        const hasLargeDiscussion = firstResult.comment_count >= 20
        const discussionAboutDomain = isDomain(url)  // More likely to hit a common website and annoy people
        const hasPath = (new URL(url).pathname.match(/\//g) || []).length > 1 // Avoid github.com/search and google.com/search
        const is1stNotification = URLS_NOTIFIED.includes(url)
        if (hasLargeDiscussion && !discussionAboutDomain && hasPath && !is1stNotification) {
            URLS_NOTIFIED.push(url);
            const logo = chrome.runtime.getURL("media/logo_128.png");
            chrome.notifications.create({
                type: 'basic',
                iconUrl: logo,
                title: 'Large discussion',
                message: 'A post about this url has >= 20 comments',
                priority: 2,
                silent: true,
                buttons: [{title: `Go to ${firstResult.source} discussion`}]
            }, (id) => CURR_NOTIFICATION_ID = id)
        }
    }
    reCreateMenu(EXTN_CACHE[isoToday][url])
}

async function queryForumAPIs(url: string): Promise<forumPost[]> {
    const hnJsUrl = chrome.runtime.getURL("build/hn.js");
    const hn = await import(hnJsUrl);
    const redditJsUrl = chrome.runtime.getURL("build/reddit.js");
    const reddit = await import(redditJsUrl);
    const stackExchangeJsUrl = chrome.runtime.getURL("build/stackexchange.js");
    const stackExchange = await import(stackExchangeJsUrl);

    console.log("Querying online APIs for url:" + url)
    const HN_ALGOLIA_DEFAULT_LIMIT = 30
    const hn_results = await hn.searchHN(url, ["story"], HN_ALGOLIA_DEFAULT_LIMIT);
    const reddit_results = await reddit.search_reddit(url, ["post"], "top");
    const se_results = await stackExchange.search_stack_exchange(url, ["question", "answer"], "activity", ["stackoverflow"]);
    let all_results: forumPost[] = [...hn_results, ...reddit_results, ...se_results];

    if (all_results.length > 0) {
        // filter out 0 comment discussions
        all_results = all_results.filter((r: any) => r.comment_count > 0);
        // sort descending
        all_results = all_results.sort((a: any, b: any) => {return b.comment_count - a.comment_count});
    }
    console.log(all_results)
    return all_results
}
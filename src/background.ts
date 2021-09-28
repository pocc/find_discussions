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

## Example data for future (filter by type: main_frame)
webRequest that is tertiary to the main page:
{
    "frameId": 412,
    "initiator": "https://hangouts.google.com",
    "method": "GET",
    "parentFrameId": 0,
    "requestId": "273659",
    "tabId": 284,
    "timeStamp": 1632856394217.238,
    "type": "xmlhttprequest",
    "url": "https://signaler-pa.clients6.google.com/punctual/multi-watch/channel?gsessionid=-9MVJVP1vl7p_agW-Pw-1WWxImFbB-Vhn30xNkqwRBc&key=AIzaSyB1j3mFq6w9iUpl8m8UNezy4TBwy9Eb8b4&VER=8&RID=rpc&SID=2l2pcm2tPLA9VdiijLWwbw&CI=0&AID=56&TYPE=xmlhttp&zx=uba3lcup1ue5&t=1"
}

webRequest that is loading the page url in the active tab:
{
    "frameId": 0,
    "initiator": "https://stackoverflow.com",
    "method": "GET",
    "parentFrameId": -1,
    "requestId": "275240",
    "tabId": 341,
    "timeStamp": 1632856681865.253,
    "type": "main_frame",
    "url": "https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array"
}


 */

import {forumPost} from 'index'

// Set up background script on extension load
/* Extn Cache is 
{
    '2020-01-01': {
        'https://example.com': [
            {forum post 1},
            ...
        ]
    }
}
*/

type globalCache = {[isodate: string]: {[url: string]: forumPost[]}}
let EXTN_CACHE: globalCache = Object()
let URLS_NOTIFIED: string[] = [] // Don't notify twice for the same URL
const getISODate = () => new Date().toISOString().substr(0,10)
const isDomain = (url: string) => new URL(url).pathname === '/'
let INIT_ISODATE = getISODate()
chrome.browserAction.setBadgeBackgroundColor({color: "#666666"}, ()=>{});    

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
        const hasLargeDiscussion = EXTN_CACHE[isoToday][url][0].comment_count >= 50
        const discussionAboutDomain = isDomain(url)  // More likely to hit a common website and annoy people
        const hasPath = (new URL(url).pathname.match(/\//g) || []).length > 1 // Avoid github.com/search and google.com/search
        const is1stNotification = URLS_NOTIFIED.includes(url)
        console.log(url, hasLargeDiscussion, discussionAboutDomain, hasPath, is1stNotification)
        if (hasLargeDiscussion && !discussionAboutDomain && hasPath && !is1stNotification) {
            URLS_NOTIFIED.push(url);
            const logo = chrome.runtime.getURL("media/logo_128.png");
            chrome.notifications.create({
                type: 'basic',
                iconUrl: logo,
                title: 'Large discussion',
                message: 'A post about this url has >= 50 comments',
                priority: 2
            })
        }
    }
}

async function queryForumAPIs(url: string): Promise<forumPost[]> {
    const hnJsUrl = chrome.runtime.getURL("build/hn.js");
    const hn = await import(hnJsUrl);
    const redditJsUrl = chrome.runtime.getURL("build/reddit.js");
    const reddit = await import(redditJsUrl);
    const stackExchangeJsUrl = chrome.runtime.getURL("build/stackexchange.js");
    const stackExchange = await import(stackExchangeJsUrl);

    let all_results: any = [];
    console.log("Querying online APIs for url:" + url)
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

    if (all_results.length > 0) {
        // filter out 0 comment discussions
        all_results = all_results.filter((r: any) => r.comment_count > 0);
        // sort descending
        all_results = all_results.sort((a: any, b: any) => {return b.comment_count - a.comment_count});
    }
    console.log(all_results)
    return all_results
}
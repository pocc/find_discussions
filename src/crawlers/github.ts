/* 
Works, but you need to be logged in in your browser
https://github.com/search?o=desc&q=%22https%3A%2F%2Fstackoverflow.com%2Fquestions%2F11227809%2Fwhy-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array%22&s=indexed&type=Code

change type to &type=issues for issues
This also works for github, but uses source graph (and is faster than github, and takes a literal, so is better than github)
curl 'https://sourcegraph.com/search/stream?q=context%3Aglobal%20https%3A%2F%2Fstackoverflow.com%2Fquestions%2F11227809%2Fwhy-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array%20&v=V2&t=literal&dl=0&dk=html&dc=1&display=1500' */
import { forumPost, WikiResp } from "../..";

const stringifyParams = (params: any) => Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')

export async function search_github(query_url: string): Promise<forumPost[]> {
    const urlBase = "https://sourcegraph.com/search/stream";
    const encoded_url = encodeURIComponent(query_url);
    const queryJSON = {
        q: `context%3Aglobal%20${encoded_url}%20`,
        v: "V2",
        t: "literal",
        dl: 0,
        dk: "html",
        dc: 1,
        display: 1500
    };
    const queryStr = stringifyParams(queryJSON);
    const fetchURL = `${urlBase}?${queryStr}`;
    let posts: forumPost[] = [];
    console.log("Fetching", fetchURL);
    const resp = await fetch(fetchURL);
    const resptext = await resp.text();
    let wikipediaResp: WikiResp = Object();
    try {
        wikipediaResp = JSON.parse(resptext) as WikiResp;
    } catch {
        console.log("FIND_DISCUSSIONS_EXTN malformed non-JSON github response:\n" + resptext)
        return [];
    }
    if (!Object.keys(wikipediaResp).includes('items')) { // probably malformed response
        console.log("FIND_DISCUSSIONS_EXTN malformed github response:\n" + resptext)
        return [];
    }
    for (const search of wikipediaResp.query.search) {
        posts.push({
            type: "article",
            source: "wikimedia",
            sub_source: "wikipedia",
            created_date: search.timestamp.substring(0,10),
            title: search.title,
            url: `https://wikipedia.org/?curid=${search.pageid}`,
            score: 0,
            comment_count: 0,
        })
    }
    return posts 
}
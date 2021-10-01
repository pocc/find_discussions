/* Query wikimedia for links

It's not literal and parses punctuation into spaces

Wikimedia Search Help:
  * https://en.wikipedia.org/wiki/Help:Searching#Parameters
  * https://www.mediawiki.org/wiki/API:Search

Working query URL to curl with: https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&srlimit=100&srsearch=insource:%22https://www.wireshark.org%22
change format to jsonfm for working in the browser
*/
import { forumPost, WikiResp } from "../..";


const stringifyParams = (params: any) => Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')

export async function search_wikimedia(query_url: string, limit: number): Promise<forumPost[]> {
    const urlBase = "https://en.wikipedia.org/w/api.php";
    const encoded_query_url = encodeURIComponent(query_url);
    const queryJSON = {
        action: 'query',
        list: 'search',
        prop: 'info',
        inprop: 'url',
        format: 'json',
        srlimit: limit,
        srsearch: `insource:%22${encoded_query_url}%22`
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
        console.log("FIND_DISCUSSIONS_EXTN malformed non-JSON wikipedia response:\n" + resptext)
        return [];
    }
    if (!Object.keys(wikipediaResp).includes('query')) { // probably malformed response
        console.log("FIND_DISCUSSIONS_EXTN malformed wikipedia response:\n" + resptext)
        return [];
    }
    const languageCode = window.navigator.language.substr(0,2)
    for (const search of wikipediaResp.query.search) {
        posts.push({
            type: "article",
            source: "wikimedia",
            sub_source: "wikipedia",
            created_date: search.timestamp.substring(0,10),
            title: search.title,
            url: `https://${languageCode}wikipedia.org/?curid=${search.pageid}`,
            score: 0,
            comment_count: 0,
        })
    }
    return posts 
}
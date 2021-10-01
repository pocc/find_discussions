#!/usr/bin/env node
// 2021 Ross Jacobs
// Access hacker news using Algolia

// This link https://hn.algolia.com/?dateRange=all&page=0&prefix=true&query=https%3A%2F%2Fblog.sigplan.org%2F&sort=byPopularity&type=all
// searches for
// * link=https://blog.sigplan.org/ | url encoded target url, can include url path as well
// * type=all                       | all => search in stories AND comments
// * sort=byPopularity              |
// * dateRange=all                  | but this could be changed
// * page=0                         | because we want first results. only the first couple links matter anyway.
// * prefix=true                    | ?


// Request that gets the data we care about as node-fetch (via browser inspector)
/*
fetch("https://uj5wyc0l7x-dsn.algolia.net/1/indexes/Item_production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.0.2)%3B%20Browser%20(lite)&x-algolia-api-key=8ece23f8eb07cd25d40262a1764599b1&x-algolia-application-id=UJ5WYC0L7X", {
  "headers": {
    "accept": "*\/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://hn.algolia.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"query\":\"https://blog.sigplan.org/\",\"analyticsTags\":[\"web\"],\"page\":0,\"hitsPerPage\":30,\"minWordSizefor1Typo\":4,\"minWordSizefor2Typos\":8,\"advancedSyntax\":true,\"ignorePlurals\":false,\"clickAnalytics\":true,\"minProximity\":1,\"numericFilters\":[],\"tagFilters\":[[\"story\",\"comment\",\"poll\",\"job\"],[]],\"typoTolerance\":true,\"queryType\":\"prefixLast\",\"restrictSearchableAttributes\":[\"title\",\"comment_text\",\"url\",\"story_text\",\"author\"],\"getRankingInfo\":true}",
  "method": "POST",
  "mode": "cors"
});
*/
import {forumPost, HNPost, HNStory} from '../../index';

export async function searchHN(url: string, typesAry: string[], limit: number): Promise<forumPost[]> {
    const types = `"${typesAry.join('", "')}"`
    const algolia_url = "https://uj5wyc0l7x-dsn.algolia.net/1/indexes/Item_production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.0.2)%3B%20Browser%20(lite)&x-algolia-api-key=8ece23f8eb07cd25d40262a1764599b1&x-algolia-application-id=UJ5WYC0L7X"
    const resp = await fetch(algolia_url, {
        "headers": {
          "accept": "*\/*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
        },
        "referrer": "https://hn.algolia.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{"query":"\\\"${url}\\\"","analyticsTags":["web"],"page":0,"hitsPerPage":${limit},"minWordSizefor1Typo":4,"minWordSizefor2Typos":8,"advancedSyntax":true,"ignorePlurals":false,"clickAnalytics":true,"minProximity":1,"numericFilters":[],"tagFilters":[${types},[]],"typoTolerance":true,"queryType":"prefixLast","restrictSearchableAttributes":["title","comment_text","url","story_text","author"],"getRankingInfo":true}`,
        "method": "POST",
        "mode": "cors"
    } as any);
    const resptext = await resp.text();
    let HNPosts: forumPost[] = []
    let body;
    try {
        body = JSON.parse(resptext) as HNPost;
    } catch {
        console.log("FIND_DISCUSSIONS_EXTN malformed non-JSON hacker news response:\n" + resptext)
        return [];
    }
    if (!Object.keys(body).includes('hits')) { // probably malformed response
        console.log("FIND_DISCUSSIONS_EXTN malformed hn.algolia response:\n" + resptext)
        return [];
    }
    // Right now, we're only showing stories
    console.log("Fetching hn.algolia for ", url)
    let stories = body.hits as HNStory[];
    for (const hit of stories) {
        // Source URL of post should match the url we are searching for
        // Searching for "chrome://extensions" can get a search for "chrome extensions"
        if (hit.url && hit.url.includes(url) || hit.title && hit.title.includes(url) || hit.story_text && (hit.story_text as string).includes(url)) {
            HNPosts.push({
                type: "post",
                source: "hackernews",
                sub_source: "hackernews",
                created_date: hit.created_at.substr(0,10),
                url: "https://news.ycombinator.com/item?id=" + hit["objectID"],
                title: hit.title,
                comment_count: hit.num_comments,
                score: hit.points,
                is_accepted_answer: false  // Accepted answer is for stack overflow
            });
        }
    }
    return HNPosts
}

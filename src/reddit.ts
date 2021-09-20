/*
via https://www.makeuseof.com/tag/right-way-search-reddit/

### **How to Search Reddit Using Modifiers and Operators**

You can also use the following modifiers as mentioned in Reddit's advanced search:

- **title:[text]** searches only post titles.
- **author:[username]** searches only posts by the given username.
- **selftext:[text]** searches only the body of posts that were made as self-posts.
- **subreddit:[name]** searches only posts that were submitted to the given subreddit community.
- **url:[text]** searches only the URL of non-self-post posts.
- **site:[text]** searches only the domain name of non-self-post posts.
- **nsfw:yes** or **nsfw:no** to filter results based on whether they were marked as NSFW or not.
- **self:yes** or **self:no** to filter results based on whether they were self-posts or not.

Use this search https://www.reddit.com/dev/api/#GET_search

Like so: https://www.reddit.com/search/?q=url%3Ahttps://www.cnbc.com/2020/03/11/who-declares-the-coronavirus-outbreak-a-global-pandemic.html&type=link&sort=top

- https://www.reddit.com/search/
- ?q=url%3Ahttps://www.cnbc.com/2020/03/11/who-declares-the-coronavirus-outbreak-a-global-pandemic.html
- &type=link
- &sort=new

for this link: https://www.cnbc.com/2020/03/11/who-declares-the-coronavirus-outbreak-a-global-pandemic.html

It's also possible to limit it to 100 instead of default 25
*/

'use strict';
//const snoowrap = require('snoowrap');
//require('dotenv').config()
import fetch from 'node-fetch';
import {forumPost, redditPost} from 'index';
import {generateLine} from './utils.js';
import {settings} from './settings.js';

(async (): Promise<void> => {
    const url = "https://apnews.com/article/election-2020-joe-biden-north-america-national-elections-elections-7200c2d4901d8e47f1302954685a737f"
    const limit = settings.limit // assume limit is >0
    let type = settings.types[0]
    if (settings.types.length > 1) {
        type = "all"
    }
    const postsData: forumPost[] = await search_reddit(url, type, limit, "top")
    let htmlLinks: string[] = []
    for (const postData of postsData) {
        htmlLinks.push(generateLine(postData));
    }
    console.log(htmlLinks)
})();

async function search_reddit(url: String, type: String, limit: number, sort: String): Promise<forumPost[]> {
    // It would be nice to limit in search query how many to return
    const resp = await fetch(`https://www.reddit.com/search/?q=url%3A${url}&type=${type}&sort=${sort}`, {
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
    } as any);
    const pagetext = await resp.text()
    const match = /window\.___r = (.*);<\/script>/g.exec(pagetext)
    let posts: forumPost[] = []
    if (match !== null) {
        const data = JSON.parse(match[1])
        let counter = 0;
        for (const page of Object.keys(data['posts']['models'])) {
            if (limit == counter) {
                break
            }
            const redditPostData: redditPost = data['posts']['models'][page]
            const created_date = new Date(redditPostData['created']).toISOString().substring(0,10)
            posts.push({
                type: "post",
                created_date: created_date,
                title: redditPostData['title'],
                url: redditPostData['permalink'],
                score: redditPostData['score'],
                comment_count: redditPostData['numComments']
            })
            counter += 1;
        }
    } 
    return posts
}

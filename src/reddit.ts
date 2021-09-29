/*
// 2021 Ross Jacobs

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
import {forumPost, redditPost} from 'index';
import {fetchGetOptions} from './utils.js';


export async function search_reddit(url: String, type: String, sort: String): Promise<forumPost[]> {
    // It would be nice to limit in search query how many to return
    const resp = await fetch(`https://www.reddit.com/search/?q=url%3A${url}&type=${type}&sort=${sort}`, fetchGetOptions as any);
    const pagetext = await resp.text()
    const match = /window\.___r = (.*);<\/script>/g.exec(pagetext)
    let posts: forumPost[] = []
    if (match !== null) {
        let data;
        try {
            data = JSON.parse(match[1])
        } catch {
            console.log("FIND_DISCUSSIONS_EXTN malformed non-JSON reddit response:\n" + match[1])
            return [];
        }
        if (!Object.keys(data).includes('posts')) { // probably malformed response
            console.log("FIND_DISCUSSIONS_EXTN malformed reddit response:\n" + pagetext)
            return [];
        }
        for (const page of Object.keys(data['posts']['models'])) {
            const redditPostData: redditPost = data.posts.models[page]
            const created_date = new Date(redditPostData.created).toISOString().substring(0,10)
            posts.push({
                type: "post",
                source: "reddit",
                created_date: created_date,
                title: redditPostData.title,
                url: redditPostData.permalink,
                score: redditPostData.score,
                comment_count: redditPostData.numComments,
                is_accepted_answer: false,  // Only for Stack Exchange answers
            })
        }
    } 
    return posts
}

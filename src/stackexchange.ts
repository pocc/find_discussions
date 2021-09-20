/*
This will search for this url:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction

Using the API, https://api.stackexchange.com/docs/excerpt-search, but will only search stackoverflow.

https://api.stackexchange.com/2.3/search/excerpts?order=desc&sort=activity&url=https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction&site=stackoverflow

Other API Site parameters that are worth checking:

- stackoverflow (default)
- serverfault
- superuser

- math
- askubuntu
- gaming → arqade
- apple → think different
- english → English language and usage

It's probably not worth it to check gaming, apple, english, math, askubuntu, as
stack exchange sites are rate limited to 300 requests / day for unregistered 
applications and 10000/day for registered applications 
with the possibility of using 5 quotas.
*/

'use strict';
import {fetchGetOptions} from './utils.js'
import { SEResp, forumPost, SEAnswer, SEQuestion } from 'index.js';


export async function search_stack_exchange(url: string, types: string[], limit: number, sort: string, subsites: string[]): Promise<forumPost[]> {
    const urlBase = "https://api.stackexchange.com/2.3/search/excerpts?order=desc"
    let counter = 0;
    let posts: forumPost[] = []
    for (const subsite of subsites) {
        if (counter == limit || limit < 1) break;
        const fetchURL = `${urlBase}&sort=${sort}&url=${encodeURIComponent(url)}&site=${subsite}`
        const resp = await fetch(fetchURL, fetchGetOptions as any);
        const stackExchangeResp = await resp.json() as SEResp;
        for (const item of stackExchangeResp.items) {
            if (counter == limit) break;
            if (types.includes(item.item_type)) {
                const created_date = new Date(item.creation_date*1000).toISOString().substring(0,10)
                let url = ""
                let comment_count = 0
                if (item.item_type == "question") {
                    url = "https://stackoverflow.com/questions/" + (item as SEQuestion).question_id
                    comment_count = (item as SEQuestion).answer_count
                } else {
                    url = "https://stackoverflow.com/a/" + (item as SEAnswer).answer_id
                }
                posts.push({
                    type: item.item_type,
                    created_date: created_date,
                    title: item.title,
                    url: url,
                    score: item.score,
                    comment_count: comment_count
                })
                counter += 1
            }
        }
    }
    return posts 
}
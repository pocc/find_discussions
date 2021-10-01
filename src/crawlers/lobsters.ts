// Query Alexandru's xojoc database of lobsters (add barnacles too if it ever becomes people even know about)
import {forumPost} from '../../index'


export async function search_lobsters(query_url: string): Promise<forumPost[]> {
    const data = await fetch('https://discussions.xojoc.pw/?url=' + encodeURIComponent(query_url))
    const text = await data.text() 
    // matches https://regex101.com/r/okTEqz/1
    const re = /<b>(.+?)<\/b><br\/>[\s\S]+?href="([^"]+)[\s\S]+?<b>(\d+?)<\/b>[\s\S]+?<b>(\d+?)<\/b>[\s\S]+?datetime="([^"]+)"/g
    const matches = [...text.matchAll(re)]
    let results = [];
    for (const match of matches) {
        if (match[2].startsWith('https://lobste.rs')) {  // filters only for lobsters links right now
            const resultForumPost: forumPost = {
                title: match[1],
                url: match[2],
                comment_count: parseInt(match[3], 10), // guaranteed to be digit by regex
                score: parseInt(match[4], 10),          // guaranteed to be digit by regex
                created_date: match[5].substr(0,10),   // has format of full ISO8601 datetime
                source: 'lobsters',
                type: 'post',
            }
            results.push(resultForumPost)
        }
    }
    return results;
}

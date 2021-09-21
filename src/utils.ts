// 2021 Ross Jacobs
import { forumPost } from "index";

export function generateLine(fp: forumPost): string {
    const score = intToString(fp.score)
    const scoreStr = `<span title="This ${fp.type} has ${score} points"><b>${score}</b>👍</span>`
    const commentCount = intToString(fp.comment_count)
    let answer_emoji = "";
    if (fp.source === "stackexchange") {
        answer_emoji = "✅";
    } 
    const commentStr = `<span title="This ${fp.type} has ${commentCount} comments"><b>${commentCount}</b>💬</span>`
    return `<p>${fp.created_date} ${scoreStr} ${commentStr} <a href="${fp.url}">${answer_emoji}${fp.title}</a></p>`
}

// copied from https://stackoverflow.com/questions/10599933/, assume no post/comment will have >= 1T points
function intToString (n: number): string {
    if (n < 1e3) return n.toString();
    else if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    else if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    else return +(n / 1e9).toFixed(1) + "B"; // MUST be >= 1e9
}

// default fetch options for all fetches
export const fetchGetOptions = {
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/" + "*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors"
}
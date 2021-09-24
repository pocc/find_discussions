// 2021 Ross Jacobs
import { forumPost } from "index";

export function generateLine(fp: forumPost): string {
    const site_ico_path = chrome.runtime.getURL(`media/${fp.source}.ico`)
    const site_ico = `<img src="${site_ico_path}" alt="${fp.source}" width="16px" height="16px" />`
    const score = intToString(fp.score)
    const scoreStr = `<span title="This ${fp.type} has ${score} points"><b>${score}</b></span>`
    const commentCount = intToString(fp.comment_count)
    let answer_svg = "";
    if (fp.source === "stackexchange") {
        answer_svg = `<svg alt="The question owner accepted this as the best answer" width="16" height="16" viewBox="0 0 36 36"><path d="m6 14 8 8L30 6v8L14 30l-8-8v-8z" fill="#65B37F"></path></svg>`;
    }
    const commentStr = `<span title="This ${fp.type} has ${commentCount} comments"><b>${commentCount}</b></span>`
    const type_svg_path = chrome.runtime.getURL(`media/${fp.type}.svg`)
    const type_svg = `<img src="${type_svg_path}" alt="${fp.type}" width="16px" height="16px" />`
    return `<tr><td>${site_ico} ${type_svg}${answer_svg}</td><td>${fp.created_date}</td><td>${scoreStr}</td><td>${commentStr}</td><td class="link"><a href="${fp.url}">${fp.title}</a></td></tr>`
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
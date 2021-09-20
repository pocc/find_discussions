import { forumPost } from "index";

export function generateLine(fp: forumPost) {
    const score = intToString(fp.score)
    const scoreStr = `<span title="This ${fp.type} has ${score} points">${score} 👍</span>`
    const commentCount = intToString(fp.comment_count)
    const commentStr = `<span title="This ${fp.type} has ${commentCount} comments">${commentCount} 💬</span>`
    return `<p>${fp.created_date} ${scoreStr} ${commentStr} <a href="${fp.url}">${fp.title}</a></p>`
}

// copied from https://stackoverflow.com/questions/10599933/, assume no post/comment will have >= 1T points
function intToString (n: number): string {
    if (n < 1e3) return n.toString();
    else if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    else if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    else return +(n / 1e9).toFixed(1) + "B"; // MUST be >= 1e9
}

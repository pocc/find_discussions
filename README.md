# Find Discussions

Discussions of a webpage may be helpful to understanding it.
This chrome/firefox extension will find related discussions of your current url on news aggregators (max 3):

* reddit.com
* news.ycombinator.com
* stackoverflow questions and answers

Maybe create a subreddit for interesting finds?

## Settings

* Search reddit/hn comments as well
* Change max # of links shown
* Sort by top (default) or new

## Dev

wye235[АТ]gmail.com will be used as the developer account for this project. Send support emails there.
Manifest v2 will be used until v3 gains more traction and has better support.

Don't use localstorage because it's too small, so use a global cache variable that gets instantiated on extension load.

## Domains to see a bunch of backlinks

* Reddit: [Flickr Sunset](https://www.flickr.com/photos/zaruka/36978499711/)
* Reddit/HN: [Rick Astley - Never Gonna Give You Up (Official Music Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
* Stack Overflow: [Stack Overflow Help](https://stackoverflow.com/help)

## Similar

* [Ampie](https://ampie.app/) puts twitter/HN threads in a sidebar. Seems too busy - I just want the links and that's about it.
* [Xojoc Discussions](https://discussions.xojoc.pw/) scrapes Hacker News, Reddit, Lobste.rs, and Barnacl.es, and provides backlinks to various websites, but results can get stale after scrape. It can also be used as a bookmarklet.
* [Newsit: Hacker News and Reddit Links](https://chrome.google.com/webstore/detail/newsit-hacker-news-and-re/nngjdplpkehilhcinpccdbkjaknkkifl): Find Reddit or Hacker News discussions on the current page!
* [What Hacker News Says](https://chrome.google.com/webstore/detail/what-hacker-news-says/khgegkjchclhgpglloficdmdannlpmoi): Easily find Hacker News threads about the page you're currently browsing.

### Defunct

* [this repo](https://github.com/theoretick/discuss-it) had the same idea as a website, but it died.
* [Epiverse](https://epiverse.co/) adds comments to any webpage that people can participate in, but they're shutting down the main functionality because content moderation is hard

# Find Discussions

Discussions of a webpage may be helpful to understanding it.
This chrome/firefox extension will find related discussions of your current url on news aggregators (max 3):

* reddit.com
* news.ycombinator.com
* stackoverflow questions and answers

## Settings

* Search reddit/hn comments as well
* Change max # of links shown
* Sort by top (default) or new

## Dev

wye235[АТ]gmail.com will be used as the developer account for this project. Send support emails there.
Manifest v2 will be used until v3 gains more traction and has better support.

Don't use localstorage because it's too small, so use a global cache variable that gets instantiated on extension load.

Apparently [this repo](https://github.com/theoretick/discuss-it) had the same idea as a website, but it died.

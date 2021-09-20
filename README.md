# Find Discussions

Discussions of a webpage may be helpful to understanding it.
This chrome/firefox extension will find related discussions of your current url on news aggregators (max 3):

* reddit.com
* news.ycombinator.com
* stackoverflow questions and answers

## Todo

* [ ] Indicate with emoji whether it's an question, answer, post, or comment
* [ ] Indicate with emoji if stackoverflow answer is accepted
* [ ] Filter out stack overflow questions and answers that have the same question_id (prefer answer)
* [ ] Convert HTML from `<p>` to table so it's aligned
* [ ] Move API requests from content script to background script
* [ ] Move HTML to popup script
* [ ] Add plus button on the bottom for more entries (save them so it's seamless)
* [ ] Add 24h caching for a URL and save to local storage

## Settings

* Search reddit/hn comments as well
* Change max # of links shown
* Sort by top (default) or new

## Dev

Manifest v2 will be used until v3 gains more traction.

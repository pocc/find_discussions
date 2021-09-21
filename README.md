# Find Discussions

Discussions of a webpage may be helpful to understanding it.
This chrome/firefox extension will find related discussions of your current url on news aggregators (max 3):

* reddit.com
* news.ycombinator.com
* stackoverflow questions and answers

## Todo

### Required

* [X] Indicate with emoji if stackoverflow answer is accepted (10m)
* [X] Indicate with image what platform this is with svg (right before link) (30min)
* [ ] Indicate with emoji whether it's an question, answer, post, or comment (15m)
* [ ] Use images of upvote/
* [ ] Filter out stack overflow questions and answers that have the same question_id (prefer answer) (15m)
* [ ] Add 24h caching for a URL and save to local storage (30m)
* [ ] Move API requests from content script to background script (60m)
* [ ] Use react for components (120m)
  * [ ] Move HTML to popup script (60m)
  * [ ] Have textbox for number of elements to show 0 for ∞ (30m)
  * [ ] Plus sign at bottom to show 1 more result (30m)
  * [ ] Convert HTML from `<p>` to table so it's aligned (30m)
  * [ ] Create an checkbox on the popup which will ensure that it won't show on this domain (60m)
* [ ] Add option for URL regex to apply to results
* [ ] Default disable bare (sub)domains without a path, allow option to enable.
        Most domains like stackoverflow.com aren't as interesting as paths on the website.

### Nice to have

* [ ] Add support for twitter (240m)
* [ ] Add support for wikipedia (240m)
* [ ] Add support for general google links (240m)
* [ ] Add support for github READMEs/issues/pull requests (240m)

## Settings

* Search reddit/hn comments as well
* Change max # of links shown
* Sort by top (default) or new

## Dev

wye235[АТ]gmail.com will be used as the developer account for this project. Send support emails there.
Manifest v2 will be used until v3 gains more traction and has better support.

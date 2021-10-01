# Changelog

List of things that have been done and should be done.
This will be accurate on every commit.

## Required

* [X] Indicate with emoji if stackoverflow answer is accepted (10m)
* [X] Indicate with image what platform this is with svg (right before link) (30min)
* [X] Indicate with emoji whether it's an question, answer, post, or comment (15m)
* [X] Move HTML to popup script (60m)
* [X] Move API requests from content script to background script (60m)
  * > moved it to popup script, which does the same thing from CORS perspective
* [X] Filter out stack overflow questions and answers that have the same question_id (prefer answer) (15m)
* [X] Convert HTML from `<p>` to table so it's aligned (30m)
* [X] Send a chrome notification on links with > 50 comments on Reddit or Hacker News
* [X] Update badge on page load instead of clicking on extension
* [X] Cache results in localstorage with key of date.
* [X] Limit number of elements through UI rather than pre-limit it in requests
* [X] Currently `https://stackoverflow.com/questions?tab=Votes` matches all questions. Fix this.
* [ ] Use react for components (120m)
  * [ ] Have textbox for number of elements to show 0 for ∞ (30m)
  * [ ] Plus sign at bottom to show 1 more result (30m)
  * [ ] Create an checkbox on the popup which will ensure that it won't show on this domain (60m)
* [ ] Add option for URL regex to apply to results
* [X] Default disable bare (sub)domains without a path, allow option to enable.
        Most domains like stackoverflow.com aren't as interesting as paths on the website.
* [X] Add 24h caching for a URL and save to local storage (30m)
* [ ] Have button to lock results for website so that when you move to a different URL, the results stay in the popup
* [ ] Change URL for context menus and popup when switching tabs
* [ ] Send a new search if input box changes
* [ ] Increase stackoverflow requests from 300 to 10000 by using oauth

### Edge cases (plz help!)

* Searching for `chrome://extensions` yields no results, but this stack overflow question has it
  `https://stackoverflow.com/questions/34888431/link-to-chrome-extensions-page-in-non-extension-html`

### Nice to have

* [ ] Allow for search in comments
* [ ] Add support for wikipedia (240m)
* [ ] LinkedIn (www.linkedin.com)
* [ ] Add support for github READMEs/issues/pull requests (240m)
* [ ] Add support for twitter (240m)

### Marginal

* [ ] WordPress (www.wordpress.org)
* [ ] Medium (www.medium.com)
* [ ] Substack
* [ ] Add support for tumblr
* [ ] Add support for facebook
* [ ] Add support for Instagram
* [ ] Wix (www.wix.com)
* [ ] Weebly (www.weebly.com)
* [ ] Ghost (www.ghost.org)
* [ ] Blogger (www.blogger.com)
* [ ] toptal.com
* [ ] wired
* [ ] dzone
* [ ] hackaday
* [ ] slashdot
* [ ] techmeme


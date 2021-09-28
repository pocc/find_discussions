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
* [ ] Default disable bare (sub)domains without a path, allow option to enable.
        Most domains like stackoverflow.com aren't as interesting as paths on the website.
* [X] Add 24h caching for a URL and save to local storage (30m)

### Nice to have

* [ ] Add support for twitter (240m)
* [ ] Add support for wikipedia (240m)
* [ ] Add support for general google links (240m)
* [ ] Add support for github READMEs/issues/pull requests (240m)

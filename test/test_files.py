#!/usr/bin/env pythnon3
# Simple python file to verify expected output because I'm time constrained and want a test without looking up the JS way
import re
import subprocess

child = subprocess.run(["bash", "-c", "tsc && node build/hn.js && node build/reddit.js"], stdout=subprocess.PIPE)
expd_bytes = b'[\n  \'<p>2019-07-11 <span title="This post has 388 points">388 \xf0\x9f\x91\x8d</span> <span title="This post has 77 comments">77 \xf0\x9f\x92\xac</span> <a href="https://news.ycombinator.com/item?id=20408011">My First Fifteen Compilers</a></p>\',\n  \'<p>2021-02-23 <span title="This post has 271 points">271 \xf0\x9f\x91\x8d</span> <span title="This post has 80 comments">80 \xf0\x9f\x92\xac</span> <a href="https://news.ycombinator.com/item?id=26237368">Teaching Compilers Backward</a></p>\',\n  \'<p>2020-10-01 <span title="This post has 115 points">115 \xf0\x9f\x91\x8d</span> <span title="This post has 187 comments">187 \xf0\x9f\x92\xac</span> <a href="https://news.ycombinator.com/item?id=24649992">Programming language notation is a barrier to entry</a></p>\',\n  \'<p>2021-09-16 <span title="This post has 109 points">109 \xf0\x9f\x91\x8d</span> <span title="This post has 45 comments">45 \xf0\x9f\x92\xac</span> <a href="https://news.ycombinator.com/item?id=28548165">Story of the Flash Fill Feature in Excel</a></p>\'\n]\n[\n  \'<p>2020-11-07 <span title="This post has 365.1K points">365.1K \xf0\x9f\x91\x8d</span> <span title="This post has 28.8K comments">28.8K \xf0\x9f\x92\xac</span> <a href="https://www.reddit.com/r/news/comments/jptqj9/joe_biden_elected_president_of_the_united_states/">Joe Biden elected president of the United States</a></p>\',\n  \'<p>2020-11-07 <span title="This post has 6.4K points">6.4K \xf0\x9f\x91\x8d</span> <span title="This post has 8K comments">8K \xf0\x9f\x92\xac</span> <a href="https://www.reddit.com/r/Conservative/comments/jpu2i4/joe_biden_wins_the_election_2020/">Joe Biden wins the election 2020</a></p>\',\n  \'<p>2020-11-07 <span title="This post has 1.3K points">1.3K \xf0\x9f\x91\x8d</span> <span title="This post has 50 comments">50 \xf0\x9f\x92\xac</span> <a href="https://www.reddit.com/r/Impeach_Trump/comments/jptr7h/associated_press_calls_it_joe_biden_elected/">Associated Press Calls It: Joe Biden elected president of the United States</a></p>\',\n  \'<p>2020-11-07 <span title="This post has 1.3K points">1.3K \xf0\x9f\x91\x8d</span> <span title="This post has 38 comments">38 \xf0\x9f\x92\xac</span> <a href="https://www.reddit.com/r/RussiaLago/comments/jptr5a/associated_press_calls_it_joe_biden_elected/">Associated Press Calls It: Joe Biden elected president of the United States</a></p>\'\n]\n' # noqa E501
if child.stdout != expd_bytes:
    print(b"expected`" + expd_bytes + b"`")
    print("\n\n", b"\ngot`" + child.stdout + b"`")
else:
    print("test passed")


child = subprocess.run(["node", "build/stackoverflow.js"], stdout=subprocess.PIPE)
expd_bytes = b'[\n  \'<p>2021-09-14 <span title="This answer has 1 points">1 \xf0\x9f\x91\x8d</span> <span title="This answer has 0 comments">0 \xf0\x9f\x92\xac</span> <a href="https://stackoverflow.com/a/69180272">How do I define AsyncFunction in node?</a></p>\',\n  \'<p>2021-09-14 <span title="This question has 0 points">0 \xf0\x9f\x91\x8d</span> <span title="This question has 1 comments">1 \xf0\x9f\x92\xac</span> <a href="https://stackoverflow.com/questions/69180188">How do I define AsyncFunction in node?</a></p>\',\n  \'<p>2021-07-05 <span title="This answer has 1 points">1 \xf0\x9f\x91\x8d</span> <span title="This answer has 0 comments">0 \xf0\x9f\x92\xac</span> <a href="https://stackoverflow.com/a/68259658">How to dynamically create an async function in node.js</a></p>\',\n  \'<p>2021-05-11 <span title="This answer has 1 points">1 \xf0\x9f\x91\x8d</span> <span title="This answer has 0 comments">0 \xf0\x9f\x92\xac</span> <a href="https://stackoverflow.com/a/67489698">Handling aws-sdk bucket creation requests nodejs express</a></p>\'\n]\n' # noqa E501
if child.stdout != expd_bytes:
    print(b"expected`" + expd_bytes + b"`")
    print("\n\n", b"\ngot`" + child.stdout + b"`")
else:
    print("test passed")

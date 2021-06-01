import requests
import json
import pathlib
import sys

def read_file(fname):
    with open(fname) as f:
        contents = f.read()
        return contents

access_token = "d229952b3e850117931"+"e15ba7e5db4939d346f0b"
blog_name = "涵曦 ~ 博客"
github_username = "hanxi"
github_repo = "blog"

headers_dict = {
        "Authorization": "token " + access_token
        }
def renderMarkdown(text):
    post = {
        "text": text,
        "mode": "gfm",
    }
    url = "https://api.github.com/markdown"
    r = requests.post(url, data = json.dumps(post), headers=headers_dict)
    return r.text

page_templ = read_file('page.html')

def to_page(page_id):
    url = "https://api.github.com/repos/%s/%s/issues/%d" % (github_username, github_repo, page_id)
    r = requests.get(url, headers=headers_dict)
    data = json.loads(r.text)
    if "title" not in data:
        return False
    title = data["title"]
    content = renderMarkdown(data["body"])

    comment_url = url + "#new_comment_field"
    comment = '<a href="%s"> 点击进入评论 ... </a>' % comment_url
    page_html = page_templ.format(
            blog_name = blog_name,
            title = title,
            content = content,
            comment = comment)
    return page_html

def save_file(fname, content):
    with open(fname, 'wb') as f:
        f.write(content.encode("UTF-8"))

def generate(tp, cnt):
    for page_id in range(1,cnt):
        print("Try generate page:", page_id)
        fname = "p/%s/index.html" % page_id
        if tp == "update":
            if pathlib.Path(fname).is_file():
                print("Exist :", fname)
                continue
        page_html = to_page(page_id)
        if not page_html:
            print("Page not exist:", page_id)
            break
        fpath = "p/%s" % page_id 
        pathlib.Path(fpath).mkdir(parents=True, exist_ok=True)
        save_file(fname, page_html)
        print("Generate Ok. fname:", fname)
        page_html

if __name__=="__main__":
    argc = len(sys.argv)
    tp = "update"
    if argc > 1:
        tp = sys.argv[1]
    generate(tp, 200)

import requests
import json
import pathlib
import sys

def read_file(fname):
    with open(fname) as f:
        contents = f.read()
        return contents

access_token = "g"+"hp_djsCiXH8lEL4HBOD1R7yS"+"DiJoZDPI31fdtRw"
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

def get_data(page_id):
    url = "https://api.github.com/repos/%s/%s/issues/%d" % (github_username, github_repo, page_id)
    r = requests.get(url, headers=headers_dict)
    data = json.loads(r.text)
    if "title" not in data:
        return False,False
    title = data["title"]
    content = renderMarkdown(data["body"])
    return title,content

def to_page(page_id, title, content):
    comment_url = "https://github.com/%s/%s/issues/%d#new_comment_field" %(github_username, github_repo, page_id)
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

templ = read_file('sitetempl.html')
def sitemaphtml_format(sitemaphtml_arr):
    arr = []
    for info in sitemaphtml_arr:
        title = info[0]
        url = info[1]
        arr.append('<li class="pagelist"><a href="%s">%s</a></li>' % (url, title))
    postlist = "\n".join(arr)
    html = templ.format(blog_name = blog_name, postlist = postlist)
    return html

def generate(cnt):
    sitemap = []
    sitemaphtml_arr = []
    for page_id in range(1,cnt):
        print("Try generate page:", page_id)
        fname = "p/%s/index.html" % page_id
        url = "https://blog.hanxi.cc/p/%s/" % page_id
        title, content = get_data(page_id)
        if not title:
            print("Page not exist:", page_id)
            break
        page_html = to_page(page_id, title, content)
        sitemap.append(url)
        sitemaphtml_arr.append([title,url])
        fpath = "p/%s" % page_id 
        pathlib.Path(fpath).mkdir(parents=True, exist_ok=True)
        save_file(fname, page_html)
        print("Generate Ok. fname:", fname)
    save_file("sitemap.txt", "\n".join(sitemap))
    sitemaphtml_arr.reverse()
    sitemaphtml = sitemaphtml_format(sitemaphtml_arr)
    save_file("sitemap.html", sitemaphtml)
    requests.get("http://www.google.com/ping?sitemap=https://blog.hanxi.cc/sitemap.txt")

if __name__=="__main__":
    argc = len(sys.argv)
    generate(200)

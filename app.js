function gotoHome() {
    setTitle(config.blog_name);
    setBlogName();
    setFooter();
    loadPage(1);
}

function loadPage(page) {
    var link = {};
    var postlist = document.getElementById("post_list");
    var more = document.getElementById("more");
    if (more) {
        removeChildById(postlist, "more");
        var newMore = document.createElement("img");
        newMore.id = "more";
        newMore.src = "littlewait.gif";
        postlist.appendChild(newMore);
    }
    getJSON(getPageUrl(page), function (data, headers) {
        removeChildById(document.getElementById("index"), "wait");
        removeChildById(postlist, "more");
        for (var i = 0; i < data.length; i++) {
            var posttitle = document.createElement("li");
            posttitle.className = "pagelist";
            postlist.appendChild(posttitle);
            var href = document.createElement("a");
            href.href = "?p=" + data[i].number + "&t=" + (new Date().getTime());
            var txt = document.createTextNode(data[i].title);
            href.appendChild(txt);
            posttitle.appendChild(href);
        }

        if (headers.link) {
            var linkArray = headers.link.split(",");
            for (var i = 0; i < linkArray.length; i++) {
                var m = linkArray[i].match(/\?per_page=(\d+)&page=(\d+).*>; rel="(\w+)"/);
                if (m) {
                    link[m[3]] = {
                        "per_page": m[1],
                        "page": m[2]
                    }
                }
            }
            if (link.last) {
                var last = parseInt(link.last.page);
                if (page < last) {
                    var href = document.createElement("a");
                    href.id = "more";
                    href.href = "javascript:loadPage(" + (page + 1) + ");";
                    var txt = document.createTextNode("加载更多 ...");
                    href.appendChild(txt);
                    postlist.appendChild(href);
                }
            }
        }
    });
}

function gotoPage(id) {
    setTitle(config.blog_name);
    setFooter();
    getJSON(getIssuesUrl(id), function (data) {
        setTitle(config.blog_name + " - " + data.title);
        var title = document.getElementById("title");
        var txt = document.createTextNode(data.title);
        title.appendChild(txt);
        var content = document.getElementById("content");
        renderMarkdown(content, data.body);
        var comment = document.getElementById("comment");
        var href = document.createElement("a");
        href.href = getCommentUrl(id);
        var txt = document.createTextNode("点击进入评论 ...");
        href.appendChild(txt);
        comment.appendChild(href);
    }, function () {
        location.replace("/");
    });
}

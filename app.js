function gotoHome()
{
    setTitle(config.blog_name);
    setBlogName();
    setFooter();
    var page = 1;
    var link = {};
    var postlist = document.getElementById("post_list");
    function loadPage(page) {
        var more = document.getElementById("more");
        if (more) {
            removeChildById(postlist, "more");
            var newMore = document.createElement("img");
            newMore.id = "more";
            newMore.src = "littlewait.gif";
            postlist.appendChild(newMore);
        }
        getJSON(getPageUrl(page), function(data, headers) {
            removeChildById(document.getElementById("index"), "wait");
            removeChildById(postlist, "more");
            for (var i=0; i<data.length; i++) {
                var posttitle = document.createElement("li");
                posttitle.className = "pagelist";
                postlist.appendChild(posttitle);
                var href = document.createElement("a");
                href.href = "?p="+data[i].number+"&t="+(new Date().getTime());
                var txt = document.createTextNode(data[i].title);
                href.appendChild(txt);
                posttitle.appendChild(href);
            }

            if (headers.Link) {
                var linkArray = headers.Link.split(",");
                for (var i=0; i<linkArray.length; i++) {
                    var m = linkArray[i].match(/\?per_page=(\d+)&page=(\d+)>; rel="(\w+)"/);
                    if (m) {
                        link[m[3]] = {
                            "per_page": m[1],
                            "page": m[2]
                        }
                    }
                }
                var last = parseInt(link.last.page);
                if (page<last) {
                    var href = document.createElement("a");
                    href.id = "more";
                    href.href = "javascript:loadPage("+(page+1)+");";
                    var txt = document.createTextNode("More");
                    href.appendChild(txt);
                    postlist.appendChild(href);
                }
            }
        });
    }
    loadPage(1);
}

function gotoPage(id)
{
    setTitle(config.blog_name);
    setFooter();
    getJSON(getIssuesUrl(id), function(data) {
        setTitle(config.blog_name + " - " + data.title);
        var title = document.getElementById("title");
        var txt = document.createTextNode(data.title);
        title.appendChild(txt);
        var content = document.getElementById("content");
        renderMarkdown(content, data.body);
        var comment = document.getElementById("comment");
        var href = document.createElement("a");
        href.href = getCommentUrl(id);
        var txt = document.createTextNode("Click here to comments");
        href.appendChild(txt);
        comment.appendChild(href);
    });
}


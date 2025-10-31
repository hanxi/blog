function gotoHome() {
    setTitle(config.blog_name);
    setBlogName();
    setFooter();
    loadPage(1);
}

/**
 * Safe remove child by id within a given parent.
 * - If the element with the id is inside a <li> that is a direct child of parent,
 *   remove that <li> (keeps list structure tidy).
 * - Otherwise remove the element itself if it's a direct child.
 * - No exception thrown if parent is null or element not found.
 */
function removeChildById(parent, id) {
    if (!parent) return;
    try {
        // Find element with id under parent
        var el = parent.querySelector && parent.querySelector('#' + CSS.escape ? '#' + CSS.escape(id) : ('#' + id));
        // Fallback if CSS.escape is not available
        if (!el) el = parent.querySelector ? parent.querySelector('#' + id) : document.getElementById(id);
        if (!el) return;
        // If the element is inside a direct-li child of parent, remove that li
        var li = el;
        while (li && li !== parent && li.tagName && li.tagName.toLowerCase() !== 'li') {
            li = li.parentNode;
        }
        if (li && li !== parent && li.parentNode === parent && li.tagName.toLowerCase() === 'li') {
            parent.removeChild(li);
        } else if (el.parentNode === parent) {
            parent.removeChild(el);
        } else {
            // If it's deeper, remove the element itself
            el.parentNode && el.parentNode.removeChild(el);
        }
    } catch (e) {
        // swallow errors to avoid interrupting page flow
        console.error('removeChildById error:', e);
    }
}

function loadPage(page) {
    var link = {};
    var postlist = document.getElementById("post_list");
    var more = document.getElementById("more");

    // show loading indicator (replace existing #more if any)
    if (more) {
        removeChildById(postlist, "more");
        var newMore = document.createElement("img");
        newMore.id = "more";
        newMore.src = "littlewait.gif";
        // put the loader inside a li for list consistency
        var liLoader = document.createElement("li");
        liLoader.appendChild(newMore);
        postlist.appendChild(liLoader);
    }

    getJSON(getPageUrl(page), function (data, headers) {
        try {
            removeChildById(document.getElementById("index"), "wait");
            removeChildById(postlist, "more");

            // render the posts
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

            // parse Link header if present
            if (headers && headers.link) {
                var linkArray = headers.link.split(",");
                for (var j = 0; j < linkArray.length; j++) {
                    // more tolerant regex to match different whitespace formats
                    var m = linkArray[j].match(/\?per_page=(\d+)&page=(\d+)[^>]*>\s*;\s*rel="(\w+)"/);
                    if (m) {
                        link[m[3]] = {
                            "per_page": m[1],
                            "page": m[2]
                        };
                    }
                }
            }

            // determine perPage (try to get from parsed link, fall back to config or default)
            var perPage = (link.last && link.last.per_page) ? parseInt(link.last.per_page, 10) : (config && config.per_page ? parseInt(config.per_page, 10) : 30);

            // decide whether to show "Read More"
            var needMore = false;
            var nextPage = page + 1;

            if (link.last) {
                var last = parseInt(link.last.page, 10);
                if (!isNaN(last) && page < last) {
                    needMore = true;
                }
            } else {
                // No Link header: if returned results equal perPage, likely there's more
                if (data.length >= perPage) {
                    needMore = true;
                }
            }

            if (needMore) {
                var li = document.createElement("li");
                li.className = "pagelist";
                var a = document.createElement("a");
                a.id = "more";
                a.href = "javascript:loadPage(" + nextPage + ");";
                a.appendChild(document.createTextNode("Read More ..."));
                li.appendChild(a);
                postlist.appendChild(li);
            }
        } catch (err) {
            // Ensure any runtime error here won't break the rest of the site
            console.error('Error in loadPage callback:', err);
        }
    });
}

function gotoPage(id) {
    setTitle(config.blog_name);
    setFooter();
    getJSON(getIssuesUrl(id), function (data) {
        setTitle(config.blog_name + " - " + data.title);
        var title = document.getElementById("title");
        // remove previous title text nodes to avoid duplicates
        while (title && title.firstChild) {
            title.removeChild(title.firstChild);
        }
        var txt = document.createTextNode(data.title);
        title && title.appendChild(txt);

        var content = document.getElementById("content");
        renderMarkdown(content, data.body);

        var comment = document.getElementById("comment");
        // clear previous comment link(s)
        while (comment && comment.firstChild) {
            comment.removeChild(comment.firstChild);
        }
        var href = document.createElement("a");
        href.href = getCommentUrl(id);
        var txt2 = document.createTextNode("Click here to comments");
        href.appendChild(txt2);
        comment.appendChild(href);
    });
}

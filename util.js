renderMarkdown = function(content,text)
{
    var post = {
        "text": text,
        "mode": "gfm",
    };
    ajax(post, "https://api.github.com/markdown", function(data) {
        content.innerHTML = data;
    });
}

getPageUrl = function(page)
{
    return "https://api.github.com/repos/"+config.github_username+"/"+config.github_repo+"/issues?per_page="+config.per_page+"&page="+page;
}

getIssuesUrl = function(id)
{
    return "https://api.github.com/repos/"+config.github_username+"/"+config.github_repo+"/issues/"+id;
}

getCommentUrl = function(id)
{
    return "https://github.com/"+config.github_username+"/"+config.github_repo+"/issues/"+id+"#new_comment_field";
}

setTitle = function(title)
{
    var titles = document.getElementsByTagName("title");
    titles[0].innerHTML = title;
}

setBlogName = function()
{
    var btitle = document.getElementById("blog_title");
    var txt = document.createTextNode(config.blog_name);
    btitle.appendChild(txt);
}

cleanChild = function(node)
{
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

removeChildById = function(node, id)
{
    var child = document.getElementById(id);
    if (child) {
        node.removeChild(child);
    }
}

setFooter = function()
{
    var footer = document.getElementById("footer");
    footer.innerHTML = '<span>\
        Copyright © 2015-2016 <a href="http://github.com/'+config.github_username+'" target="_blank">'+config.github_username+'</a>.\
        Powered by <a href="http://github.com/hanxi/issues-blog" target="_blank">issues-blog</a>.\
        </span>';
}

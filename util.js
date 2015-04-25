getJSON = function(url, callback)
{
    var xhr = new window.XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200)
        {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.send();
}

ajax = function(post, url, callback) {
    var xhr = new window.XMLHttpRequest();
    var method = "post";
    if (post == null) {
        method = "get";
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200)
        {
            callback(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify(post));
}

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

getPageUrl = function()
{
    return "https://api.github.com/repos/"+config.github_username+"/"+config.github_repo+"/issues";
}

getIssuesUrl = function(id)
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

setFooter = function()
{
    var footer = document.getElementById("footer");
    footer.innerHTML = '<span>\
        Copyright © 2015-2016 <a href="http://github.com/'+config.github_username+'" target="_blank">'+config.github_username+'</a>.\
        Powered by <a href="http://github.com/hanxi/issues-blog" target="_blank">issues-blog</a>.\
        </span>';
}

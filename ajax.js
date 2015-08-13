createHTTPRequestObject = function() {
    // although IE supports the XMLHttpRequest object, but it does not work on local files.
    var forceActiveX = (window.ActiveXObject && location.protocol === "file:");
    if (window.XMLHttpRequest && !forceActiveX) {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {}
    }
    alert ("Your browser doesn't support XML handling!");
    return null;
}

getJSON = function(url, callback)
{
    var xhr = createHTTPRequestObject();
    xhr.open("get", url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
            var headers = {};
            if (xhr.getAllResponseHeaders) {
                var headersArray = xhr.getAllResponseHeaders().split("\n");
                for (var i=0; i<headersArray.length; i++) {
                    var kv = headersArray[i].split(": ");
                    if (kv.length==2) {
                        headers[kv[0]] = kv[1];
                    }
                }
            }
            callback(JSON.parse(xhr.responseText), headers);
        }
    }
    xhr.send();
}

ajax = function(post, url, callback) {
    var xhr = createHTTPRequestObject();
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

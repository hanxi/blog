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
	var method = "get";
	if (post == null) {
		method = "post";
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

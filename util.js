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

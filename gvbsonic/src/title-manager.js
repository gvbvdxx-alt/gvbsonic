var appName = "Gvbvdxx Sonic Engine";
function setTitleInfo (data) {
	if (data.length > 0) {
		document.title = `${appName} - ${data}`;
	} else {
		document.title = appName;
	}
}
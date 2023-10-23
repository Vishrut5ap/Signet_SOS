var sUrl = window.location.href;
var oUrl = new URL(sUrl);
var sStore = oUrl.searchParams.get("store");
// console.log("sStore = " + sStore);
// var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
var sLocalStore = sessionStorage.getItem("store");
//Ashim
var sCenter = oUrl.searchParams.get("supportcenter");
//Ashim

if (sStore && sLocalStore) {
	if (sLocalStore !== sStore) { //compare local storage store and URL store
		document.write("An error occurred! Invalid access");
		window.stop();
	}
}
if (sStore) {
	
	sessionStorage.setItem("store", sStore);
	
	history.pushState(null, document.title, location.href);
	window.addEventListener('popstate', function(event) {
	history.pushState(null, document.title, location.href);
	});
	window.location.href = window.location.origin + window.location.pathname;
} else {
	if (!sLocalStore) {
	  document.write("An error occurred! Invalid store");
	  window.stop();
	}
}

//Ashim
//if (sCenter) {
	//sessionStorage.setItem("supportcenter", sCenter);
//}
//Ashim


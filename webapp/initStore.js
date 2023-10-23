var sUrl = window.location.href;
var oUrl = new URL(sUrl);
var sStore = oUrl.searchParams.get("store");
// console.log("sStore = " + sStore);
// var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
var sLocalStore = sessionStorage.getItem("store");
 
// var sLocalStore = oStorage.get("storeNumber");
if (sStore) {
	// sStore = atob(sStore);
	//sStore = decryptStore(sStore);
	
	if (!sStore) {
		document.write("An error occurred! Invalid store value");
		//window.location.href = window.location.origin + window.location.pathname;
		window.stop();
	}
}
if (sStore && sLocalStore) {
	if (sLocalStore !== sStore) { //compare local storage store and URL store
		document.write("An error occurred! Invalid access");
		//window.location.href = window.location.origin + window.location.pathname;
		window.stop();
	}
}
if (sStore) {
	
	sessionStorage.setItem("store", sStore);
	
	history.pushState(null, document.title, location.href);
	window.addEventListener('popstate', function(event) {
	history.pushState(null, document.title, location.href);
	});
	// window.location.href = window.location.origin + window.location.pathname;

	window.location.href = window.location.origin + window.location.pathname.replace("welcome", "index");
} else {
	if (!sLocalStore) {
	  document.write("An error occurred! Invalid store");
	  //window.location.href = window.location.origin + window.location.pathname.replace("welcome", "index");
	  window.stop();
	}
}

//Ashim: Changed on 26th Aug
 var sCenter = oUrl.searchParams.get("supportcenter");
	if (!sCenter) {
	  document.write("An error occurred! Invalid Support Center");
	  //window.location.href = window.location.origin + window.location.pathname.replace("welcome", "index");
	  window.stop();
	} else {
	sessionStorage.setItem("supportcenter", sCenter);	
	}
//Ashim: Changed on 26th Aug
/*function decryptStore (store) {
	//decrypt the store now
			var key = "6Le0DgMTAAAAANokdEEial";
			var iv = "mHGFxENnZLbienLyANoi.e";
			key = CryptoJS.enc.Base64.parse(key);
			iv = CryptoJS.enc.Base64.parse(iv);
			var data = CryptoJS.AES.decrypt(store.toString(), key, {
				iv: iv
			});
			sDecryptedStore = data.toString(CryptoJS.enc.Utf8);
			return btoa(sDecryptedStore);
}*/
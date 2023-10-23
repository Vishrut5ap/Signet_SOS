jQuery.sap.declare("zsos.home.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");

sap.ui.generic.app.AppComponent.extend("zsos.home.Component", {
	metadata: {
		interfaces: [
			"sap.ui.core.IAsyncContentCreation", // Available since 1.89.0
		  ],
		"manifest": "json"
	}
});
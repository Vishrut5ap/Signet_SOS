// jQuery.sap.registerModulePath("sos", "/webapp/");
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (UIComponent, JSONModel, MessageBox) {
	"use strict";
	return UIComponent.extend("zsos.Component", {
		metadata: {
			interfaces: [
				"sap.ui.core.IAsyncContentCreation", // Available since 1.89.0
			  ],
			manifest: "json"
		},
		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// additional initialization can be done here
			//$Sumit set startup params here
			var oStartupData;
			if (this.getComponentData()) {
				oStartupData = this.getComponentData().startupParameters;
			} else {
				oStartupData = jQuery.sap.getUriParameters();
			}
			var oModel = new JSONModel(oStartupData);
			this.setModel(oModel, "startupParams");

			//$Sumit -- read 'admin' tab visibility
			//var oModel = this.getModel();
			//var oUser = new sap.ushell.services.UserInfo();
			//var sUser = oUser.getId(),
			//	sPath;
			//>> for FL -----
			// if (sUser) {
			// 	// sPath = oModel.createKey("/UserDetailsSet", {
			// 	// 	Bname: sUser
			// 	// });
			// 	// sPath = "/UserDetailsSet('" + sUser + "')";
			// 	sPath = "/UserDetailsSet('SBASU')";
			// 	oModel.read(sPath, {success: jQuery.proxy(this.adminReadSuccess, this), error: jQuery.proxy(this.adminReadError, this)}

			// 	);
			// }
		},
		// adminReadSuccess: function(oData,oResponse) {
		// 	var oModel = new JSONModel(oData);
		// 	this.setModel(oModel, "initModel");
		// 	// this.getView().setBusy(false);
		// },
		// adminReadError: function(data,response) {
		// 	// var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		// 	MessageBox.error(
		// 		"An error Occured. Please check user settings with system administrators!"
		// 		// {
		// 		// 	styleClass: bCompact ? "sapUiSizeCompact" : ""
		// 		// }
		// 	);
		// 	// this.getView().setBusy(false);
		// },

	});
});
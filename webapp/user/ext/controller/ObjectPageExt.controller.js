sap.ui.controller("zsos.user.ext.controller.ObjectPageExt", {

	onClickActionzcds_c_sos_userHeader1: function (oEvent) {
			window.history.go(-1);
	},
	pageDataLoaded: function (oEvent, r) {
		// TODO: create the custom css class and see if it is working
		//	var a =	this.byId("objectPage").getSections()[0].getSubSections()[0]._sContainerSelector;
		//var a = this.getView().$().find('.sapUxAPBlockContainer');
		if (!sap.ushell.services) {  
		//ushell.services undefined => it is not from fiori Launchpad, i.e. in it is index.html
		this.getView().byId("template::NavigationBar").setVisible(false);
		}
	},
	onBeforeRebindTableExtension: function (oEvent) {
		
	    
	},
	onInit: function () {
		// this.byId("listReport").setShowTablePersonalisation(false);
	//	this.byId("ItemDetails::Table::Toolbar").setVisible(false);
		// this.byId("template::Share").setVisible(false);
		// this.byId("action::Actionzcds_c_sos_userHeader1").setIcon("sap-icon://decline");
		
		var that = this;
		this.extensionAPI.attachPageDataLoaded(jQuery.proxy(this.pageDataLoaded, this));
		this.byId("template::Share").setVisible(false);
		this.byId("action::Actionzcds_c_sos_userHeader1button").setIcon("sap-icon://decline");
		this.byId("edit").addStyleClass("editButton");
		this.byId("action::Actionzcds_c_sos_userHeader1button").addStyleClass("closeButton");
	}
});
sap.ui.controller("zsos.report.ext.controller.ObjectPageExt", {

	onClickActionZCDS_C_SOS_HOME_TPHeader1: function (oEvent) {
		//this._templateEventHandlers.fclActionButtonHandlers.onCloseColumnPressed();
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
		this.byId("edit").setVisible(false);
		// this.byId("edit").addStyleClass("editButtonHide");
		this.byId("ItemDetails::deleteEntry").setVisible(false);
		this.byId("ItemDetails::Table").getTable().setMode();

		this.byId("ItemDetails::Table::Toolbar").setVisible(false);
		this.byId("template::Share").setVisible(false);
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").setIcon("sap-icon://decline");
		var columns = oEvent.getSource().getTable().getColumns();
		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			if (id.indexOf("Table-buzei") !== -1) {
				columns[i].setWidth("3rem");
			}
			if (id.indexOf("Table-matnr") !== -1) {
				columns[i].setWidth("6rem");
			}
			// if (id.indexOf("Table-maktx") !== -1) {
			// 	columns[i].setWidth("8rem");
			// }
			if (id.indexOf("Table-UnitCost") !== -1) {
				columns[i].setWidth("4rem");
			}
			if (id.indexOf("Table-bdmng") !== -1) {
				columns[i].setWidth("4rem");
			}
			if (id.indexOf("Table-ItmTotalAmt") !== -1) {
				columns[i].setWidth("6rem");
			}
			// if (id.indexOf("Table-SOSItemStatus") !== -1) {
			// 	columns[i].setWidth("7rem");
			// }
		}
		//	this.byId("ItemDetails::Table-header").addStyleClass("objSection");
	},
	onInit: function () {
		// this.byId("listReport").setShowTablePersonalisation(false);
		var that = this;
		this.extensionAPI.attachPageDataLoaded(jQuery.proxy(this.pageDataLoaded, this));
	}
});
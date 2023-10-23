sap.ui.controller("zsos.home.ext.controller.ObjectPageExt", {

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
		if ((oEvent.context.getProperty("SOSReqStatus") === "COMPLETE") ||
			//>>//$Sumit -- 15May2019-- edit not allowed if reservation/PO created
			(!oEvent.context.getProperty("SOSEdit"))) {

			//<<//$Sumit -- SF-1003 17Mar2019			
			//Complete status => edit, delete buttons should be hidden and also the item table should not be selectable			
			// this.byId("objectPageHeader-actions").setEnabled(true);
			// this.byId("edit").setEnabled(false);
			//this.byId("edit").addStyleClass("hideEdit");
			this.byId("edit").setVisible(false);
			this.byId("ItemDetails::deleteEntry").setVisible(false);
			this.byId("ItemDetails::Table").getTable().setMode();
			//>>$Sumit --  15May2019 -- edit not allowed if reservation/PO created
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var sMsg = this.getView().getModel("@i18n").getResourceBundle().getText("noEditMsg");
			if (sMsg) {
				sap.m.MessageBox.information(
					sMsg, {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}

				);
			}
			//<<//$Sumit -- 15May2019 -- edit not allowed if reservation/PO created
		} else {
			this.byId("edit").setVisible(true); //16May19
			this.byId("edit").setEnabled(true);
			// this.byId("edit").removeStyleClass("editButtonHide");

			this.byId("ItemDetails::deleteEntry").setVisible(true);
			this.byId("ItemDetails::Table").getTable().setMode("SingleSelectLeft");
		}
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").setEnabled(true);
	},
	onBeforeRebindTableExtension: function (oEvent) {
		// this.byId("ItemDetails::Table::Toolbar").setVisible(false);
		this.byId("template::Share").setVisible(false);
		this.byId("edit").addStyleClass("editButton");
		this.byId("ItemDetails::Table-btnPersonalisation").setVisible(false);
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").setEnabled(true);
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").setIcon("sap-icon://decline");
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").setTooltip("Close");
		this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").addStyleClass("closeButton");

		//this.byId("action::ActionZCDS_C_SOS_HOME_TPHeader1button").addStyleClass("sapUxAPObjectPageHeaderActionButtonHideText");
		//	this.byId("closeColumn").setVisible(true);
		//	this.byId("ItemDetails::Table-header").addStyleClass("objSection");
		var columns = oEvent.getSource().getTable().getColumns();
		var that = this;

		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			// columns[i].getHeader().addEventDelegate(this.onClick(id));

			// if (id.indexOf("__column0") !== -1) {
			// 	columns[i].setWidth("4rem");
			// }

			// if (id.indexOf("SOSReqNum") !== -1) {
			// 	columns[i].setWidth("8rem");
			// }
			// if (id.indexOf("ColumnBreakout1") !== -1) {
			// 	columns[i].setWidth("7rem");
			// }
			// if (id.indexOf("CatLogSKU") !== -1) {
			// 	columns[i].setWidth("10rem");
			// }
			// if (id.indexOf("notes") !== -1 || id.indexOf("TotalPrice") !== -1 || id.indexOf("bstma") !== -1 || id.indexOf("minbm") !== -1 || id.indexOf(
			// 		"meins") !== -1 || id.indexOf("bdmng") !== -1 || id.indexOf("werks") !== -1) {
			// 	table.getColumns()[i].setVisible(false);
			// }
		}
	},
	onInit: function () {
		// this.byId("listReport").setShowTablePersonalisation(false);
		var that = this;
		this.extensionAPI.attachPageDataLoaded(jQuery.proxy(this.pageDataLoaded, this));
	},
	onClickActionZCDS_C_SOS_HOME_TPSections1: function (oEvent) {}
});
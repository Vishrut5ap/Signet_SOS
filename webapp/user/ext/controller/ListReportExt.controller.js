sap.ui.controller("zsos.user.ext.controller.ListReportExt", {

	onClickActionzcds_c_sos_user1: function (oEvent) {},
    onListNavigationExtension: function (oEvent) {},

	onBeforeRebindTableExtension: function (oEvent) {
		this.byId("page").getTitle().addStyleClass("hideTitle");
		this.byId("listReportFilter-btnFilters").setVisible(false);
		if (!sap.ushell.services) {  
		//ushell.services undefined => it is not from fiori Launchpad, i.e. in it is index.html
		this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn").addStyleClass("filterExpandButton");
		}
		var columns = oEvent.getSource().getTable().getColumns();
		var that = this;
		
		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			// columns[i].getHeader().addEventDelegate(this.onClick(id));
			if (id.indexOf("bname") !== -1 || id.indexOf("name") !== -1 || id.indexOf("tel_number") !== -1 || 
			id.indexOf("smtp_addr") !== -1 ||id.indexOf("status") !== -1) {
				columns[i].getHeader().addEventDelegate({
					onclick: function (oEvent) { //Attach Table Header Element Event
						//$('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
						var srcId = oEvent.srcControl.getId();
						if (srcId.indexOf("bname") !== -1) {
							that.sortId = "bname";
						}
						if (srcId.indexOf("name") !== -1) {
							that.sortId = "name";
						}
						if (srcId.indexOf("tel_number") !== -1) {
							that.sortId = "tel_number";
						}
						if (srcId.indexOf("smtp_addr") !== -1) {
							that.sortId = "smtp_addr";
						}
						if (srcId.indexOf("status") !== -1) {
							that.sortId = "status";
						}
						
						var oTarget = oEvent.currentTarget; //Get hold of Header Element
						var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
						// var oIndex = oTarget.id.slice(-1); //Get the column Index
						var oView = that.getView();
						var oTable = oView.byId("listReport");
						// var oModel = oTable.getModel().getProperty("/ProductCollection"); //Get Hold of Table Model Values
						////var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
						////oView.getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
						that._oResponsivePopover.openBy(oTarget);
					}
				});
			}
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
		//**
	},
	
	onInit: function () {
		// this.extensionAPI.attachPageDataLoaded(this.pageDataLoaded, this);
		//**
		if (!this._oResponsivePopover) {
			this._oResponsivePopover = sap.ui.xmlfragment("zsos.user.ext.view.Popover", this);
			this._oResponsivePopover.setModel(this.getView().getModel("sort"));
		}
		if (!sap.ushell.services) {  
		this.getView().byId("template::FilterText").setVisible(false);
		}
		//**
		this.byId("listReport").setEnableAutoBinding(true);
		this.byId("listReport").setShowTablePersonalisation(false);
		// 	var oMySmartFilterBar = this.getView().byId("listReportFilter");
		// 	oMySmartFilterBar.addAggregation("customData",
		// 		new sap.ui.core.CustomData({
		// 			key: "executeStandardVariantOnSelect",
		// 			value: true
		// 		}));
		// 	var liveMode = oMySmartFilterBar.getLiveMode();
		// 	if(!liveMode) {
		// 		oMySmartFilterBar.setLiveMode(true);
		// 	}
		// 	// var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		// 	// var path = oSmartFilterBar.getParameterBindingPath();
		// 	// oSmartTable.setTableBindingPath(path);
		// 	var oDefaultFilter = {
		// 			SOSStore: "DL01"
		// 		};
		// 	//Default the Global filter values
		// 		oMySmartFilterBar.setFilterData(oDefaultFilter);
	},
	//**
	
	onAscending: function () {
		var oTable = this.getView().byId("listReport");
		var oItems = oTable._oTable.getBinding("items");
		//var oBindingPath = this.getView().getModel().getProperty("/bindingValue");
		var oSorter = new sap.ui.model.Sorter({
			path: this.sortId
		});
		oItems.sort(oSorter);
		this._oResponsivePopover.close();
	},

	onDescending: function () {
		var oTable = this.getView().byId("listReport");
		var oItems = oTable._oTable.getBinding("items");
		//var oBindingPath = this.getView().getModel().getProperty("/bindingValue");
		var oSorter = new sap.ui.model.Sorter({
			path: this.sortId,
			descending: true
		});
		oItems.sort(oSorter);
		this._oResponsivePopover.close();
	}
    //**
});
sap.ui.controller("zsos.home.ext.controller.ListReportExt", {

	onClickActionZCDS_C_SOS_HOME_TP1: function (oEvent) {},
	onListNavigationExtension: function (oEvent) {},
	fireSearch: function (oEvent) {
		this.fireSearch();
	},
	onBeforeRebindTableExtension: function (oEvent) {
		this.getView().byId("listReportFilter-btnBasicSearch").attachEvent("liveChange", this.fireSearch);
		this.getView().byId("listReportFilter-btnBasicSearch").getParent().getContent()[0].setText("Article Description:");
		// oEvent.getParameter("bindingParams").filters $Sumit for PDF filter
		this.byId("page").getTitle().addStyleClass("hideTitle");
		this.byId("listReportFilter-btnFilters").setVisible(false);
		if (!sap.ushell.services) {
			//ushell.services undefined => it is not from fiori Launchpad, i.e. in it is index.html
			if (this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn")) {
				this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn").addStyleClass("filterExpandButton");
			}

		}
		// oEvent.getSource().getTable().setSelectionMode("None");
		// this.byId("listReport").setShowTablePersonalisation(false);
		// var oSmartTable = oEvent.getSource();
		// var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		// // var path = oSmartFilterBar.getParameterBindingPath();
		// // oSmartTable.setTableBindingPath(path);
		// var oDefaultFilter = {
		// 		SOSStore: "DL01"
		// 	};
		// //Default the Global filter values
		// 	oSmartFilterBar.setFilterData(oDefaultFilter);
		var oStartupParams = this.getOwnerComponent().oPropagatedProperties.oModels.startupParams;
		var sStore;
		if (oStartupParams) {
			if (oStartupParams.getData()) {
				if (oStartupParams.getData().store ||
					typeof oStartupParams.getData().get === "function") {

					sStore = (oStartupParams.getData().store) ? oStartupParams.getData().store[0] :
						oStartupParams.getData().get("store");
					//>>$Sumit 5Jul2019 get store from local storage
					if (!sStore) {
						var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

						// Changes by Ashim Anam on 10th Jan 2020
						var oLocalStore = oStorage.get("werks");
						this.sStore = oLocalStore.werks;
						/*	var oLocalStore = oStorage.get("storeNumber"); //Local storage has store?
							if (oLocalStore) {
								sStore = atob(oLocalStore.store);
								// atob(oStore.store)/
							}*/
						// Changes by Ashim Anam on 10th Jan 2020
					}
					//<<$Sumit 5Jul2019
					var binding = oEvent.getParameter("bindingParams");
					var oFilter = new sap.ui.model.Filter(
						"SOSStore", sap.ui.model.FilterOperator.EQ,
						this.sStore
						// oStartupParams.getData().store[0]
					);
					binding.filters.push(oFilter);
				}
			}
		}
		// binding.filters.push(oFilter);
		// this.extensionAPI.attachPageDataLoaded(this.pageDataLoaded, this);
		//**
		var columns = oEvent.getSource().getTable().getColumns();
		var that = this;

		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			// columns[i].getHeader().addEventDelegate(this.onClick(id));
			if (id.indexOf("SOSReqNum") !== -1 || id.indexOf("SOSReqItemCount") !== -1 || id.indexOf("SOSDate") !== -1 ||
				id.indexOf("SOSReqTotAmt") !== -1 || id.indexOf("SOSUser") !== -1 || id.indexOf("SOSReqUserName") !== -1 ||
				id.indexOf("SOSReqStatus") !== -1) {
				columns[i].getHeader().addEventDelegate({
					onclick: function (oEvent) { //Attach Table Header Element Event
						//$('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
						var srcId = oEvent.srcControl.getId();
						if (srcId.indexOf("SOSReqNum") !== -1) {
							that.sortId = "SOSReqNum";
						}
						if (srcId.indexOf("SOSReqItemCount") !== -1) {
							that.sortId = "SOSReqItemCount";
						}
						if (srcId.indexOf("SOSDate") !== -1) {
							that.sortId = "SOSDate";
						}
						if (srcId.indexOf("SOSReqTotAmt") !== -1) {
							that.sortId = "SOSReqTotAmt";
						}
						if (srcId.indexOf("SOSUser") !== -1) {
							that.sortId = "SOSUser";
						}
						if (srcId.indexOf("SOSReqUserName") !== -1) {
							that.sortId = "SOSReqUserName";
						}
						if (srcId.indexOf("SOSReqStatus") !== -1) {
							that.sortId = "SOSReqStatus";
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
			if (id.indexOf("SOSReqItemCount") !== -1) {
				columns[i].setWidth("5rem");
			}

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
			this._oResponsivePopover = sap.ui.xmlfragment("zsos.home.ext.view.Popover", this);
			this._oResponsivePopover.setModel(this.getView().getModel("sort"));
		}
		//**
		this.byId("listReport").setEnableAutoBinding(true);
		this.byId("listReport").setShowTablePersonalisation(false);
		if (!sap.ushell.services) {
			this.getView().byId("template::FilterText").setVisible(false);
		}
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
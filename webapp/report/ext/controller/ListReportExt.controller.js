sap.ui.controller("zsos.report.ext.controller.ListReportExt", {
	_oResponsivePopover: null,
	onClickActionRequestReport: function (oEvent) {

		// var sSource = oEvent.getSource().getModel().getData().Source;
		var oModel = this.getView().getModel("SummaryPDF");

		oModel.read("/SOSSearchSet", {
			// method: mParameters.httpMethod,
			// urlParameters: mParameters.urlParameters,
			filters: this.filtersParam,
			success: jQuery.proxy(this.mySuccessHandler, this),
			error: this.myErrorHandler
		});

		// var oHTML = new sap.ui.core.HTML();
		//	 var pdfURL = "http://dldf20app00.irving.zalecorp.com:8001/sap/opu/odata/sap/ZFIAP_SOS_REPORT_SRV/SOSSearchSet(guid'00505680-244a-1ed9-8aee-c5114c09bfa9')/to_SOSPDFReport/$value";
		// // var oContent = '<iframe id="iframeContentPanel" ' + 'src="formGetController.do?' + formData + '"width="100%" height=600px'"></iframe>';
		// oHTML.setContent("<iframe src=" + pdfURL + " width='700' height='700'></iframe>");
		// oHTML.setContent(oContent);
		//var URL = "https://www.sapfioritrial.com/sap/opu/odata/sap/HCM_MY_PAYSTUBS_SRV/PDFPaystubs(SEQUENCENUMBER=1694,PersonnelAssignment='00100226')/$value";
		// sap.m.URLHelper.redirect( pdfURL, true );

		// var oTarget = oEvent.currentTarget; //Get hold of Header Element
		// // this._oPDFDialog.openBy(oTarget);
		// this._oPDFDialog.open();
		// this._pdfViewer.setSource("http://dldf20app00.irving.zalecorp.com:8001/sap/opu/odata/sap/ZFIAP_SOS_REPORT_SRV/SOSSearchSet(guid'00505680-244a-1ed9-8aee-c5114c09bfa9')/to_SOSPDFReport/$value");
		// this._pdfViewer.setTitle("Report Summary");
		// this._pdfViewer.open();
	},

	onClickActionRequestSummary: function (oEvent) {

		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("zsos.report.ext.view.RequestSummary", this);
		}
		this.getView().addDependent(this._oDialog);
		//	var oContext = oEvent.getSource().getParent().getBindingContext();
		this._oDialog.open();
	},
	handleClose: function (oEvent) {
		this._oDialog.close();
	},

	mySuccessHandler: function (d, r) {
		sap.m.URLHelper.redirect(d.results[0].to_SOSPDFReport.__deferred.uri + "/$value", true);

	},
	myErrorHandler: function () {},
	onInit: function () {
		if (!this._oResponsivePopover) {
			this._oResponsivePopover = sap.ui.xmlfragment("zsos.report.ext.view.Popover", this);
		}
		this.byId("page").getTitle().addStyleClass("hideTitle");
		if (!sap.ushell.services) {
			this.getView().byId("template::FilterText").setVisible(false);
		}
		//For PDF report summary
		// if (!this._oPDFDialog) {
		// 	this._oPDFDialog = sap.ui.xmlfragment("zsos.report.ext.view.PDFDialog", this);
		// 	this.getView().addDependent(this._oPDFDialog);
		// }
		// this._pdfViewer = new sap.m.PDFViewer();
		// this.getView().addDependent(this._pdfViewer);

		for (var i = 0; i < this.byId("template::IconTabBar").getContent().length; i++) {

			if (this.byId("template::IconTabBar").getContent()[i].getId().indexOf("_tab1") !== -1) {
				this.byId("template::IconTabBar").getContent()[i].setEnableAutoBinding(true);
			}
			if (this.byId("template::IconTabBar").getContent()[i].getId().indexOf("_tab2") !== -1) {
				this.byId("template::IconTabBar").getContent()[i].setEnableAutoBinding(true);
			}
		}

		//	this.byId("template::IconTabBar").getContent()[2].setEnableAutoBinding(true);
		var page = this.getView().byId("page");
		page.getHeader().addStyleClass("headerPadding");
		// this.byId("template::IconTabBar").getContent()[0].getCustomToolbar().setVisible(false);
		//this.byId("listReport").getTable().setFixedLayout(true);

	},
	onDataReceived: function (e) {
		// this.getParent().getParent().getTitle().setVisible(false);
		this.getTable().setAlternateRowColors(true);
		var data = e.getParameters().getParameter("data");
		// var data = e.getParameters().getParameter("data").results;
		if (data) {
			if (data.results) {
				var results = data.results;
				for (var i = 0; i < results.length; i++) {
					results[i].SOSReqTotAmt = results[i].SOSReqTotAmt.substring(0, results[i].SOSReqTotAmt.length - 3);
				}
			}
		}
	},
	onBeforeRebindTableExtension: function (oEvent) {
		//Apply store filter 		
		var oStartupParams = this.getOwnerComponent().oPropagatedProperties.oModels.startupParams;
		var binding, oStoreFilter, oDateFilter, oFilter, sStore;
		binding = oEvent.getParameter("bindingParams");
		if (!sap.ushell.services) {
			//ushell.services undefined => it is not from fiori Launchpad, i.e. in it is index.html
			if (this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn")) {
				this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn").addStyleClass("filterExpandButton");
			}
		}
		if (oStartupParams) {
			if (oStartupParams.getData()) {
				if (oStartupParams.getData().store ||
					typeof oStartupParams.getData().get === "function") { //$Sumit 29Apr19 Store handling in Store app (index.html)

					sStore = (oStartupParams.getData().store) ? oStartupParams.getData().store[0] :
						oStartupParams.getData().get("store");
					//>>$Sumit 5Jul2019 Get store from local storage						
					if (!sStore) {
						// sStore = jQuery.sap.getUriParameters().get("store");
						var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
                  	// Start Changes by Ashim Anam on 7th Aug 2020
                      	var oLocalStore = oStorage.get("werks");
                      	this.sStore = oLocalStore.werks;
						//var oLocalStore = oStorage.get("storeNumber"); //Local storage has store?
						// if (oLocalStore) {
						// 	sStore = atob(oLocalStore.store);
						// 	// atob(oStore.store)/
						// }
					 	// End of Changes by Ashim Anam on 7th Aug 2020	
					}
					//<<$Sumit 5Jul2019 Get store from local storage			
					var binding = oEvent.getParameter("bindingParams");
					// Start of Changes by Ashim Anam on 7th Aug 2020
					
					var oStoreFilter = new sap.ui.model.Filter(
						"SOSStore", sap.ui.model.FilterOperator.EQ,
						this.sStore
				//	End of Changes by Ashim Anam on 7th Aug 2020
						// oStartupParams.getData().store[0]
					);
					// binding.filters.push(oFilter);

				}
			}
		}
		if (oEvent.getParameters().id.indexOf("_tab1") !== -1) {
			//if(oEvent.getParameters().id == "_tab1"){
			var oMySmartFilterBar = this.getView().byId("listReportFilter");
			//var olow1 = this.getView().byId("low");
			var oToDate = new Date();
			var oFromDate = new Date(oToDate.getTime() - 24 * 60 * 60 * 1000 * 30);

			oDateFilter = new sap.ui.model.Filter("SOSDate", sap.ui.model.FilterOperator.BT, oFromDate, oToDate);
			// binding = oEvent.getParameter("bindingParams");
			// binding.filters.push(oFilter);
		}
		if (oStoreFilter) {
			if (oDateFilter) {
				oFilter = new sap.ui.model.Filter([oStoreFilter, oDateFilter], true);
			} else {
				oFilter = oStoreFilter;
			}

		} else {
			if (oDateFilter) {
				oFilter = oDateFilter;
			}
		}
		if (oFilter) {
			// binding.filters.push(oFilter);
			if (binding.filters.length > 0) {
				binding.filters[0].bAnd = true;
				binding.filters[0].aFilters.push(oFilter);
			} else {
				binding.filters.push(oFilter);
			}
		}
		this.filtersParam = oEvent.getParameter("bindingParams").filters;

		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqNum").setWidth("70%");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqNum").getParent().addStyleClass("filters");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqItemCount").setWidth("70%");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqItemCount").getParent().addStyleClass("filters");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSDate").setWidth("70%");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSDate").getParent().addStyleClass("filters");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqTotAmt").setWidth("70%");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqTotAmt").getParent().addStyleClass("filters");
		// this.byId("listReportFilter-filterItemControl_BASIC-SOSReqUserName").setWidth("70%");
		// this.byId("listReportFilter-filterItemControl_BASIC-SOSReqUserName").getParent().addStyleClass("filters");
		// this.byId("listReportFilter-filterItemControl_BASIC-SOSUser").setWidth("70%");
		// this.byId("listReportFilter-filterItemControl_BASIC-SOSUser").getParent().addStyleClass("filters");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqStatus").setWidth("70%");
		this.byId("listReportFilter-filterItemControl_BASIC-SOSReqStatus").getParent().addStyleClass("filters");

		if (oEvent.getParameters().id.indexOf("_tab1") !== -1) {
			for (var j = 0; j < this.byId("template::IconTabBar").getContent().length; j++) {
				if (this.byId("template::IconTabBar").getContent()[j].getId().indexOf("_tab1") !== -1) {
					this.byId("template::IconTabBar").getContent()[j].setShowTablePersonalisation(false);
				}
			}

		} else if (oEvent.getParameters().id.indexOf("_tab2") !== -1) {
			for (var j = 0; j < this.byId("template::IconTabBar").getContent().length; j++) {
				if (this.byId("template::IconTabBar").getContent()[j].getId().indexOf("_tab2") !== -1) {
					this.byId("template::IconTabBar").getContent()[j].setShowTablePersonalisation(false);
				}
			}
		}
		oEvent.getSource().getTable().setMode();
		oEvent.getSource().attachDataReceived(this.onDataReceived);
		// this.byId("template::IconTabBar").getContent()[1].getTable().setPopinLayout(sap.m.PopinLayout.GridSmall);
		//	this.byId("template::IconTabBar").getContent()[2].getTable().setPopinLayout(sap.m.PopinLayout.GridSmall);
		//this.byId("page").getTitle().setVisible(false);
		this.byId("listReportFilter-btnFilters").setVisible(false);
		var columns = oEvent.getSource().getTable().getColumns();
		var that = this;
		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			if (id.indexOf("SOSReqNum") !== -1 || id.indexOf("SOSDate") !== -1 || id.indexOf("SOSUser") !== -1 || id.indexOf("SOSReqItemCount") !==
				-1 || id.indexOf("SOSReqStatus") !== -1 || id.indexOf("SOSReqTotAmt") !== -1 || id.indexOf("SOSReqUserName") !== -1) {
				columns[i].getHeader().addEventDelegate({
					onclick: function (oEvent) {
						if (oEvent.currentTarget.id.indexOf("_tab1") !== -1) {
							that.tabNum = 0;
						}
						if (oEvent.currentTarget.id.indexOf("_tab2") !== -1) {
							that.tabNum = 1;
						}
						var srcId = oEvent.srcControl.getId();
						if (srcId.indexOf("SOSReqNum") !== -1) {
							that.sortId = "SOSReqNum";
						}
						if (srcId.indexOf("SOSDate") !== -1) {
							that.sortId = "SOSDate";
						}
						if (srcId.indexOf("SOSUser") !== -1) {
							that.sortId = "SOSUser";
						}
						if (srcId.indexOf("SOSReqItemCount") !== -1) {
							that.sortId = "SOSReqItemCount";
						}
						if (srcId.indexOf("SOSReqStatus") !== -1) {
							that.sortId = "SOSReqStatus";
						}
						if (srcId.indexOf("SOSReqTotAmt") !== -1) {
							that.sortId = "SOSReqTotAmt";
						}
						if (srcId.indexOf("SOSReqUserName") !== -1) {
							that.sortId = "SOSReqUserName";
						}
						var oTarget = oEvent.currentTarget; //Get hold of Header Element
						that._oResponsivePopover.openBy(oTarget);
					}
				});
			}
			if (id.indexOf("SOSReqItemCount") !== -1) {
				columns[i].setWidth("6rem");
			}
			if (id.indexOf("SOSReqNum") !== -1) {
				columns[i].setWidth("8rem");
			}
			// if (id.indexOf("SOSReqTotAmt") !== -1) {
			// columns[i].mAggregations.customData[0].mProperties.value.scale = "2";
			// }
		}

		var oPage = this.getView().byId("page");
		var content = oPage.getContent();

		// content.addItem(new sap.m.TextArea({
		// 	width: "10%",
		// 	height: "1px"
		// }));

	},
	onAscending: function () {
		var oTable = this.byId("template::IconTabBar").getContent()[this.tabNum];
		var oItems = oTable._oTable.getBinding("items");
		var oSorter = new sap.ui.model.Sorter({
			path: this.sortId
		});
		oItems.sort(oSorter);
		this._oResponsivePopover.close();
	},

	onDescending: function () {
		var oTable = this.byId("template::IconTabBar").getContent()[this.tabNum];
		var oItems = oTable._oTable.getBinding("items");
		var oSorter = new sap.ui.model.Sorter({
			path: this.sortId,
			descending: true
		});
		oItems.sort(oSorter);
		this._oResponsivePopover.close();
	},
	onClickActionZCDS_C_SOS_HOME_TP2: function (oEvent) {

	}
});
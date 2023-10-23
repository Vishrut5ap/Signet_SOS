jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("zsos.sosservice.ext.controller.ListReportExt", {
	_oResponsivePopover: null,
	//Formatter for Quantity, Minimum Quantity and Maximum Quantity custom fields(quqntityCell.fragment.xml)
	valueFormat: function (minbm) {
		// if (minbm !== null) {
		if (typeof minbm !== "undefined" && minbm !== null) {
			var str = minbm;

			var val = str.split(".");
			return parseInt(val[0], 10);
		}
	},
	//Formatter for Favorite icon display
	favDisplay: function (FavInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (FavInd) {
		case "XX":
			return true;
		case "X0":
			return true;
		default:
			return false; //sap-icon://unfavorite
		}
	},
	unfavDisplay: function (FavInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (FavInd) {
		case "XX":
			return false;
		case "X0":
			return false;
		default:
			return true; //sap-icon://unfavorite
		}
	},
	favtooltip: function (FavInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (FavInd) {
		case "XX":
			return "Add to Favorite";
		case "X0":
			return "Add to Favorite";
		default:
			return "Remove from Favorite"; //sap-icon://unfavorite
		}
	},
	cartText: function (CartInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (CartInd) {
		case "XX":
			return "Add to cart";
		case "0X":
			return "Add to cart";
		default:
			return "Remove from cart"; //sap-icon://unfavorite
		}
	},
	buttonType: function (CartInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (CartInd) {
		case "XX":
			return "Accept";
		case "0X":
			return "Accept";
		default:
			return "Default"; //sap-icon://unfavorite
		}
	},
	fnCartEnable: function (bInProgress, bHotPick) {
		//Start of change by Ashim Anam on 10th Feb 2020	
		//return (bHotPick === "Y") ? true : !bInProgress;
		// return !bInProgress;
		if (!bInProgress) {
			return true;
		} else {
			return false;
		}
		//End of change by Ashim Anam on 10th Feb 2020
	},
	stepEditable: function (CartInd) {
		// var resourceBundle = this.getView().getModel("FavInd").getResourceBundle();
		switch (CartInd) {
		case "XX":
			return true;
		case "0X":
			return true;
		default:
			return false; //sap-icon://unfavorite
		}
	},
	//User specific binding
	onClickActionZCDS_I_SOS_REQUEST_TP1: function (oEvent) {},

	// onClick: function (oID) {
	// 	var that = this;
	// 	$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
	// 		//$('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
	// 		var oTarget = oEvent.currentTarget; //Get hold of Header Element
	// 		var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
	// 		var oIndex = oTarget.id.slice(-1); //Get the column Index
	// 		var oView = that.getView();
	// 		var oTable = oView.byId("listReport");
	// 		//var oModel = oTable.getModel().getProperty("/ProductCollection"); //Get Hold of Table Model Values
	// 		//var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
	// 		//oView.getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
	// 		that._oResponsivePopover.openBy(oTarget);
	// 	});
	// },

	onInit: function () {

		// var oModel1 = new sap.ui.model.json.JSONModel();
		// this.getView().setModel(oModel1, "sort");
		var oFavCartModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_FAV_CART_SRV/");
		oFavCartModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		this.getView().setModel(oFavCartModel, "Favorites"); //$Sumit csrftok

		this.byId("page").getTitle().addStyleClass("hideTitle");
		this.byId("listReportFilter-btnFilters").setVisible(false);
		if (!sap.ushell.services) {
			this.getView().byId("template::FilterText").setVisible(false);
		}
		// this.byId("ActionZCDS_I_SOS_REQUEST_TP1button").setVisible(false);
		this.byId("listReport").setShowTablePersonalisation(false);
		if (!this._oResponsivePopover) {
			this._oResponsivePopover = sap.ui.xmlfragment("zsos.sosservice.ext.view.Popover", this);
			this._oResponsivePopover.setModel(this.getView().getModel("sort"));
		}
		/*	var oModel1 = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel1,"sort");
          var that = this;
          if (!this._oResponsivePopover) {
			this._oResponsivePopover = sap.ui.xmlfragment("zsos.sosservice.ext.view.Popover", this);
			this._oResponsivePopover.setModel(this.getView().getModel("sort"));
		var oTable = this.getView().byId("listReport");
    oTable.addEventDelegate({
       onAfterRendering: function() {
          var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
          for (var i = 0; i < oHeader.length; i++) {
          var oID = oHeader[i].id;
          //that.onClick(oID);
          if (oID.indexOf("__column0") !== -1){
          that.onClick(oID);
         }
          if (oID.indexOf("CatLogSkuPrice") !== -1){
          that.onClick("ListReport::ZCDS_I_SOS_REQUEST_TP--listReport-CatLogSkuPrice");
         }
         if (oID.indexOf("CatLogSKU") !== -1){
          that.onClick("ListReport::ZCDS_I_SOS_REQUEST_TP--listReport-CatLogSKU");
         }
         if (oID.indexOf("CatalogSKUDesc") !== -1){
          that.onClick("ListReport::ZCDS_I_SOS_REQUEST_TP--listReport-CatalogSKUDesc");
         }
        }
      }
   }, oTable);*/

		this.byId("listReport").setEnableAutoBinding(true);
		var page = this.getView().byId("page");
		// page.addStyleClass("pagePadding");
		// page.getContent().addStyleClass("pagePadding");

		// page.getTitle().setVisible(false);
		// page.getHeader().setVisible(false);
		// page.getTitle().setHeading();
		// page.getTitle()._getActionsToolbar().destroyContent();
		// page.getTitle().addStyleClass("titleHeight");
		page.getHeader().addStyleClass("headerPadding");
		this.byId("listReport").getTable().setFixedLayout(true);
		var oUser, sUser;
		if (sap.ushell.services) {
			oUser = new sap.ushell.services.UserInfo();
			if (oUser) {
				sUser = oUser.getId();
			}
		}

		// var oUser = new sap.ushell.services.UserInfo();
		// var sUser = oUser.getId(),
		// if (!sUser) {
		// 	sUser = jQuery.sap.getUriParameters().get("user");
		// }
		sUser = "SOS_USER";
		if (!this.sStore) {
			// this.sStore = jQuery.sap.getUriParameters().get("store");
			//>>$Sumit 5Jul2019 Get store from local storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// Change by Ashim on 10th Jan 2019		   
			var oLocalStore = oStorage.get("werks");
			this.sStore = oLocalStore.werks;

			/*	var oLocalStore = oStorage.get("storeNumber"); //Local storage has store?
				if (oLocalStore) {
					this.sStore = atob(oLocalStore.store);
					// atob(oStore.store)/
				}*/
			//<<$Sumit 5Jul2019 Get store from local storage
			// Change by Ashim on 10th Jan 2019
		}
		if (sUser === "DEFAULT_USER") {
			sUser = "SBASU";
		}
		this.sPath = this.getOwnerComponent().getModel().createKey("/ZCDS_C_SOSREQUEST_ST_TP", {
			bname: sUser,
			werks: this.sStore //Add store as a key $Sumit 29Apr19
		});

		// var sPath = "/ZCDS_C_SOSREQUEST_ST_TP('AKHAN2')";
		this.getView().bindElement(this.sPath);
		this.byId("listReport").setTableBindingPath(this.sPath + "/to_SOSReqStoreUser");
		// set data model on view
		var oData = {
			key: "",
			quantity: ""

		};
		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "addCart");

	},

	//Store quanity into JSON Model
	onChangeQuantity: function (oEvent) {
		var oCartModel = this.getView().getModel("addCart");

		//Get the changed value of bdmng from current context
		var oContext = oEvent.getSource().getBindingContext();
		if (oEvent.getParameters().value > oContext.getProperty("CatLogMaxOrd")) {
			oEvent.getParameters().value = oContext.getProperty("CatLogMaxOrd");
			oEvent.getSource().setValue(oContext.getProperty("CatLogMaxOrd"));
			sap.m.MessageToast.show("Quantity must not exceed Maximum Quantity");
		}
		if (oEvent.getParameters().value < oContext.getProperty("CatLogMinOrd")) {
			oEvent.getParameters().value = oContext.getProperty("CatLogMinOrd");
			oEvent.getSource().setValue(oContext.getProperty("CatLogMinOrd"));
			sap.m.MessageToast.show("Quantity must not less than Minimum Quantity");
		}

		var oCartContext = new sap.ui.model.Context(oCartModel, oContext.sPath);
		// oCartModel.createBindingContext(oContext.sPath, oCartContext);
		oCartModel.bindContext(oContext.sPath, oCartContext);
		// oCartModel.setProperty("/quantity", oEvent.getParameter("value"), oCartContext);
		oCartModel.setProperty("/" + oContext.sPath, [oContext.sPath, oEvent.getParameter("value")], oCartContext);
		//Get Odata model bound to the view
		var oModel = this.getView().getModel();

		// var oCartModel = this.getView().getModel("addCart");

		// 		//Get the changed value of bdmng from current context
		// 		var oContext = oEvent.getSource().getBindingContext();
		// 		var oCartContext = new sap.ui.model.Context(oCartModel, oContext.sPath);
		// 		// oCartModel.createBindingContext(oContext.sPath, oCartContext);
		// 		oCartModel.bindContext(oContext.sPath, oCartContext);
		// 		oCartModel.setProperty("/"+oContext.sPath, [oContext.sPath,oEvent.getParameter("value")], oCartContext);
		// 		//Get Odata model bound to the view
		// 		var oModel = this.getView().getModel(); 
		// var oCart = oModel.oData[oContext.getPath().substr(1)];
		// oCart.bdmng = oContext.getProperty("bdmng");
		// sap.ui.core.BusyIndicator.show();
		// var quantity = oContext.getProperty("bdmng") + "";
	},

	//Function for Add Cart Button
	addCart: function (oEvent) {
		var oContext = oEvent.getSource().getParent().getBindingContext();
		var article = oContext.getProperty("CatLogSKU");
		//this.oSmartTable = oEvent.getSource();
		//show a confirmation message if backorder $Sumit 15Mar2019 --SF-1003
		// if (oContext.getProperty("BackOrdIndicator") === 'X') {

		// } else 

		// this.callAddCartApi(oEvent, oContext); //uncomment this line when stable $Sumit 15Mar19

		var oDate = new Date();
		// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var format1 = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "PTHH'H'mm'M'ss'S'"

		});
		var oQuantity = oEvent.getSource().getModel("addCart").getData()[oContext.sPath.slice(1)];
		var quantity;
		if (!oQuantity) { //.length > 0
			quantity = oContext.getProperty("CatLogMinOrd") + "";
		} else {
			quantity = oQuantity[1] + "";
		}
		// var oDate = oDateFormat.format(new Date());
		var oData;
		// useroDataModel.setHeaders({
		// 	"X-CSRF-Token": "Fetch" // auth 
		// });

		var oModelRef = this.getView().byId("listReport").getModel();
		var oModel = this.getView().getModel("Favorites");

		// Change by Ashim on 18th March 2020
		if (this.byId("template::SegmentedButton").getSelectedKey() === "_tab2") {
			var sosReqType = "Y";
		} else {
			sosReqType = "N";
		}
		// Change by Ashim on 18th March 2020
		//$Sumit csrftok
		// var oFavModel = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, null, "SOS_USER", "Welcome@1");
		// sap.ui.core.BusyIndicator.show();
		if (oEvent.getSource().getText() === "Add to cart") {
			if (quantity === "0.000" || quantity === "0") {
				sap.m.MessageToast.show("Select a valid quantity");
				sap.ui.core.BusyIndicator.hide();
			} else {

				oData = {

					"Bname": oContext.getProperty("CatlogUser"),
					"IsHotpick": sosReqType, // Added by Ashim
					// "Minbm": oContext.getProperty("CatLogMinOrd"),
					"Bstma": oContext.getProperty("CatLogMaxOrd"),
					"CartItmNo": "00001",
					"Matnr": article,
					"Createdate": oDate,
					"Createtime": format1.format(oDate),
					"Bdmng": quantity,
					"Meins": oContext.getProperty("CatlogUnit"),
					// Start of change by Ashim Anam to save Article Price
					"SkuPrice": oContext.getProperty("CatLogSkuPrice")

					// End of change by Ashim Anam to save Article Price

				};
				if (this.getOwnerComponent().getModel("startupParams").getData().store) {
					oData.Werks = this.getOwnerComponent().getModel("startupParams").getData().store[0];
				} else {
					//new store parameter handling -- $Sumit 23Apr19					
					// oData.Werks = jQuery.sap.getUriParameters().get("store"); //Removed -- $Atanu 15Jul19
					oData.Werks = this.sStore; //-- $Atanu 15Jul19
				}
				//Store the event object to be used in callback fn of confirmation message
				if (oContext.getProperty("BackOrdIndicator")) {
					// Added on 3rd Aug 2021
					this.CatalogSKUDesc = oContext.getProperty("CatalogSKUDesc");
					this.backOrderCatalogSKU = oContext.getProperty("CatLogSKU");
					// Added on 3rd Aug 2021
					this.oCartData = oData;
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					var sMsg = this.getView().getModel("@i18n").getResourceBundle().getText("backOrderMsg");
					var sTitle = this.getView().getModel("@i18n").getResourceBundle().getText("Confirm");
					sap.m.MessageBox.confirm(sMsg, {
						// title: sTitle,
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CLOSE, sap.m.MessageBox.Action.RETRY],
						onClose: jQuery.proxy(this.backOrderOK, this),
						onRetry: jQuery.proxy(this.backOrderOK, this),
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						// initialFocus: null,
						// textDirection: sap.ui.core.TextDirection.Inherit
					});
				} else {
					sap.ui.core.BusyIndicator.show();
					// oModel.refreshSecurityToken();
					// oModel.bTokenHandling = true; //Force token handling $Sumit 2May19
					oModel.setHeaders({
						            'X-Requested-With': 'X'
						        });
					oModel.create("/CartSet", oData, {
						//Calling success function with refresh parameter	
						success: jQuery.proxy(this.mySuccessHandler, this),
						error: jQuery.proxy(this.cartError, this)
					});
					// sap.m.MessageToast.show("Article : " + article + " added to cart");
					this.msg = "Article : " + article + " added to cart";
				}
			}
		} else {
			this.msg = "Article : " + article + " removed from cart";
			// sap.m.MessageToast.show("Article : " + article + " removed from cart");
			sap.ui.core.BusyIndicator.show();
			//csrftok
			var path = "/CartSet(Bname='" + oContext.getProperty("CatlogUser") + "',CartItmNo='',Matnr='" + article + "',Werks='" + this.sStore +
				"')";
			// oModel.refreshSecurityToken();
			// oModel.bTokenHandling = true; //Force token handling $Sumit 2May19
			oModel.setHeaders({
				            'X-Requested-With': 'X'
				        });
			oModel.remove(path, {
				success: jQuery.proxy(this.mySuccessHandler, this),
				error: this.myErrorHandler
			});
			// }
		}

		// }
	},
	removeFavorite: function (oEvent) {
		var oContext = oEvent.getSource().getParent().getBindingContext();
		var oModel = this.getView().getModel("Favorites");
		//$Sumit csrftok
		// var oFavModel = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, null, "SOS_USER", "Welcome@1");
		// sap.m.MessageToast.show("Article : " + oContext.getProperty("CatLogSKU") + " removed from favorite");
		this.msg = "Article : " + oContext.getProperty("CatLogSKU") + " removed from favorite";
		// "/FavoriteSet(Bname='AKHAN2',CartItmNo='',Matnr='40',Werks='')"
		var path = "/FavoriteSet(Bname='" + oContext.getProperty("CatlogUser") + "',Matnr='" + oContext.getProperty("CatLogSKU") +
			"',Werks='" +
			oContext.getProperty("CatLogSkuStore") + "')";
		// oModel.refreshSecurityToken();
		// oModel.bTokenHandling = true; //Force token handling $Sumit 2May19
		oModel.remove(path, {
			success: jQuery.proxy(this.mySuccessHandler, this),
			error: this.myErrorHandler
		});
	},
	//Function for add Favorite
	addFavorite: function (oEvent) {
		sap.ui.core.BusyIndicator.show();
		var oContext = oEvent.getSource().getParent().getBindingContext();
		var article = oContext.getProperty("CatLogSKU");

		// sap.m.MessageToast.show("Article : " + article + " added to favorite");
		var oData = {
			"Bname": oContext.getProperty("CatlogUser"),
			"Matnr": article,
			"Werks": oContext.getProperty("CatLogSkuStore"),
			"CtlgItmKey": 0,
			"CatItmHash": ""
		};
		//Call odata to update
		var oModel = this.getView().getModel("Favorites");
		//$Sumit csrftok
		// var oFavModel = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, null, "SOS_USER", "Welcome@1");
		// oModel.refreshSecurityToken();
		// oModel.bTokenHandling = true; //Force token handling $Sumit 2May19
		oModel.create("/FavoriteSet", oData, {
			//Calling success function with refresh parameter
			success: jQuery.proxy(function (oData, oResponse) {
				// success
				sap.ui.core.BusyIndicator.hide();
				var oModelRef = this.getView().byId("listReport").getModel();
				oModelRef.refresh(true);
				sap.m.MessageToast.show("Article : " + article + " added to favorite");
				this.msg = "";
				// this._createBindingContextAuftrag(this.AuftragBindingPath);

			}, this),
			// success: this.mySuccessHandler,
			error: this.myErrorHandler
		});
	},
	mySuccessHandler: function (oEvent) {
		sap.ui.core.BusyIndicator.hide();
		this.getView().byId("listReport").getModel().refresh(true);
		this.getOwnerComponent().getModel("favCart").refresh(true);
		sap.m.MessageToast.show(this.msg);
		this.msg = "";
		this.getOwnerComponent().getModel("userDetailsModel").getData().userDetails.oModelC.read(this.getOwnerComponent().getModel(
				"userDetailsModel").getData().userDetails.sPathC, {
				success: jQuery.proxy(this.adminReadSuccess, this),
				error: jQuery.proxy(this.adminReadError, this)
			}

		);
		//update cart count
		// this.getOwnerComponent().getModel().read("/UserDetailsSet('SBASU')",{
		// 			success: jQuery.proxy(this.mySuccessHandlerq, this),
		// 			error: this.myErrorHandler
		// 		});

	},
	// mySuccessHandlerq: function(){
	// 	this.getOwnerComponent().getModel().refresh(true);
	// },
	myErrorHandler: function () {
		sap.ui.core.BusyIndicator.hide();
		// sap.m.MessageToast.show("Error ");
		sap.m.MessageToast.show("Some error occurred. Please try again.");
		this.msg = "";
	},
	onDataReceived: function (oEvent) {
		this.byId("template::SegmentedButton").setWidth("90%");
		var sCount = oEvent.getParameters("data").getParameter("data").__count,
			oButton, sButtonTxt;
		var oBundle = this.getOwnerComponent().getModel("i18n|sap.suite.ui.generic.template.ListReport|ZCDS_I_SOS_REQUEST_TP").getResourceBundle();
		if (this.byId("template::SegmentedButton").getSelectedKey() === "_tab1") {
			oButton = this.byId("template::SegmentedButton").getButtons()[0];
			sButtonTxt = oBundle.getText("regular");
		} else if (this.byId("template::SegmentedButton").getSelectedKey() === "_tab2") {
			oButton = this.byId("template::SegmentedButton").getButtons()[1];
			sButtonTxt = oBundle.getText("hotpick");
		} else if (this.byId("template::SegmentedButton").getSelectedKey() === "_tab3") {
			oButton = this.byId("template::SegmentedButton").getButtons()[2];
			sButtonTxt = oBundle.getText("favorites");
		}
		if (oButton) {
			// oButton.setWidth("15rem");
			oButton.setText(sButtonTxt + " (" + sCount + ")");
		}
	},
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
	},

	onOpen: function (oEvent) {
		//On Popover open focus on Input control
		// var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
		// var oPopoverContent = oPopover.getContent()[0];
		// var oCustomListItem = oPopoverContent.getItems()[2];
		// var oCustomContent = oCustomListItem.getContent()[0];
		// var oInput = oCustomContent.getItems()[1];
		// oInput.focus();
		// oInput.$().find('.sapMInputBaseInner')[0].select();
	},
	fireSearch: function (oEvent) {
		this.fireSearch();
	},
	onBeforeRebindTableExtension: function (oEvent) {
		this.getView().byId("listReportFilter-btnBasicSearch").attachEvent("liveChange", this.fireSearch);
		this.getView().byId("listReportFilter-btnBasicSearch").getParent().getContent()[0].setText("Article Description:");
		//need new handling of store parameter $Sumit 23Apr19
		if (!sap.ushell.services) {
			//ushell.services undefined => it is not from fiori Launchpad, i.e. in it is index.html
			//	this.getView().byId("template:::ListReportPage:::DynamicPageTitle-expandBtn").addStyleClass("filterExpandButton"); Removed -- $Atanu 15Jul19
		}
		// var sStore;
		if (this.getOwnerComponent().getModel("startupParams").getData().store) {
			this.sStore = this.getOwnerComponent().getModel("startupParams").getData().store[0];
		}
		if (!this.sStore) {
			if (this.getOwnerComponent().getModel("startupParams").getData().get("store")) {
				this.sStore = this.getOwnerComponent().getModel("startupParams").getData().get("store");
			}
		}
		if (this.sStore) {
			var oFilter = new sap.ui.model.Filter("CatLogSkuStore", sap.ui.model.FilterOperator.EQ, this.sStore);
			var binding = oEvent.getParameter("bindingParams");
			binding.filters.push(oFilter);
		}
		// var oSorter = new sap.ui.model.Sorter({
		//   path: "CatLogSKU"});
		//   oEvent.getParameters().bindingParams.sorter = oSorter;
		oEvent.getSource().getTable().setMode();
		// oEvent.getSource().setHeight("50rem");
		oEvent.getSource().attachDataReceived(jQuery.proxy(this.onDataReceived, this));

		this.byId("listReport").getTable().setPopinLayout(sap.m.PopinLayout.GridSmall);
		// oEvent.getSource().getTable().getHeaderToolbar().addStyleClass("headerText");
		// oEvent.getSource().getTable().setSticky([sap.m.Sticky.ColumnHeaders, sap.m.Sticky.HeaderToolbar]);
		// this.byId("page").getTitle().setVisible(false);
		// this.byId("ActionZCDS_I_SOS_REQUEST_TP1button").setVisible(false);
		// this.byId("listReport").setShowTablePersonalisation(false);
		// this.byId("listReportFilter-btnFilters").setVisible(false);
		var columns = oEvent.getSource().getTable().getColumns();
		var that = this;
		for (var i = 0; i < columns.length; i++) {
			columns[i].getHeader().addStyleClass("headerText");
			var id = columns[i].getId();
			// columns[i].getHeader().addEventDelegate(this.onClick(id));
			if (id.indexOf("CatLogSkuPrice") !== -1 || id.indexOf("CatLogSKU") !== -1 || id.indexOf("ColumnBreakout2") !== -1) {
				columns[i].getHeader().addEventDelegate({
					// ----------------------------------------------------------------
					// Custom Event for Sort ------------------------------------------
					// ----------------------------------------------------------------
					onclick: function (oEvent) { //Attach Table Header Element Event
							//$('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
							var srcId = oEvent.srcControl.getId();
							// if (srcId.indexOf("CatLogSkuPrice") !== -1) {
							// 	that.sortId = "CatLogSkuPrice";
							// }
							// if (srcId.indexOf("CatLogSKU") !== -1) {
							// 	that.sortId = "CatLogSKU";
							// }
							if (srcId.indexOf("ColumnBreakout2") !== -1) {
								that.sortId = "CatalogSKUDesc";
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
						// END-------------------------------------------------------------
						// Custom Event for Sort ------------------------------------------
						// ----------------------------------------------------------------
				});
			}
			/*if (id.indexOf("__column0") !== -1 || id.indexOf("GetUrl")) {
				columns[i].setWidth("4rem");
			}
			if (id.indexOf("CatLogSkuPrice") !== -1) {
				columns[i].setWidth("8rem");
			}
			if (id.indexOf("ColumnBreakout") !== -1) {
				columns[i].setWidth("10rem");
			}
			if (id.indexOf("ColumnBreakout1") !== -1) {
				columns[i].setWidth("7rem");
			}
			if (id.indexOf("CatLogSKU") !== -1) {
				columns[i].setWidth("10rem");
			}*/

			if (id.indexOf("__column0") !== -1 || id.indexOf("GetUrl")) {
				columns[i].setWidth("4%");
			}
			if (id.indexOf("CatLogSkuPrice") !== -1) {
				columns[i].setWidth("10%");
			}
			if (id.indexOf("ColumnBreakout") !== -1) {
				columns[i].setWidth("10%");
			}
			if (id.indexOf("ColumnBreakout1") !== -1) {
				columns[i].setWidth("7%");
			}
			if (id.indexOf("CatLogSKU") !== -1) {
				columns[i].setWidth("8%");
			}
			if (id.indexOf("ColumnBreakout2") !== -1) {
				columns[i].setWidth("25%");
			}
			if (id.indexOf("CatLogSkuTypeStat") !== -1) {
				columns[i].setWidth("8%");
			}
			// if (id.indexOf("CatalogSKUDesc") !== -1) {
			// 	columns[i].setWidth("25%");
			// }

			// if (id.indexOf("notes") !== -1 || id.indexOf("TotalPrice") !== -1 || id.indexOf("bstma") !== -1 || id.indexOf("minbm") !== -1 || id.indexOf(
			// 		"meins") !== -1 || id.indexOf("bdmng") !== -1 || id.indexOf("werks") !== -1) {
			// 	table.getColumns()[i].setVisible(false);
			// }
		}

		// var sPath = "/ZCDS_C_SOSREQUEST_ST_TP('SBASU')";
		// this.getView().bindElement(sPath);
		//  var oSmartTable = oEvent.getSource();
		//  var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		// // // var path = oSmartFilterBar.getParameterBindingPath();
		// // // var sPath = oSmartTable.getTableBindingPath();
		// // //oSmartTable.setTableBindingPath("ZCDS_C_SOSREQUEST_ST_TP('AKHAN2')/to_SOSReqStoreUser");
		//  var oDefaultFilter = {
		//  		CatlogUser: "AKHAN2"
		//  	};
		// //Default the Global filter values
		// oSmartFilterBar.setFilterData(oDefaultFilter);
		// var binding = oEvent.getParameter("bindingParams");
		// var oFilter = new sap.ui.model.Filter("SOSStore", sap.ui.model.FilterOperator.EQ, "DL01");
		//  	binding.filters.push(oFilter);
	},
	//$Sumit backorder SF-1003 15Mar2019
	backOrderOK: function (oAction) {
		if (this.oCartData) {
			if (oAction === sap.m.MessageBox.Action.OK) {
				this.callAddCartApi(this.oCartData);
			}
			// Get Article description and put it in the filter button.	on 3rd Aug 2021
			else if (oAction === sap.m.MessageBox.Action.RETRY) {

			
				// var aFilters = this.getView().byId("listReportFilter").getFilters();
				//var oFilter = new sap.ui.model.Filter("CatLogSku", sap.ui.model.FilterOperator.NE,this.backOrderCatalogSKU);
				//aFilters.push(oFilter);
				//this.getView().byId("listReportFilter").setFilters(aFilters);
				//var list = this.getView().byId("listReport");
				//var binding = list._oTable.getBinding("items");
				//var oFilter = new sap.ui.model.Filter("CatLogSku", sap.ui.model.FilterOperator.NE,this.backOrderCatalogSKU);
				//binding.aFilters.push(oFilter);
				// var binding = this.getView().byId("listReport").getTable().getBinding("items");

				//var filterData = this.getView().byId("listReportFilter").getFilterData();

				// var jsonRangeData = {
				// 	exclude: true,
				// 	operation: "EQ",
				// 	keyField: "CatLogSKU",
				// 	value1: this.backOrderCatalogSKU,
				// 	value2: ""
				// };
				// if (filterData.CatLogSKU) {
				// 	var len = filterData.CatLogSKU.ranges.length;
				// 	filterData.CatLogSKU.ranges[len] = jsonRangeData;
				// } else {
				// 	filterData.CatLogSKU = {
				// 		items: [],
				// 		ranges: [],
				// 		value: null
				// 	};
				// 	filterData.CatLogSKU.ranges[0] = jsonRangeData;
				// }
				// this.getView().byId("listReportFilter").setFilterData(filterData, true);
				
			 //  var filterStr = this.CatalogSKUDesc;
				// filterStr = filterStr.replace(/ .*/, '');
				var lenContent =  this.getView().byId("listReportFilter-btnBasicSearch").getParent().getContent().length;
				lenContent = lenContent  - 1;
				if(lenContent >= 0){
				this.getView().byId("listReportFilter-btnBasicSearch").getParent().getContent()[lenContent].setValue('');
				this.getView().byId("listReportFilter-btnBasicSearch").getParent().getContent()[lenContent].setValue(this.CatalogSKUDesc);
				this.getView().byId("listReportFilter-btnBasicSearch").fireSearch();
				}
				//filterStr=null;
				lenContent = null;
				this.CatalogSKUDesc = null;
			} else {
				this.retry = null;
			}
			// Get Article description and put it in the filter button.	on 3rd Aug 2021		
			this.oEventAddCart = null;
		}

	},

	callAddCartApi: function (oCartData) {
		var oModel = this.getView().getModel("Favorites");
		//$Sumit csrftok
		// var oFavModel = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, null, "SOS_USER", "Welcome@1");
		// oModel.refreshSecurityToken();
		// oModel.bTokenHandling = true; //Force token handling $Sumit 2May19
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.create("/CartSet", oCartData, {
			//Calling success function with refresh parameter	
			success: jQuery.proxy(this.mySuccessHandler, this),
			// Start Change by Ashim Anam for Defect #5313
			error: jQuery.proxy(this.cartError, this)
				//error: this.myErrorHandler
				// End Change by Ashim Anam for Defect #5313
		});
		// sap.m.MessageToast.show("Article : " + oCartData.Matnr + " added to cart");
		this.msg = "Article : " + oCartData.Matnr + " added to cart";

	},

	// Start Change by Ashim Anam for Defect #5313
	cartError: function (oData, oResponse) {
		sap.ui.core.BusyIndicator.hide();
		if (oData) {
			var mes = JSON.parse(oData.responseText).error;
			// Assuming that one message is placed in the error response			
			if (mes) {
				sap.m.MessageToast.show(mes.message.value);
			} else {
				sap.m.MessageToast.show("Some error occurred. Please try again.");
			}
		}
		this.msg = "";
	},
	// End Change by Ashim Anam for Defect #5313
	adminReadSuccess: function (oData, oResponse) {
		this.getView().setBusy(false);
		this.getView().getModel("userDetailsModel").setProperty("/userDetails/Cartitmcount", oData.Cartitmcount);
		this.getView().getModel("userDetailsModel").refresh(true);
	},
	adminReadError: function (oData, oResponse) {
		this.getView().setBusy(false);

	}

});
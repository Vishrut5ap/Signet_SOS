sap.ui.controller("zsos.cart.ext.controller.ListReportExt", {
	// For Item Total calculation	
	itemtotal: function (unitPrice, quantity) {
		var total = parseFloat(unitPrice) * parseFloat(quantity);
		// sap.ui.model.type.Currency(total);
		var oFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
			"currencyCode": false,
			"customCurrencies": {
				"MyDollar": {
					"isoCode": "USD",
					"decimals": 2
				}
			}
		});
		// var tot = new sap.ui.model.type.Currency(total);
		var tot = oFormat.format(total, "");
		return tot; //total;
	},

	//Formatter for Quantity, Minimum Quantity and Maximum Quantity custom fields(quqntityCell.fragment.xml)
	valueFormat: function (minbm) {
		// if (minbm !== null) {
		if (typeof minbm !== "undefined") {
			var str = minbm;
			var val = str.split(".");
			return parseInt(val[0], 10);
		}
	},
	formatStoreText: function (storeTxt, store) {
		// if (minbm !== null) {
		return storeTxt + " " + store;
	},
	// Function for both (top and bottom)Check Out button 
	onClickActionZCDS_I_SOS_CART1: function (oEvent) {
		var key = this.getView().byId("listReport").getTable().getBinding("items").aKeys[0];
		var oModel = this.getView().getModel();
		//var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_PORTAL_NEW_SRV");
		var values = oModel.oData[key];
		var oUser, sUser, bIsStoreApp = false;
		if (sap.ushell.services) {
			oUser = new sap.ushell.services.UserInfo();
			sUser = oUser.getId();
		}
		if (!sUser) {
			sUser = "SOS_USER"; //jQuery.sap.getUriParameters().get("user");
			bIsStoreApp = true;
		}

		if (sUser === "DEFAULT_USER") {
			sUser = "SBASU";
		}
		if (!this.checkOutUser.getValue()) {
			var msg = "Please Fill Check Out User before proceeding to check out";
			sap.m.MessageBox.show(msg, {
				icon: sap.m.MessageBox.Icon.ERROR, // default sap-icon://message-success
				title: "ERROR", // default
				actions: sap.m.MessageBox.Action.OK, // default
				onClose: null, // default
				styleClass: "sapUiSizeCompact", // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});
		}

		// sUser = "AKHAN2";
		else {
			sap.ui.core.BusyIndicator.show();
			var mParameters = {
				httpMethod: "POST",
				urlParameters: {
					"bname": values.bname,
					"cart_itm_no": values.cart_itm_no,
					"matnr": values.matnr,
					"werks": values.werks,
					"Checkoutuser": this.checkOutUser.getValue(),
					"notes": this.noteTxt.getValue()
				}
			};
			// var table = oEvent.getSource().getTable();
			// oModel.callFunction("/ZCDS_I_SOS_CARTCart_checkout", {
				var oModelNew = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_PORTAL_NEW_SRV");
				oModelNew.setHeaders({
					            'X-Requested-With': 'X'
					        });
					oModelNew.callFunction("/ZCDS_I_SOS_CARTCheckout_sos", {
				method: mParameters.httpMethod,
				urlParameters: mParameters.urlParameters,
				success: jQuery.proxy(this.mySuccessHandler, this),
				error: this.myErrorHandler
			});
		}

	},
	// Adding Buttons in initial function
	onInit: function () {
		this.byId("listReport").setEnableAutoBinding(true);
		// Fetch Page
		this.oView = this.getView();
		var page = this.getView().byId("page");
		//>>$Sumit 29Apr19 | User name default in case of index.html, i.e., Store app 	
		var oUser;
		if (sap.ushell.services) {
			oUser = new sap.ushell.services.UserInfo();
			this.sUser = oUser.getId();
		}
		if (!this.sUser) {
			this.sUser = "SOS_USER"; //jQuery.sap.getUriParameters().get("user");
			this.bIsStoreApp = true;
		}
		if (!this.sStore) {
			// this.sStore = jQuery.sap.getUriParameters().get("store");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// Changes by Ashim Anam on 10th Jan 2020
			var oLocalStore = oStorage.get("werks");
			this.sStore = oLocalStore.werks;
			/*	var oLocalStore = oStorage.get("storeNumber"); //Local storage has store?
				if (oLocalStore) {
					this.sStore = atob(oLocalStore.store);
					// atob(oStore.store)/
				}*/
			// Changes by Ashim Anam on 10th Jan 2020
		}
		if (this.bIsStoreApp) {
			this.sPath = this.getOwnerComponent().getModel().createKey("/ZCDS_C_SOSREQUEST_ST_TP", {
				bname: this.sUser,
				werks: this.sStore //Add store as a key $Sumit 29Apr19
			});
			this.getView().bindElement(this.sPath);
			this.byId("listReport").setTableBindingPath(this.sPath + "/to_SOSCart");
		} else {

		}

		//<<$Sumit 29Apr19 | User name default in case of index.html, i.e., Store app 
		// Fetch Footer
		var footer = page.getFooter();
		footer.setVisible(true);
		page.setShowFooter(true);
		// Create Select Store button for footer
		var storeButton = new sap.m.Button({
			text: "Select Store",
			press: jQuery.proxy(this.selectStore, this),
			id: "selectStore"
		});
		// Create Check Out button for footer
		var checkOutButton = new sap.m.Button({
			text: "Check Out",
			press: jQuery.proxy(this.onClickActionZCDS_I_SOS_CART1, this),
			id: "checkOutButton"
		});

		// Create Check Out button for footer
		var cartTotal = new sap.m.Text({
			text: "",
			// press: jQuery.proxy(this.onClickActionZCDS_I_SOS_CART1, this),
			id: "cartTotal"
		});
		if (this.getOwnerComponent().getModel("startupParams").getData().store || //$Sumit store handling for index.html 25Apr19
			// jQuery.sap.getUriParameters().get("store")) { //Removed $Atanu 15Jul19
			this.sStore) {
			storeButton.setVisible(false);
		} else {
			checkOutButton.setEnabled(false);
		}
		footer.addContent(cartTotal);
		footer.addContent(storeButton);
		footer.addContent(checkOutButton);
		this.oView = this.getView();

		this.selectStoreIndicator = false;
		this.bFlexCreated = false;
		// this.oFlexFrag = sap.ui.xmlfragment(this.oView.getId(), "zsos.cart.ext.view.CartwStore", this);
		// this.oView.addDependent(this.oFlexFrag);
		// oContent.addItem(this.oFlexFrag);
	},

	// Function for Select Store
	selectStore: function (oEvent) {
		// var oContext = oEvent.getSource().getParent().getBindingContext();
		//	var oModel = this.getView().getModel();
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("zsos.cart.ext.view.Dialog", this);
		}
		this.getView().addDependent(this._oDialog);
		//	var oContext = oEvent.getSource().getParent().getBindingContext();
		this._oDialog.open();

	},
	//Search function for Store fragment
	handleSearch: function (oEvent) {
		var sValue = oEvent.getParameter("value");
		var filters = new sap.ui.model.Filter([
				new sap.ui.model.Filter("StoreName", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("SOSStore", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("StoreCity", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("StoreState", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("StoreCountry", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("StoreDiv", sap.ui.model.FilterOperator.Contains, sValue)
			],
			false);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([filters]);

	},
	//Function after selecting the stores
	handleOk: function (oEvent) {
		// Fetch selected data
		sap.ui.core.BusyIndicator.show();

		if (this.byId("storeFlex")) {
			this.byId("storeFlex").destroy();
		}

		var oCartStore = {};
		var oData = oEvent.getSource().getModel().oData;
		var selectedPaths = oEvent.getSource()._oTable._aSelectedPaths;
		var oDatas = {
			"Bname": (oData[selectedPaths[0].slice(1)].SOSUser),
			"UserToCartStore": []

		};

		for (var l = 0; l < selectedPaths.length; l++) {
			oCartStore = {
				"Bname": (oData[selectedPaths[l].slice(1)].SOSUser),
				"Werks": (oData[selectedPaths[l].slice(1)].SOSStore),
				"Notes": ""

			};
			oDatas.UserToCartStore[l] = oCartStore;
		}
		// Update store in table
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		var oModel = this.getView().getModel("CartNote");
		oModel.create("/UserCartSet", oDatas, {
			success: jQuery.proxy(this.storeUpdateSuccessHandler, this),
			error: this.myErrorHandler
		});
		// /////////////////////////////////////////////
		// Hide previous table
		this.selectStoreIndicator = true;
		var oPage = this.oView.byId("page");
		var oContent = oPage.getContent();
		// Hide previous table
		var items = oContent.getItems();
		for (var k = 0; k < items.length; k++) {
			items[k].setVisible(false);
		}
		//Disable select store
		var footerContent = this.getView().byId("page").getFooter().getContent();
		for (var j = 0; j < footerContent.length; j++) {

			if (footerContent[j].getId() === "selectStore") {
				footerContent[j].setEnabled(false);
			}
			if (footerContent[j].getId() === "checkOutButton") {
				footerContent[j].setEnabled(true);
			}

		}

	},

	beforeRebindTable: function (oEvent) {

		// var cartStoreTable=this.getView().byId("cartStores");
		// var model=this.getOwnerComponent().getModel("CartStore");
		// // this.getView().setModel(model);
		// cartStoreTable.setModel(model, "CartStore");
		// cartStoreTable.rebindTable();

	},
	// onBeforeExport: function (oEvent){
	// 	var a;
	// 	a=this;
	// },
	// Execute after data fetch
	onDataReceived: function (e) {
		var data = e.getParameters().getParameter("data"),
			k;
		var oTable = this.byId("listReport");
		// var items = this.getItems();
		var items = oTable.getItems();
		// var footerContent = this.getParent().getFooter().getContent();
		var footerContent = this.byId("page").getFooter().getContent();
		// Disable checkout asnd select store if there is no data
		if (data.results.length === 0) {
			// var footerContent = this.getView().byId("page").getFooter().getContent();
			for (k = 0; k < footerContent.length; k++) {

				if (footerContent[k].getId() === "checkOutButton") {

					footerContent[k].setEnabled(false);
				}
				if (footerContent[k].getId() === "selectStore") {
					footerContent[k].setEnabled(false);
				}
				if (footerContent[k].getId() === "cartTotal") {
					footerContent[k].setText("Total price : " + 0.00);
				}

			}
		} else {
			/////////For tab cahnge set cart to initial view
			// for (var m = 0; m < data.result.length; m++) {
			// 	this.selectStoreIndicator = true;
			// 	if (!data.result.werks) {
			// 		this.selectStoreIndicator = false;
			// 		break;
			// 	}
			// }
			if (!this.selectStoreIndicator) {
				// 				this.selectStoreIndicator = false;
				//store not selected => show intital view of cart
				for (var l = 0; l < items.length; l++) {
					if (items[l].getId().indexOf("responsiveTable") !== -1) {
						items[l].setVisible(true);
					}
				}

			}

			for (k = 0; k < footerContent.length; k++) {

				if (footerContent[k].getId() === "checkOutButton") {
					if (this.getOwnerComponent().getModel("startupParams").getData().store ||
						// jQuery.sap.getUriParameters().get("store")) {	//--Removed $Atanu 16Jul19
						this.sStore) { //-- $Atanu 16Jul19
						footerContent[k].setEnabled(true);
					}
				}

				if (footerContent[k].getId() === "selectStore") {
					if (!this.bFlexCreated) {
						footerContent[k].setEnabled(true);
					}
				}
			}

			for (var i = 0; i < items.length; i++) {
				if (items[i].getId() === "input") {
					items[i].setValue(data.results[0].notes);
				}
			}

			//var footerContent = this.getParent().getFooter().getContent();
			for (var j = 0; j < footerContent.length; j++) {
				if (footerContent[j].getId() === "cartTotal") {
					footerContent[j].setText("Total price : " + data.results[0].TotalPrice);
				}
			}
		}
	},
	onBeforeRebindTableExtension: function (oEvent) {
		this.byId("addEntry").setVisible(false);
		this.byId("deleteEntry").setVisible(false);
		this.byId("listReport").setShowTablePersonalisation(false);
		oEvent.getSource().attachDataReceived(jQuery.proxy(this.onDataReceived, this));
		// oEvent.getSource().attachDataReceived(this.onDataReceived);
		var oPage = this.getView().byId("page");
		oPage.getTitle().setVisible(false);
		oPage.getHeader().setVisible(false);
		var content = oPage.getContent();

		var hbox = new sap.m.HBox("HBox", {
			width: "100%"
		});
		var vbox1 = new sap.m.VBox({
			width: "50%"
		});
		var vbox2 = new sap.m.VBox({
			width: "50%"
		});

		if (!this.noteTxt) {
			this.noteTxt = new sap.m.TextArea({
				id: "input",
				placeholder: "Input Notes(max. 200 character)",
				maxLength: 200,
				width: "80%",
				height: "100px",
				change: jQuery.proxy(this.onChangeNotes, this)
			});
			vbox1.addItem(this.noteTxt);
			// content.addItem(this.noteTxt);
		}
		if (!this.checkOutUser) {
			var labelCheckoutUser = new sap.m.Label({
				required: true,
				textAlign: "Left",
				text: "Check Out User",
				design: "Bold",
				width: "20%",
				height: "50px",
			});
			this.checkOutUser = new sap.m.Input({
				id: "input1",
				textAlign: "Left",
				maxLength: 40,
				text: "",
				width: "40%",
				height: "50px",
			});
			vbox2.addItem(labelCheckoutUser);
			vbox2.addItem(this.checkOutUser);
		}

		if (this.noteTxt || this.checkOutUser) {
			hbox.addItem(vbox1);
			hbox.addItem(vbox2);
			//oPage.addContent(hbox);
			content.addItem(hbox);
		}

		var table = oEvent.getSource().getTable();
		for (var i = 0; i < table.getColumns().length; i++) {
			var id = table.getColumns()[i].getId();
			if (id.indexOf("notes") !== -1 || id.indexOf("TotalPrice") !== -1 || id.indexOf("bstma") !== -1 || id.indexOf("minbm") !== -1 || id.indexOf(
					"meins") !== -1 || id.indexOf("bdmng") !== -1 || id.indexOf("werks") !== -1) {
				table.getColumns()[i].setVisible(false);
			}
		}
		table.setMode();

	},

	// Change event for notes
	onChangeNotes: function (oEvent) {

		// var oUser = new sap.ushell.services.UserInfo();
		// var sUser = oUser.getId();

		if (this.sUser === "DEFAULT_USER") {
			this.sUser = "SBASU";
		}
		// sUser = "AKHAN2";
		sap.ui.core.BusyIndicator.show();
		var oData = {
			"Bname": this.sUser,
			"Notes": oEvent.getParameters().newValue
		};
		// Pass store if available
		if (this.getOwnerComponent().getModel("startupParams").getData().store) {
			oData.Werks = this.getOwnerComponent().getModel("startupParams").getData().store[0];
		}
		if (!oData.Werks) {
			oData.Werks = jQuery.sap.getUriParameters().get("store");
		}

		// Updating notes to database
		
		var oModel = this.getView().getModel("CartNote");
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.create("/CartNoteSet", oData, {
			success: this.mySuccessHandlerNote,
			error: this.myErrorHandler
		});

	},
	onChangeNotesChild: function (oEvent) {

		// var oUser = new sap.ushell.services.UserInfo();
		// var sUser = oUser.getId();
		// sUser = "AKHAN2";
		var param = oEvent.getSource().oPropagatedProperties.oBindingContexts.CartStore.getPath();
		var oDatam = oEvent.getSource().oPropagatedProperties.oBindingContexts.CartStore.getModel().oData[param.slice(1)];
		sap.ui.core.BusyIndicator.show();
		var oData = {
			"Bname": oDatam.CartUser,
			"Werks": oEvent.getSource().getParent().getHeaderText(),
			"Notes": oEvent.getSource().getValue()
		};
		// Updating notes to database
		var oModel = this.getView().getModel("CartNote");
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.create("/CartNoteSet", oData, {
			success: this.mySuccessHandlerNote,
			error: this.myErrorHandler
		});
	},
	deleteItem: function (oEvent) {
		//Get the changed value from current context
		//var oSource = oEvent.getSource();
		//var cstoken = oSource.getModel().getSecurityToken();
		this.oDeleteContext = oEvent.getSource().getBindingContext();
		//Get Odata model bound to the view
		//var oModel = this.getView().getModel();
		//sap.ui.core.BusyIndicator.show();
		//var oModel = new sap.ui.model.odata.ODataModel( "/sap/opu/odata/sap/Z_ATC_CUSTOMER_OUTSTANDING_SRV",true,"ABAP","123");
var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_PORTAL_NEW_SRV");
// oModel.setTokenHandlingEnabled(true);
// oModel.setHeaders({
// 	"X-Requested-With": "XMLHttpRequest",
// 	"Content-Type": "application/atom+xml",
// 	"DataServiceVersion": "2.0",
// 	"X-CSRF-Token": "Fetch"
// 			 // auth 
// 		});
// var tkn = oModel.getSecurityToken();
// console.log(tkn);
// oModel.setTokenHandlingEnabled(true);
// oModel.setHeaders({
// 	"X-Requested-With": "XMLHttpRequest",
// 	"Content-Type": "application/atom+xml",
// 	"DataServiceVersion": "2.0",
// 	"X-CSRF-Token": "Fetch"
// 			 // auth 
// 		});
// 		oModel.read("/ZCDS_I_SOS_CART",
// 		{success: function(data, response){
// 					//response will have the retrun of the request
			
// 			var header_xcsrf_token = response.headers['x-csrf-token']; 
// 			console.log(header_xcsrf_token);
// 			MessageToast.show("Success");
// 		}, error: function(e){
// 			MessageToast.show("Failed");}
// 		})



		//var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_PORTAL_SRV");
		
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		
		//oModel.refreshSecurityToken();
		// oModel.setHeaders({
		// 	            'connection': 'keep-alive'
		// 	        });
		//Connection: keep-alive		
		oModel.remove(this.oDeleteContext.getPath(), {
			success: jQuery.proxy(this.mySuccessHandlerdel, this),
			error: this.myErrorHandler
		});
	},
	deleteItemChild: function (oEvent) {
		//Get the changed value from current context
		var oContext = oEvent.getSource().oPropagatedProperties.oBindingContexts.CartStore.getPath();
		//Get Odata model bound to the view
		var oModel = this.getView().getModel();
		sap.ui.core.BusyIndicator.show();
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.remove(oContext.replace("ZCDS_I_SOS_CARTSTOREITEM", "ZCDS_I_SOS_CART"), {
			success: jQuery.proxy(this.mySuccessHandlerBdmngChild, this),
			error: this.myErrorHandler
		});
	},
	// Change event for Quantity
	onChangeBdmng: function (oEvent) {
		//Get the changed value of bdmng from current context
		this.oContext = oEvent.getSource().getBindingContext();
		//Get Odata model bound to the view
		//var oModel = this.getView().getModel();
		var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_PORTAL_NEW_SRV");

		var oCart = oModel.oData[this.oContext.getPath().substr(1)];
		// oCart.bdmng = oContext.getProperty("bdmng");
		sap.ui.core.BusyIndicator.show();

		if (oEvent.getParameters().value > this.oContext.getProperty("bstma")) {
			oEvent.getSource().setValue(this.oContext.getProperty("bstma"));
			sap.m.MessageToast.show("Quantity must not exceed Maximum Quantity");
		}

		if (oEvent.getParameters().value < this.oContext.getProperty("minbm")) {
			oEvent.getSource().setValue(this.oContext.getProperty("minbm"));
			sap.m.MessageToast.show("Quantity must not less than Minimum Quantity");
		}

		var quantity = this.oContext.getProperty("bdmng") + "";
		var itemTotal = (quantity * this.oContext.getProperty("sku_price")) + "";
		var oData = {
			"bname": this.oContext.getProperty("bname"),
			"cart_itm_no": this.oContext.getProperty("cart_itm_no"),
			"matnr": this.oContext.getProperty("matnr"),
			"werks": this.oContext.getProperty("werks"),
			"bdmng": quantity, //oContext.getProperty("bdmng"),
			"meins": this.oContext.getProperty("meins"),
			"minbm": this.oContext.getProperty("minbm"),
			"bstma": this.oContext.getProperty("bstma"),
			"total_price": itemTotal,
			//<< Ashim on 19th Feb
			"Currency": this.oContext.getProperty("Currency"),
			"waers": this.oContext.getProperty("Currency")
				// >> Ashim on 19th Feb
				// "Notes" : oContext.getProperty("bdmng")
		};
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.update(this.oContext.getPath(), oData, {
			success: jQuery.proxy(this.mySuccessHandlerdel, this),
			error: this.myErrorHandler
		});

		// var article = oContext.getProperty("CatLogSKU");
		// MessageToast.show("Value changed to '" + oEvent.getParameter("value") + "'");
	},
	onChangeBdmngChild: function (oEvent) {

		var param = oEvent.getSource().oPropagatedProperties.oBindingContexts.CartStore.getPath();
		var oDatam = oEvent.getSource().oPropagatedProperties.oBindingContexts.CartStore.getModel().oData[param.slice(1)];
		var oModel = this.getView().getModel();

		sap.ui.core.BusyIndicator.show();
		var quantity = oEvent.getSource().getValue() + "";
		var itemTotal = (quantity * oDatam.sku_price) + "";
		var oData = {
			"bname": oDatam.bname,
			"cart_itm_no": oDatam.cart_itm_no,
			"matnr": oDatam.matnr,
			"werks": oDatam.werks,
			"bdmng": quantity, //oContext.getProperty("bdmng"),
			"meins": oDatam.meins,
			"minbm": oDatam.minbm,
			"bstma": oDatam.bstma,
			"total_price": itemTotal,
			//<< Ashim on 19th Feb
			"Currency": oDatam.currency,
			"waers": oDatam.currency
				//>> Ashim on 19th Feb
				// "Notes" : oContext.getProperty("bdmng")
		};
		// var rModel = this.getView().getModel("CartStore");
		var key = param.replace("ZCDS_I_SOS_CARTSTOREITEM", "ZCDS_I_SOS_CART");
		oModel.setHeaders({
			            'X-Requested-With': 'X'
			        });
		oModel.update(key, oData, {
			success: jQuery.proxy(this.mySuccessHandlerBdmngChild, this),
			error: this.myErrorHandler
		});
	},
	mySuccessHandlerNote: function () {
		sap.ui.core.BusyIndicator.hide();
	},
	mySuccessHandler: function (d, r) {
		sap.ui.core.BusyIndicator.hide();

		var header = r.headers["sap-message"];
		var message = JSON.parse(header);
		if (message.severity == "success") {
			var allMessage = "Following Request(s) created :" + "\n" + "\n" + message.message;
			for (var i = 0; i < message.details.length; i++) {
				allMessage = allMessage + "\n" + message.details[i].message;
			}
			var setIcon = sap.m.MessageBox.Icon.SUCCESS;
		} else {
			var setIcon = sap.m.MessageBox.Icon.ERROR;
			allMessage = message.message;
		}
		sap.m.MessageBox.show(allMessage, {
			icon: setIcon, // default sap-icon://message-success
			title: message.severity.toUpperCase(), // default
			actions: sap.m.MessageBox.Action.OK, // default
			onClose: null, // default
			styleClass: "sapUiSizeCompact", // default
			initialFocus: null, // default
			textDirection: sap.ui.core.TextDirection.Inherit // default
		});
		// this.getView().getModel("CartStore").refresh(true);
		this.getView().byId("listReport").getModel().refresh(true);
		this.getView().getModel("CartNote").refresh(true);
		// this.getView().byId("input").setValue("");
		//this.oModel.mChangedEntities = {};
		// this.getView().getModel("CartStore").refresh(true);
		// this.getView().byId("listReport").getModel().refresh(true);
		// this.getView().byId("page").getContent().getItems("input")[1].setValue("");
		this.noteTxt.setValue("");
		this.checkOutUser.setValue("");
		var footerContent = this.getView().byId("page").getFooter().getContent();
		for (var j = 0; j < footerContent.length; j++) {
			if (footerContent[j].getId() === "cartTotal") {
				footerContent[j].setText("");
			}
			if (footerContent[j].getId() === "checkOutButton") {
				footerContent[j].setEnabled(false);
			}
			if (footerContent[j].getId() === "selectStore") {
				footerContent[j].setEnabled(false);
			}

		}
		this.getOwnerComponent().getModel("favCart").refresh(true);
		this.getOwnerComponent().getModel("userDetailsModel").getData().userDetails.oModelC.read(this.getOwnerComponent().getModel(
				"userDetailsModel").getData().userDetails.sPathC, {
				success: jQuery.proxy(this.adminReadSuccess, this),
				error: jQuery.proxy(this.adminReadError, this)
			}

		);
	},
	storeUpdateSuccessHandler: function () {
		var oPage = this.oView.byId("page");
		var oContent = oPage.getContent();
		sap.ui.core.BusyIndicator.hide();
		this.getView().byId("listReport").getModel().refresh(true);
		//this.oModel.refresh(true);
		// Calling Store cart fragment
		if (!this.bFlexCreated) {
			if (this.byId("articleHdr")) {
				this.byId("articleHdr").destroy();
			}
			if (this.byId("artDescHdr")) {
				this.byId("artDescHdr").destroy();
			}
			if (this.byId("quantityHdr")) {
				this.byId("quantityHdr").destroy();
			}
			if (this.byId("SKUPriceHdr")) {
				this.byId("SKUPriceHdr").destroy();
			}
			if (this.byId("totalHdr")) {
				this.byId("totalHdr").destroy();
			}
			if (this.byId("actionHdr")) {
				this.byId("actionHdr").destroy();
			}
			if (this.byId("nameColumn")) {
				this.byId("nameColumn").destroy();
			}
			if (this.byId("minbm2")) {
				this.byId("minbm2").destroy();
			}
			if (this.byId("bstma2")) {
				this.byId("bstma2").destroy();
			}
			if (this.byId("cartStores")) {
				this.byId("cartStores").destroy();
			}
			// this.oFlexFrag = sap.ui.xmlfragment(this.createFragmentId("cartStoreFrag"), "zsos.cart.ext.view.CartwStore", this);
			this.oFlexFrag = sap.ui.xmlfragment(this.oView.getId(), "zsos.cart.ext.view.CartwStore", this);
			this.oView.addDependent(this.oFlexFrag);
			oContent.addItem(this.oFlexFrag);
			this.bFlexCreated = true;
		} else {
			this.byId("storeFlex").setVisible(true);
			oContent.addItem(this.byId("storeFlex"));
		}
	},
	byFragmentId: function (i) {
		return sap.ui.core.Fragment.byId(this.sFragmentId, i);
	},
	mySuccessHandlerdel: function () {
		sap.ui.core.BusyIndicator.hide();
		if (this.oDeleteContext) {
			this.oDeleteContext.oModel.refresh(true);
		}
		if (this.oContext) {
			this.oContext.oModel.refresh(true);
		}
		// this.getOwnerComponent().getModel("userDetailsModel").refresh(true);
		this.getOwnerComponent().getModel("userDetailsModel").getData().userDetails.oModelC.read(this.getOwnerComponent().getModel(
				"userDetailsModel").getData().userDetails.sPathC, {
				success: jQuery.proxy(this.adminReadSuccess, this),
				error: jQuery.proxy(this.adminReadError, this)
			}

		);

	},
	mySuccessHandlerBdmngChild: function () {
		sap.ui.core.BusyIndicator.hide();
		// this.refresh(true);
		// this.getView().getModel("CartStore").refresh(true);
		this.getView().byId("listReport").getModel().refresh(true);
		this.getOwnerComponent().getModel("favCart").refresh(true);
	},
	myErrorHandler: function () {
		sap.ui.core.BusyIndicator.hide();
	},
	adminReadSuccess: function (oData, oResponse) {
		this.getView().setBusy(false);
		this.getView().getModel("userDetailsModel").setProperty("/userDetails/Cartitmcount", oData.Cartitmcount);
		this.getView().getModel("userDetailsModel").refresh(true);
	},
	adminReadError: function (oData, oResponse) {
		this.getView().setBusy(false);

	}
});
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/json/JSONModel",
	"sap/m/PDFViewer"
], function (Controller, MessageBox, ComponentContainer, HashChanger, JSONModel,PDFViewer) {
	"use strict";
	return Controller.extend("zsos.controller.App", {
		onInit: function () {
			// this.getView().setModel(this.getOwnerComponent().getModel("favCart"), "favCart");
			// this.getView().setBusy(true);
			this.jsonData = { //JSON Model for favCart
				userDetails: {
					IsAdmin: false,
					Cartitmcount: "",
					sPathC: "",
					oModelC: ""
				}
			};
			var userDetailsModel = new JSONModel(this.jsonData);
			this.getView().setModel(userDetailsModel, "userDetailsModel");

			if (!sap.ushell) {
				// this.getView().byId("icon0").addStyleClass("cartSize");
				// this.getView().byId("cartCount").addStyleClass("cartCountSize");
				this.getView().byId("bar1").addStyleClass("cartCountGap");
				// this.getView().byId("bar1-BarRight").addStyleClass("cartGap");
				// this.getView().byId("bar1").mAggregations.contentRight[0].addStyleClass("cartGap");
			}
			var oImage = this.getView().byId("image0_copy");
			var sRootPath = jQuery.sap.getModulePath("zsos");
			var sImagePath = sRootPath + "/image/Sigp2.png";
			var sImagePath1 = sRootPath + "/image/Sigp1.png";
			oImage.setSrc(sImagePath);
			var oImage1 = this.getView().byId("image0");
			oImage1.setSrc(sImagePath1);
			this.selectedTab = "home";

			// //$Sumit -- read 'admin' tab visibility
			var oModel = this.getOwnerComponent().getModel(),
				oUser, sStore, sUser, sPath;

			if (sap.ushell) {
				var oUser = new sap.ushell.services.UserInfo();
				sUser = oUser.getId();
			}
			if (!sUser) {
				sUser = "Store User"; //jQuery.sap.getUriParameters().get("user");
				this.bIsStoreApp = true;
			}
			this.byId("loginUser").setText(this.byId("loginUser").getText() + " " + sUser);
			// Set store value in header
			if (this.getOwnerComponent().getComponentData()) {
				if (this.getOwnerComponent().getComponentData().startupParameters.store) {
					var sStore = this.getOwnerComponent().getComponentData().startupParameters.store[0];
				}
			}
			if (!sStore) {
				// sStore = jQuery.sap.getUriParameters().get("store");
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				var oLocalStore = oStorage.get("werks"); //Local storage has store? "Ashim"
				if (oLocalStore) {
					//sStore = atob(oLocalStore.store);
					sStore = oLocalStore.werks; //Ashim
					// atob(oStore.store)/
				}
			}
			if (!sStore) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				var that = this;
				MessageBox.error(
					"Invalid Store!", {
						action: [sap.m.MessageBox.Action.CLOSE],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							// MessageToast.show("Action selected: " + sAction);
							// window.close();
							that.getView().byId("rootPage").destroy();
						}
					}
				);
			}
			if (sStore) {
				this.byId("Store").setText("Store" + " : " + sStore);
			} else {
				this.byId("Store").setVisible(false);
			}

			//>> for FL -----
			if (sUser) {
				// sPath = oModel.createKey("/UserDetailsSet", {
				// 	Bname: sUser
				// });
				if (this.bIsStoreApp) {
					sUser = "SOS_USER";
				}
				// sPath = "/UserDetailsSet('" + sUser + "')";
				sPath = "/UserDetailsSet(Bname='" + sUser + "',Werks='" + sStore + "')";
				if (sUser === "DEFAULT_USER") {
					// sPath = "/UserDetailsSet('SKUNDU2')";
					sPath = "/UserDetailsSet(Bname='SBASU',Werks='" + sStore + "')";
				}
				//commented
				var oFavCartModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIAP_SOS_FAV_CART_SRV");
				// this.getView().setModel(oFavCartModel, "favCart");
				// this.getView().bindElement({
				// 	path: sPath,
				// 	model: "favCart"
				// });
				// this.getView().getModel("favCart").refresh(true);
				// commented
				// this.getOwnerComponent().getModel("favCart").refresh(true);
				// oFavCartModel.refresh(true);
				this.getView().getModel("userDetailsModel").setProperty("/userDetails/sPathC", sPath);
				this.getView().getModel("userDetailsModel").setProperty("/userDetails/oModelC", oFavCartModel);
				oFavCartModel.setHeaders({
					            'X-Requested-With': 'X'
					        });
				oFavCartModel.read(sPath, {
					success: jQuery.proxy(this.adminReadSuccess, this),
					error: jQuery.proxy(this.adminReadError, this)
				});
			}

			//sai
			var oCompCont;
			
			oCompCont = this.byId("homeCont");
			this.oHomeComp = this.getOwnerComponent().createComponent({
				usage: "zsos.home",
				settings: {},
				componentData: {},
				async: true
			}).then(function (oHomeComp) {
				oCompCont.setComponent(oHomeComp);
				//that.oHomeModel = oHomeComp.getModel();
			});
			//sai
			//<< for FL------			
			// var sPath = oModel.createKey("/UserDetailsSet", {
			// 	Bname: oSource.getBindingContext().getProperty("CatalogSKU")
			// })

			//$Sumit 29Feb18 -- add home component initially			
			// var oTab = this.byId("topIconTabBar"),
			// 	oComp, oCompCont;
			// oTab.removeAllContent();
			// if (!this.oHomeComp) {
			// 		this.oHomeComp = sap.ui.getCore().createComponent({
			// 			name: "zsos.home",
			// 			id: "home",
			// 			// height: "100rem",
			// 			settings: {
			// 				text: "Home"
			// 			}
			// 		});
			// 	}

			// 	// Create a Ui container&nbsp;
			// 	if (!this.oHomeCont) {

			// 		this.oHomeCont = new sap.ui.core.ComponentContainer("homeCont", {
			// 			component: this.oHomeComp,
			// 			height: "100rem"
			// 		});
			// 	}
			// 	oTab.insertContent(this.oHomeCont);
			// var oCompCont = this.oCompCont = this.byId("homeCont");
			// var oView = this.getView();
			// if (!this.oHomeComp) {
			// 	// this.oHomeComp = sap.ui.getCore().createComponent({
			// 	// 	name: "zsos.home",
			// 	// 	id: "home",
			// 	// 	// height: "100rem",
			// 	// 	settings: {
			// 	// 		text: "Home"
			// 	// 	}
			// 	// });
			// 	oView.setBusy(true);
			// 	var oComp = this.oHomeComp = sap.ui.component({
			// 		id: "zsos.home",
			// 		usage: "genericComp",
			// 		name: "zsos..home",
			// 		manifest: true,
			// 		async: true
			// 	}).then(function (oComp) {
			// 		oCompCont.setComponent(oComp);
			// 		oView.setBusy(false);
			// 	});
			// }
			// this.oCompCont.setComponent(this.oHomeComp);
			this.oHashChanger = new HashChanger();
			this.sInitHash = this.oHashChanger.getHash();
		},
		adminReadSuccess: function (oData, oResponse) {
			// var oModel = new JSONModel(oData);
			// this.getView().setModel(oModel, "initModel");
			this.getView().setBusy(false);
			// this.byId("admin").setVisible(oData.IsAdmin);
			// this.getView().getModel("favCart").refresh(true);
			// this.byId("cartCount").setText(oData.Cartitmcount);
			var legacyStore = this.byId("Store").getText() + " (" + oData.LegacyStoreNo + ")";
			this.byId("Store").setText(legacyStore);
			this.getView().getModel("userDetailsModel").setProperty("/userDetails/IsAdmin", oData.IsAdmin);
			this.getView().getModel("userDetailsModel").setProperty("/userDetails/Cartitmcount", oData.Cartitmcount);
			this.getView().getModel("userDetailsModel").refresh(true);
		},
		adminReadError: function (data, response) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var that = this;
			// this.getView().setBusy(true);
			MessageBox.error(
				"An error Occured. Please check user settings with system administrators!", {
					action: [sap.m.MessageBox.Action.CLOSE],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						// MessageToast.show("Action selected: " + sAction);
						// window.close();
						that.getView().byId("rootPage").destroy();
					}
				}
			);
			this.getView().setBusy(false);
		},
		// adminReadError: function (data, response) {
		// 	// var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		// 	MessageBox.error(
		// 		"An error Occured. Please check user settings with system administrators!"
		// 		// {
		// 		// 	styleClass: bCompact ? "sapUiSizeCompact" : ""
		// 		// }
		// 	);
		// 	this.getView().setBusy(false);
		// },
		onHomeCompCreated: function (oEvent) {
			this.oHomeComp = oEvent.getParameter("component");
			this.oHomeModel = this.oHomeComp.getModel();
		},
		onSosCompCreated: function (oEvent) {
			this.oSosComp = oEvent.getParameter("component");
			this.oSosModel = this.oSosComp.getModel();
		},
		onReportCompCreated: function (oEvent) {
			this.oReportComp = oEvent.getParameter("component");
			this.oReportModel = this.oReportComp.getModel();
		},
		onAdminCompCreated: function (oEvent) {
			this.oAdminComp = oEvent.getParameter("component");
			this.oAdminModel = this.oAdminComp.getModel();
		},
		onCartCompCreated: function (oEvent) {
			this.oCartComp = oEvent.getParameter("component");
			this.oCartModel = this.oCartComp.getModel();
		},
		handleIconTabBarSelect: function (oEvent) {
			// var oTab = this.byId("topIconTabBar"),
			var oCompCont;
			var that = this;
			var oStartupData = {},
				sSOSCompUsage = "";
			// oTab.removeAllContent();
			// this.byId(this.selectedTab).removeAllContent();
			// var oView = this.getView();
			// oView.setBusy(true);
			var bForceSetComp = !(this.sInitHash === this.oHashChanger.getHash());
			this.oHashChanger.replaceHash(this.sInitHash);
			this.selectedTab = this.byId("topIconTabBar").getSelectedKey();
			var sKey = oEvent.getParameter("key");
			// var oCompCont = this.oCompCont,
			// oComp;

			if (sKey === "home") {
				oCompCont = this.byId("homeCont");
				this.byId("sosCont").setVisible(false);
				// this.byId("reportCont").setVisible(false);
				// this.byId("adminCont").setVisible(false);
				this.byId("cartCont").setVisible(false);
				this.byId("homeCont").setVisible(true);
				if (bForceSetComp || !this.oHomeComp) {
					oCompCont.setVisible(true);
					this.oHomeComp = this.getOwnerComponent().createComponent({
						usage: "zsos.home",
						settings: {},
						componentData: {},
						async: true
					}).then(function (oHomeComp) {
						oCompCont.setComponent(oHomeComp);
						that.oHomeModel = oHomeComp.getModel();
					});
				} else {
					oCompCont.setVisible(true);
					this.oHomeModel.refresh(true);
				}
				// if (this.oHomeModel) {
				// 	this.oHomeModel.refresh(true);
				// }
				// 	var oTabFilter = this.byId("home");
				// var oComp = this.oHomeComp || new Text({text: {path: sName}})
				// if (!this.oHomeComp) {
				// 	this.oHomeComp = this.getOwnerComponent().createComponent({
				// 		usage: "zsos.home",
				// 		settings: {},
				// 		componentData: {},
				// 		async: true
				// 	}).then(function (oHomeComp) {
				// 		oCompCont.setComponent(oHomeComp);
				// 			oView.setBusy(false);
				// 	});
				// } else {
				// 	oCompCont.setComponent(this.oHomeComp);
				// oView.setBusy(false);
				// }
				//----------------
				// if (!this.oHomeComp) {
				// oView.setBusy(true);
				// 	this.oHomeComp = oComp = sap.ui.component({
				// 		id: "zsos.home",
				// 		name: "zsos.home",
				// 		manifest: true,
				// 		async: true
				// 	}).then(function () {
				// 		oCompCont.setComponent(oComp);
				// 		oView.setBusy(false);
				// 	});
				// } else {
				// 	oCompCont.setComponent(this.oHomeComp);
				// }
				//-------------
				// this.oCompCont.setComponent(this.oHomeComp);
				// 	// Create a Ui container&nbsp;
				// 	if (!this.oHomeCont) {

				// 		this.oHomeCont = new sap.ui.core.ComponentContainer("homeCont", {
				// 			component: this.oHomeComp,
				// 			height: "100rem"
				// 		});
				// 	}
				// 	oTab.insertContent(this.oHomeCont);
				// 	// 	new ComponentContainer(
				// 	// 	"home", {
				// 	// 		name: "zsos.home"
				// 	// 	}

				// 	// ));
			} else if (sKey === "sosReq") {
				this.byId("homeCont").setVisible(false);
				this.byId("reportCont").setVisible(false);
				// this.byId("adminCont").setVisible(false);
				this.byId("cartCont").setVisible(false);
				oCompCont = this.byId("sosCont");

				//$Sumit get the startup params
				oStartupData = this.getOwnerComponent().getModel("startupParams").getData();
				var oSOSCompData = (oStartupData.store || typeof oStartupData.get === "function") ? oStartupData : {};
				sSOSCompUsage = (oStartupData.store || typeof oStartupData.get === "function") ? "zsos.sosservice" : "zsos.sosrequestfsc";
				if (bForceSetComp || !this.oSosComp) {
					oCompCont.setVisible(true);
					if (oStartupData.store || typeof oStartupData.get === "function") {
						this.oSosComp = this.getOwnerComponent().createComponent({
							usage: sSOSCompUsage,
							settings: {},
							componentData: oSOSCompData,
							async: true
						}).then(function (oSosComp) {
							oCompCont.setComponent(oSosComp);
							that.oSosModel = oSosComp.getModel();
						});
					} else {
						this.oSosComp = this.getOwnerComponent().createComponent({
							usage: sSOSCompUsage,
							settings: {},
							async: true
						}).then(function (oSosComp) {
							oCompCont.setComponent(oSosComp);
							that.oSosModel = oSosComp.getModel();
						});
					}
				} else {
					oCompCont.setVisible(true);
					this.oSosModel.refresh(true);
				}
			} else if (sKey === "report") {
				this.byId("homeCont").setVisible(false);
				this.byId("reportCont").setVisible(false);
				this.byId("sosCont").setVisible(false);
				this.byId("cartCont").setVisible(false);
				oCompCont = this.byId("reportCont");
				if (bForceSetComp || !this.oReportComp) {
					oCompCont.setVisible(true);
					this.oReportmp = this.getOwnerComponent().createComponent({
						usage: "zsos.report",
						settings: {},
						componentData: {},
						async: true
					}).then(function (oReportComp) {
						oCompCont.setComponent(oReportComp);
						that.oSosModel = oReportComp.getModel();
					});
				} else {
					oCompCont.setVisible(true);
					this.oReportModel.refresh(true);
				}
			} else if (sKey === "admin") {
				this.byId("homeCont").setVisible(false);
				this.byId("sosCont").setVisible(false);
				this.byId("reportCont").setVisible(false);
				this.byId("cartCont").setVisible(false);
			} else if (sKey === "cart") {
				oCompCont = this.byId("cartCont");
				this.byId("homeCont").setVisible(false);
				this.byId("sosCont").setVisible(false);
				this.byId("reportCont").setVisible(false);
				// this.byId("adminCont").setVisible(false);
				this.byId("cartCont").setVisible(true);
				if (bForceSetComp || !this.oCartComp) {

					oCompCont.setVisible(true);
					if (this.bIsStoreApp) {
						this.oCartComp = this.getOwnerComponent().createComponent({
							usage: "zsos.cart",
							settings: {},
							async: true
						}).then(function (oCartComp) {
							oCompCont.setComponent(oCartComp);
							that.oCartModel = oCartComp.getModel();
						});
					} else {
						this.oCartComp = this.getOwnerComponent().createComponent({
							usage: "zsos.cartFSC",
							settings: {},
							async: true
						}).then(function (oCartComp) {
							oCompCont.setComponent(oCartComp);
							that.oCartModel = oCartComp.getModel();
						});
					}
				} else {
					oCompCont.setVisible(true);
					this.oCartModel.refresh(true);
				}
			}
		},
		onCompCreated: function (oEvent) {
			this.oHashChanger.replaceHash(this.sInitHash);
		},
		// <!--<!<start of change for REQ0337378-->
		handlePickday: function (oEvent) {
			var sServiceURL = this.getView().getModel().sServiceUrl;
			var sSource = sServiceURL + "/PickdaycalendarPDFSet(ID='pickday')/$value";
			sap.m.URLHelper.redirect(sSource, true);
		},
		// <!--End of change for REQ0337378--->

		handleCartItem: function (oEvent) {
			var that = this;
			this.byId("homeCont").setVisible(false);
			this.byId("sosCont").setVisible(false);
			this.byId("reportCont").setVisible(false);
			// this.byId("adminCont").setVisible(false);
			this.byId("cartCont").setVisible(true);

			this.byId("topIconTabBar").setSelectedKey("cart");
			var bForceSetComp1 = !(this.sInitHash === this.oHashChanger.getHash());
			var oCompCont = this.byId("cartCont");
			if (bForceSetComp1 || !this.oCartComp) {

				oCompCont.setVisible(true);
				if (this.bIsStoreApp) {
					this.oCartComp = this.getOwnerComponent().createComponent({
						usage: "zsos.cart",
						settings: {},
						async: true
					}).then(function (oCartComp) {
						oCompCont.setComponent(oCartComp);
						that.oCartModel = oCartComp.getModel();
					});
				} else {
					this.oCartComp = this.getOwnerComponent().createComponent({
						usage: "zsos.cartFSC",
						settings: {},
						async: true
					}).then(function (oCartComp) {
						oCompCont.setComponent(oCartComp);
						that.oCartModel = oCartComp.getModel();
					});
				}
			} else {
				oCompCont.setVisible(true);
				this.oCartModel.refresh(true);
			}

		}

	});
});
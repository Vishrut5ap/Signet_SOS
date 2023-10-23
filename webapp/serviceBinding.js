function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZFIAP_SOS_FAV_CART_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}
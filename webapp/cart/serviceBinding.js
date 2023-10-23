function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZCDS_C_SOS_CARTSTORE_CDS/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}
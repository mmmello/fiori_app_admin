sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat",
    "br/com/gestao/fioriappadmin/util/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, NumberFormat, Formatter, Fragment, JSONModel) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin.controller.Detalhes", {

            objFormatter: Formatter,

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                // Esse método é chamado toda vez que um route acontece nessa página
                // Neste caso, o Route está vindo da página Lista
                oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this);


                // 1 - Chamar a função onde irá fazer o carregamento dos fragments
                this._formFragments = {};

                this._showFormFragments("DisplayBasicInfo", "vboxViewBasicInfo");
                this._showFormFragments("DisplayTechInfo", "vboxViewTechInfo");

            },

            // 2 - Recebe como parâmetro o nome dos fragments e o nome dos VBox's de destino
            _showFormFragments: function (sFragmentName, sVBoxName) {
                var objVBox = this.byId(sVBoxName);
                objVBox.removeAllItems();

                this._getFormAllItems(sFragmentName).then(function (oVBox) {
                    objVBox.insertItem(oVBox);
                });
            },

            _getFormAllItems: function (sFragmentName) {
                var oFormFragment = this._formFragments[sFragmentName];
                var oView = this.getView();

                if (!oFormFragment) {
                    oFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin.frags." + sFragmentName,
                        controller: this
                    });

                    this._formFragments[sFragmentName] = oFormFragment;
                }
                return oFormFragment;
            },

            onBindingProdutoDetalhes: function (oEvent) {
                var oProduto = oEvent.getParameter("arguments").productId;

                var oView = this.getView();

                // Criar a URL de chamada da nossa entidade de Produtos
                var sURL = "/Produtos('" + oProduto + "')";

                oView.bindElement({
                    path: sURL,
                    parameters: { expand: 'to_cat' },

                    events: {
                        change: this.onBindingChange.bind(this),
                        dataRequested: function () {
                            debugger;
                        },
                        dataReceived: function (data) {
                            debugger;
                        }
                    }
                });
            },

            onBindingChange: function (oEvent) {

                var oView = this.getView();
                var oElementBinding = oView.getElementBinding();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                if (!oElementBinding.getBoundContext()) {
                    oRouter.getTargets().display("objNotFound");
                    return;
                } else {
                    this._oProduto = Object.assign({}, oElementBinding.getBoundContext().getObject());
                }
            },

            handleEditBtnPress: function () {
                
            },

            criarModel: function () {
                // Model produto
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");
            },

            _HabilitaEdicao: function (bEdit) {
                var oView = this.getView();

                // Botões de ações
                oView.byId("btnEdit").setVisible(!bEdit);
                oView.byId("btnDelete").setVisible(!bEdit);
                oView.byId("btnSave").setVisible(bEdit);
                oView.byId("btnCancel").setVisible(bEdit);

                // Habilitar/Desabilitar Abas (seções) das páginas
                oView.byId("section1").setVisible(!bEdit);
                oView.byId("section2").setVisible(!bEdit);
                oView.byId("section3").setVisible(bEdit);

                if (bEdit) {
                    this._showFormFragments("Change", "vboxChangeProduct");
                } else {
                    this._showFormFragments("DisplayBasicInfo", "vboxViewBasicInfo");
                    this._showFormFragments("DisplayTechInfo", "vboxViewTechInfo");
                }
            },

            handleLink1Press: function () {

            },

            handleLink2Press: function () {

            },

            toggleFooter: function () {

            },

            onNavBack: function (oEvent) {
                this._HabilitaEdicao(false);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.getTargets().display("lista");
                oRouter.navTo("lista");
            },

            onValida: function (oEvent) {

            },

            onDelete: function (oEvent) {

            },

            handleCancelPress: function (oEvent) {
                //var oModel = this.getView().getModel();
                //oModel.refresh(true);
                this._HabilitaEdicao(false);
            },

            handleEditPress: function (oEvent) {
                this.criarModel();

                var oModelProduto = this.getView().getModel("MDL_Produto");
                oModelProduto.setData(this._oProduto);

                this._HabilitaEdicao(true);
            },

            // date: function (value) {
            //     var oConfiguration = sap.ui.getCore().getConfiguration();
            //     var oLocale = oConfiguration.getFormatLocale();
            //     var oPattern = "";

            //     if (oLocale === "pt-BR") oPattern = "dd/MM/yyyy"
            //     else oPattern = "MM/dd/yyyy"


            //     if (value) {
            //         let year = new Date().getFullYear();
            //         if (year === 9999) {
            //             return "";
            //         } else {
            //             var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            //                 //style: "short"
            //                 pattern: oPattern
            //             });

            //             return oDateFormat.format(new Date(value));
            //         }
            //     } else {
            //         return value;
            //     }
            // },

            // statusProduto: function (value) {
            //     var oBundle = this.getView().getModel("i18n").getResourceBundle();

            //     try {
            //         return oBundle.getText("status" + value);
            //     } catch (err) {
            //         return "";
            //     }
            // },

            // stateProduto: function (value) {
            //     try {
            //         if (value === "E") {
            //             return "Success";
            //         } else if (value === "P") {
            //             return "Warning";
            //         } else if (value === "F") {
            //             return "Error";
            //         } else {
            //             return "None";
            //         }
            //     } catch (err) {
            //         return "None";
            //     }
            // },

            // changeIcon: function (value) {
            //     try {
            //         if (value === "E") {
            //             return "sap-icon://sys-enter-2";
            //         } else if (value === "P") {
            //             return "sap-icon://alert";
            //         } else if (value === "F") {
            //             return "sap-icon://status-error";
            //         } else {
            //             return "";
            //         }
            //     } catch (err) {
            //         return "";
            //     }
            // }, 

            // floatNumber: function(value){
            //     var numberFloat = NumberFormat.getFloatInstance({
            //         maxFractionDigits:2,
            //         minFractionDigits:2,
            //         groupingEnabled:true,
            //         groupingSeparator:".",
            //         decimalSeparator:","
            //     });

            //     return numberFloat.format(value);
            // }
        });
    });

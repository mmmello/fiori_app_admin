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
                    oRouter.navTo("objNotFound");
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
                debugger;
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

                this._oProduto.Price = [this._oProduto.Price, undefined];
                this._oProduto.Createdat = this._oProduto.Createdat.toLocaleDateString();

                var oModelProduto = this.getView().getModel("MDL_Produto");
                oModelProduto.setData(this._oProduto);

                this._HabilitaEdicao(true);
            }
        });
    });

document.write('<script src="'+documentServer+'/web-apps/apps/api/documents/api.js"></script>');
$(function () {
    vm.editDoc();
});
var docEditor;
var vm = new Vue({
    el:'#rrapp',
    data:{
        tContractTemplate:{},
},
created: function(){
    var _this = this;
    _this.tContractTemplate = parent.layer.boxParams.boxParams;
},
updated: function(){
    layui.form.render();
},
methods: {
    editDoc: function () {
        var config = {
            documentType: 'text',
            document: {
                title: vm.tContractTemplate.nameFile,
                url: fileURL + vm.tContractTemplate.url,
                fileType: 'docx',
                key: vm.generateKey(vm.tContractTemplate.url),
            },
            editorConfig: {
                mode: 'view',
                user: {
                    id: '----',
                    name: '----',
                },
                customization: {
                    // autosave: false,
                    goback: {
                        url: '',
                    }
                },
                width: '100%',
                height: '100%'
            },
        };
        docEditor = new DocsAPI.DocEditor("placeholder", config);
    },
    generateKey: function(url){
        var expectedKey = url.slice(url.lastIndexOf('/')).replace(/[^0-9-a-zA-Z_=]/g, '_');
        return expectedKey;
        // var expectedKey = url.replace(/[^0-9-.a-zA-Z_=]/g, '_');
        // return expectedKey.substring(0, Math.min(expectedKey.length, 20));
    },
}
});

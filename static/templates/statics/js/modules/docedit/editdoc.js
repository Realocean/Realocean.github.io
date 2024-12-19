document.write('<script src="'+documentServer+'/web-apps/apps/api/documents/api.js"></script>');
$(function () {
    vm.editDoc();
});
var docEditor;
var vm = new Vue({
    el:'#rrapp',
    data:{
        conf:{
            title:'',
            url:'',
            type:'',
            tag:'',
        },
},
created: function(){
    var _this = this;
    _this.conf = parent.layer.boxParams.boxParams;
},
updated: function(){
    layui.form.render();
},
methods: {
    editDoc: function () {
        var config = {
            documentType: 'text',
            document: {
                title: vm.conf.title,
                url: fileURL + vm.conf.url,
                fileType: 'docx',
                key: vm.generateKey(vm.conf.url),
            },
            editorConfig: {
                mode: 'edit',
                callbackUrl: document.location.toString().substring(0, document.location.toString().lastIndexOf('/modules/')).replace('localhost', '10.7.17.117') + '/contract/contractemplate/docx/save?saveType='+vm.conf.type+'&docId='+vm.conf.tag,
                // callbackUrl: document.location.toString().substring(0, document.location.toString().lastIndexOf('/modules/')) + '/contract/contractemplate/docx/save?saveType='+vm.conf.type+'&docId='+vm.conf.tag,
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
            events: {//fun
                onAppReady: '',
                onDocumentStateChange: '',
                onRequestEditRights: '',
                onError: '',
                onOutdatedVersion: '',
            }
        };
        console.log(config);
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

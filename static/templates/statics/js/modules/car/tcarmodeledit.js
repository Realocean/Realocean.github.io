$(function () {
    vm.detail(window.localStorage.getItem("id"));
    //初始化数据
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        //    getColorList();
        form.on('submit(saveOrUpdate)', function () {
            vm.saveOrUpdate();
            return false;
        });
        //自定义验证
        form.verify({
            carBrandName: function (value) {
                if (value == "" || value == null) {
                    return '所属品牌不能为空';
                }
            },
            styleModelIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '所属款型不能为空';
                }
            },
            modelTypeVerify: function (value) {
                if (value == "" || value == null) {
                    return '所属类型不能为空';
                }
            },
            carSeriesId: function (value) {
                if (value == "" || value == null) {
                    return '所属车系不能为空';
                }
            },
            modelName: function (value) {
                if (value == "" || value == null) {
                    return '车型名称不能为空';
                }else if(value.length>100){
                    return '车型名称最长不能超过100个字符';
                }

            },
            isAvailable:function (value) {
                if (value == "" || value == null) {
                    return '请选择车型状态';
                }
            }

        });
        form.render();
    });

    //监听查询条件品牌下拉列表监听
    layui.form.on('select(brandIdSelect)', function (data) {
        var brandId= data.value;
        vm.q.carBrandId = data.value;
        //通过品牌id 查询对应的车系
        $.ajax({
            type: "POST",
            async: false,
            url: baseURL + "car/tcarseries/listCarSeriesByBrandIdPro/" + brandId,
            contentType: "application/json",
            success: function (r) {
                vm.allCarSeries = r.list;
                if(vm.allCarSeries.length==0){
                    vm.allCarModels = [];
                }
            }
        });

    });
    //查询条件所属车系下拉列表监听
    layui.form.on('select(carSeriesIdSelect)', function (data) {
        vm.q.carSeriesId = data.value;
        $.ajax({
            type: "POST",
            async: false,
            url: baseURL + "car/tcarmodel/listCarmodelByCarSeriesIdAll",
            contentType: "application/json",
            data: JSON.stringify(vm.q.carSeriesId),
            success: function (r) {
                vm.allCarModels = r.carModelList;
            }
        });
    });

    //查询条件所属车系下拉列表监听
    layui.form.on('select(carModelIdSelect)', function (data) {
        vm.q.carModelId = data.value;
    });

    //查询调价款型下拉列表监听
    layui.form.on('select(styleModelIdSelect)', function (data) {
        vm.q.styleModelId = data.value;
    });

    layui.form.on('checkbox(carColor)', function(data){
        if (data.elem.checked) {
            vm.colorList.push(data.value);
        } else {
            vm.colorList=vm.colorList.filter(function (v) {return v!=data.value});
        }
    });
    layui.form.on('submit(saveOrUpdate)', function () {

        vm.saveOrUpdate();
        return false;
    });

    //车系select
    layui.form.on('select(carSeriesId)', function (data) {
        if (vm.tCarModel.carBrandId == null || vm.tCarModel.carBrandId == '') {
            alert("请选择品牌信息");
        }
        vm.tCarModel = Object.assign({}, vm.tCarModel, {carSeriesId: data.value});
        layui.form.render();
    });

    layui.form.on('select(seatQuantity)', function (data) {
        vm.tCarModel = Object.assign({}, vm.tCarModel, {seating: data.value});
        layui.form.render();
    }),

    layui.form.on('select(styleModelId)', function (data) {
        vm.tCarModel = Object.assign({}, vm.tCarModel, {styleModelId: data.value});
        layui.form.render();
    }),

    layui.form.on('select(modelTypeFilter)', function (data) {
        vm.tCarModel = Object.assign({}, vm.tCarModel, {modelType: data.value});
        layui.form.render();
    }),

    layui.form.on('switch(isAvailable)', function(data){
        if(data.elem.checked){
            vm.tCarModel.isAvailable = 1;
        }else{
            vm.tCarModel.isAvailable = 0;
        }
    });


    layui.upload.render({
        elem: '#control_video_button', //绑定元素
        url: baseURL + "file/uploadFile",
        field:'files',
        accept: 'video',
        data: {'path':'videoUrl'}
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#control_video_demo').attr('src', result); //图片链接（base64）
                $('#control_video_demo').css('display','block');
                $('#control_video_del').css('display','inline');
            });
        },
        done: function(res){
            if(res.code == '0'){
                //vm.tCarModel.videoUrl = res.data[0];
                Vue.set(vm.tCarModel,'videoUrl',res.data[0]);
                layer.msg('上传成功', {icon: 1});
            }else{
                layer.msg('上传失败', {icon: 5});
            }

        },error: function(res){
            console.log(res);
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });

    $('#control_video_del').click(function(){
        //vm.tCarModel.videoUrl = null;
        Vue.set(vm.tCarModel,'videoUrl',null);
    })

});

var photoSize=null;
var formData = new FormData();
var vm = new Vue({
    el: '#rrapp',
    data: {
        cfViewId:'cfViewId_0',
        carParamconf: [],
        carParamconfData: {},
        styleModelData: [],
        modelTypeData: [],
        editForm: false,
        addForm:false,
        detailForm: false,
        allCarBrand: [],
        allCarSeries: [],
        allCarModels: [],
        tCarModel: {},
        seatQuantities: [2, 3, 4, 5,7],
        colorList: [],
        imgList:[],
        carcolorList:[],
        fileLstId: '0',
        introduce:'',
        //图片查看相关
        dialogVisible: false,
        activeFile: {},
        imgListlbt:[],
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        dialogImageUrl:'',
        richText:[],
        imgListlbt1:[],
        tagTags: [],
        inputTagVisible: false,
        inputTagValue: ''
    },

    //查询品牌
    created: function () {
        var _this = this;
        $.ajaxSettings.async = false;
        $.getJSON(baseURL + "car/tcarbrand/listAll", function (r) {
            _this.allCarBrand = r.carBrands;
        });
        $.getJSON(baseURL + "sys/dict/getInfoByType/styleModel", function (r) {
            _this.styleModelData = r.dict;
        });
        $.getJSON(baseURL + "sys/dict/getInfoByType/modelType", function (r) {
            _this.modelTypeData = r.dict;
        });
        $.get(baseURL + "car/carparamconf/allLastList", function (r) {
            _this.carParamconf = r.data;
        });
        var param = parent.layer.boxParams.boxParams;
        if (param.carParamconfData != null && param.carParamconfData != ''){
            var conf = JSON.parse(param.carParamconfData);
            for (let key in conf) {
                _this.carParamconfData[key] = conf[key];
            }
        }
        //

        //
        var viewParent = $('#paramConfId>div');
        if (viewParent != null){
            viewParent.empty();
            if (_this.carParamconf != null && _this.carParamconf.length > 0){
                var kays = [];
                for (let i = 0; i < _this.carParamconf.length; i++) {
                    var cf = _this.carParamconf[i];
                    var paramKey = 'param_'+cf.paramKey+'_'+cf.id;
                    var paramValue = cf.defaultValue||'';
                    if (_this.carParamconfData[paramKey] == null || Object.keys(_this.carParamconfData[paramKey]).length < 1){
                        _this.carParamconfData[paramKey] = {
                            name:cf.paramName,
                            group:cf.parentName,
                            value:paramValue
                        };
                    }else {
                        paramValue = _this.carParamconfData[paramKey].value||'';
                    }
                    var viewItem=''
                        +'	<div class="layui-inline layui-col-md6 layui-col-sm6 layui-col-xs6">                   '
                        +'		<label class="layui-form-label">'+cf.paramName+':</label>    '
                        +'		<div class="layui-input-inline">                                                   '
                        +'			<input type="text" id="carParamconfData_'+paramKey+'" autocomplete="off" maxlength="200" '
                        +'				   placeholder="'+cf.paramName+'" class="layui-input" value="'+paramValue+'">                               '
                        +'		</div>                                                                             '
                        +'	</div>                                                                                 '
                        +''
                        +'';
                    viewParent.append(viewItem);
                    kays.push(paramKey);
                }

                for (let key in _this.carParamconfData) {
                    if ($.inArray(key, kays) >= 0){

                    }else {
                        delete _this.carParamconfData[key];
                    }
                }
            }
        }
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        alertTab: function () {
            layer.open({
                type: 2,
                title: '车辆品牌选择',
                area: ['700px', '500px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/car/carmodelSelectBrand.html',
            });
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var ids = [];
            $.each(list, function (index, item) {
                ids.push(item.id);
            });
            return ids;
        },

        handleClose(tag) {
            vm.dynamicTags.splice(vm.dynamicTags.indexOf(tag), 1);
        },
        addColor(){
            /*vm.dynamicTags.push({
                name:'标签一',
                checked:'',
            })*/
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
             
            let inputValue = this.inputValue;
            if (inputValue) {
                vm.dynamicTags.push({
                    name:inputValue,
                    checked:'',
                });
            }
            this.inputVisible = false;
            this.inputValue = '';
        },


        handleTagClose(tag) {
            for (var i = vm.tagTags.length - 1; i >= 0; i--) {
                if (vm.tagTags[i] == tag) {
                    vm.tagTags.splice(i, 1);
                }
            }
        },

        showTagInput() {
            this.inputTagVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagTagInput.$refs.input.focus();
            });
        },

        handleInputTagConfirm() {
            let inputTagValue = this.inputTagValue;
            if (inputTagValue) {
                this.tagTags.push(inputTagValue);
            }
            this.inputTagVisible = false;
            this.inputTagValue = '';
        },

        handlePictureCardPreview(item) {
            vm.dialogImageUrl = item.url;
            this.dialogVisible = true
        },

        // 轮播图片删除
        handleRemove(file, fileList) {
            if(vm.imgListlbt.length>0){
                for (var i = vm.imgListlbt.length - 1; i >= 0; i--) {
                    if (vm.imgListlbt[i].uid==file.uid) {
                        vm.imgListlbt.splice(i, 1);
                    }
                }
            }
        },

        // 车型列表图片删除
        carhandleRemove(file, fileList) {
            if(vm.imgList.length>0){
                for (var i = vm.imgList.length - 1; i >= 0; i--) {
                    if (vm.imgList[i].uid==file.uid) {
                        vm.imgList.splice(i, 1);
                    }
                }
            }
        },

        // 轮播上传
        handlechange(file, fileList){
            var fileName = file.raw.name;
            var uid = file.raw.uid;
            var formData = new FormData();
            formData.append("files", file.raw);
            formData.append("path", 'carImageLb');
            vm.activeFile = {};
            $.ajax({
                type: "POST",
                url: baseURL + '/file/uploadFile',
                contentType: false,
                processData: false,
                data: formData,
                success: function (r) {
                    var activeFile = {
                        url: imageURL+r.data[0],
                        nameAccessory: fileName,
                        imgUrl:r.data[0],
                        id:uid
                    };
                    vm.imgListlbt.push(activeFile);
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },

        // 车型列表上传
        modelcarchange(file, fileList){
            console.log(file,fileList);
            var fileName = file.raw.name;
            var uid = file.raw.uid;
            var formData = new FormData();
            formData.append("files", file.raw);
            formData.append("path", 'carImage');
            vm.activeFile = {};
            $.ajax({
                type: "POST",
                url: baseURL + '/file/uploadFile',
                contentType: false,
                processData: false,
                data: formData,
                success: function (r) {
                    var activeFile = {
                        url: imageURL+r.data[0],
                        nameAccessory: fileName,
                        imgUrl:r.data[0],
                        id:uid
                    };
                    vm.imgList.push(activeFile);
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },

        cancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },


        detail: function (id) {
            vm.imgList =[];
            vm.dynamicTags = [];
            vm.imgListlbt = [];
            //$(".div2").attr("id","editEd");
            $.get(baseURL + "car/tcarmodel/getCarModelPic/" + id, function (r) {
                if(r.tSysAccessory != null){
                    r.tSysAccessory.forEach(item => {
                        let imageUrl = imageURL + item.url;
                        vm.imgList.push({
                            "url": imageUrl,
                            "imgUrl":item.url,
                            "nameAccessory":item.nameAccessory,
                            "id": item.id
                        })
                    })
                }
            });

            $.get(baseURL + "car/tcarmodel/getCarModelPicRotation/" + id, function (r) {
                if(r.modelFileList != null){
                    r.modelFileList.forEach(item => {
                        let imageUrl = imageURL + item.url;
                        vm.imgListlbt.push({
                            "url": imageUrl,
                            "imgUrl":item.url,
                            "nameAccessory":item.nameAccessory,
                            "id": item.id
                        })
                    })
                }
            });

            $.ajax({
                type: "POST",
                async: false,
                url: baseURL + "car/tcarmodel/info/" + id,
                contentType: "application/json",
                success: function (r) {
                    vm.tCarModel = r.tCarModel;
                    // 富文本数据赋值
                    if(r.tCarModel.introduce == null){
                        getHtmlData("");
                    } else {
                        getHtmlData(r.tCarModel.introduce);
                    }
                    if(r.tCarModel.basicServices == null){
                        setHtmlData(basicServicesEditor,"");
                    } else {
                        setHtmlData(basicServicesEditor,r.tCarModel.basicServices);
                    }


                    if(r.tCarModel.incrementServices == null){
                        setHtmlData(incrementServicesEditor,"");
                    } else {
                        setHtmlData(incrementServicesEditor,r.tCarModel.incrementServices);
                    }


                    if(r.tCarModel.companyIntroduction == null){
                        setHtmlData(companyIntroductionEditor,"");
                    } else {
                        setHtmlData(companyIntroductionEditor,r.tCarModel.companyIntroduction);
                    }

                    if(r.tCarModel.color != null && r.tCarModel.color !=''){
                        var stringResult = r.tCarModel.color.split(',');
                        for(var i=0;i< stringResult.length;i++){
                            vm.dynamicTags.push({
                                name:stringResult[i],
                                checked:true,
                            });
                        }

                    }
                    if(r.tCarModel.tagNames != null && r.tCarModel.tagNames !=''){
                        vm.tagTags = r.tCarModel.tagNames.split(',');
                    }
                    var carBrandId = vm.tCarModel.carBrandId;
                    $.getJSON(baseURL + "car/tcarseries/listCarSeriesByBrandIdPro/" + carBrandId, function (r) {
                        vm.allCarSeries = r.list;
                        layui.form.render();
                    });
                }
            });

        },

        saveOrUpdate: function (event) {
            /*if(vm.imgList == null || vm.imgList.length==0){
                alert("车型列表图片不能为空！");
                return;
            }

            if(vm.imgListlbt == null || vm.imgListlbt.length==0){
                alert("车型轮播图片不能为空！");
                return;
            }

            if(vm.tCarModel.videoUrl == null || vm.tCarModel.videoUrl == ''){
                alert("车型视频不能为空！");
                return;
            }*/
            for (let key in vm.carParamconfData) {
                var paramView = $('#carParamconfData_'+key);
                if (paramView.length > 0){
                    vm.carParamconfData[key].value = paramView.val();
                }else {
                    delete vm.carParamconfData[key];
                }
            }
            console.log(vm.carParamconfData);

            var check = [];
            // 保存时处理复选框数据
            if(vm.dynamicTags.length>0){
                for(var i = 0 ;i<vm.dynamicTags.length;i++) {
                    if(vm.dynamicTags[i].checked == true) {
                        check.push(vm.dynamicTags[i].name);
                    }
                }
            }
            if (check instanceof Array) {// 验证是否是数组
                vm.tCarModel.color = check.join(",");
            }


            if(null != vm.tagTags && vm.tagTags.length > 0){
                let strs = "";
                for (let i in vm.tagTags) {
                    strs += vm.tagTags[i] + ',';
                }
                vm.tCarModel.tagNames = strs != '' ? strs.substr(0, strs.length - 1) : '';
            }else{
                vm.tCarModel.tagNames = "";
            }


            vm.tCarModel.imgList = vm.imgList;
            vm.tCarModel.imgListlbt = vm.imgListlbt;
            vm.tCarModel.introduce = editor.txt.html();
            vm.tCarModel.basicServices = basicServicesEditor.txt.html();
            vm.tCarModel.incrementServices = incrementServicesEditor.txt.html();
            vm.tCarModel.companyIntroduction = companyIntroductionEditor.txt.html();
            vm.tCarModel.carParamconfData = JSON.stringify(vm.carParamconfData);
            var url = vm.tCarModel.id == null ? "car/tcarmodel/save" : "car/tcarmodel/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCarModel),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            //layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        // 打开图片窗口
        openImgBox:function(e) {
            layer.photos({
                photos: {"data": [{"src": e.target.src}]},
                closeBtn:1
            })
        },

    }
});

// 富文本编辑
const E = window.wangEditor;
const editor = new E('#Editor')
// 或者 const editor = new E( document.getElementById('div1') )
// 设置编辑区域高度为 500px
editor.config.height = 500;
editor.config.zIndex = 1;
editor.config.placeholder = '请输入内容';
editor.config.pasteFilterStyle = true;
// 配置粘贴文本的内容处理
editor.config.pasteTextHandle = function (pasteStr) {
    // 对粘贴的文本进行处理，然后返回处理后的结果
    return pasteStr;
}

// 配置菜单栏，设置不需要的菜单
editor.config.excludeMenus = [
    'emoticon',
    'video',
    'link',
    'splitLine',
    'backColor',
]

// 图片上传
editor.config.customUploadImg = function (resultFiles, insertImgFn) {
    // 上传图片，返回结果，将图片插入到编辑器中
    const formData = new FormData();
    formData.append("files", resultFiles[0]);
    formData.append("path", 'carIntroduce');
    //图片名称
    const fileName = resultFiles.name;
    $.ajax({
        type: "POST",
        url: baseURL + '/file/uploadFile',
        contentType: false,
        processData: false,
        data: formData,
        success: function (r) {
             
            const activeFile = {
                url: r.data[0],
                name: fileName,
                uid: uuid(6)
            };
            vm.richText.push(activeFile);
            insertImgFn(imageURL+r.data[0])
        },
        error: function () {
            layer.msg('上传失败', {icon: 5});
        }
    });
}

function getHtml() {
    vm.introduce = editor.txt.html();
    console.log(editor.txt.html());
}

function getHtmlData(value){
    editor.txt.html('<p>' + value + '</p>');
}

editor.create();


 
const basicServicesE = window.wangEditor;
const basicServicesEditor = new basicServicesE('#basicServices');


const incrementServicesE = window.wangEditor;
const incrementServicesEditor = new incrementServicesE('#incrementServices');


const companyIntroductionE = window.wangEditor;
const companyIntroductionEditor = new companyIntroductionE('#companyIntroduction');


createEditor(basicServicesEditor);
createEditor(incrementServicesEditor);
createEditor(companyIntroductionEditor);



function createEditor(editor){
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '请输入内容';
    editor.config.pasteFilterStyle = true;

// 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
        'emoticon',
        'video',
        'link',
        'splitLine',
        'backColor',
    ]

// 图片上传
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log(resultFiles);
        // 上传图片，返回结果，将图片插入到编辑器中
        //insertImgFn('https://cn.vuejs.org/images/logo.png')
        const formData = new FormData();
        formData.append("files", resultFiles[0]);
        formData.append("path", 'carIntroduce');
        //图片名称
        const fileName = resultFiles.name;
        $.ajax({
            type: "POST",
            url: baseURL + '/file/uploadFile',
            contentType: false,
            processData: false,
            data: formData,
            success: function (r) {
                const activeFile = {
                    url: r.data[0],
                    name: fileName,
                    uid: uuid(6)
                };
                vm.richText.push(activeFile);
                insertImgFn(imageURL+r.data[0])
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });
    }
    editor.create();
}

function setHtmlData(editor, value){
    //editor.txt.html('<p>' + value + '</p>');
    editor.txt.html('<p>' + value + '</p>');
}


$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});


var map;
var vm = new Vue({
    el:'#rrapp',
    data:{
        tag: '',
        electricFence: {},
        deptList: [],
        province: [],
        city: [],       //定义市下拉列表数据源
        area: [],       //定义区下拉列表数据源
        verify: false,
        deptInforList:[],
        deptUpdate:[],
        //省份对应坐标点集合
        coordinatePointList:null

    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tag = param.tag;
        if( _this.tag=='add'){
            _this.electricFence = param.data;
        }
        if( _this.tag=='update'){
            _this.electricFence = param.data.electricFence;
            _this.deptUpdate = param.data.deptListDTO;

        }

        var _this = this;
        $.ajaxSettings.async = false;
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dept/deptList",
            contentType: "application/json",
            data: {},
            success: function(r){
                _this.deptList = r.deptListDTOList;
            }
        });

        //加载省市区文件内容
        var cache = localStorage.getItem("globalProvinces");
        if (cache == null) {
            $.getJSON(provinceUrl + "statics/js/province.js", function (r) {
                _this.province = r;
                localStorage.setItem("globalProvinces", JSON.stringify(r));
            });
        } else {
            _this.province = JSON.parse(cache);
        }
        $.ajaxSettings.async = true;
        if (_this.electricFence.provinceCode != null && _this.electricFence.provinceCode != ''){
            _this.city = _this.province.filter(function(s){return s.code===_this.electricFence.provinceCode})[0].cityList;
            if (_this.electricFence.cityCode != null && _this.electricFence.cityCode != '') {
                _this.area = _this.city.filter(function(s){return s.code===_this.electricFence.cityCode})[0].areaList;
            }
        }
    },
    mounted(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {

            var nameList=[];
            var deptIdList=[];
            if(vm.deptInforList!=null && vm.deptInforList.length>0){
                for (var i = 0; i <vm.deptInforList.length ; i++) {
                     var name=vm.deptInforList[i].name;
                     var deptId=vm.deptInforList[i].value;
                     nameList.push(name);
                     deptIdList.push(deptId);
                }
            }

            if(nameList!=null && nameList.length>0){
                var nameStr=nameList.join(",");
                vm.electricFence.deptName=nameStr;
            }

            if(deptIdList!=null && deptIdList.length>0){
                var deptIdStr=deptIdList.join(",");
                vm.electricFence.deptId=deptIdStr;
            }
            if(vm.coordinatePointList!=null){
                vm.electricFence.polygonPoints=vm.coordinatePointList;
            }
            var url = vm.electricFence.id == null ? "car/electricfence/save" : "car/electricfence/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.electricFence),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
});
var demo2 = xmSelect.render({
    el: '#deptName',
    repeat: false,
    theme: {
        color: '#3FACB3',
    },
    autoRow: true,
    height: '500px',
    toolbar: {
        show: true
    },
    on: function(data){
        //当前多选已选中的数据
        var arr = data.arr;
        vm.deptInforList=arr;

        if(arr.length==0){
            vm.deptUpdate=[];
        }
    },
    data:vm.deptList
});

demo2.setValue(vm.deptUpdate);

function init(layui) {
    initEventListener(layui);
    initData();
}



function initData() {
    if (vm.tag === 'update'){
        $("#deptName").attr("disabled","disabled");
    }
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_electricName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入围栏名称";
                }
            }
        },
        validate_deptId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if(vm.deptInforList==null ||vm.deptInforList.length==0){
                   if(vm.deptUpdate==null || vm.deptUpdate.length==0){
                       vm.verify = false;
                       return "请选择所属公司";
                   }
                }
            }
        },
        provinceCode: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择所在省";
                }
            }
        },
        warningType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择围栏报警类型";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    //点击下拉列表-省-事件监听
    /*form.on('select(provinceCode)', function (data) {
        vm.electricFence.provinceCode = data.value;
        vm.electricFence.provinceName = data.elem[data.elem.selectedIndex].text;
        if(data.value==null||data.value==''){
            vm.electricFence.cityCode ='';
            vm.electricFence.cityName ='';
            vm.city = [];
        }else{
            vm.city = vm.province.filter(function (s) {
                return s.code === data.value
            })[0].cityList;
        }
        vm.area = [];
        //选择省份进行解析坐标点
        vm.coordinatePointList=null;
        getBoundary(vm.electricFence.provinceName);
        form.render();
    });*/

    //点击下拉列表-市-事件监听
    /*form.on('select(cityCode)', function (data) {
        vm.electricFence.cityCode = data.value;
        if(data.elem[data.elem.selectedIndex].text =='请选择市'){
            vm.electricFence.cityName ='';
        }else{
            vm.electricFence.cityName = data.elem[data.elem.selectedIndex].text;
        }
        if(data.value==null||data.value==''){
            vm.electricFence.areaCode ='';
            vm.electricFence.areaName ='';
            vm.area=[];
        }else{
            vm.area = vm.city.filter(function (s) {
                return s.code === data.value
            })[0].areaList;
        }
        form.render();
    });*/
    //点击下拉列表-区-事件监听
     /*  form.on('select(areaCode)',function (data) {
        vm.electricFence.areaCode = data.value;
        if(data.elem[data.elem.selectedIndex].text =='请选择县/区'){
            vm.electricFence.areaName ='';
        }else{
            vm.electricFence.areaName =data.elem[data.elem.selectedIndex].text;
        }
    });*/


    //点击下拉列表-省-事件监听
    form.on('select(provinceCode)', function (data) {
         
        vm.electricFence.provinceCode = data.value;
        if(data.value!=null && data.value!=''){
            vm.electricFence.provinceName = data.elem[data.elem.selectedIndex].text;

            vm.city = [];
            Vue.set(vm.electricFence , 'cityName', '');
            Vue.set(vm.electricFence , 'cityCode', '');

            vm.area=[];
            Vue.set(vm.electricFence , 'areaName', '');
            Vue.set(vm.electricFence , 'areaCode', '');

            vm.city = vm.province.filter(function (s) {
                return s.code === data.value
            })[0].cityList;
            getBoundary(vm.electricFence.provinceName);
        }else{
            Vue.set(vm.electricFence , 'provinceCode', '');
            Vue.set(vm.electricFence , 'provinceName', '');
            vm.city = [];
            Vue.set(vm.electricFence , 'cityName', '');
            vm.area=[];
            Vue.set(vm.electricFence , 'areaName', '');

        }
        form.render();
    });


    //点击下拉列表-市-事件监听
    form.on('select(cityCode)', function (data) {
        vm.electricFence.cityCode = data.value;
        if(data.value!=null && data.value!=''){
            vm.electricFence.cityName = data.elem[data.elem.selectedIndex].text;
            vm.area=[];
            Vue.set(vm.electricFence , 'areaName', '');
            Vue.set(vm.electricFence , 'areaCode', '');

            vm.area = vm.city.filter(function (s) {
                return s.code === data.value
            })[0].areaList;

        }else{
            vm.area=[];
            Vue.set(vm.electricFence , 'areaName', '');
            Vue.set(vm.electricFence , 'areaCode', '');

        }
        form.render();
    });

    //点击下拉列表-区-事件监听
    form.on('select(areaCode)',function (data) {
        vm.electricFence.areaCode = data.value;
        if(data.value!=null && data.value!=''){
            vm.electricFence.areaName =data.elem[data.elem.selectedIndex].text;
        }
        form.render();
    });


    form.on('select(electricType)',function (data) {
        vm.electricFence.electricType = data.value;
    });
    form.on('select(warningType)',function (data) {
        vm.electricFence.warningType = data.value;
    });

    form.on('select(deptSelect)', function (data) {
        vm.electricFence.deptId = data.value;
        var obj = vm.deptList.filter(function (obj) {
            return obj.deptId == data.value;
        })[0];
        if (obj != null){
            Vue.set(vm.electricFence, "deptName", obj.name);
        }else {
            Vue.set(vm.electricFence, "deptName", '');
        }
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}







function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

//获取省份对应的坐标点
function getBoundary(address,list){
    var bdary = new BMap.Boundary();
    bdary.get(address, function(rs){       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        var pointArray = [];
        if(count>0){
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor : "#014F99",
                    fillColor: " #DDE4F0"}); //建立多边形覆盖物
                //map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
        }
        vm.coordinatePointList=JSON.stringify(pointArray);
    });
}
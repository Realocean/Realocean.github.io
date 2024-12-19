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

var vm = new Vue({
    el:'#rrapp',
    data:{
        btnActive:0,
        btnList:[
            {
                name:'告警预览',
                id:0,
            },
            {
                name:'处理详情',
                id:1,
            }
        ],
        longitude: 116.403925,
        latitude: 39.913903,
        data: {}
    },
    created: function(){
        var param = parent.layer.boxParams.boxParams;
        this.init(param.id)
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        init(id){
            let _this = this;
            $.ajax({
                type: "GET",
                url: baseURL + `alarmStatistics/${id}`,
                success: function (r) {
                    vm.data = r.data;
                    _this.initMap()
                }
            });
        },
        onSelectBtn(item){
            vm.btnActive = item.id
        },
        setMarker(position){
            // this.removeMarker()
            let positionIcon = new BMap.Icon("./../../statics/images/mapMark.png", new BMap.Size(30, 30));
            positionIcon.setImageSize(new BMap.Size(30,30))
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
              offset: new BMap.Size(0, -8),
            });
            let openInfoWinFun = this.addInfoWindow(marker,position)
            openInfoWinFun()
            this.map.addOverlay(marker);
        }, 
        addInfoWindow(marker, pos) {
            let vm = this;
            var html = [];
            html.push('<div>');
            html.push('<div class="infoItems" style="background:transparent !important;"><span>告警类型：</span><span>'+vm.data.alarmTypeStr+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>定位时间：</span><span>'+vm.data.alarmTime+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>定位地址：</span><span>'+vm.data.alarmAddr+'</span></div>')
            html.push('</div>');
            var opts = {
                width: 200, // 信息窗口宽度
                height: 60, // 信息窗口高度
                title: '', // 信息窗口标题
                enableMessage: true, //设置允许信息窗发送短息
            }
        
            var infoWindow = new BMap.InfoWindow(html.join(""), opts);
            var openInfoWinFun = function () {
                marker.openInfoWindow(infoWindow);
            };
            marker.addEventListener("click", openInfoWinFun);
            return openInfoWinFun;
        },
        initMap() {
            // 百度地图API功能
            this.map = new BMap.Map("allmap");
            var point = new BMap.Point(this.longitude, this.latitude);
            this.map.centerAndZoom(point, 1);
            this.map.enableScrollWheelZoom();
            if (this.longitude && this.latitude) {
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                this.setMarker(point)
            } else {
                // 根据经纬度显示地图的范围
                this.map.centerAndZoom("北京", this.config.zoom);
            }
        },
    }
});
function init(layui) {
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}
function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

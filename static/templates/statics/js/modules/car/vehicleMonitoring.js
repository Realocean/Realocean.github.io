$(function () {
//	alert(12313);
	initMap1();
})


function  initMap1(){
	// 百度地图API功能
	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(108.93425, 34.23053), 11);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]}));
	map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

	var opts = {type: BMAP_NAVIGATION_CONTROL_ZOOM,offset: new BMap.Size(30, 90)};
	map.addControl(new BMap.NavigationControl(opts)); // 添加默认缩放平移控件  PC 端默认位于地图左上方，它包含控制地图的平移和缩放的



}

function initMap2(){
	//实时跟踪
	var map2 = new BMap.Map("realTimeTracking");    // 创建Map实例
	map2.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map2.addControl(new BMap.MapTypeControl({
		mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]}));
	map2.setCurrentCity("北京");           // 设置地图显示的城市 此项是必须设置的
	map2.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
}

function initMap3(){
	//轨迹回放
	var map3 = new BMap.Map("trackPlayback");    // 创建Map实例
	map3.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map3.addControl(new BMap.MapTypeControl({
		mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]}));
	map3.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map3.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
}

var vmApp3 = new Vue({
	el:'#v-app3',
	data:{

	},
	methods: {
		carTrackSearch:function(){
			alert(123);
		}
	}
});

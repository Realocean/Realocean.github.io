var lushu;
$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form'], function () {
    layui.form.on('select(refush)', function (data) {
        if(data.value){
          vm.refush = data.value;
          clearInterval(vm.timer);
          vm.initData()
        }else{
          vm.refush = '';
        }
      }); 
      layui.form.render('select');
  });
  
});
var vm = new Vue({
    el: '#app',
    data: {
        refushList:[],
        refush:20,
        detail:{},
        carInfo:{},
        longitude: 116.403925,
        latitude: 39.913903,
        s: 0,
        time: null,
        map:null,
        gpsAccountId:null
    },
    created() {
        this.getRefushList()
        
    },
    mounted() {
        //初始化
        this.initMap();
        this.initData()
    },
    methods: {
        // 倒计时
        resetTime(time){
            this.s = Math.floor(time % 60);
            this.timer = setInterval(this.countDownFun,1000);
        },
        countDownFun(){
            this.s--;
            if(this.s=='00'){
                this.s='0';
                clearInterval(this.timer);
                this.initData()
            }
            this.s < 10 && (this.s = '0' + this.s);
            this.time = `${this.s}秒`;
        },
        initData(){
            let _this = this;
            let getData = getQueryVariable("data")
            let gpsAccountId = getQueryVariable("gpsAccountId")
            _this.gpsAccountId=gpsAccountId
            var base = new Base64();
            let query = base.decode(getData)
            let data = eval("("+query+")")
            this.detail = data;
            $.ajax({
                type: "GET",
                sync: false,
                url: baseURL + 'vehiclemonitor/latestPosition?deviceNo='+data.deviceNo+"&gpsAccountId="+gpsAccountId,
                contentType: "application/json",
                success: function (r) {
                    if (r.code === 0) {
                        // _this.resetTime(Number(_this.refush))
                        // let r = {
                        //     longitude: 116.403925,
                        //     latitude: 39.913903,
                        //     time:'2023-05-18 15:09:34',
                        //     gsm:"差",
                        //     sd:'快',
                        //     dwfs:'卫星定位',
                        //     address:'四川省绵阳市梓潼县文昌中路416号'
                        // }
                        _this.carInfo = r.data
                        _this.map.removeOverlay()
                        var point = new BMap.Point(r.data.lng,r.data.lat);
                        _this.map.centerAndZoom(point, 12);
                        _this.setMarker(point,r.data)
                        _this.resetTime(Number(_this.refush))
                    } else {
                        alert(r.msg);
                    }
                }
            });
            
            
        },
        //查看轨迹
        checkTrackClick(){
            let _this = this;
            var base = new Base64();
            let item = _this.detail;
            const params = {}
            for(let key in item){   
              params[key] = item[key]?item[key]+'':''
            }
            let data = JSON.stringify(JSON.parse(JSON.stringify(params)))
            var result = base.encode(data); 
            window.open(tabBaseURL + "modules/devicemanagement/hasCarStatisticsmanage.html?data="+result+"&gpsAccountId="+_this.gpsAccountId,"_self");
        },
        addSignWindow(marker,r) {
            var html = [];
            html.push('<div>');
            html.push('<div class="infoItems" style="background:transparent !important;"><span>速度：</span><span>'+r.speed||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>定位方式：</span><span>'+r.posTypeStr ||'--'+'</span></div>')
            html.push('</div>');
            var opts = {
                width: 250, // 信息窗口宽度
                height: 80, // 信息窗口高度
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
        setMarker(position,r){
            let positionIcon = new BMap.Icon("./../../statics/images/car_green.png", new BMap.Size(52, 36), {});
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
            });
            let openInfoWinFun = this.addSignWindow(marker,r);
            openInfoWinFun();
            marker.name = 'carIcon';
            this.map.addOverlay(marker);
        },
        getRefushList(){
            var vm = this;
            vm.refushList = [
                {
                    id:10,
                    name:'10s'
                },
                {
                    id:20,
                    name:'20s'
                },
                {
                    id:30,
                    name:'30s'
                },
            ];
            vm.refushList.forEach((item, index) => {
                $("#refush").append(`<option value=${item.id}>${item.name}</option>`);
            })
            layui.form.render();
        },
        initMap() {
            // 百度地图API功能
            this.map = new BMap.Map("allmap");
            var point = new BMap.Point(this.longitude, this.latitude);
            this.map.centerAndZoom(point, 5);
            this.map.enableScrollWheelZoom();
            if (this.longitude && this.latitude) {
                //起点坐标
                let longitude = this.longitude;
                let latitude = this.latitude;
                let point = new BMap.Point(longitude, latitude);
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                
            } else {
                // 根据经纬度显示地图的范围
                this.map.centerAndZoom("北京", this.config.zoom);
            }
        },
    }
})

function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // 公共编码方法
    this.encode = function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = _utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
      }
      return output;
    }
  
    // 公共解码方法
    this.decode = function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = _utf8_decode(output);
      return output;
    }
  
    // UTF-8编码的私有方法
    _utf8_encode = function (string) {
    //   string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
  
    // UTF-8解码的私有方法
    _utf8_decode = function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  }
  function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
    }
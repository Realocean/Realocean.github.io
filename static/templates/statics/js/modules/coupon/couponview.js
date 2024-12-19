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
        couponEntity: {},
        couponBusiness:{}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.couponEntity = param.data1;
        _this.couponBusiness = param.data2;
    },
    computed:{
        getBusinessNo: {
            get: function () {
                let businessNo = this.couponBusiness.businessNo;
                if (businessNo == 1) {
                    return "经租";
                } else if (businessNo == 2) {
                    return "以租代购";
                } else if (businessNo == 3) {
                    return "金融分期";
                }else if (businessNo == 4) {
                    return "直购";
                }else if (businessNo == 5) {
                    return "短租";
                } else {
                    return "--"
                }
            }
        },
        getCarType: {
            get: function () {
                if (this.couponBusiness.useArea == 1) {
                    return "全场通用";
                } else if (this.couponBusiness.useArea == 2) {
                    return this.couponBusiness.serviceItems;
                } else {
                    return "--";
                }
            }
        },
        getSendTotal: {
            get: function () {
                if (this.couponBusiness.sendTotal == null) {
                    return "无限制";
                }  else {
                    return this.couponBusiness.sendTotal;
                }
            }

        },
        getEndTime:{
            get: function () {
                if (this.couponEntity.sendTimeEnd == null) {
                    return "不限";
                } else {
                    return this.couponEntity.sendTimeEnd;
                }
            }

        },

        getEffect:{
            get: function () {
                if (this.couponEntity.useTimeType == 1) {
                    return "固定时间: "+this.couponEntity.useTimeStart +"至 "+this.couponEntity.useTimeEnd
                } else if(this.couponEntity.useTimeType == 2) {
                     if(this.couponEntity.useTime==0){
                         return "长期有效";
                     }else{
                         return "领券后有效天数   "+this.couponEntity.useTime+"/天";
                     }

                }else{
                    return "--";
                }
            }

        },


        getShiYong:{
            get: function () {
                if (this.couponBusiness.applicableUnitType == 1) {
                    return "全场通用 ";
                } else if(this.couponBusiness.applicableUnitType == 2) {
                    return this.couponBusiness.applicableUnit;
                }else{
                    return "--";
                }
            }

        },
        getUseTypeName:{
          get:function (){
              if (this.couponBusiness.useType == 1) {
                  return "全场通用 ";
              }else{
                  return this.couponBusiness.useTypeName;
              }


          }

        },
        getNode:{
            get: function () {
                if (this.couponBusiness.distributedNodeId == 0) {
                    return "新用户登录自动弹出 ";
                } else if(this.couponBusiness.distributedNodeId == 1) {
                    return "提单成功自动弹出";
                }else if(this.couponBusiness.distributedNodeId == 2) {
                    return "活动发放";
                }else if(this.couponBusiness.distributedNodeId == 3) {
                    return "免费领取";
                }
                else{
                    return "--";
                }
            }

        },

    },
    updated: function(){
        layui.form.render();
    },
    methods: {

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
    parent.vm.reload();
    parent.layer.close(index);
}

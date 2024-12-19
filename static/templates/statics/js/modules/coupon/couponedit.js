var type;
var type2;
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
    data: {
        q: {
            keyword: null
        },
        couponEntity: {},
        couponBusiness:{
        },
        verify: false,
        serviceItems:[],
        applicableUnits:[],
        endType:false,
        useType1:true,
        useType2:false,
        unitType:false,
        showCarType:false,
        use1:false,
        use2:false,
        use3:false,
        use4:false,

    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.couponEntity = param.data1;
        _this.couponBusiness = param.data2;
        if(_this.couponBusiness.useArea==2){
            _this.showCarType=true;
        }
        if(_this.couponBusiness.applicableUnitType==2){
            _this.unitType=true;
        }
        if(_this.couponEntity.sendTimeEndType==2){
            _this.endType=true;
        }
        if(_this.couponEntity.useTimeType==1){
            _this.useType1=true;
            _this.useType2=false;

        }
        if(_this.couponEntity.useTimeType==2){
            _this.useType1=false;
            _this.useType2=true;
        }

        if(_this.couponBusiness.businessNo == null){
              _this.couponBusiness.businessNo = 1;
        }
        if(_this.couponBusiness.useArea == null){
            _this.couponBusiness.useArea = 1;
        }
        if(_this.couponBusiness.distributedNodeId == null){
            _this.couponBusiness.distributedNodeId = 0;
        }
        if(_this.couponBusiness.applicableUnitType == null){
            _this.couponBusiness.applicableUnitType = 1;
        }

        if(_this.couponEntity.sendTimeEndType == null){
            _this.couponEntity.sendTimeEndType = 1;
        }
        if(_this.couponEntity.useTimeType == null){
            _this.couponEntity.useTimeType = 1;
        }
        if(_this.couponEntity.isTurn == null){
            _this.couponEntity.isTurn = 1;
        }
        if(_this.couponBusiness.useType == null){
            _this.couponBusiness.useType = 1;
        }
        if(_this.couponBusiness.useType==2){
            if(_this.couponBusiness.businessNo == 1){
                _this.use1=true;
                _this.use2=false;
                _this.use3=false;
                _this.use4=false;
            }else if(_this.couponBusiness.businessNo == 2){
                _this.use1=false;
                _this.use2=true;
                _this.use3=false;
                _this.use4=false;
            }else if(_this.couponBusiness.businessNo == 3){
                _this.use1=false;
                _this.use2=false;
                _this.use3=true;
                _this.use4=false;
            }else if(_this.couponBusiness.businessNo == 4){
                _this.use1=false;
                _this.use2=false;
                _this.use3=false;
                _this.use4=true;
            }
        }
    },

    mounted:function() {
        // $.ajaxSettings.async = false;
        $.ajax({
            type: "GET",
            url:baseURL +"/coupon/carModelData",
            success: function(r){
                if(r.code === 0){
                    vm.serviceItems=r.data;
                    let data=[];
                    for(let i=0;i< r.data.length;i++){
                        let row = {};
                        row.name=r.data[i].value;
                        row.value=r.data[i].id;
                        data.push(row);
                    }
                        type2 = xmSelect.render({
                            el: '#type2',
                            filterable: true,
                            toolbar: {
                                show: true
                            },
                            selected: true,
                            data: data
                        })
                      if(vm.couponBusiness !=null){
                           
                          if(vm.couponBusiness.useArea == 2){
                              let ccc = vm.couponBusiness.serviceItems.split(',')
                              let aaa = vm.couponBusiness.serviceItemsNo.split(',')
                              let bbb = aaa.map((val, index)=> {
                                          return {
                                              name:ccc[index],
                                              value: val,
                                              selected: true,
                                          }
                                      })
                             // let data=  [{name: '蔬菜', value: 2}];
                              type2.setValue(bbb);
                              type2.selected=true;

                          }
                      }
                }else{
                    alert(r.msg);
                }
            }
        });
        $.ajax({
            type: "GET",
            url:baseURL +"/coupon/deptData",
            success: function(r){
                if(r.code === 0){
                    vm.applicableUnits=r.data;
                    let data=[];
                    for(let i=0;i< r.data.length;i++){
                        let row = {};
                        row.name=r.data[i].applicableUnit;
                        row.value=r.data[i].applicableUnitNo;
                        data.push(row);
                    }
                        type = xmSelect.render({
                            el: '#type',
                            filterable: true,
                            toolbar: {
                                show: true
                            },
                            selected: true,
                            data: data
                        })
                    if(vm.couponBusiness !=null){
                        if(vm.couponBusiness.applicableUnitType ==2){
                            let aaa=  vm.couponBusiness.applicableUnitNo.split(",");
                            let ccc= vm.couponBusiness.applicableUnit.split(",");
                            let bbb = aaa.map((val, index)=> {
                                return {
                                    name:ccc[index],
                                    value: val,
                                    selected: true,
                                }
                            })
                            type.setValue(bbb);
                            type.selected=true;
                        }
                    }
                }else{
                    alert(r.msg);
                }
            }
        });


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
              var url = vm.couponEntity.couponId == null ? "/coupon/addCoupon" : "/coupon/updateCoupon";
               PageLoading();
              if(vm.couponBusiness.applicableUnitType ==2){
                 vm.couponBusiness.applicableUnitNo= type.getValue('valueStr');
                 vm.couponBusiness.applicableUnit=type.getValue('nameStr');
              }
               if(vm.couponBusiness.useArea == 2){
                   vm.couponBusiness.serviceItemsNo=type2.getValue('valueStr');
                   vm.couponBusiness.serviceItems=type2.getValue('nameStr');
               }
            vm.couponEntity.business=vm.couponBusiness;
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.couponEntity),
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

        handleInput1(e) {
            // 通过正则过滤小数点后两位
            vm.couponEntity.money = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        },
        handleInput2(e) {
            // 通过正则过滤小数点后两位
            vm.couponEntity.conditionMoney = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {



}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        couponName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "优惠券名称不能为空";
                }
            }
        },
        money: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "优惠券面值不能为空";
                }
                if(matchZhengShu(value)!=1){
                    return "优惠券面值必须为数字";
                }
            }
        },
        conditionMoney: function (value, item) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "使用条件不能为空";
                }
                if(matchZhengShu(value)!=1){
                    return "使用条件必须为数字";
                }

        },
        sendTotal: function (value, item) {
            // if (value == null || value == '') {
            //     return "库存数量不能为空";
            // }
             if(value != null && value != ''){
                 let reg = /^[1-9]\d*$/;
                 if(!reg.test(value)){
                     return "库存数量必须为正整数";
                 }
                 if(matchNum(value)!=1){
                     return "库存数量必须数值类型且>0";
                 }

             }
        },
        sendTimeStart: function (value, item) {
            if (value == null || value == '') {
                return "发放开始时间不能为空";
            }
        },
        sendTimeEnd: function (value, item) {
            if(vm.couponEntity.sendTimeEndType == 2){
                if (value == null || value == '') {
                    return "发放结束时间不能为空!";
                }
            }
        },

        useTimeStart:function (value, item) {
            if(vm.couponEntity.useTimeType == 1){
                if (value == null || value == '') {
                    return "有效期开始时间不能为空";
                }
            }
        },
        useTimeEnd:function (value, item) {
            if(vm.couponEntity.useTimeType == 1){
                if (value == null || value == '') {
                    return "有效期结束不能为空";
                }
            }
        },
        useTime:function (value, item) {
            if(vm.couponEntity.useTimeType  == 2){
                if (value == null || value == '') {
                    return "领取后有效天数不能为空";
                }
                let reg = /^[0-9]\d*$/;
                if(!reg.test(value)){
                    return "领取后有效天数必须为正整数";
                }
                if(matchNum(value)!=1){
                    return "有效天数必须为数值类型";
                }
            }
        },
        useTypeNo:function (value, item) {
            if(vm.couponBusiness.useType==2){
                if (value == null || value == '') {
                    return "指定类型名称不能为空";
                }
            }
        },
        useNotice: function (value, item) {
                if (value == null || value == '') {
                    return "优惠券使用说明不能为空";
                }
         }


    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('radio(businessNo)', function (data) {
        vm.couponBusiness.businessNo = data.value;
        if( vm.couponBusiness.useType==1){
            vm.use1=false;
            vm.use2=false;
            vm.use3=false;
            vm.use4=false;
            vm.couponBusiness.useTypeNo=null;
        }
        if(data.value==1 && vm.couponBusiness.useType==2){
            vm.use1=true;
            vm.use2=false;
            vm.use3=false;
            vm.use4=false;
        }else if(data.value==2  && vm.couponBusiness.useType==2){
            vm.use1=false;
            vm.use2=true;
            vm.use3=false;
            vm.use4=false;
        }else if(data.value==3  && vm.couponBusiness.useType==2){
            vm.use1=false;
            vm.use2=false;
            vm.use3=true;
            vm.use4=false;
        }else if(data.value==4  && vm.couponBusiness.useType==2){
            vm.use1=false;
            vm.use2=false;
            vm.use3=false;
            vm.use4=true;
        }
    });

    form.on('radio(useType)', function (data) {
         vm.couponBusiness.useType = data.value;
         if(data.value==1){
             vm.use1=false;
             vm.use2=false;
             vm.use3=false;
             vm.use4=false;
             vm.couponBusiness.useTypeNo=null;
         }
          if(data.value==2  && vm.couponBusiness.businessNo==1 ){
              vm.use1=true;
              vm.use2=false;
              vm.use3=false;
              vm.use4=false;
          }else if(data.value==2  && vm.couponBusiness.businessNo==2){
              vm.use1=false;
              vm.use2=true;
              vm.use3=false;
              vm.use4=false;
          }else if(data.value==2  && vm.couponBusiness.businessNo==3){
              vm.use1=false;
              vm.use2=false;
              vm.use3=true;
              vm.use4=false;
          }else if(data.value==2  && vm.couponBusiness.businessNo==4){
              vm.use1=false;
              vm.use2=false;
              vm.use3=false;
              vm.use4=true;
          }
    });
    form.on('radio(useTypeNo)', function (data) {
        vm.couponBusiness.useTypeNo = data.value;
    });

    form.on('radio(isTurn)', function (data) {
        vm.couponEntity.isTurn = data.value;
    });

    form.on('radio(useArea)', function(data){
        vm.couponBusiness.useArea = data.value;
        if(data.value==1){
            vm.couponBusiness.serviceItemsNo=null;
            vm.couponBusiness.serviceItems=null;
            vm.showCarType=false;
        }else{
            vm.showCarType=true;

        }
    });

    form.on('radio(distributedNodeId)', function(data){
        vm.couponBusiness.distributedNodeId = data.value;
    });

    form.on('radio(endType)', function(data){
        vm.couponEntity.sendTimeEndType = data.value;
        if(data.value==1){
           vm.endType=false;
           vm.couponEntity.sendTimeEnd=null;
        }else{
            vm.endType=true
        }
    });

    form.on('radio(applicableUnitType)', function(data){
        vm.couponBusiness.applicableUnitType = data.value;
        if(data.value==1){
            vm.unitType=false;
        }else{
            vm.unitType=true
        }
    });

    form.on('radio(useTimeType)', function(data){
        vm.couponEntity.useTimeType = data.value;
        if(data.value==1){
            vm.useType1=true;
            vm.useType2=false;
            vm.couponEntity.useTime=null;
        }else if(data.value==2){
            vm.useType2=true;
            vm.useType1=false;
            vm.couponEntity.useTimeStart=null;
            vm.couponEntity.useTimeEnd=null;
            if(vm.couponEntity.useTime==0){
                vm.couponEntity.useTimeType=3;
            }
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

function initTable(table, soulTable) {
    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {
    laydate.render({
        elem: '#sendTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeStart = value;
        }
    });
    laydate.render({
        elem: '#sendTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeEnd = value;
        }
    });

    laydate.render({
        elem: '#useTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeStart = value;
        }
    });

    laydate.render({
        elem: '#useTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeEnd = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    vm.couponEntity=null;
    vm.couponBusiness=null;
    parent.vm.reload();
    parent.layer.close(index);
}

function matchNum(theObj){
    var reg = /^[0-9]+\.?[0-9]*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}


function matchZhengShu(theObj){
    var reg = /^\d+(?=\.{1}\d+$|$)/
    // var reg2= /^(\-)*(\d+)\.(\d\d).*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}



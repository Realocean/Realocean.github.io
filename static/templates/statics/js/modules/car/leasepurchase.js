$(function () {
    layui.use(['layer','form','table','laydate','upload'], function () {
        vm.initFeeItem();
        layui.form.on('radio(isCreateOrder)', function (data) {
            vm.carBasicSource.isCreateOrder = data.value;
        });
        layui.form.on('select(repaymentSelect)', function (data) {
            vm.carBasicSource.repayment = data.value;
        });
        layui.form.on('select(feeItem)', function (data) {
            vm.feeItemId = data.value;
        });
        layui.laydate.render({
            elem: '#handleDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carBasicSource.handleDate = value;
            }
        });
        layui.laydate.render({
            elem: '#rentStartDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carBasicSource.rentStartDate = value;
            }
        });
        layui.laydate.render({
            elem: '#rentEndDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carBasicSource.rentEndDate = value;
            }
        });
        layui.laydate.render({
            elem: '#dueDate',
            trigger: 'click',
            theme: 'grid',
            type: 'date',
            isInitValue: false,
            showBottom: false,
            value: '1989-10-01',
            min: '1989-10-01',
            max: '1989-10-31',
            done: function (value, date) {
                Vue.set(vm.carBasicSource, "dueDate", date.date);
                $('input#dueDateVal').val(date.date);
            },
            ready: function(){//
                $('.laydate-theme-grid>div.layui-laydate-hint').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
            }
        });
        layui.laydate.render({
            elem: '#transferTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carBasicSource.transferTime = value;
            }
        });
        //车辆来源附件上传
        layui.upload.render({
            elem: '#addFile',
            url: baseURL + 'file/uploadFile',
            data: {'path':'car_images'},
            field:'files',
            auto:true,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function(obj){
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1:0;
                    fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                    var fileTmp={
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc:'车辆来源附件',
                        nameAccessory:fileNameNotext,
                        nameFile:fileName,
                        nameExt:ext,
                        typeFile:fileType,
                    };
                    vm.fileLst.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.fileLst.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
        layui.table.on('tool(feeLst)', function (obj) {
            var layEvent = obj.event;
            var data = obj.data;
            if (layEvent === 'delect') {
                vm.feeItemDelectObj(obj);
            }else if (layEvent === 'selectTimePayment1st') {
                var txt = '';
                if ((/\d+/).test(data.timePayment1st)){
                    txt = isEmpty(dateFormatYMD(data.timePayment1st));
                }else {
                    var now = new Date();
                    txt = now.format('yyyy-MM-dd');
                }
                this.firstChild.textContent = txt;
                layui.laydate.render({
                    elem: this.firstChild,
                    trigger: 'click',
                    closeStop: this,
                    isInitValue: false,
                    value: txt,
                    btns: ['now', 'confirm'],
                    show: true,
                    done: function (value, date) {
                        data.timePayment1st = new Date(value).getTime();
                        vm.balancePaymentLst.forEach(function (value) {
                            if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                        });
                        obj.update(data);
                        layui.form.render('select');
                    }
                });
            }else if (layEvent === 'money') {
                tableEditMaxlength('money', 10);
                tableEditOninputNum('money');
            }
        });
        layui.form.on('submit(save)', function () {
            vm.saveOrUpdate();
            return false;
        });
        layui.table.on('edit(feeLst)', function(obj){
            vm.editfeeItemlistener(obj);
        });
        layui.form.verify({
            handleDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '提车时间不能为空';
                }
            },
            rentStartDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '租赁开始时间不能为空';
                }
            },
            rentEndDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '租赁结束时间不能为空';
                }
            },
            rentMonthPriceVerify: function (value) {
                if (value == "" || value == null) {
                    return '月租金不能为空';
                }
            },
            dueDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '付款日期不能为空';
                }
            },
            repaymentVerify: function (value) {
                if (value == "" || value == null) {
                    return '月租金还款方式不能为空';
                }
            }
        });
    });
});
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {

        },
        feeItemId: '',
        fileLst: [],
        fileLstId: '0',
        feeItemLst: [],
        carBasicSource: {},
        balancePaymentLst:[],
        isDetail:false,
        isEdit:false,
        promptFlag:true
    },
    created: function () {
        var _this = this;
        // 6 为长租
        $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + 8, function (r) {
            _this.feeItemLst = r.datas;
        });
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        inputRentMonthPrice:function(){
            this.carBasicSource.rentMonthPrice = checkNum(this.carBasicSource.rentMonthPrice);
        },
        inputAmountPaid:function(){
            this.carBasicSource.amountPaid = checkNum(this.carBasicSource.amountPaid);
        },
        initFeeItem:function(){
          if(vm.isDetail){
              layui.table.render({
                  id: 'feeLstid',
                  elem: '#feeLst',
                  data: vm.balancePaymentLst,
                  cols: [[
                      {field:'typeFieldDesc', title: '类型'},
                      {field:'money', title: '金额/元'},
                      {field:'paymentMethod', title: '付款方式',templet:function(d){
                              if(d.paymentMethod === 5 || d.paymentMethod === '5'){
                                  return '一次性结清';
                              }
                          }},
                      {field:'timePayment1st', title: '付款日期'}
                  ]]
              });
          }else{
              layui.table.render({
                  id: 'feeLstid',
                  elem: '#feeLst',
                  data: vm.balancePaymentLst,
                  cols: [[
                      {field:'typeFieldDesc', title: '类型'},
                      {field:'money', title: '金额/元', edit: 'text', event: 'money'},
                      {field:'paymentMethod', title: '付款方式',templet:function(d){
                              if(d.paymentMethod === 5 || d.paymentMethod === '5'){
                                  return '一次性结清';
                              }
                          }},
                      {field:'timePayment1st', title: '付款日期', event: 'selectTimePayment1st', templet: function (d) {
                              var txt = d.timePayment1st;
                              if ((/\d+/).test(txt)){
                                  txt = isEmpty(dateFormatYMD(txt));
                              }else txt = '请选择付款日期';
                              return txt;
                          }},
                      {title: '操作', width: 120, templet: '#feeItemBarTpl', fixed: "right", align: "center"}
                  ]]
              });
          }
        },
        editfeeItemlistener: function (obj) {
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
                v = '';
            }else {
                if (field === 'money') {//分期金额
                    v = Number(value).toFixed(2);
                }
            }
            vm.balancePaymentLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
        },
        saveOrUpdate: function(){
            if (vm.balancePaymentLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.timePayment1st == null || value.timePayment1st == '');
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            parent.vm.sourceDataList[0] = Object.assign({},parent.vm.sourceDataList[0],{
                 rentStartDate:vm.carBasicSource.rentStartDate,
                 rentEndDate:vm.carBasicSource.rentEndDate,
                 handleDate:vm.carBasicSource.handleDate,
                 rentMonthPrice:vm.carBasicSource.rentMonthPrice,
                 dueDate:vm.carBasicSource.dueDate,
                 repayment:vm.carBasicSource.repayment,
                 amountPaid:vm.carBasicSource.amountPaid,
                 payType:vm.carBasicSource.payType,
                 transferTime:vm.carBasicSource.transferTime,
                 remark:vm.carBasicSource.remark,
                 isCreateOrder:vm.carBasicSource.isCreateOrder,
                 feeItemId:vm.feeItemId
            });
            parent.vm.feeItemLst = vm.balancePaymentLst;
            parent.vm.basicSourceFileLst = vm.fileLst;
            parent.layer.closeAll();
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.balancePaymentLst.length;i++) {
                    if(vm.balancePaymentLst[i].serializeId === serializeId) {
                        vm.balancePaymentLst.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                vm.reloadFeeItem();
            });
        },
        addFeeItem: function () {
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if (vm.balancePaymentLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.timePayment1st == null || value.timePayment1st == '');
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            var feeItem = vm.feeItemLst.filter(function (f) {
                return f.id == vm.feeItemId;
            })[0];
            var serializeId = 0;
            if(vm.balancePaymentLst.length > 0){
                vm.balancePaymentLst.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId:serializeId+1,
                elid: 'serializeId_'+(serializeId+1),
                typeFieldName:feeItem.fieldName,
                typeFieldDesc:feeItem.name,
                multiple:feeItem.multiple,
                money:'',
                paymentMethod:5,
                timePayment1st:''
            };
            vm.balancePaymentLst.push(item);
            vm.reloadFeeItem();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid',
                {data: vm.balancePaymentLst});
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        closePage: function () {
            parent.layer.closeAll();
        }
    }
});



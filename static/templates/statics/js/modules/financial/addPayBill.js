$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        upload = layui.upload;

        form.verify({
            /*paidAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '应还总金额不能为空';
                } else {
                    if(!reg.test(value)){
                        return '应还总金额输入格式不正确(大于0或保留两位小数的正整数)!';
                    }
                }
            },
            playStartDateVerify: function (value) {
                if(value==''){
                    return '请选择开始时间';
                }
            },
            playEndDateVerify: function (value) {
                if(value==''){
                    return '请选择结束时间';
                }
            },
            paidDateVerify: function (value) {
                if(value==''){
                    return '请选择应还日期';
                }
            },*/
            validate_paymentType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value == '') {
                    return "请选择付款类型";
                }
            }
        });

        laydate.render({
            elem: '#paymentTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.payment.paymentTime = value;
            }
        });
        form.on('select(lessor)', function (data) {
            vm.payment.payerId = data.value;
        });
        //监听付款方
        form.on('select(supplier)', function (data) {
            console.log("gys:::",data)
            vm.payment.customerId = data.value;
        })

        //监听付款方
        form.on('select(customer)', function (data) {
            vm.payment.customerId = data.value;
        })
        //监听单选按钮
        form.on('radio(radioCustomer)', function (data) {
            vm.payment.customerType = data.value;
            $('#customer').html("<option value=''>请选择渠道商</option>");
            $('#supplier').html("<option value=''>请选择供应商</option>");
            if (data.value == 5) {
                //获取客户下拉选;
                vm.payment.customerId = null;
                vm.qudaoShow = false;
                vm.kehuShow = true;
                vm.supplierShow = false;
            } else if (data.value == 6) {
                //获取渠道商下拉选
                vm.payment.customerId = null;
                vm.payment.customerName = null;
                vm.qudaoShow = true;
                vm.kehuShow = false;
                vm.supplierShow = false;
                getDistributors();
            } else if (data.value == 7) {
                //获取渠道商下拉选
                vm.payment.customerId = null;
                vm.payment.customerName = null;
                vm.qudaoShow = false;
                vm.kehuShow = false;
                vm.supplierShow = true;
                getGysDistributors();
            }
            vm.customer = {};
        });

        uploadAttachment(upload);

        form.render();
    });
    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        type: 1,
        status: null,
        title: null,
        amountLabel: null,
        dateLabel: null,
        payment: {},
        carSourceOrder: {},
        deliveryFileLst: [],
        costTypeList:[],
        costTypeMap:{},
        deliveryFileLstId: 'deliveryFileLstId_0',
        deptList: [],
        customer: {},
        showForm: true,
        qudaoShow: false,
        kehuShow: false,
        supplierShow: false,
        disabled:false,
        pageSource:1,//1.采购订单添加账单 2.财务应付添加账单
    },
    created: function () {
        var _this = this;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
        });

        // 查询费用类型名称
        $.ajax({
            type: "POST",
            url: baseURL + "/otherCostType/costType/selectCostNameList?costType=1",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.costTypeList = r.list;
                if (_this.costTypeList.length < 1) {
                    return false;
                }
                for (let i = 0; i < _this.costTypeList.length; i++) {
                    _this.costTypeMap[_this.costTypeList[i].id] = _this.costTypeList[i];
                }
            }
        });

        layui.form.on('select(paymentType)', function (data) {
            vm.payment.type = vm.costTypeMap[data.value].costName;
            vm.payment.typeVal = data.value;
        });

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectCar: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/financial/selectCarInfo.html",
                end: function () {
                    console.log(vm.payment);
                    layer.close(index);
                }
            });
        },
        selectCustomer: function () {
            // window.localStorage.setItem("customerName",vm.customer.customerName);
            // window.localStorage.setItem("customerId",vm.customer.customerId);
            var index = layer.open({
                title: "选择客户",
                type: 2,
                content: tabBaseURL + "modules/common/selectcustomer.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                },
                end: function () {

                    vm.payment.customerId = vm.customer.id;
                    vm.payment.customerName = vm.customer.customerName;
                    console.log('---------', vm.payment)
                    // window.localStorage.removeItem("customerId");
                    // window.localStorage.removeItem("customerName");

                }
            });
            layer.full(index)
        },
        // 跳转费用类型维护页面
        jumpToFeeTypePage : function () {
            let url=tabBaseURL+'modules/otherCostType/costType.html';
            let title='费用类型配置';
            addTab(url,title);
        },
        cancel: function () {
            parent.layer.closeAll();
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        //保存
        saveOrUpdate: function (event) {
            vm.payment.attachment = vm.deliveryFileLst;
            if (vm.payment.customerId == null || vm.payment.customerId == '') {
                layer.msg('收款方不能为空!', {icon: 7});
                return false;
            }
            $.ajax({
                type: "POST",
                url: baseURL + "financial/paymentbill/save",
                contentType: "application/json",
                data: JSON.stringify(vm.payment),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                            if (vm.pageSource == 1){//采购订单刷新
                                if (vm.payment.status == 1) {
                                    parent.vm.reloadPayBillPage(vm.carSourceOrder.id, 1);
                                } else if (vm.payment.status == 2) {
                                    parent.vm.reloadPaidBillPage(vm.carSourceOrder.id, 2);
                                }
                            }else if(vm.pageSource == 2) {//财务应收刷新
                                parent.vm.reloadGridid()
                            }
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }
    }
});

//编辑时父页面传过来的值
function sendData(data, type, pageSource) {
    console.log('参数-------', data, type, pageSource);
    vm.pageSource = pageSource;
    vm.payment.status = type;
    if( data && pageSource == 1){
        vm.disabled = true;
        vm.carSourceOrder = data;
        vm.payment.carNo = data.carNo;
        vm.payment.vinNo = data.vinNo;
        vm.payment.payerId = '';
        // vm.payment.supplierId = data.supplierId;
        // vm.payment.supplierName = data.supplierName;
        vm.payment.carId = data.carId;
        vm.payment.sourceOrderId = data.id;
        vm.payment.carSource = data.carSourceType;
        vm.payment.contractNo = data.contractNo;
        vm.payment = Object.assign({}, vm.payment, {
            carId: data.carId,
            carNo: data.carNo,
            vinNo: data.vinNo,
            sourceOrderId: data.id,
            // supplierId:data.supplierId,
            // supplierName:data.supplierName,
            carSource: data.carSourceType,
            contractNo: data.contractNo
        });
    }

    if (type == 1) {

        vm.title = "新增应付账单";
        vm.status = "未付款";
        vm.amountLabel = "应付金额";
        vm.dateLabel = "应付日期";
    } else if (type == 2) {
        vm.payment.status = 2;
        vm.title = "新增已付账单";
        vm.status = "已付款";
        vm.amountLabel = "已付金额";
        vm.dateLabel = "已付日期";
    }
    $('#customer').html("<option value=''>请选择付款方</option>");
    vm.payment.customerType = 5;
    vm.kehuShow = true;
    vm.qudaoShow = false;
    vm.supplierShow = false;

    layui.form.render();
}

/**
 * 获取收款方信息
 */
function getCustomer() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getCustomer",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.customerName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}


/**
 * 获取渠道商信息
 */
function getDistributors() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getDistributors",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.channelName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}


/**
 * 获取供应商信息
 */
function getGysDistributors() {

    $.ajax({
        type: "GET",
        url: baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#supplier').append(new Option(item.supplierName, item.purchaseSupplierId));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}


/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        multiple: true,
        number: 20,
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}


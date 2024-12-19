$(function () {

    /***
     * 页面初始化根据车辆id赋值
     */
    if (parent.layui.larryElem != undefined) {
        var params = parent.layui.larryElem.boxParams;
        if(typeof params!="undefined"){
            vm.getCarBasicInforByCarNo(params.carId);
        }
    }

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        form.verify({
            carNoVerify: function (value) {
                if ((vm.ouinsuranceOrder.carNo == "" || vm.ouinsuranceOrder.carNo == null) && (vm.ouinsuranceOrder.vinNo == "" || vm.ouinsuranceOrder.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
            vinNoVerify: function (value) {
                if ((vm.ouinsuranceOrder.carNo == "" || vm.ouinsuranceOrder.carNo == null) && (vm.ouinsuranceOrder.vinNo == "" || vm.ouinsuranceOrder.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
            /*receiveDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '接收时间不能为空';
                }
            },
         outDateVerify: function (value) {
            if (value == "" || value == null) {
                return '出险时间不能为空';
            }
        },
         outAddrVerify: function (value) {
            if (value == "" || value == null) {
                return '出险地点不能为空';
            }
        },
         reporterVerify: function (value) {
            if (value == "" || value == null) {
                return '报案人不能为空';
            }
        },
       outReasonVerify: function (value) {
            if (value == "" || value == null) {
                return '出险经过及原因不能为空';
            }
        },
        outReasonVerify: function (value) {
           if (value == "" || value == null) {
               return '出险经过及原因不能为空';
           }
        },
        insuranceCompanyVerify: function (value) {
            if (value == "" || value == null) {
                return '保险公司不能为空';
            }
        },
        outLevelVerify: function (value) {
           if (value == "" || value == null) {
               return '事故等级不能为空';
           }
        },
        sxIsPayVerify: function (value) {
           if (value == "" || value == null) {
               return '商业险赔付不能为空';
           }

        },*/
            sxPayFeeVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                /*if (value == "" || value == null) {
                    return '赔付金额不能为空';
                }*/
                if (value != null && value != "") {
                    if (!reg.test(value)) {
                        return '金额的输入格式不正确,请确认!';
                    }
                }

            },
            /*sxPayDateVerify: function (value) {
              if (value == "" || value == null) {
                  return '支付时间不能为空';
              }
           },
           qxIsPayVerify: function (value) {
              if (value == "" || value == null) {
                  return '交强险赔付不能为空';
              }
           },*/
            qxPayFeeVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                /*if (value == "" || value == null) {
                    return '赔付金额不能为空';
                }*/
                if (value != null && value != "") {
                    if (!reg.test(value)) {
                        return '金额的输入格式不正确,请确认!';
                    }
                }
            },
            floatFee: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value != null && value != "") {
                    if (value <= 0) {
                        return '保险上浮费必须大于0';
                    }
                    if (!reg.test(value)) {
                        return '保险上浮费的输入格式不正确,请确认!';
                    }
                }
            },
            repairBackFee: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value != null && value != "") {
                    if (value <= 0) {
                        return '维修返佣金额必须大于0';
                    }
                    if (!reg.test(value)) {
                        return '维修返佣金额的输入格式不正确,请确认!';
                    }
                }
            },
            /*qxPayDateVerify: function (value) {
               if (value == "" || value == null) {
                   return '支付时间不能为空';
               }
            },
            responsiblePartyVerify: function (value) {
               if (value == "" || value == null) {
                   return '责任方不能为空';
               }
            },*/
        });
        form.render();
    });
    //接收时间
    laydate.render({
        elem: '#receiveDate',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.ouinsuranceOrder.receiveDate = value;
        }
    });
    //出险时间
    laydate.render({
        elem: '#outDate',
        type: 'datetime',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.ouinsuranceOrder.outDate = value;
        }
    });

    //事故等级
    layui.form.on('select(outLevelFilter)', function (data) {
        vm.ouinsuranceOrder.outLevel = data.value;
    });

    //商业险保险公司
    layui.form.on('select(sxInsuranceCompanyId)', function (data) {
        vm.ouinsuranceOrder.sxInsuranceCompanyId = data.value;
    });
    //商业险赔付
    layui.form.on('select(sxIsPayFilter)', function (data) {
        vm.ouinsuranceOrder.sxIsPay = data.value;
    });

    //支付时间
    laydate.render({
        elem: '#sxPayDate',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.ouinsuranceOrder.sxPayDate = value;
        }
    });

    //交强险保险公司
    layui.form.on('select(qxInsuranceCompanyId)', function (data) {
        vm.ouinsuranceOrder.qxInsuranceCompanyId = data.value;
    });

    //交强险赔付
    layui.form.on('select(qxIsPayFilter)', function (data) {
        vm.ouinsuranceOrder.qxIsPay = data.value;
    });

    //强险支付时间
    laydate.render({
        elem: '#qxPayDate',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.ouinsuranceOrder.qxPayDate = value;
        }
    });

    //责任方
    layui.form.on('select(responsiblePartyFilter)', function (data) {
        vm.ouinsuranceOrder.responsibleParty = data.value;
    });

    //附件上传
    uploadoutinsuranceorder = Upload({
        elid: 'fileLst',
        edit: true,
        fileLst: vm.fileLst,
        param: {'path':'outinsuranceorder'},
        fidedesc: '出险附件'
    });
    uploadoutinsuranceorder.initView();

    layui.upload.render({
        elem: '#addFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: { 'path': 'outinsuranceorder' },
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number: 20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', { icon: 5 });
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username"),
                    nameDesc: '出险附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.fileLst.push(fileTmp);
                vm.fileLstId = 'fileLstId_' + uuid(6);
            });
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', { icon: 5 });
            vm.delFile(fileIdTmp);
            fileIdTmp = null;
        }
    });

    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
    // 保险赔付情况表单
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance1",
        elem: '#compulsoryInsurance1',
        minWidth: 150,
        data: vm.dataliat1,
        cols: [[
            { field: 'payInsuranceName', title: '保险类型', align: "center" },
            // {
            //     field: 'company', title: '赔付保险公司', align: "center", templet: '#selectCompontMethod', width: 250
            // },
            {
                field: 'insuranceCompanyName', title: '赔付保险公司', align: "center", templet: function (d) {
                    let txt = vm.insuranceCompany
                    let op = ''
                    txt.map((res) => {
                        op = `<option>${res.companyName}</option>` + op
                    })
                    let tml = `<select lay-filter="insuranceTtype1" name="insuranceTtype1" id="${d.index}" sid="${d.payInsuranceName}">${op}</select>`
                    return tml;
                },
            },
            {
                field: 'payFee', title: '保险赔付金额(元)', align: "center", templet: function (d) { return isEmpty(d.payFee); }, edit: 'text', event: 'payFee'
            },
            {
                field: 'payDate', title: '赔付时间', align: "center", templet: function (d) {
                    var txt = d.payDate;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payDate'
            },
            {
                field: 'remark', title: '备注信息', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark'
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>删除</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="insuranceCompanyName"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var data = vm.dataliat1.filter(function (value) {

                    return value.payInsuranceName == serializeId;
                })[0];

                console.log(vm.dataliat1)
                console.log(data, 444444444)
                var value = '';
                if (data != null) {
                    value = data.insuranceCompanyName;
                }
                $(this).val(value);
            });
            layui.form.render('select');
        }

    });
    // 出险相关费用信息表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        // minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '费用类型', align: "center" },
            {
                field: 'receivableAmount', title: '应收金额(元)', align: "center", templet: function (d) { return isEmpty(d.receivableAmount); }, edit: 'text', event: 'receivableAmount'
            },

            {
                field: 'receivableObjName', title: '付款对象', align: "center", templet: function (d) {
                    let txt = vm.payeeList
                    let op = ''
                    txt.map((res) => {
                        op = `<option>${res.customerName}</option>` + op
                    })
                    let tml = `<select lay-filter="insuranceTtype2" name="insuranceTtype2" id="${d.index}" sid="${d.feeName}">${op}</select>`
                    return tml;
                },
            },
            {
                field: 'isGenerateReceivableBill', title: '生成应收账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateReceivableBill ? 'checked' : ""}  onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'payableAmount', title: '应付金额(元)', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'paymentObjName', title: '收款对象', align: "center", templet: function (d) { return isEmpty(d.paymentObjName); }, edit: 'text', event: 'paymentObjName'
            },
            {
                field: 'isGeneratePayableBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch12${d.index}' ${d.isGeneratePayableBill ? 'checked' : ""}  onlyName=${d.index} name='switchTest12' lay-skin='switch' lay-filter='switchTest12' title='是|否'>`
                }
            },

            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>删除</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="receivableObjName"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var data = vm.dataliat2.filter(function (value) {
                    return value.feeName == serializeId;
                })[0];
                var value = '';
                console.log(vm.dataliat2)
                console.log(data, 444444444)
                console.log(serializeId, 444444444)
                if (data != null) {
                    value = data.receivableObjName;
                }
                $(this).val(value);
            });
            layui.form.render('select');


        }

    });
    layui.table.on('edit(test1)', function (obj) {
        var field = obj.field;
        var value = obj.value;
        var regNumber = /^[0-9]+\.?[0-9]*$/;
        var v = '';
        if (field === 'payFee') {
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
            } else {
                //项目金额
                v = Number(value).toFixed(2);
            }
        } else {
            v = value
        }
        obj.data[field] = v;
        for (let i = 0; i < vm.dataliat1.length; i++) {
            var thisObj = vm.dataliat1[i];
            if (thisObj.index == obj.data.index) {
                vm.dataliat1[i] = obj.data;
            }
        }
        reloadPlan1()
    });

    layui.table.on('edit(test2)', function (obj) {
        var field = obj.field;
        var value = obj.value;
        var regNumber = /^[0-9]+\.?[0-9]*$/;
        var v = '';
        if (field === 'payableAmount' || field === 'receivableAmount' ) {
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
            } else {
                //项目金额
                v = Number(value).toFixed(2);
            }
        } else {
            v = value
        }
        obj.data[field] = v;
        console.log('修改保险相关费用里面值了', obj);
        for (let i = 0; i < vm.dataliat2.length; i++) {
            var thisObj = vm.dataliat2[i];
            if (thisObj.index == obj.data.index) {
                if (field === 'payableAmount'){
                    vm.dataliat2[i].payableAmount = v;
                }
                if (field === 'receivableAmount'){
                    vm.dataliat2[i].receivableAmount = v;
                }
                vm.dataliat2[i].paymentObjName = obj.data.paymentObjName;
            }
        }
        reloadPlan2()
    });

    layui.table.on('tool(test1)', function (obj) {//test为table标签中lay-filter的值
        console.log("111111111111", obj)
        var data = obj.data;
        if (obj.event === 'del') {
            console.log(data)
            vm.dataliat1.forEach(function (value, index) {
                if (value.payInsuranceName === data.payInsuranceName) {
                    console.log(22222)
                    vm.dataliat1.splice(index, 1)
                }
            });
            reloadPlan1()

        } else if (obj.event === 'payFee' || obj.event === 'isPay') {
            tableEditOninputNumInteger(data);
        } else if (obj.event === 'payDate') {
            var txt = '';
            if ((/\d+/).test(data.payDate)) {
                txt = isEmpty(dateFormatYMD(data.payDate));
            } else {
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
                show: true,
                done: function (value1, date) {
                    console.log(data, 999999999)
                    data.payDate = value1
                    obj.update(data)
                    $('td[data-field="insuranceCompanyName"]>div>select').each(function () {
                        var serializeId = this.attributes.sid.value;
                        var data = vm.dataliat1.filter(function (value) {

                            return value.payInsuranceName == serializeId;
                        })[0];
                        var value = '';
                        if (data != null) {
                            value = data.insuranceCompanyName;
                        }
                        $(this).val(value);
                    });
                    layui.form.render('select');
                    vm.dataliat1.forEach(function (value) {
                        if (value.index === data.index) value.payDate = value1
                    });
                }
            });
        }
    });
    layui.table.on('tool(test2)', function (obj) {//test为table标签中lay-filter的值 
        var data = obj.data;
        if (obj.event === 'del') {
            console.log(data)
            vm.dataliat2.forEach(function (value, index) {
                if (value.feeName === data.feeName) {
                    console.log(22222)
                    vm.dataliat2.splice(index, 1)
                }
            });
            reloadPlan2()

        } else if (obj.event === 'receivableAmount' || obj.event === 'payableAmount') {
            tableEditOninputNumInteger(data);
        }
    });
    // 保险类型dataouinsuranceOrder 
    layui.form.on('select(insuranceTtype)', function (data) {
        vm.ouinsuranceOrder.insuranceType = data.value;
    });
    // 保险类型
    layui.form.on('select(insuranceTtype1)', function (data) {
        console.log(data, 'bx111111')
        console.log("测试保险赔付公司 ", data.elem.attributes.sid.value)
        vm.dataliat1.map((res) => {
            if (res.payInsuranceName == data.elem.attributes.sid.value) {
                console.log("asdjgasyhgsa走到了")
                res.insuranceCompanyName = data.value
                vm.insuranceCompany.map((item) => {
                    if (item.companyName == data.value) {
                        res.insuranceCompanyId = item.id
                    }
                })
                layui.table.reload('compulsoryInsurance1', {
                    data: vm.dataliat1
                });

            }
        })
        console.log(vm.dataliat1, 222222222222222)
    });
    // 费用类型
    layui.form.on('select(insuranceTtype3)', function (data) {
        vm.ouinsuranceOrder.expenseType = data.value;
    });
    // 收款对象
    layui.form.on('select(insuranceTtype2)', function (data) {
        console.log(data, 11)
        vm.dataliat2.map((res) => {
            if (res.feeName == data.elem.attributes.sid.value) {
                res.receivableObjName = data.value
            }
            vm.payeeList.map((item) => {
                if (item.customerName == data.value) {
                    res.receivableObjNo = item.customerId;
                    vm.ouinsuranceOrder.orderId = item.orderId;
                    vm.ouinsuranceOrder.orderCarId = item.orderCarId;
                    vm.ouinsuranceOrder.customer = item.customerName;
                    vm.ouinsuranceOrder.customerName = item.customerName;
                    vm.ouinsuranceOrder.customerId = item.customerId;
                }
            })
            layui.table.reload('compulsoryInsurance2', {
                data: vm.dataliat2
            });
        });
    });
    // 生成应收账单
    layui.form.on('switch(switchTest11)', function (obj) {
        // let a = $.trim($('#contractSwitch11').is(":checked"));
        let a = $.trim($('#'+obj.elem.id).is(":checked"));

        let data1 = obj.elem.attributes.onlyname.value
        console.log("现成保教结合：：：", data1);
        console.log(obj, 111111)
        if (a == 'true') {
            let list = vm.dataliat2
            console.log(list, 2222222)
            list.map((res, index) => {
                if (res.index == data1) {
                    list[index].isGenerateReceivableBill = 1
                }
            })
        } else {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data1) {
                    list[index].isGenerateReceivableBill = 0
                }
            })
        }
        console.log(vm.dataliat2)
    });
    // 生成应付账单
    layui.form.on('switch(switchTest12)', function (obj) {
        // let a = $.trim($('#contractSwitch12').is(":checked"));
        let a = $.trim($('#'+obj.elem.id).is(":checked"));

        let data2 = obj.elem.attributes.onlyname.value
        console.log(obj, 111111)
        if (a == 'true') {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGeneratePayableBill = 1
                }
            })
        } else {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGeneratePayableBill = 0
                }
            })
        }
        console.log(vm.dataliat2)
    });

});

var uploadoutinsuranceorder;
var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong: false,
        showForm: false,
        carInforData: {
            predictLossFee: null
        },
        ouinsuranceOrder: {},
        fileLst: [],
        fileLstId: '0',
        //保险公司数据源
        compulsoryInsuranceList: [],
        //事故等级
        outLevelList: [],
        bpmChartDtoList: [],
        openFlow: false,
        dataliat1: [],
        dataliat2: [],
        insuranceArr: [
            {
                value: '交强险',
                lable: '1',
            },
            {
                value: '承运险',
                lable: '2',
            },
            {
                value: '商业险',
                lable: '3',
            },
        ],
        payeeList: [
            {
                value: '张山',
                lable: '1',
            },
            {
                value: '李四',
                lable: '2',
            },
            {
                value: '王五',
                lable: '3',
            },
        ],
        insuranceCompany: [],
        expenseArr: [
            {
                value: '保险上浮费',
                lable: '1',
            },
            {
                value: '维修费',
                lable: '2',
            },
            {
                value: '折旧费',
                lable: '3',
            },
            {
                value: '其他费用',
                lable: '4',
            },
        ],
        num: 1,
    },
    watch: {
        dataliat1: {
            handler(newValue, oldValue) {
                this.dataliat1 = newValue
            }
        }
    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        var _this = this;
        //初始化加载保险公司下拉列表
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        if (param && param.id) {
            $.ajax({
                type: "POST",
                url: baseURL + "outinsuranceorder/ouinsuranceorder/info/" + param.id,
                contentType: "application/json",
                async: false,
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        _this.ouinsuranceOrder = Object.assign({}, _this.ouinsuranceOrder, r.outinsuranceOrderDetil);
                        _this.ouinsuranceOrder = Object.assign({}, _this.ouinsuranceOrder, { carNo: r.outinsuranceOrderDetil.carPlateNo });
                        _this.ouinsuranceOrder = Object.assign({}, _this.ouinsuranceOrder, { customerName: r.outinsuranceOrderDetil.customer });
                        _this.fileLst = r.outinsuranceOrderDetil.fileLst;
                        //
                        delete _this.ouinsuranceOrder.id;
                        delete _this.ouinsuranceOrder.applyNo;
                        delete _this.ouinsuranceOrder.outInsuranceStatus;
                        delete _this.ouinsuranceOrder.timeCreate;
                        delete _this.ouinsuranceOrder.timeUpdate;
                        delete _this.ouinsuranceOrder.instanceId;
                        delete _this.ouinsuranceOrder.operator;
                        delete _this.ouinsuranceOrder.flowApproveStatus;
                        if (_this.fileLst) {
                            _this.fileLst.forEach(function (item) {
                                delete item.sysAccessoryId;
                                delete item.objId;
                                delete item.objType;
                            })
                        }
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }
        //初始化加载保险公司下拉列表
        $.get(baseURL + "activity/bpmInitChart", { processKey: "carOutInsuranceApprove" }, function (r) {
            if (r.code == 0) {
                _this.bpmChartDtoList = r.bpmInitChart;
                _this.openFlow = r.openFlow;

            }
        });
        $.get(baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyInforList", function (r) {
            _this.insuranceCompany = r.compulsoryInsuranceList;
        });
        $.get(baseURL + "sys/dict/getInfoByType/" + "accidentLevel", function (r) {
            _this.outLevelList = r.dict;
        });
        var sysUserInfo = window.localStorage.getItem("sysUserInfo");
        var jsonStr = JSON.parse(sysUserInfo) || {};
        this.ouinsuranceOrder.serviceName = jsonStr.officialPartner;
        $.ajaxSettings.async = true;

    },
    methods: {
        // 新增保险赔付情况
        addInsurance: function () {
            if (vm.ouinsuranceOrder.carId == null || vm.ouinsuranceOrder.carId == '' || vm.ouinsuranceOrder.carId == undefined) {
                layer.alert('请先选择车辆', {
                    icon: 5,
                    title: "提示"
                });
                return false;
            }
            if (this.dataliat1.length > 0) {
                if (this.dataliat1.some(animal => animal.payInsuranceName === vm.ouinsuranceOrder.insuranceType)) {
                    layer.alert('不能添加相同的保险类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                } else {
                    console.log(this.ouinsuranceOrder.insuranceType)
                    let obj = {
                        payInsuranceName: vm.ouinsuranceOrder.insuranceType,
                        insuranceCompanyId: '',
                        insuranceCompanyName: '',
                        payFee: '',
                        payDate: '',
                        remark: '',
                        index: this.num++,
                    }
                    this.dataliat1.push(obj)
                    layui.table.reload('compulsoryInsurance1', {
                        data: vm.dataliat1
                    });
                }
            } else {
                if (vm.ouinsuranceOrder.insuranceType) {
                    let obj = {
                        payInsuranceName: vm.ouinsuranceOrder.insuranceType,
                        insuranceCompanyId: '',
                        insuranceCompanyName: '',
                        payFee: '',
                        payDate: '',
                        remark: '',
                        index: this.num++,
                    }
                    this.dataliat1.push(obj)
                    layui.table.reload('compulsoryInsurance1', {
                        data: vm.dataliat1
                    });
                } else {
                    layer.alert('请先选择保险类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                }

            }


        },
        // 新增出险相关费用信息
        addExpense: function () {
            if (vm.ouinsuranceOrder.carId == null || vm.ouinsuranceOrder.carId == '' || vm.ouinsuranceOrder.carId == undefined) {
                layer.alert('请先选择车辆', {
                    icon: 5,
                    title: "提示"
                });
                return false;
            }
            if (this.dataliat2.length > 0) {
                if (this.dataliat2.some(animal => animal.feeName === vm.ouinsuranceOrder.expenseType)) {
                    layer.alert('不能添加相同的费用类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                } else {
                    console.log(this.ouinsuranceOrder.expenseType)
                    let obj = {
                        feeName: vm.ouinsuranceOrder.expenseType,
                        payableAmount: null,
                        paymentObjName: '',
                        isGeneratePayableBill: 0,
                        receivableAmount: null,
                        receivableObjNo: '',
                        receivableObjName: '',
                        isGenerateReceivableBill: 0,
                        index: this.num++,

                    }
                    this.dataliat2.push(obj)
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                }
            } else {
                if (vm.ouinsuranceOrder.expenseType) {
                    let obj = {
                        feeName: vm.ouinsuranceOrder.expenseType,
                        payableAmount: null,
                        paymentObjName: '',
                        isGeneratePayableBill: 0,
                        receivableAmount: null,
                        receivableObjNo: '',
                        receivableObjName: '',
                        isGenerateReceivableBill: 0,
                        index: this.num++,
                    }
                    this.dataliat2.push(obj)
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                } else {
                    layer.alert('请先选择费用类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                }
            }
        },
        retractChange: function (data) {
            if (data == 1) {
                this.hetong = false
            }
        },
        expandChange: function (data) {
            console.log(1)
            if (data == 1) {
                this.$nextTick(() => {
                    this.hetong = true
                })

            }
        },
        cancel: function () {
            // parent.layer.closeAll();
            closeCurrent();
        },
        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车牌号",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('outinsurance');
                },
                end: function () {
                    var carId = vm.carInforData.carId;
                    if (carId != null && carId != '' && carId != undefined) {
                        vm.getCarBasicInforByCarNo(carId);
                    }
                }
            });
            // layer.full(index);

        },
        //选择车架号
        selectVinNo: function () {
            var index = layer.open({
                title: "选择车架号",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('outinsurance');
                },
                end: function () {
                    var vinNo = vm.carInforData.vinNo;
                    if (vinNo != null && vinNo != '' && vinNo != undefined) {
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            // layer.full(index);

        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.ouinsuranceOrder = r.baseInfor;
                    if (!vm.ouinsuranceOrder) {
                        vm.ouinsuranceOrder = {
                            carId:''
                        };
                    }
                    var sysUserInfo = window.localStorage.getItem("sysUserInfo");
                    var jsonStr = JSON.parse(sysUserInfo) || {};
                    vm.ouinsuranceOrder.serviceName = jsonStr.officialPartner;
                    console.log("打印r.baseInfor:" + r.baseInfor);
                    // 查询车辆对应客户列表
                    $.ajax({
                        type: "GET",
                        url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + vm.ouinsuranceOrder.carId,
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {
                                vm.payeeList = r.data;
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        //根据车架号查询基本信息
        getCarBasicInforByVinNo: function (vinNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/" + vinNo,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.ouinsuranceOrder = r.baseInfor;
                    console.log("打印r.baseInfor:" + r.baseInfor);
                    // 查询车辆对应客户列表
                    $.ajax({
                        type: "GET",
                        url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + vm.ouinsuranceOrder.carId,
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {
                                vm.payeeList = r.data;
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        saveOrUpdate: function (event) {
            vm.ouinsuranceOrder.fileLst = vm.fileLst;
            vm.ouinsuranceOrder.carPlateNo = vm.ouinsuranceOrder.carNo;
            vm.ouinsuranceOrder.customer = vm.ouinsuranceOrder.customerName;
            vm.ouinsuranceOrder.carPurpose = vm.ouinsuranceOrder.rentTypeStr;
            vm.ouinsuranceOrder.depotId = vm.ouinsuranceOrder.carDepotId;
            vm.ouinsuranceOrder.depotName = vm.ouinsuranceOrder.carDepotName;

            console.log("保险费用 ：", vm.dataliat1);
            console.log("出险相关费用 ：", vm.dataliat2);

            vm.ouinsuranceOrder.insuranceCompensationList = vm.dataliat1;
            vm.ouinsuranceOrder.relatedCostsList = vm.dataliat2;
            console.log(vm.ouinsuranceOrder, '提交阐述')
            var url = "outinsuranceorder/ouinsuranceorder/save";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.ouinsuranceOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            // parent.layer.closeAll();
                            // parent.vm.reload();
                            //页面关闭
                            closeCurrent();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        delFile: function (id) {
            for (var i = 0; i < vm.fileLst.length; i++) {
                if (vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },

    }
});

function reloadPlan1() {
    if ($('div[lay-id="compulsoryInsurance1"]').length > 0) {
        console.log(vm.dataliat1, 455454545454)
        layui.table.reload('compulsoryInsurance1', { data: vm.dataliat1 });
    }
}
function reloadPlan2() {
    if ($('div[lay-id="compulsoryInsurance2"]').length > 0) {
        console.log(vm.dataliat2, 455454545454)
        layui.table.reload('compulsoryInsurance2', { data: vm.dataliat2 });
    }
}



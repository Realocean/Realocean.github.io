$(function () {
    vm.ouinsuranceOrder = {};
    vm.getOutinsuranceOrderInfor(window.localStorage.getItem("outInsuranceOrderId"));
    // 只读
    var readOnly = ['edit', 'reedit', 'add','approve'].indexOf(vm.viewTag)==-1;
    vm.readOnly = readOnly;
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.verify({
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
            }*/
        });
        $("#recall").on('click', function () {
            vm.recall();
        });
        BpmChart({ instanceId: vm.instanceId }).initView();
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

    //商业险赔付保险公司
    layui.form.on('select(sxInsuranceCompanyId)', function (data) {
        vm.ouinsuranceOrder.sxInsuranceCompanyId = data.value;
    });

    //交强险赔付保险公司
    layui.form.on('select(qxInsuranceCompanyId)', function (data) {
        vm.ouinsuranceOrder.qxInsuranceCompanyId = data.value;
    });

    //事故等级
    layui.form.on('select(outLevelFilter)', function (data) {
        vm.ouinsuranceOrder.outLevel = data.value;
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
    layui.upload.render({
        elem: '#addFile2',
        url: baseURL + 'file/uploadFile',
        data: { 'path': 'processApprove' },
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number: 20,
        choose: function (obj) {
            // PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = vm.fileLst2.length + '_' + uuid(60);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username"),
                    nameDesc: '审批附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.fileLst2.push(fileTmp);
            });
        },
        done: function (res) {
            // RemoveLoading();
            if (res.code == '0') {
                vm.fileLst2.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                vm.fileLstId2 = 'fileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', { icon: 5 });
                vm.delFile2(fileIdTmp);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', { icon: 5 });
            vm.delFile2(fileIdTmp);
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
                    var disabledStr = readOnly?"disabled":" ";
                    let tml = `<select lay-filter="insuranceTtype1" name="insuranceTtype1" id="${d.index}" sid="${d.payInsuranceName}" ${disabledStr}>${op}</select>`
                    return tml;
                },
            },
            {
                field: 'payFee', title: '保险赔付金额(元)', align: "center", templet: function (d) { return isEmpty(d.payFee); },
                edit: readOnly?undefined:'text',
                event: 'payFee'
            },
            {
                field: 'payDate', title: '赔付时间', align: "center", templet: function (d) {
                    var txt = d.payDate;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: readOnly?undefined:'payDate'
            },
            {
                field: 'remark', title: '备注信息', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: readOnly?undefined:'text', event: 'remark'
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    if(readOnly){
                        return '';
                    }
                    return `<a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>删除</a>`
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
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '费用类型', align: "center" },
            {
                field: 'receivableAmount', title: '应收金额(元)', align: "center", templet: function (d) { return isEmpty(d.receivableAmount); },
                edit: readOnly?undefined:'text', event: 'receivableAmount'
            },

            {
                field: 'receivableObjName', title: '付款对象', align: "center", templet: function (d) {
                    console.log(vm.payeeList, '11aaaaaaaaaaa')
                    let txt = vm.payeeList
                    let op = '<option value="">请选择</option>'
                    if (txt.length > 0) {
                        txt.map((res) => {
                            op = op + `<option :value="${res.customerName}">${res.customerName}</option>`
                        })
                        var disabledStr = readOnly?"disabled":" ";
                        let tml = `<select lay-filter="insuranceTtype2" name="insuranceTtype2" id="${d.index}" sid="${d.feeName}" ${disabledStr}>${op}</select>`
                        return tml;
                    }else {
                        return isEmpty(d.receivableObjName);
                    }

                },
            },
            {
                field: 'isGenerateReceivableBill', title: '生成应收账单', align: "center", templet: function (d) {
                    var disabledStr = readOnly?"disabled":" ";
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateReceivableBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否' ${disabledStr}/>`
                }
            },
            {
                field: 'payableAmount', title: '应付金额(元)', align: "center", templet: function (d) { return isEmpty(d.payableAmount); },
                edit: readOnly?undefined:'text', event: 'payableAmount'
            },
            {
                field: 'paymentObjName', title: '收款对象', align: "center", templet: function (d) { return isEmpty(d.paymentObjName); },
                edit: readOnly?undefined:'text', event: 'paymentObjName'
            },
            {
                field: 'isGeneratePayableBill', title: '生成应付账单', align: "center", templet: function (d) {
                    var disabledStr = readOnly?"disabled":" ";
                    return `<input type='checkbox' id='contractSwitch12${d.index}'  ${d.isGeneratePayableBill ? 'checked' : ""} onlyName=${d.index} name='switchTest12' lay-skin='switch' lay-filter='switchTest12' title='是|否' ${disabledStr}/>`
                }
            },

            {
                title: '操作', align: "center", templet: function (d) {
                    if(readOnly){
                        return '';
                    }
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>删除</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            console.log(vm.dataliat2)
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
        console.log(obj)
        console.log(vm.dataliat1)
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
        console.log('修改保险费用里面值了', obj);
        for (let i = 0; i < vm.dataliat1.length; i++) {
            var thisObj = vm.dataliat1[i];
            if (thisObj.index == obj.data.index) {
                vm.dataliat1[i].payFee = obj.data.payFee;
                vm.dataliat1[i].remark = obj.data.remark;
            }
        }
        reloadPlan1()
    });

    layui.table.on('edit(test2)', function (obj) {
        var field = obj.field;
        var value = obj.value;
        var regNumber = /^[0-9]+\.?[0-9]*$/;
        var v = '';
        if (field === 'payableAmount' || field === 'receivableAmount') {
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
        console.log('修改相关费用里面值了', obj);
        for (let i = 0; i < vm.dataliat2.length; i++) {
            var thisObj = vm.dataliat2[i];
            if (thisObj.index == obj.data.index) {
                vm.dataliat2[i].receivableAmount = obj.data.receivableAmount;
                vm.dataliat2[i].payableAmount = obj.data.payableAmount;
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
        }
        else if (obj.event === 'payDate') {
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
    // 保险类型
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
                    res.receivableObjNo = item.customerId
                }else {
                    res.receivableObjNo = null
                }
            })
            layui.table.reload('compulsoryInsurance2', {
                data: vm.dataliat2
            });
        })
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
    });

});


var uploadoutinsuranceorder;
var vm = new Vue({
    el: '#rrapp',
    data: {
        showForm: false,
        carInforData: {},
        ouinsuranceOrder: {},
        fileLst: [],
        fileLstId: '0',
        compulsoryInsuranceList: [],
        outLevelList: [],
        boxShow: false,
        boxInputShow: false,
        boxTitle: '',
        fileLst2: [],
        fileLstId2: '0',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        viewTag: 'edit',
        recallNodeName: null,
        processApproveForm: {},
        bpmChartDtoList: [],
        instanceId: null,
        nodeType: null,
        isApply: false,
        instanceStatus: null,
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
        payeeList: [],
        insuranceCompany: [

        ],
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
        num1: 1,
        readOnly: false
    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            _this.instanceId = param.instanceId;
            _this.recallNodeName = param.recallName;
            _this.viewTag = param.viewTag;
            _this.instanceStatus = param.instanceStatus;
            _this.isApply = param.isApply;
            _this.processApproveForm = param;
            //初始化加载保险公司下拉列表
            // if(_this.viewTag != 'edit'){
            //     $.get(baseURL + "activity/bpmChart",{processKey:param.processKey,instanceId:param.instanceId}, function (r) {
            //         if (r.code == 0){
            //             _this.bpmChartDtoList = r.bpmChart;
            //         }
            //     });
            // }
            $.get(baseURL + "activity/getNodeType", { instanceId: param.instanceId }, function (r) {
                _this.nodeType = r.nodeType;
            });
        }
        $.get(baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyInforList", function (r) {
            _this.insuranceCompany = r.compulsoryInsuranceList;
        });
        $.get(baseURL + "sys/dict/getInfoByType/" + "accidentLevel", function (r) {
            _this.outLevelList = r.dict;
        });
        $.ajaxSettings.async = true;
    },
    watch: {
        payeeList: {
            handler(newValue, oldValue) {
                this.payeeList = newValue
            },
            deep: true
        },
        num: {
            handler(newValue, oldValue) {
                this.num = newValue
            },
            immediate: true
        },
        num1: {
            handler(newValue, oldValue) {
                this.num1 = newValue
            },
            immediate: true
        },
    },
    methods: {
        // 新增保险赔付情况
        addInsurance: function () {
            console.log(this.num)
            if (vm.ouinsuranceOrder.carId == null || vm.ouinsuranceOrder.carId == '' || vm.ouinsuranceOrder.carId == undefined) {
                layer.alert('请先选择车辆', {
                    icon: 5,
                    title: "提示"
                });
                return false;
            }

            if (vm.ouinsuranceOrder.insuranceType == null || vm.ouinsuranceOrder.insuranceType == '' || vm.ouinsuranceOrder.insuranceType == undefined) {
                layer.alert('请先选择保险类型', {
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
                        index: vm.num + 1,
                    }
                    vm.dataliat1.push(obj)
                    vm.num = vm.dataliat1.length
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
                        index: vm.num + 1,
                    }
                    vm.dataliat1.push(obj)
                    vm.num = vm.dataliat1.length
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
            console.log(this.num1, 999999999)

            if (vm.ouinsuranceOrder.expenseType == null || vm.ouinsuranceOrder.expenseType == '' || vm.ouinsuranceOrder.expenseType == undefined) {
                layer.alert('请先选择费用类型', {
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
                        index: vm.num1 + 1,

                    }
                    vm.dataliat2.push(obj)
                    vm.num1 = vm.dataliat2.length
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
                        index: vm.num1 + 1,
                    }
                    vm.dataliat2.push(obj)
                    vm.num1 = vm.dataliat2.length
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                } else {
                    layer.alert('请先选择费用类型', {
                        icon: 5,
                        title: "提示"
                    });
                }

            }
        },
        requestAction: function (action, type) {
            PageLoading();
            vm.ouinsuranceOrder.fileLst = vm.fileLst;
            vm.ouinsuranceOrder.carPlateNo = vm.ouinsuranceOrder.carNo;
            vm.ouinsuranceOrder.customer = vm.ouinsuranceOrder.customerName;
            vm.ouinsuranceOrder.carPurpose = vm.ouinsuranceOrder.rentTypeStr;
            vm.ouinsuranceOrder.viewTag = vm.viewTag;
            vm.ouinsuranceOrder.instanceId = vm.processApproveForm.instanceId;
            vm.processApproveForm.outinsuranceOrder=vm.ouinsuranceOrder;
            vm.processApproveForm.processOperationType = type;
            vm.processApproveForm.businessId = window.localStorage.getItem("outInsuranceOrderId");
            vm.processApproveForm.approveContent = vm.boxTxt;
            vm.processApproveForm.approveFileList = vm.fileLst2;
            var closeBox = false;
            console.log("审核通过数据"+vm.processApproveForm);
            $.ajax({
                type: "POST",
                url: baseURL + "outinsuranceorder/ouinsuranceorder/" + action,
                contentType: "application/json",
                async: false,
                data: JSON.stringify(vm.processApproveForm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            return closeBox;
        },
        showBox: function (submit) {
            vm.boxTxt = '';
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn: ['取消', '确定'],
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function () {
                    vm.boxShow = false;
                    vm.fileLst2 = [];
                    layer.close(index);
                },
                btn1: function (index, layero) {
                    vm.boxShow = false;
                    vm.fileLst2 = [];
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    return submit();
                }
            });
            vm.boxShow = true;
        },
        approve: function () {
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('handle', 4);
            });
        },
        getFileData: function (data) {
            let param = {
                data: data
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/common/approvefileview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        delFile2: function (id) {
            for (var i = 0; i < vm.fileLst2.length; i++) {
                if (vm.fileLst2[i].id === id) {
                    vm.fileLst2.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        reject: function () {
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == '') {
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle', 3);
            });
        },
        reedit: function () {
            vm.viewTag = 'reedit';
        },
        cancel: function () {
            parent.layer.closeAll();
        },
        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车牌号",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var carId = vm.carInforData.carId;
                    if (carId != null && carId != '' && carId != undefined) {
                        vm.getCarBasicInforByCarNo(carId);
                    }
                }
            });
            layer.full(index);

        },
        //选择车架号
        selectVinNo: function () {
            var index = layer.open({
                title: "选择车架号",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var vinNo = vm.carInforData.vinNo;
                    if (vinNo != null && vinNo != '' && vinNo != undefined) {
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            layer.full(index);

        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.ouinsuranceOrder.carId = carId;
                    vm.ouinsuranceOrder.carNo = r.baseInfor.carNo;
                    vm.ouinsuranceOrder.vinNo = r.baseInfor.vinNo;
                    vm.ouinsuranceOrder.carBrandModelName = r.baseInfor.carBrandModelName;
                    vm.ouinsuranceOrder.customerName = r.baseInfor.customerName;
                    vm.ouinsuranceOrder.carStatus = r.baseInfor.carStatus;
                    vm.ouinsuranceOrder.carStatusStr = r.baseInfor.carStatusStr;
                    vm.ouinsuranceOrder.carOrderNo = r.baseInfor.carOrderNo;
                    vm.ouinsuranceOrder.belongCompanyName = r.baseInfor.belongCompanyName;
                    vm.ouinsuranceOrder.timeStartRent = r.baseInfor.timeStartRent;
                    vm.ouinsuranceOrder.timeFinishRent = r.baseInfor.timeFinishRent;
                    vm.ouinsuranceOrder.sumOdograph = r.baseInfor.sumOdograph;
                    vm.ouinsuranceOrder.rentTypeStr = r.baseInfor.rentTypevm.payeeListStr;
                    vm.ouinsuranceOrder.cityName = r.baseInfor.cityName;
                    vm.ouinsuranceOrder.depotName = r.baseInfor.carDepotName;
                    vm.ouinsuranceOrder.depotId = r.baseInfor.carDepotId;
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
                    vm.ouinsuranceOrder.carId = r.baseInfor.carId;
                    vm.ouinsuranceOrder.carNo = r.baseInfor.carNo;
                    vm.ouinsuranceOrder.vinNo = r.baseInfor.vinNo;
                    vm.ouinsuranceOrder.carBrandModelName = r.baseInfor.carBrandModelName;
                    vm.ouinsuranceOrder.customerName = r.baseInfor.customerName;
                    vm.ouinsuranceOrder.carStatus = r.baseInfor.carStatus;
                    vm.ouinsuranceOrder.carStatusStr = r.baseInfor.carStatusStr;
                    vm.ouinsuranceOrder.carOrderNo = r.baseInfor.carOrderNo;
                    vm.ouinsuranceOrder.belongCompanyName = r.baseInfor.belongCompanyName;
                    vm.ouinsuranceOrder.timeStartRent = r.baseInfor.timeStartRent;
                    vm.ouinsuranceOrder.timeFinishRent = r.baseInfor.timeFinishRent;
                    vm.ouinsuranceOrder.sumOdograph = r.baseInfor.sumOdograph;
                    vm.ouinsuranceOrder.rentTypeStr = r.baseInfor.rentTypeStr;
                    vm.ouinsuranceOrder.cityName = r.baseInfor.cityName;
                    vm.ouinsuranceOrder.depotName = r.baseInfor.carDepotName;
                    vm.ouinsuranceOrder.depotId = r.baseInfor.carDepotId;
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
            vm.ouinsuranceOrder.viewTag = vm.viewTag;
            vm.ouinsuranceOrder.instanceId = vm.processApproveForm.instanceId;
            var url = "outinsuranceorder/ouinsuranceorder/update";

            console.log('要提交的数据', vm.ouinsuranceOrder)

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.ouinsuranceOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        getOutinsuranceOrderInfor: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "outinsuranceorder/ouinsuranceorder/info/" + id,
                contentType: "application/json",
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        // 查询车辆对应客户列表
                        $.ajax({
                            type: "GET",
                            url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + r.outinsuranceOrderDetil.carId,
                            contentType: "application/json",
                            success: function (r) {
                                if (r.code == 0) {

                                    vm.payeeList = r.data;
                                    reloadPlan2()
                                } else {
                                    alert(r.msg);
                                }
                            }
                        });
                        vm.ouinsuranceOrder = Object.assign({}, vm.ouinsuranceOrder, r.outinsuranceOrderDetil);
                        vm.ouinsuranceOrder = Object.assign({}, vm.ouinsuranceOrder, { carNo: r.outinsuranceOrderDetil.carPlateNo });
                        vm.ouinsuranceOrder = Object.assign({}, vm.ouinsuranceOrder, { customerName: r.outinsuranceOrderDetil.customer });
                        uploadoutinsuranceorder.updateFile(r.outinsuranceOrderDetil.fileLst);
                        r.outinsuranceOrderDetil.relatedCostsList.map((res, index) => {
                            res.index = index
                        })
                        r.outinsuranceOrderDetil.insuranceCompensationList.map((res, index) => {
                            res.index = index
                        })

                        vm.dataliat2 = r.outinsuranceOrderDetil.relatedCostsList;
                        vm.dataliat1 = r.outinsuranceOrderDetil.insuranceCompensationList;
                        vm.num = r.outinsuranceOrderDetil.insuranceCompensationList.length
                        vm.num1 = r.outinsuranceOrderDetil.relatedCostsList.length
                        console.log(vm.num1, '2323423ojjfhhdh')
                        layui.table.reload('compulsoryInsurance1', {
                            data: vm.dataliat1
                        })
                        layui.table.reload('compulsoryInsurance2', {
                            data: vm.dataliat2
                        })

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
        //撤回
        recall: function (event) {
            vm.boxTitle = '审核撤回';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == '') {
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('recall', 3);
            });
        },
    }
});


function isRecall() {
    return vm && (vm.instanceStatus == 1 || vm.instanceStatus == 6) && vm.isApply && vm.viewTag === 'applyDetail';
}
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

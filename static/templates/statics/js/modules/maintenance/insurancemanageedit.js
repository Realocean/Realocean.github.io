$(function () {
    // vm.detail(window.localStorage.getItem("jqxId"),window.localStorage.getItem("syxId"));
    var policyApplyNo = window.localStorage.getItem("policyApplyNo");

    vm.reloadSourceTable(policyApplyNo);
    vm.getInsuranceAmountStatus();
    vm.getPayObjectData();
    var cols;
    if (vm.viewTag === 'edit' || vm.viewTag === 'reedit') {
        cols = [[
            { title: '操作', templet: '#barTpl', fixed: "left", align: "center" },
            { field: 'commercialInsuranceName', title: '商业险种' },
            { field: 'amountInsured', title: '保额/万元' },
            { field: 'insuranceExpenses', title: '保险费/元' }
        ]];
    } else {
        cols = [[
            { field: 'commercialInsuranceName', title: '商业险种' },
            { field: 'amountInsured', title: '保额/万元' },
            { field: 'insuranceExpenses', title: '保险费/元' }
        ]];
    }
    layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        minWidth: 150,
        cols: cols,
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('div[lay-id="insuranceTypeGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
        }
    });
    // 交强险费用表单
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.dataliat,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payableTime'
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    // sid="${d.id}" 去掉了
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'remark', title: '备注', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark'
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="isGenerateBill"]>div>input').each(function () {
                if(this.attributes.sid) {
                    var serializeId = this.attributes.sid.value;

                    console.log('attributes==>', this.attributes)

                    var data = vm.dataliat.filter(function (value) {
                        return value.id == serializeId;
                    })[0];
                    var value = 0;
                    console.log('dataliat', vm.dataliat)
                    console.log('data', data)
                    console.log('serializeId', serializeId)
                    if (data != null) {
                        value = data.isGenerateBill;
                    }
                    $(this).prop('checked', 1 == value);
                    // $(this).val(value);
                }
            });
            layui.form.render();


        }
    });
    // 承运险费用表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance1",
        elem: '#compulsoryInsurance1',
        minWidth: 150,
        data: vm.dataliat1,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payableTime'
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch22${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest22' lay-skin='switch' lay-filter='switchTest22' title='是|否'>`
                }
            },
            {
                field: 'remark', title: '备注', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark'
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="isGenerateBill"]>div>input').each(function () {
                if(this.attributes.sid){
                    var serializeId = this.attributes.sid.value;

                    console.log('attributes==>', this.attributes)

                    var data = vm.dataliat1.filter(function (value) {
                        return value.id == serializeId;
                    })[0];
                    var value = 0;
                    console.log('dataliat1', vm.dataliat1)
                    console.log('data', data)
                    console.log('serializeId', serializeId)
                    if (data != null) {
                        value = data.isGenerateBill;
                    }
                    $(this).prop('checked', 1==value);
                }

                // $(this).val(value);
            });
            layui.form.render();


        }
    });
    // 商业险费用表单
    gridTable3 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payableTime',
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch33${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest33' lay-skin='switch' lay-filter='switchTest33' title='是|否'>`
                }
            },
            {
                field: 'remark', title: '备注', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark'
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="isGenerateBill"]>div>input').each(function () {
                if(this.attributes.sid) {
                    var serializeId = this.attributes.sid.value;

                    console.log('attributes==>', this.attributes)

                    var data = vm.dataliat2.filter(function (value) {
                        return value.id == serializeId;
                    })[0];
                    var value = 0;
                    console.log('dataliat2', vm.dataliat2)
                    console.log('data', data)
                    console.log('serializeId', serializeId)
                    if (data != null) {
                        value = data.isGenerateBill;
                    }
                    $(this).prop('checked', 1 == value);
                    // $(this).val(value);
                }
            });
            layui.form.render();


        }
    });


    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;

        form.verify({
            compulsoryAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == '') {
                    return '';
                } else {
                    if (!reg.test(value)) {
                        return '交强险金额输入格式不正确，请确认!';
                    }
                }
            },
            /*compulsoryCompanyIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险保险公司不能为空';
                }
            },
            compulsoryNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险保单号不能为空';
                }
            },
            compulsoryStartTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险开始时间不能为空';
                }
            },
            compulsoryEndTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险结束时间不能为空';
                }
            },
            compulsoryAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == "" || value == null) {
                    return '交强险费用不能为空';
                }
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            },
            commercialCompanyIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险保险公司不能为空';
                }
            },
            commercialNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险保单号不能为空';
                }
            },
            commercialStartTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险开始时间不能为空';
                }
            },
            commercialEndTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险结束时间不能为空';
                }
            },
            commercialAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == "" || value == null) {
                    return '商业险费用不能为空';
                }
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            },*/

            /* insuranceTypeNoVerify: function (value) {
                 if (value == "" || value == null) {
                     return '商业险种不能为空';
                 }
             },*/
        });

        //交强险保险公司
        form.on('select(compulsoryCompanyId)', function (data) {
            vm.insuranceManage.compulsoryCompanyId = data.value;
            vm.insuranceManage.compulsoryInsurancePayId = data.value;
            vm.insuranceManage.compulsoryInsurancePayName = data.elem[data.elem.selectedIndex].text;
        });
        //承运险保险公司
        form.on('select(carrierCompanyId)', function (data) {
            vm.insuranceManage.carrierCompanyId = data.value;
            vm.insuranceManage.carrierInsurancePayId = data.value;
            vm.insuranceManage.carrierInsurancePayName = data.elem[data.elem.selectedIndex].text;
        });
        //商业保险公司
        form.on('select(commercialCompanyId)', function (data) {
            vm.insuranceManage.commercialCompanyId = data.value;
            vm.insuranceManage.commercialInsurancePayId = data.value;
            vm.insuranceManage.commercialInsurancePayName = data.elem[data.elem.selectedIndex].text;

        });
        //商业险种
        form.on('select(selectInsuranceTypeNo)', function (data) {
            vm.insuranceManage.insuranceTypeNo = data.value;
        });

        // // 交强险付款对象
        // form.on('select(compulsoryInsurancePayId)', function (data) {
        //     vm.insuranceManage.compulsoryInsurancePayId = data.value;
        //     // 获取名称
        //     $.ajax({
        //         type: "POST",
        //         url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code=" + data.value,
        //         contentType: "application/json",
        //         data: null,
        //         success: function (r) {
        //             if (r.sysDictEntity != null) {
        //                 vm.insuranceManage.compulsoryInsurancePayName = r.sysDictEntity.value;
        //             } else {
        //                 vm.insuranceManage.compulsoryInsurancePayName = '';
        //             }
        //         }
        //     });
        // });
        // // 承运险付款对象
        // form.on('select(carrierInsurancePayId)', function (data) {
        //     vm.insuranceManage.carrierInsurancePayId = data.value;
        //     // 获取名称
        //     $.ajax({
        //         type: "POST",
        //         url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code=" + data.value,
        //         contentType: "application/json",
        //         data: null,
        //         success: function (r) {
        //             if (r.sysDictEntity != null) {
        //                 vm.insuranceManage.carrierInsurancePayName = r.sysDictEntity.value;
        //             } else {
        //                 vm.insuranceManage.carrierInsurancePayName = '';
        //             }
        //         }
        //     });
        // });
        // // 商业险付款对象
        // form.on('select(commercialInsurancePayId)', function (data) {
        //     vm.insuranceManage.commercialInsurancePayId = data.value;
        //     // 获取名称
        //     $.ajax({
        //         type: "POST",
        //         url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code=" + data.value,
        //         contentType: "application/json",
        //         data: null,
        //         success: function (r) {
        //             if (r.sysDictEntity != null) {
        //                 vm.insuranceManage.commercialInsurancePayName = r.sysDictEntity.value;
        //             } else {
        //                 vm.insuranceManage.commercialInsurancePayName = '';
        //             }
        //         }
        //     });
        // });
        Upload({
            elid: 'jqxImages',
            edit: true,
            fileLst: vm.jqxFileList,
            param: { 'path': 'jqx_images' },
            fidedesc: '交强险文件'
        }).initView();

        Upload({
            elid: 'syxImages',
            edit: true,
            fileLst: vm.syxxFileList,
            param: { 'path': 'syx_images' },
            fidedesc: '商业险文件'
        }).initView();

        Upload({
            elid: 'cyxImages',
            edit: true,
            fileLst: vm.cyxxFileList,
            param: { 'path': 'cyx_images' },
            fidedesc: '承运险文件'
        }).initView();

        approveUplod = Upload({
            elid: 'addFile2',
            edit: true,
            fileLst: vm.fileLst2,
            param: { 'path': 'processApprove' },
            fidedesc: '审批附件'
        });
        approveUplod.initView();
        BpmChart({ instanceId: vm.instanceId }).initView();
        form.render();
    });

    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //交强险开始结束时间
        var compulsoryStartTime = laydate.render({
            elem: '#compulsoryStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStTime = value;
                vm.insuranceManage.compulsoryStartTime = vm.insuranceManage.compulsoryStTime;
                var month = date.month - 1;
                compulsoryEndTime.config.min = date;
                compulsoryEndTime.config.min.month = month;
            }
        });
        //交强险结束时间
        var compulsoryEndTime = laydate.render({
            elem: '#compulsoryEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryEnTime = value;
                vm.insuranceManage.compulsoryEndTime = vm.insuranceManage.compulsoryEnTime;
                var month = date.month - 1;
                compulsoryStartTime.config.max = date;
                compulsoryStartTime.config.max.month = month;
            }
        });
        //承运险开始结束时间
        var carrierStartTime = laydate.render({
            elem: '#carrierStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.carrierStTime = value;
                vm.insuranceManage.carrierStartTime = vm.insuranceManage.carrierStTime;
                var month = date.month - 1;
                carrierEndTime.config.min = date;
                carrierEndTime.config.min.month = month;
            }
        });
        //承运险结束时间
        var carrierEndTime = laydate.render({
            elem: '#carrierEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.carrierEnTime = value;
                vm.insuranceManage.carrierEndTime = vm.insuranceManage.carrierEnTime;
                var month = date.month - 1;
                carrierStartTime.config.max = date;
                carrierStartTime.config.max.month = month;
            }
        });
        //商业险开始时间
        var commercialStartTime = laydate.render({
            elem: '#commercialStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialStTime = value;
                vm.insuranceManage.commercialStartTime = vm.insuranceManage.commercialStTime;
                var month = date.month - 1;
                commercialEndTime.config.min = date;
                commercialEndTime.config.min.month = month;
            }
        });

        //商业险结束时间
        var commercialEndTime = laydate.render({
            elem: '#commercialEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialEnTime = value;
                vm.insuranceManage.commercialEndTime = vm.insuranceManage.commercialEnTime;
                var month = date.month - 1;
                commercialStartTime.config.max = date;
                commercialStartTime.config.max.month = month;
            }
        });
        /*laydate.render({
            elem: '#commercialEndTime',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialEnTime = value;
            }
        });*/
    });


    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
    layui.table.on('tool(insuranceTypeGrid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.insuranceTypeUpdate(data);
        } else if (layEvent === 'del') {
            vm.insuranceTypeDel(data);
        }
    });
    layui.table.on('tool(test)', function (obj) {//test为table标签中lay-filter的值
        var data = obj.data;
        if (obj.event === 'del') {
            vm.dataliat.forEach(function (value) {
                if (value.index === data.index) {
                    value.isGenerateBill = 0
                    value.payableTime = ''
                    value.payableAmount = ''
                    value.remark = ''
                    value.feeName = '交强险费用'
                    value.type = 1
                    value.index = data.index
                    reloadPlan()
                }
            });

        } else if (obj.event === 'payableAmount' || obj.event === 'isGenerateBill') {
            tableEditOninputNumInteger(data);
        } else if (obj.event === 'payableTime') {
            var txt = '';
            if ((/\d+/).test(data.payableTime)) {
                txt = isEmpty(dateFormatYMD(data.payableTime));
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
                    // data.date = new Date(value).getTime();
                    data.payableTime = value1
                    // obj.update(data)
                    vm.dataliat.forEach(function (value) {
                        if (value.index === data.index) value.payableTime = value1
                    });
                    console.log(vm.dataliat, 1111111)
                    reloadPlan()
                }
            });
        }
    });
    layui.table.on('edit(test)', function (obj) {//test为table标签中lay-filter的值
        var data1 = obj.data;
        let list = vm.dataliat
        console.log('obj===>', obj)

        list.map((res, index) => {
            if (res.index == data1.index) {
                list[index].payableAmount = getDecimalNumber(data1.payableAmount)>2 ? Number(data1.payableAmount).toFixed(2):Number(data1.payableAmount)

                list[index].remark = data1.remark
            }

        })
        let allMoney = 0
        list.map((res) => {
            allMoney = Number(res.payableAmount) + Number(allMoney)
        })
        allMoney = allMoney.toFixed(2)
        if ('payableAmount'==obj.field && allMoney != Number(vm.insuranceManage.compulsoryAmount)) {
            layer.alert('填入金额的总和不等于总金额，请重新填写', {
                icon: 5,
                title: "提示"
            });
        }

        layui.table.reload('compulsoryInsurance', {
            data: vm.dataliat
        });
        console.log(typeof vm.insuranceManage.compulsoryAmount, vm.insuranceManage.compulsoryAmount, 33333333333)
        console.log(typeof allMoney, allMoney, 33333333333)
    });
    layui.form.on('switch(switchTest11)', function (obj) {
        console.log('vm.dataliat==>', vm.dataliat)
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        let data2 = obj.elem.attributes.onlyname.value
        if (a == 'true') {
            let list = vm.dataliat
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 1
                }
            })
        } else {
            let list = vm.dataliat
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 0
                }
            })
        }

        console.log('vm.dataliat==变化完>', vm.dataliat)
    });
    layui.form.on('switch(switchTest22)', function (obj) {
        console.log('vm.dataliat22==>', vm.dataliat1)
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        console.log('a33===>', a)
        let data2 = obj.elem.attributes.onlyname.value
        if (a == 'true') {
            let list = vm.dataliat1
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 1
                }
            })
        } else {
            let list = vm.dataliat1
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 0
                }
            })
        }

        console.log('vm.dataliat22==变化完>', vm.dataliat1)
    });
    layui.form.on('switch(switchTest33)', function (obj) {
        console.log('vm.dataliat33==>', vm.dataliat2)

        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        console.log('a33===>', a)
        let data2 = obj.elem.attributes.onlyname.value
        if (a == 'true') {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 1
                }
            })
        } else {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 0
                }
            })
        }

        console.log('vm.dataliat33==变化完>', vm.dataliat2)
    });
    layui.table.on('tool(test1)', function (obj) {//test为table标签中lay-filter的值
        var data = obj.data;
        if (obj.event === 'del') {
            vm.dataliat1.forEach(function (value) {
                if (value.index === data.index) {
                    value.isGenerateBill = 0
                    value.payableTime = ''
                    value.payableAmount = ''
                    value.remark = ''
                    value.feeName = '承运险费用'
                    value.type = 3
                    value.index = data.index
                    reloadPlan1()
                }
            });

        } else if (obj.event === 'payableAmount' || obj.event === 'isGenerateBill') {
            tableEditOninputNumInteger(data);
        } else if (obj.event === 'payableTime') {
            var txt = '';
            if ((/\d+/).test(data.payableTime)) {
                txt = isEmpty(dateFormatYMD(data.payableTime));
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
                    // data.date = new Date(value).getTime();
                    console.log(vm.dataliat1, 22222222)
                    data.payableTime = value1
                    // obj.update(data)
                    vm.dataliat1.forEach(function (value) {
                        if (value.index === data.index) value.payableTime = value1
                    });
                    reloadPlan1()
                }
            });
        }
    });
    layui.table.on('edit(test1)', function (obj) {//test为table标签中lay-filter的值
        var data1 = obj.data;
        let list = vm.dataliat1
        console.log(data1)
        list.map((res, index) => {
            if (res.index == data1.index) {
                list[index].payableAmount = getDecimalNumber(data1.payableAmount)>2 ? Number(data1.payableAmount).toFixed(2):Number(data1.payableAmount)

                list[index].remark = data1.remark
            }
        })
        let allMoney = 0
        list.map((res) => {
            allMoney = Number(res.payableAmount) + Number(allMoney)
        })
        allMoney = allMoney.toFixed(2)
        if ('payableAmount'==obj.field && allMoney != Number(vm.insuranceManage.carrierAmount)) {
            layer.alert('填入金额的总和不等于总金额，请重新填写', {
                icon: 5,
                title: "提示"
            });
        }
        layui.table.reload('compulsoryInsurance1', {
            data: vm.dataliat1
        });
        console.log(typeof vm.insuranceManage.carrierAmount, vm.insuranceManage.carrierAmount, 33333333333)
        console.log(typeof allMoney, allMoney, 33333333333)
        console.log(list, 22222222)
    });
    layui.table.on('tool(test2)', function (obj) {//test为table标签中lay-filter的值
        var data = obj.data;
        if (obj.event === 'del') {
            vm.dataliat2.forEach(function (value) {
                if (value.index === data.index) {
                    value.isGenerateBill = 0
                    value.payableTime = ''
                    value.payableAmount = ''
                    value.remark = ''
                    value.feeName = '商业险费用'
                    value.type = 2
                    value.index = data.index
                    reloadPlan2()
                }
            });

        } else if (obj.event === 'payableAmount' || obj.event === 'isGenerateBill') {
            tableEditOninputNumInteger(data);
        } else if (obj.event === 'payableTime') {
            var txt = '';
            if ((/\d+/).test(data.payableTime)) {
                txt = isEmpty(dateFormatYMD(data.payableTime));
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
                    // data.date = new Date(value).getTime();
                    data.payableTime = value1
                    // obj.update(data)
                    console.log(vm.dataliat2, 3333333)
                    vm.dataliat2.forEach(function (value) {
                        if (value.index === data.index) value.payableTime = value1
                    });
                    reloadPlan2()
                }
            });
        }
    });
    layui.table.on('edit(test2)', function (obj) {//test为table标签中lay-filter的值
        var data1 = obj.data;
        let list = vm.dataliat2
        console.log('data1===>',data1)
        list.map((res, index) => {
            if (res.index == data1.index) {
                list[index].payableAmount = getDecimalNumber(data1.payableAmount)>2 ? Number(data1.payableAmount).toFixed(2):Number(data1.payableAmount)

                list[index].remark = data1.remark
            }
        })
        let allMoney = 0
        list.map((res) => {
            allMoney = Number(res.payableAmount) + Number(allMoney)
        })
        allMoney = allMoney.toFixed(2)
        if ('payableAmount'==obj.field && allMoney != Number(vm.insuranceManage.commercialAmount)) {
            layer.alert('填入金额的总和不等于总金额，请重新填写', {
                icon: 5,
                title: "提示"
            });
        }
        layui.table.reload('compulsoryInsurance2', {
            data: vm.dataliat2
        });
        console.log(allMoney, '=allMoney====')
        console.log(vm.dataliat2, '=dataliat2====')
        console.log(vm.insuranceManage.commercialAmount, 999999999)
    });

});

var approveUplod;
var vm = new Vue({
    el: '#rrapp',
    data: {
        //交强险保险公司下拉列表数据源
        compulsoryInsuranceList: [],
        //商业险保险公司下拉列表数据源
        commercialInsuranceList: [],
        // 交强险付款对象数据源
        compulsoryInsurancePay: [],
        // 商业险付款对象数据源
        commercialInsurancePay: [],
        //险种集合
        insuranceTypeList: [],
        //保险单数据源
        insuranceManage: {},
        //商业险种列表数据源
        commercialInsuranceTableList: [],
        jqxFileList: [],
        syxxFileList: [],
        cyxxFileList: [],
        fileLstId: '0',
        boxShow: false,
        boxInputShow: false,
        fileLst2: [],
        fileLstId2: '0',
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        viewTag: 'edit',
        viewTag1: 'edit',
        recallNodeName: null,
        instanceStatus: null,
        bpmChartDtoList: [],
        instanceId: null,
        nodeType: null,
        processApproveForm: {},
        dataliat: [],
        dataliat1: [],
        dataliat2: [],
        timeList: [],
        byStagesStatus: true,
        byStages: null, // 交强险分期数
        byStagesStatus1: true,
        byStages1: null, // 商业险分期数
        money1: null,
        money2: null,
        money3: null,
        byStagesStatus2: true,
        byStages2: null, // 商业险分期数
        synum:''
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        if (param) {
            _this.instanceId = param.instanceId;
            _this.recallNodeName = param.recallName;
            _this.viewTag = param.viewTag + '';
            _this.viewTag1 = param.viewTag + '';
            _this.instanceStatus = param.instanceStatus;
            _this.processApproveForm = param;

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
        //初始化加载保险公司下拉列表
        $.get(baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList", function (r) {
            //交强险
            _this.compulsoryInsuranceList = r.compulsoryInsuranceList;
            //商业险
            _this.commercialInsuranceList = r.commercialInsuranceList;
        });
        //获取险种类型
        $.get(baseURL + "sys/dict/getInfoByType/" + "insuranceType", function (r) {
            //险种集合
            _this.insuranceTypeList = r.dict;
        });
        // 初始化加载商业险种数据
        var policyApplyNo = window.localStorage.getItem("policyApplyNo");
        $.get(baseURL + "maintenance/insurancemanage/getCommercialInsuranceList", { "policyApplyNo": policyApplyNo }, function (r) {
            //商业险
            _this.commercialInsuranceTableList = r.commercialInsuranceTableList;
        });

        $.ajax(baseURL + "sys/dict/getInfoByType/" + "insurancePaymentTarget", function (r) {
            _this.compulsoryInsurancePay = r.dict;
            _this.commercialInsurancePay = r.dict;
        });
        _this.viewTag = 'edit';
        var editType = window.localStorage.getItem("editType");
        if (editType == null || editType == '' || editType == undefined) {
            editType = "insuranceBj";
        }
        $.ajax({
            type: "POST",
            async: false,
            url: baseURL + "maintenance/insurancemanage/info",
            data: {
                jqxId: isEmptyReturnNull(window.localStorage.getItem("jqxId")),
                syxId: isEmptyReturnNull(window.localStorage.getItem("syxId")),
                type: editType
            },
            success: function (r) {
                if (r.code === 0) {
                    _this.insuranceManage = r.insuranceManage;
                    _this.jqxFileList = r.insuranceManage.jqxFileList;
                    _this.syxxFileList = r.insuranceManage.syxxFileList;
                    _this.cyxxFileList = r.insuranceManage.cyxxFileList;
                    _this.dataliat = r.insuranceManage.jqxFeePeriodsList && r.insuranceManage.jqxFeePeriodsList.map((item, index)=>{
                        item.payableAmount = Number(item.payableAmount)
                        item.index = index+1
                        return item
                    });

                    console.log('_this.dataliat', _this.dataliat)

                    _this.dataliat2 = r.insuranceManage.syxFeePeriodsList && r.insuranceManage.syxFeePeriodsList.map((item, index)=>{
                        item.payableAmount = Number(item.payableAmount)
                        item.index = index+1
                        return item
                    });

                    // if(r.insuranceManage.syxFeePeriodsList && r.insuranceManage.syxFeePeriodsList.length>0){
                    //     vm.byStagesChange2({
                    //         target:{
                    //             value:r.insuranceManage.syxFeePeriodsList.length
                    //         }
                    //     })
                    // }


                    console.log('_this.dataliat2', _this.dataliat2)

                    _this.dataliat1 = r.insuranceManage.cyxFeePeriodsList && r.insuranceManage.cyxFeePeriodsList.map((item, index)=>{
                        item.payableAmount = Number(item.payableAmount)
                        item.index = index+1
                        return item
                    });

                    console.log('_this.dataliat1', _this.dataliat1)

                    _this.byStages = r.insuranceManage.compulsoryFeePeriods;
                    _this.byStages2 = r.insuranceManage.commercialFeePeriods;
                    _this.byStages1 = r.insuranceManage.carrierFeePeriods;

                    _this.synum = _this.byStages2

                    console.log(r.insuranceManage, 222222222)
                    reloadPlan()
                    reloadPlan1()
                    reloadPlan2()

                } else {
                    alert(r.msg);
                }
            }
        });
        $.ajaxSettings.async = true;

    },
    computed: {
        brandNameAndModelName: {
            get: function () {
                if (this.insuranceManage.brandName != null && this.insuranceManage.modelName != null) {
                    return this.insuranceManage.brandName + "/" + this.insuranceManage.modelName;
                } else if (this.insuranceManage.brandName != null && this.insuranceManage.modelName == null) {
                    return this.insuranceManage.brandName
                } else if (this.insuranceManage.brandName == null && this.insuranceManage.modelName != null) {
                    return this.insuranceManage.modelName
                } else {
                    return "--";
                }
            }

        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        //保养费用期数变化刷新
        refreshTable(){
            let num = Number(this.byStages);

            if(num && num>=1){
                let allmoney = this.insuranceManage.compulsoryAmount;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                // console.log('aaa222', vm.stageDatalist)
                if(vm.dataliat.length === num){

                    vm.dataliat.forEach((item,i)=>{
                        item.payableAmount = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    // console.log('aaa111', vm.stageDatalist)
                }else {
                    this.dataliat = []
                    // if (allmoney) {
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '交强险费用',
                            payableAmount: someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null,
                            payableTime: '',
                            isGenerateBill: 0,
                            type: 1,
                            remark: "",
                        }
                        vm.dataliat.push(obj)
                        // layui.table.reload('compulsoryInsurance', {
                        //     data: vm.stageDatalist
                        // });
                    }
                    // }

                }
                layui.table.reload('compulsoryInsurance', {
                    data: vm.dataliat
                });
            }else{
                this.dataliat = []
                layui.table.reload('compulsoryInsurance', {
                    data: vm.dataliat
                });
            }
        },
        //保养费用期数变化刷新
        refreshTable1(){
            let num = Number(this.byStages1);

            if(num && num>=1){
                let allmoney = this.insuranceManage.carrierAmount;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                // console.log('aaa222', vm.stageDatalist)
                if(vm.dataliat1.length === num){

                    vm.dataliat1.forEach((item,i)=>{
                        item.payableAmount = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    // console.log('aaa111', vm.stageDatalist)
                }else {
                    this.dataliat1 = []
                    // if (allmoney) {
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '承运险费用',
                            payableAmount: someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null,
                            payableTime: '',
                            isGenerateBill: 0,
                            type: 3,
                            remark: "",
                        }
                        vm.dataliat1.push(obj)
                        // layui.table.reload('compulsoryInsurance', {
                        //     data: vm.stageDatalist
                        // });
                    }
                    // }

                }
                layui.table.reload('compulsoryInsurance1', {
                    data: vm.dataliat1
                });
            }else{
                this.dataliat1 = []
                layui.table.reload('compulsoryInsurance1', {
                    data: vm.dataliat1
                });
            }
        },
        //保养费用期数变化刷新
        refreshTable2(){
            let num = Number(this.byStages2);

            if(num && num>=1){
                let allmoney = this.insuranceManage.commercialAmount;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                // console.log('aaa222', vm.stageDatalist)
                if(vm.dataliat2.length === num){

                    vm.dataliat2.forEach((item,i)=>{
                        item.payableAmount = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    // console.log('aaa111', vm.stageDatalist)
                }else {
                    this.dataliat2 = []
                    // if (allmoney) {
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '商业险费用',
                            payableAmount: someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null,
                            payableTime: '',
                            isGenerateBill: 0,
                            type: 2,
                            remark: "",
                        }
                        vm.dataliat2.push(obj)
                        // layui.table.reload('compulsoryInsurance', {
                        //     data: vm.stageDatalist
                        // });
                    }
                    // }

                }
                layui.table.reload('compulsoryInsurance2', {
                    data: vm.dataliat2
                });
            }else{
                this.dataliat2 = []
                layui.table.reload('compulsoryInsurance2', {
                    data: vm.dataliat2
                });
            }
        },


        // 费用变化-交强险
        compulsoryAmountChange(e) {
            console.log('compulsoryAmountChange', e)
            this.refreshTable();

            // this.byStages = null
            // layui.table.reload('compulsoryInsurance', {
            //     data: []
            // });
        },
        // 费用变化-承运险
        compulsoryAmountChange1(e) {
            this.refreshTable1()
            // this.byStages1 = null
            // layui.table.reload('compulsoryInsurance1', {
            //     data: []
            // });
        },
        // 费用期数变化-交强险
        byStagesChange(e) {
            console.log('byStagesChange', e)
            this.refreshTable();


            // this.dataliat = []
            // console.log(e.target.value)
            // let num = e.target.value
            // let allmoney = this.insuranceManage.compulsoryAmount
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num)*100)/100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '交强险费用',
            //             payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
            //             payableTime: '',
            //             isGenerateBill: 0,
            //             type: 1,
            //             remark: "",
            //         }
            //         this.dataliat.push(obj)
            //         layui.table.reload('compulsoryInsurance', {
            //             data: vm.dataliat
            //         });
            //     }
            // } else {
            //
            // }
        },
        // 费用期数变化-承运险
        byStagesChange1(e) {
            this.refreshTable1()
            // this.dataliat1 = []
            // console.log(e.target.value)
            // let num = e.target.value
            // let allmoney = this.insuranceManage.carrierAmount
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num)*100)/100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '承运险费用',
            //             payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
            //             payableTime: '',
            //             isGenerateBill: 0,
            //             type: 3,
            //             remark: "",
            //         }
            //         this.dataliat1.push(obj)
            //         layui.table.reload('compulsoryInsurance1', {
            //             data: vm.dataliat1
            //         });
            //     }
            // } else {
            //
            // }
        },
        compulsoryAmountChange2(){
            this.refreshTable2()
        },
        // 费用期数变化-商业险
        byStagesChange2(e) {
            this.refreshTable2()
            // this.dataliat2 = []
            // console.log('byStagesChange2', e.target.value)
            // vm.synum = e.target.value
            // let num = e.target.value
            // let allmoney = this.insuranceManage.commercialAmount
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num)*100)/100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '商业险费用',
            //             payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
            //             payableTime: '',
            //             isGenerateBill: 0,
            //             type: 2,
            //             remark: "",
            //         }
            //         this.dataliat2.push(obj)
            //         layui.table.reload('compulsoryInsurance2', {
            //             data: vm.dataliat2
            //         });
            //     }
            // } else {
            //
            // }
        },


        byStagesChangeUpdateDel(number) {
            this.dataliat2 = []
            let num = number
            let allmoney = this.insuranceManage.commercialAmount
            let someMoney = ''
            if (allmoney) {
                if(allmoney > 0 ){
                    someMoney = Math.floor((allmoney / num)*100)/100
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '商业险费用',
                            payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
                            payableTime: '',
                            isGenerateBill: 0,
                            type: 2,
                            remark: "",
                        }
                        this.dataliat2.push(obj)
                        layui.table.reload('compulsoryInsurance2', {
                            data: vm.dataliat2
                        });
                    }
                }else{

                }
            } else {
                this.dataliat2 = []
                this.insuranceManage.commercialAmount = 0
                this.byStages2 = null
                vm.synum = this.byStages2
                layui.table.reload('compulsoryInsurance2', {
                    data: vm.dataliat2
                });
            }
        },


        requestAction: function (action, type) {
            PageLoading();

            vm.insuranceManage.jqxFeePeriodsList = vm.dataliat;
            vm.insuranceManage.syxFeePeriodsList = vm.dataliat2;
            vm.insuranceManage.cyxFeePeriodsList = vm.dataliat1;
            vm.insuranceManage.compulsoryFeePeriods = vm.byStages;
            vm.insuranceManage.commercialFeePeriods = vm.byStages2;
            vm.insuranceManage.carrierFeePeriods = vm.byStages1;

            vm.insuranceManage.commercialInsuranceRecordList = vm.commercialInsuranceTableList;
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            vm.insuranceManage.cyxxFileList = vm.cyxxFileList;
            vm.insuranceManage.viewTag = vm.viewTag;
            vm.insuranceManage.instanceId = vm.processApproveForm.instanceId;
            vm.processApproveForm.processOperationType = type;
            vm.processApproveForm.businessId = window.localStorage.getItem("policyApplyNo");
            vm.processApproveForm.approveContent = vm.boxTxt;
            vm.processApproveForm.approveFileList = vm.fileLst2;
            vm.processApproveForm.insuranceManage = vm.insuranceManage;
            var closeBox = false;
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/" + action,
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
            approveUplod.updateFile();
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn: ['取消', '确定'],
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function () {
                    vm.boxShow = false;
                    // vm.fileLst2=[];
                    layer.close(index);
                },
                btn1: function (index, layero) {
                    vm.boxShow = false;
                    // vm.fileLst2=[];
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
            vm.saveOrUpdate();
        },
        // getPayObjectData() {
        //     // 获取交强险、商业险付款对象
        //     $.ajax({
        //         type: "POST",
        //         url: baseURL + "sys/dict/getInfoByType/" + "insurancePaymentTarget",
        //         contentType: "application/json",
        //         data: null,
        //         success: function (r) {
        //             vm.compulsoryInsurancePay = r.dict;
        //             vm.commercialInsurancePay = r.dict;
        //         }
        //     });
        // },
        getPayObjectData() {
            // 获取交强险、商业险付款对象
            $.ajax({
                type: "POST",
                url: baseURL + "system/tsysinsurancecompany/paymentObjectList",
                contentType: "application/json",
                data: null,
                success: function (r) {
                    vm.compulsoryInsurancePay = r.paymentCompanyList;
                    vm.commercialInsurancePay = r.paymentCompanyList;
                }
            });
        },

        //保存修改方法
        saveOrUpdate: function (event) {
            if (vm.insuranceManage.compulsoryStartTime != null && vm.insuranceManage.compulsoryStartTime != '') {
                if (vm.insuranceManage.compulsoryEndTime == null || vm.insuranceManage.compulsoryEndTime == '') {
                    alert('请填写交强险结束时间！');
                    return false;
                }
            }
            if (vm.insuranceManage.compulsoryEndTime != null && vm.insuranceManage.compulsoryEndTime != '') {
                if (vm.insuranceManage.compulsoryStartTime == null || vm.insuranceManage.compulsoryStartTime == '') {
                    alert('请填写交强险开始时间！');
                    return false;
                }
            }

            if (vm.insuranceManage.commercialStartTime != null && vm.insuranceManage.commercialStartTime != '') {
                if (vm.insuranceManage.commercialEndTime == null || vm.insuranceManage.commercialEndTime == '') {
                    alert('请填写商业险结束时间！');
                    return false;
                }
            }
            if (vm.insuranceManage.commercialEndTime != null && vm.insuranceManage.commercialEndTime != '') {
                if (vm.insuranceManage.commercialStartTime == null || vm.insuranceManage.commercialStartTime == '') {
                    alert('请填写商业险开始时间！');
                    return false;
                }
            }

            if (vm.insuranceManage.carrierStartTime != null && vm.insuranceManage.carrierStartTime != '') {
                if (vm.insuranceManage.carrierEndTime == null || vm.insuranceManage.carrierEndTime == '') {
                    alert('请填写承运险结束时间！');
                    return false;
                }
            }
            if (vm.insuranceManage.carrierEndTime != null && vm.insuranceManage.carrierEndTime != '') {
                if (vm.insuranceManage.carrierStartTime == null || vm.insuranceManage.carrierStartTime == '') {
                    alert('请填写承运险开始时间！');
                    return false;
                }
            }

            if(vm.dataliat && vm.dataliat.length>0){

                let compulsoryAll = vm.dataliat.reduce((pre, item)=>{
                    return pre+=Number(item.payableAmount)
                }, 0).toFixed(2);

                console.log('vm.dataliat==>', vm.dataliat)
                console.log('交强险==>', Number(compulsoryAll), Number(vm.insuranceManage.compulsoryAmount))

                if(Number(compulsoryAll) != Number(vm.insuranceManage.compulsoryAmount)){
                    alert('交强险填入的应付金额总额需等于总费用！');
                    return false
                }


                for (const dataliatElement of vm.dataliat) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择交强险应付日期');
                        return false;
                    }
                }
            }

            if(vm.dataliat1 && vm.dataliat1.length>0){

                let carrierAll = vm.dataliat1.reduce((pre, item)=>{
                    return pre+=Number(item.payableAmount)
                }, 0).toFixed(2);

                console.log('交强险==>', Number(carrierAll), Number(vm.insuranceManage.carrierAmount))

                if(Number(carrierAll) !== Number(vm.insuranceManage.carrierAmount)){
                    alert('承运险填入的应付金额总额需等于总费用！');
                    return false
                }

                for (const dataliatElement of vm.dataliat1) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择承运险应付日期');
                        return false;
                    }
                }
            }

            if(vm.dataliat2 && vm.dataliat2.length>0){

                let commercialAll = vm.dataliat2.reduce((pre, item)=>{
                    return pre+=Number(item.payableAmount)
                }, 0).toFixed(2);
                console.log('111--->', vm.dataliat2)
                console.log('商业险===>', Number(commercialAll), Number(vm.insuranceManage.commercialAmount))
                if(Number(commercialAll) !== Number(vm.insuranceManage.commercialAmount)){
                    alert('商业险填入的应付金额总额需等于总费用！');
                    return false
                }

                for (const dataliatElement of vm.dataliat2) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择商业险应付日期');
                        return false;
                    }
                }
            }

            //商业险种记录
            vm.insuranceManage.commercialInsuranceRecordList = vm.commercialInsuranceTableList;
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            vm.insuranceManage.cyxxFileList = vm.cyxxFileList;
            vm.insuranceManage.viewTag = vm.viewTag;
            vm.insuranceManage.instanceId = vm.processApproveForm.instanceId;

            vm.insuranceManage.jqxFeePeriodsList = vm.dataliat;
            vm.insuranceManage.syxFeePeriodsList = vm.dataliat2;
            vm.insuranceManage.cyxFeePeriodsList = vm.dataliat1;
            vm.insuranceManage.compulsoryFeePeriods = vm.byStages;
            vm.insuranceManage.commercialFeePeriods = vm.byStages2;
            vm.insuranceManage.carrierFeePeriods = vm.byStages1;

            // if(vm.commercialInsuranceTableList.length>0){
            //     if (vm.insuranceManage.commercialEndTime == null || vm.insuranceManage.commercialEndTime == ''
            //         ||  vm.insuranceManage.commercialStartTime == null || vm.insuranceManage.commercialStartTime == '') {
            //         alert('请完善商业险保险时间！');
            //         return false;
            //     }
            // }

            console.log("编辑提交保险数据", vm.insuranceManage)
            var url = vm.insuranceManage.insuranceManageId == null ? "maintenance/insurancemanage/save" : "maintenance/insurancemanage/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
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
        //通过险种编号获取险种名称
        getInsuranceTypeName: function (insuranceTypeNo) {
            $.ajax({
                async: false,
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode",
                dataType: "JSON",
                data: { "code": insuranceTypeNo, "type": "insuranceType" },
                success: function (r) {
                    if (r.sysDictEntity != null) {
                        var commercialInsuranceName = r.sysDictEntity.value;
                        window.localStorage.setItem("commercialInsuranceName", commercialInsuranceName);
                    }
                }
            });
        },
        //商业险种添加
        addTo: function () {
            var vinNo = vm.insuranceManage.vinNo;
            var carNo = vm.insuranceManage.carNo;
            var carId = $("#carId").val();
            if ((carNo == null || carNo == "") && (vinNo == null || vinNo == "")) {
                alert("请先选择车牌号或者车架号");
                return;
            }

            var insuranceTypeNo = vm.insuranceManage.insuranceTypeNo;
            if (insuranceTypeNo == null || insuranceTypeNo == "") {
                alert("请先选择商业险种类型");
                return;
            } else {
                //通过险种编号查询险种名称
                vm.getInsuranceTypeName(insuranceTypeNo);
                window.localStorage.setItem("vinNo", vinNo);
                window.localStorage.setItem("carNo", carNo);
                window.localStorage.setItem("carId", carId);
                window.localStorage.setItem("insuranceTypeNo", insuranceTypeNo);

                var index = layer.open({
                    title: "商业险种编辑",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                    end: function () {
                        vm.byStagesChange2({
                            target:{
                                value:vm.synum
                            }
                        })
                        layer.close(index);
                    }
                });
            }
        },
        //商业险种修改方法
        insuranceTypeUpdate: function (data) {
            window.localStorage.setItem("commercialInsurance", data);
            var index = layer.open({
                title: "商业险种编辑",
                type: 2,
                area: ['80%', '60%'],
                content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(data);
                },
                end: function () {
                    layer.close(index);
                    if(vm.byStages2 != null && vm.byStages2>0 ){
                        console.log("打印期数",vm.byStages2,"金额:",vm.insuranceManage.commercialTotalAmount)
                        vm.byStagesChangeUpdateDel(vm.byStages2)
                    }
                }
            });

        },
        //商业险种删除方法
        insuranceTypeDel: function (data) {
            confirm('确定要删除选中的记录？', function () {
                var randomData = data.randomData;
                var parentData = vm.commercialInsuranceTableList;
                for (var i = parentData.length - 1; i >= 0; i--) {
                    if (parentData[i].randomData == randomData) {
                        parentData.splice(i, 1);
                    }
                }
                console.log(parentData)
                vm.reloadCommercialInsurance();
                alert('删除成功', function (index) {
                    // byStages2
                    if(vm.byStages2 != null ){
                        console.log("打印期数",vm.byStages2,"金额:",vm.insuranceManage.commercialTotalAmount)
                        vm.byStagesChangeUpdateDel(vm.byStages2)
                    }
                });

            });
        },
        //加载表格数据--子页面调用
        reloadCommercialInsurance: function () {

            list = vm.commercialInsuranceTableList;
            if (list.length > 0) {
                var array = new Array()
                for (var i = 0; i < list.length; i++) {
                    array.push(parseFloat(list[i].insuranceExpenses));
                }
                var commercialAmount = sum(array);
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                    contentType: "application/json",
                    data: null,
                    success: function (r) {
                        if (r.code === 0) {
                            vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                            console.log(vm.insuranceManage.insuranceAmountValue);
                            if (vm.insuranceManage.insuranceAmountValue == '2') {
                                vm.insuranceManage = Object.assign({}, vm.insuranceManage, { commercialAmount: commercialAmount });
                            }
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            } else {
                var commercialAmount = 0;
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                vm.insuranceManage.commercialAmount = commercialAmount;
            }

            layui.table.reload('insuranceTypeGrid', {
                data: vm.commercialInsuranceTableList
            });

            /* if(list==null||list.length==0){
                 layui.table.reload('insuranceTypeGrid', {
                     data: vm.commercialInsuranceTableList
                 });
             }else{
                 vm.commercialInsuranceTableList = list;
                 layui.table.reload('insuranceTypeGrid', {
                     data:  vm.commercialInsuranceTableList
                 });
             }*/

        },

        //表格数据重新加载方法
        reloadSourceTable: function (policyApplyNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
                dataType: "JSON",
                data: { "policyApplyNo": policyApplyNo },
                success: function (r) {
                    vm.commercialInsuranceTableList = r.commercialInsuranceTableList;
                    for (var i = 0; i < vm.commercialInsuranceTableList.length; i++) {
                        var randomData = Math.random().toString(36).slice(2);
                        vm.commercialInsuranceTableList[i].randomData = randomData;
                    }
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.commercialInsuranceTableList
                    });
                }
            });
        },

        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.tCarBasic, "deptId", treeNode.deptId);
            Vue.set(vm.tCarBasic, "deptName", treeNode.name);
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        cancel: function () {
            parent.layer.closeAll();
        },

        detail: function (jqxId, syxId) {
            var editType = window.localStorage.getItem("editType");
            if (editType == null || editType == '' || editType == undefined) {
                editType = "insuranceBj";
            }
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/info",
                data: {
                    jqxId: isEmptyReturnNull(jqxId),
                    syxId: isEmptyReturnNull(syxId),
                    type: editType
                },
                success: function (r) {
                    if (r.code === 0) {
                        vm.insuranceManage = r.insuranceManage;
                        vm.jqxFileList = vm.insuranceManage.jqxFileList;
                        vm.syxxFileList = vm.insuranceManage.syxxFileList;
                        vm.cyxxFileList = vm.insuranceManage.cyxxFileList;

                        vm.dataliat = vm.insuranceManage.jqxFeePeriodsList;
                        vm.dataliat2 = vm.insuranceManage.syxFeePeriodsList;
                        vm.dataliat1 = vm.insuranceManage.cyxFeePeriodsList;
                        vm.byStages = vm.insuranceManage.compulsoryFeePeriods;
                        vm.byStages2 = vm.insuranceManage.commercialFeePeriods;
                        vm.byStages1 = vm.insuranceManage.carrierFeePeriods;

                        vm.synum = vm.byStages2

                        console.log(vm.dataliat)
                        console.log(vm.dataliat1)
                        console.log(vm.dataliat)
                        reloadPlan()
                        reloadPlan1()
                        reloadPlan2()
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        // 获取商业险费用是否支持手动输入系统参数
        getInsuranceAmountStatus: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                contentType: "application/json",
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                        console.log(vm.insuranceManage.insuranceAmountValue);
                        if (vm.insuranceManage.insuranceAmountValue == '1') {
                            $("#commercialAmount").removeAttr("readonly");
                        } else {
                            $("#commercialAmount").attr("readonly", "readonly");
                        }
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

    }
})

//求和计算
function sum(arr) {
    var s = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        console.log(isValueNaN(arr[i]));
        if (isValueNaN(arr[i])) {
            arr[i] = 0;
        }
        s += arr[i];
    }
    return s.toFixed(2);
}

function isValueNaN(value) {
    return typeof value === 'number' && isNaN(value);
}

function reloadPlan() {
    if ($('div[lay-id="compulsoryInsurance"]').length > 0) {
        console.log(vm.dataliat, 455454545454)
        layui.table.reload('compulsoryInsurance', { data: vm.dataliat });
    }
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

function prescription(type,endDate) {
    console.log(this)
    var view = '<span '
    var context = '';
    if (!endDate) {
        switch (type^0) {
            case 1:{
                context = '未购买交强险';
                break;
            }
            case 2:{
                context = '未购买商业险';
                break;
            }
            case 3:{
                context = '未购买承运险';
                break;
            }
            default:{
                context = '--';
            }
        }
        view += ' style="color: red;font-size: 15px;">';
    } else {
        var now_cur = new Date();
        var now = new Date(now_cur.format("yyyy-MM-dd"));
        var end = new Date(new Date(endDate).format("yyyy-MM-dd"));
        var diff = end.getTime() - now.getTime();
        var days = Math.abs(diff) / (24 * 60 * 60 * 1000);
        if (diff < 0) {
            view += ' style="color: red;font-size: 15px;">';
            context += '失效/逾期';
        } else {
            view += ' style="color: green;font-size: 15px;">';
            context += '有效/剩余';
        }
        if (diff === 0) {
            var now_end = new Date(now_cur.format("yyyy-MM-dd") + ' 23:59:59');
            diff = now_end.getTime() - now_cur.getTime();
            var hour = Math.abs(diff) / (60 * 60 * 1000);
            context += Math.ceil(hour);
            context += '小时';
        } else {
            context += Math.ceil(days);
            context += '天';
        }
    }
    view += context;
    view += '</span>';
    setTimeout(function(){
        $('span').each(function (index, elem) {
            if (elem.textContent.indexOf(context) < 0) {

            } else {
                if (diff < 0) {
                    $(this).css('color', 'red');
                } else {
                    $(this).css('color', 'green');
                }
            }
        });
    }, 100);
    return context;
}

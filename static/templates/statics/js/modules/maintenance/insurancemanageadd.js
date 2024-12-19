$(function () {
    /***
     * 页面初始化根据车辆id赋值
     */
    if (parent.layui.larryElem != undefined) {
        console.log('接受参数', parent.layui.larryElem)
        var params = parent.layui.larryElem.boxParams;
        if(params != undefined && params != null){
            vm.getCarBasicInforByCarNo(params.carId);
        }
    }
    vm.getInsuranceAmountStatus();

    vm.getPayObjectData();
    gridTable = layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        minWidth: 150,
        cols: [[
            { title: '操作', templet: '#barTpl', fixed: "left", align: "center" },
            { field: 'commercialInsuranceName', title: '商业险种' },
            { field: 'amountInsured', title: '保额/万元' },
            { field: 'insuranceExpenses', title: '保险费/元' }
        ]],
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

    });
    // 承运险费用表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance1",
        elem: '#compulsoryInsurance1',
        minWidth: 150,
        data: vm.dataliat1,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center", width: 250 },
            {
                field: 'payableAmount', title: '应付金额/元', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount', width: 250
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payableTime', width: 250
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch12${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest12' lay-skin='switch' lay-filter='switchTest12' title='是|否'>`
                }, width: 250
            },
            {
                field: 'remark', title: '备注', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark', width: 250
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }, width: 250
            },
        ]],
        page: false,
        loading: false,
        limit: 500,

    });
    // 商业险费用表单
    gridTable3 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center", width: 250 },
            {
                field: 'payableAmount', title: '应付金额/元', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount', width: 250
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                event: 'payableTime', width: 250
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch13${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest13' lay-skin='switch' lay-filter='switchTest13' title='是|否'>`
                }, width: 250
            },
            {
                field: 'remark', title: '备注', align: "center", templet: function (d) { return isEmpty(d.remark); }, edit: 'text', event: 'remark', width: 250
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }, width: 250
            },
        ]],
        page: false,
        loading: false,
        limit: 500,

    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;

        form.verify({
            carNoVerify: function (value) {
                if ((vm.insuranceManage.carNo == "" || vm.insuranceManage.carNo == null) && (vm.insuranceManage.vinNo == "" || vm.insuranceManage.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
            vinNoVerify: function (value) {
                if ((vm.insuranceManage.carNo == "" || vm.insuranceManage.carNo == null) && (vm.insuranceManage.vinNo == "" || vm.insuranceManage.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
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

        // 交强险付款对象
        // form.on('select(compulsoryInsurancePayId)', function (data) {
        //     vm.insuranceManage.compulsoryInsurancePayId = data.value;
        //     // 获取名称
        //     $.ajax({
        //         type: "POST",
        //         url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code=" + data.value,
        //         contentType: "application/json",
        //         async: false,
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
        // 承运险付款对象
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
        // 商业险付款对象
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
        form.render();
    });


    layui.use('laydate', function () {
        var laydate = layui.laydate;

        //交强险开始结束时间
        var compulsoryStartTime = laydate.render({
            elem: '#compulsoryStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStartTime = value;
                var month = date.month - 1;
                compulsoryEndTime.config.min = date;
                compulsoryEndTime.config.min.month = month;
            }
        });
        //date = vm.insuranceManage.compulsoryStartTime;
        //交强险结束时间
        var compulsoryEndTime = laydate.render({
            elem: '#compulsoryEndTime',
            trigger: 'click',
            //range:true,
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryEndTime = value;
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
                vm.insuranceManage.carrierStartTime = value;
                var month = date.month - 1;
                carrierEndTime.config.min = date;
                carrierEndTime.config.min.month = month;
            }
        });
        //承运险结束时间
        var carrierEndTime = laydate.render({
            elem: '#carrierEndTime',
            trigger: 'click',
            //range:true,
            done: function (value, date, endDate) {
                vm.insuranceManage.carrierEndTime = value;
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
                vm.insuranceManage.commercialStartTime = value;
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
                vm.insuranceManage.commercialEndTime = value;
                var month = date.month - 1;
                commercialStartTime.config.max = date;
                commercialStartTime.config.max.month = month;
            }
        });
        //交强险应付日期
        var compulsoryPayment = laydate.render({
            elem: '#test1',
            trigger: 'click',
            done: function (value, date, endDate) {
                console.log(value)
                console.log(date)
                vm.timeList = value;
            }
        });
    });


    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
    layui.form.on('switch(switchTest)', function () {
        let a = $.trim($('#contractSwitch').is(":checked"));
        console.log(a, 2222222222222)
        if (a == 'true') {
            Vue.set(vm.box, "box1", true);
        } else {
            Vue.set(vm.box, "box1", false);
        }

    });
    layui.form.on('switch(switchTest1)', function (obj) {
        let a = $.trim($('#contractSwitch1').is(":checked"));
        console.log(a, 2222222222222)
        console.log(obj, 2222222222222)
        if (a == 'true') {
            Vue.set(vm.box, "box2", true);
        } else {
            Vue.set(vm.box, "box2", false);
        }

    });
    layui.form.on('switch(switchTest2)', function (obj) {
        let a = $.trim($('#contractSwitch2').is(":checked"));
        console.log(a, 2222222222222)
        if (a == 'true') {
            Vue.set(vm.box, "box3", true);
        } else {
            Vue.set(vm.box, "box3", false);
        }

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
            console.log('@@@', this.firstChild)
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

                    console.log(vm.dataliat, '0000000', value1);
                    reloadPlan()
                }
            });
        }
    });
    layui.table.on('edit(test)', function (obj) {//test为table标签中lay-filter的值
        var data1 = obj.data;
        let list = vm.dataliat
        console.log(data1)

        list.map((res, index) => {
            if (res.index == data1.index) {
                console.log('结果是', getDecimalNumber(data1.payableAmount))

                list[index].payableAmount = getDecimalNumber(data1.payableAmount)>2 ? Number(data1.payableAmount).toFixed(2):Number(data1.payableAmount)
                list[index].remark = data1.remark
            }

        })
        let allMoney = 0
        list.map((res) => {
            allMoney = Number(res.payableAmount) + Number(allMoney)
        })
        allMoney = allMoney.toFixed(2)
        if ('payableAmount'==obj.field && allMoney != vm.money1) {
            layer.alert('填入金额的总和不等于总金额，请重新填写', {
                icon: 5,
                title: "提示"
            });
        }

        layui.table.reload('compulsoryInsurance', {
            data: vm.dataliat
        });

        console.log(typeof vm.money1, 33333333333)
        console.log(typeof allMoney, 33333333333)
        console.log(list, 22222222)
    });
    layui.form.on('switch(switchTest11)', function (obj) {
        // let a = $.trim($('#contractSwitch11').is(":checked"));
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
    });
    layui.form.on('switch(switchTest12)', function (obj) {
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
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
    });
    layui.form.on('switch(switchTest13)', function (obj) {
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
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
            if ((/\d+/).test(data.date)) {
                txt = isEmpty(dateFormatYMD(data.date));
            } else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            console.log('@@@111', this.firstChild)
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
                    vm.dataliat1.forEach(function (value) {
                        if (value.index === data.index) value.payableTime = value1
                    });
                    console.log(vm.dataliat1, 1111111111, value1)
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

                // list[index].payableAmount = Number(data1.payableAmount)
                list[index].remark = data1.remark
            }
        })
        let allMoney = 0
        list.map((res) => {
            allMoney = Number(res.payableAmount) + Number(allMoney)
        })
        allMoney = allMoney.toFixed(2)
        if ('payableAmount'==obj.field && allMoney != vm.money2) {
            layer.alert('填入金额的总和不等于总金额，请重新填写', {
                icon: 5,
                title: "提示"
            });
        }
        layui.table.reload('compulsoryInsurance1', {
            data: vm.dataliat1
        });
        console.log(typeof vm.money1, vm.money2, 33333333333)
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

        } else if (obj.event === 'money' || obj.event === 'bill') {
            tableEditOninputNumInteger(data);
        } else if (obj.event === 'payableTime') {
            var txt = '';
            if ((/\d+/).test(data.date)) {
                txt = isEmpty(dateFormatYMD(data.date));
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
                    vm.dataliat2.forEach(function (value) {
                        if (value.index === data.index) value.payableTime = value1
                    });
                    console.log(vm.dataliat2, 222222222)
                    reloadPlan2()
                }
            });
        }
    });
    layui.table.on('edit(test2)', function (obj) {//test为table标签中lay-filter的值
        var data1 = obj.data;
        let list = vm.dataliat2
        console.log('obj', obj)
        console.log('vm.dataliat2', vm.dataliat2)
        console.log('vm.insuranceManage.commercialAmount', vm.insuranceManage.commercialAmount)
        list.map((res, index) => {
            if (res.index == data1.index) {
                list[index].payableAmount = getDecimalNumber(data1.payableAmount)>2 ? Number(data1.payableAmount).toFixed(2):Number(data1.payableAmount)

                // list[index].payableAmount = Number(data1.payableAmount)
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
        console.log('allMoney', allMoney)
    });


});

var vm = new Vue({
    el: '#rrapp',
    data: {
        box: {
            box1: false,
            box2: false,
            box3: true,
        },
        checked: true,
        insuranceTypeGridMS: false,
        //交强险保险公司下拉列表数据源
        compulsoryInsuranceList: [],
        //承运险保险公司下拉列表数据源
        carrierInsuranceList: [],
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
        carInforData: {},
        fileLstId: '0',
        bpmChartDtoList: [],
        openFlow: false,
        dataliat: [],
        dataliat1: [],
        dataliat2: [],
        timeList: [],
        byStagesStatus: true,
        byStages: null, // 交强险分期数
        byStagesStatus1: true,
        byStages1: null, // 承运险分期数
        money1: null,
        money2: null,
        money3: null,
        byStagesStatus2: true,
        byStages2: null, // 商业险分期数
        synum:''
    },
    created: function () {
        var _this = this;
        //初始化加载保险公司下拉列表
        $.ajaxSettings.async = false;
        //初始化加载保险公司下拉列表
        $.get(baseURL + "activity/bpmInitChart", { processKey: "carInsuranceApprove" }, function (r) {
            if (r.code == 0) {
                _this.bpmChartDtoList = r.bpmInitChart;
                _this.openFlow = r.openFlow;
            }
        });
        //初始化加载保险公司下拉列表
        $.get(baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList", function (r) {

            //交强险
            _this.compulsoryInsuranceList = r.compulsoryInsuranceList;
            //商业险
            _this.commercialInsuranceList = r.commercialInsuranceList;
            //承运险
            _this.carrierInsuranceList = r.compulsoryInsuranceList;
        });
        //获取险种类型
        $.get(baseURL + "sys/dict/getInfoByType/insuranceType", function (r) {
            //险种集合
            _this.insuranceTypeList = r.dict;
        });
        $.ajaxSettings.async = true;
        // document.getElementById('contractSwitch').setAttribute("checked", OFF)

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
        // 费用变化-交强险
        compulsoryAmountChange(e) {
            this.byStages = null
            this.money1 = Number(e.target.value)
            layui.table.reload('compulsoryInsurance', {
                data: []
            });
            let money = e.target.value

        },
        // 费用期数变化-交强险
        byStagesChange(e) {
            this.dataliat = []
            console.log(e.target.value)
            let num = e.target.value
            let allmoney = this.insuranceManage.compulsoryAmount
            let someMoney = ''
            if (allmoney) {
                someMoney = Math.floor((allmoney / num)*100)/100

                for (let i = 0; i < num; i++) {
                    let obj = {
                        index: i + 1,
                        feeName: '交强险费用',
                        payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
                        payableTime: '',
                        isGenerateBill: 0,
                        type: 1,
                        remark: "",
                    }
                    vm.dataliat.push(obj)
                    layui.table.reload('compulsoryInsurance', {
                        data: vm.dataliat
                    });

                    console.log('---------obj-->', obj)
                }


            } else {

            }
        },
        // 费用变化-承运险
        compulsoryAmountChange1(e) {
            this.byStages1 = null
            this.money2 = Number(e.target.value)
            layui.table.reload('compulsoryInsurance1', {
                data: []
            });
            let money = e.target.value
            if (money) {
                this.byStagesStatus1 = false
            } else {
                this.byStagesStatus1 = true
            }
        },
        // 费用期数变化-承运险
        byStagesChange1(e) {
            this.dataliat1 = []
            console.log(e.target.value)
            let num = e.target.value
            let allmoney = this.insuranceManage.carrierAmount
            let someMoney = ''
            if (allmoney) {
                someMoney = Math.floor((allmoney / num)*100)/100
                for (let i = 0; i < num; i++) {
                    let obj = {
                        index: i + 1,
                        feeName: '承运险费用',
                        payableAmount: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
                        payableTime: '',
                        isGenerateBill: 0,
                        type: 3,
                        remark: "",
                    }
                    vm.dataliat1.push(obj)
                    layui.table.reload('compulsoryInsurance1', {
                        data: vm.dataliat1
                    });
                }
            } else {

            }
        },
        // 费用变化-商业险
        compulsoryAmountChange2(e) {
            this.byStages2 = null
            this.money3 = Number(e.target.value)
            layui.table.reload('compulsoryInsurance2', {
                data: []
            });

        },
        // 费用期数变化-商业险
        byStagesChange2(e) {
            this.dataliat2 = []
            console.log(e.target.value)
            vm.synum = e.target.value
            let num = e.target.value
            let allmoney = this.insuranceManage.commercialAmount
            let someMoney = ''
            if (allmoney) {
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
                    vm.dataliat2.push(obj)
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                }
                console.log()
            } else {

            }
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
                this.insuranceManage.commercialAmount = null
                this.byStages2 = null
                layui.table.reload('compulsoryInsurance2', {
                    data: vm.dataliat2
                });
            }
        },


        confirmSup: function (data) {
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

        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('insurancemanage');
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
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('insurancemanage');
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
        //保存修改方法
        saveOrUpdate: function (event) {
            /* var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
             var compulsoryAmount = vm.insuranceManage.compulsoryAmount;
             if(!reg.test(compulsoryAmount)){
                 alert('交强险金额的输入格式不正确,请确认!');
                 return false;
             }*/
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
                        alert('请选择应付日期');
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
                        alert('请选择应付日期');
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
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            if(vm.dataliat && vm.dataliat.length>0){
                for (const dataliatElement of vm.dataliat) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            if(vm.dataliat1 && vm.dataliat1.length>0){
                for (const dataliatElement of vm.dataliat1) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            if(vm.dataliat2 && vm.dataliat2.length>0){
                for (const dataliatElement of vm.dataliat2) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payableTime==undefined||dataliatElement.payableTime==null||dataliatElement.payableTime=='')){
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            //商业险种记录
            vm.insuranceManage.commercialInsuranceRecordList = vm.commercialInsuranceTableList;
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            vm.insuranceManage.cyxxFileList = vm.cyxxFileList;

            vm.insuranceManage.jqxFeePeriodsList = vm.dataliat;
            vm.insuranceManage.syxFeePeriodsList = vm.dataliat2;
            vm.insuranceManage.cyxFeePeriodsList = vm.dataliat1;
            vm.insuranceManage.compulsoryFeePeriods = vm.byStages;
            vm.insuranceManage.commercialFeePeriods = vm.byStages2;
            vm.insuranceManage.carrierFeePeriods = vm.byStages1;
            vm.insuranceManage.commercialTotalAmount = vm.insuranceManage.commercialAmount;

            // if(vm.commercialInsuranceTableList.length>0){
            //     if (vm.insuranceManage.commercialEndTime == null || vm.insuranceManage.commercialEndTime == ''
            //         ||  vm.insuranceManage.commercialStartTime == null || vm.insuranceManage.commercialStartTime == '') {
            //         alert('请完善商业险保险时间！');
            //         return false;
            //     }
            // }

            console.log("提交保险数据", vm.insuranceManage)
            var url = vm.insuranceManage.insuranceManageId == null ? "maintenance/insurancemanage/save" : "maintenance/insurancemanage/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
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
            var vinNo = $("#vinNo").val();
            var carNo = $("#carNo").val();
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
                // console.log(parentData)
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
            //计算保险费
            var list = vm.commercialInsuranceTableList;
            if (list.length > 0) {
                var array = new Array()
                for (var i = 0; i < list.length; i++) {
                    array.push(parseFloat(list[i].insuranceExpenses));
                }
                var commercialAmount = sum(array);
                vm.insuranceManage = Object.assign({}, vm.insuranceManage, { commercialAmount: commercialAmount });
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
                vm.insuranceManage.commercialAmount = commercialAmount;
                vm.insuranceManage.commercialAmount = commercialAmount;
            }
            //重新加载表格
            layui.table.reload('insuranceTypeGrid', {
                data: vm.commercialInsuranceTableList
            });
            vm.insuranceTypeGridMS = true;
        },
        //表格数据重新加载方法
        reloadSourceTable: function () {
            layui.table.reload('gridid', {
                data: vm.sourceDataList
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
            // parent.layer.closeAll();
            //关闭页面
            closeCurrent();
        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    //console.log(r.baseInfor.carNo)
                    vm.insuranceManage = r.baseInfor;
                    if (r.baseInfor.carBrandModelName == null) {
                        vm.insuranceManage.carBrandModelName = '';
                    }
                    vm.insuranceManage.vehicleUse = r.baseInfor.rentType;
                    vm.insuranceManage.departureNo = r.baseInfor.carOrderNo;
                    vm.insuranceManage.carBelongCompanyName = r.baseInfor.deptName;
                    vm.insuranceManage.carBrandId = r.baseInfor.brandId;
                    vm.insuranceManage.carBrandName = r.baseInfor.brandName;
                    vm.insuranceManage.carModelId = r.baseInfor.modelId;
                    vm.insuranceManage.carModelName = r.baseInfor.modelName;
                    vm.insuranceManage.carSeriesId = r.baseInfor.seriesId;
                    vm.insuranceManage.carSeriesName = r.baseInfor.seriesName;
                    vm.insuranceManage.carOwner = r.baseInfor.carOwner;
                    if (r.baseInfor.timeStartRent != null) {
                        vm.insuranceManage.timeStartRent = new Date(r.baseInfor.timeStartRent).format("yyyy-MM-dd");
                    }
                    if (r.baseInfor.timeFinishRent != null) {
                        vm.insuranceManage.timeFinishRent = new Date(r.baseInfor.timeFinishRent).format("yyyy-MM-dd");
                    }
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
                    vm.insuranceManage = r.baseInfor;
                    if (r.baseInfor.carBrandModelName == null) {
                        vm.insuranceManage.carBrandModelName = '';
                    }
                    vm.insuranceManage.vehicleUse = r.baseInfor.rentType;
                    vm.insuranceManage.departureNo = r.baseInfor.carOrderNo;
                    vm.insuranceManage.carBelongCompanyName = r.baseInfor.deptName;
                    vm.insuranceManage.carBrandId = r.baseInfor.brandId;
                    vm.insuranceManage.carBrandName = r.baseInfor.brandName;
                    vm.insuranceManage.carModelId = r.baseInfor.modelId;
                    vm.insuranceManage.carModelName = r.baseInfor.modelName;
                    vm.insuranceManage.carSeriesId = r.baseInfor.seriesId;
                    vm.insuranceManage.carSeriesName = r.baseInfor.seriesName;
                    if (r.baseInfor.timeStartRent != null) {
                        vm.insuranceManage.timeStartRent = new Date(r.baseInfor.timeStartRent).format("yyyy-MM-dd");
                    }
                    if (r.baseInfor.timeFinishRent != null) {
                        vm.insuranceManage.timeFinishRent = new Date(r.baseInfor.timeFinishRent).format("yyyy-MM-dd");
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
        layui.table.reload('compulsoryInsurance', { data: vm.dataliat });
    }
}
function reloadPlan1() {
    if ($('div[lay-id="compulsoryInsurance1"]').length > 0) {
        layui.table.reload('compulsoryInsurance1', { data: vm.dataliat1 });
    }
}

function reloadPlan2() {
    if ($('div[lay-id="compulsoryInsurance2"]').length > 0) {
        layui.table.reload('compulsoryInsurance2', { data: vm.dataliat2 });
    }
}


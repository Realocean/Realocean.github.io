layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');
const App = {
    data() {
        return {
            form: {
                brandId: null,
                modelId: null,
                seriesId: null,
                brandName: null,
                modelName: null,
                seriesName: null,
                contractUrl: null,
                cluesSource: null,
                cluesSourceValue: null,
                financeStatus: null,
                phone: null,
                financeCompany: null,
                carOrderId: null,
                salesId: null,
                cluesId: null,
                customerName: null,
                downPayment: null,
                paymentType: null,
                loanAmount: null,
                customerType: null,
                vinNo: null,
                salesAmount: null,
                customerAddress: null,
                buyCarPurpose: null,
                agencyRegistration: null,
                loanTerm: null,
                remark: null,
                carBasicId: null
            },
            rules: {
                salesId: [
                    {
                        required: true,
                        message: '请选择销售顾问',
                        trigger: 'change',
                    },
                ],
                cluesId: [
                    {
                        required: true,
                        message: '客户名称不能为空',
                        trigger: 'change',
                    },
                ],
                phone: [
                    {
                        required: true,
                        //首位1，第二位3-9，之后随机
                        pattern: /^(1[3-9])\d{9}$/,
                        message: '请输入正确的电话',
                        trigger: 'blur',
                    },
                ],
                salesAmount: [
                    {
                        required: true,
                        message: '销售金额不能为空',
                        trigger: 'change',
                    },
                ],
                paymentType: [
                    {
                        required: true,
                        message: '请选择付款类型',
                        trigger: 'change',
                    },
                ],
                financeCompany: [
                    {
                        required: true,
                        message: '请选择金融公司',
                        trigger: 'change',
                    },
                ],
                financeStatus: [
                    {
                        required: true,
                        message: '请选择金融状态',
                        trigger: 'change',
                    },
                ],
                financeStatus: [
                    {
                        required: true,
                        message: '请选择首付款',
                        trigger: 'change',
                    },
                ],
                loanAmount: [
                    {
                        required: true,
                        message: '请输入贷款额度',
                        trigger: 'change',
                    },
                ],
                loanTerm: [
                    {
                        required: true,
                        message: '请选择贷款期限',
                        trigger: 'change',
                    },
                ],
                agencyRegistration: [
                    {
                        required: true,
                        message: '请选择是否代办上牌',
                        trigger: 'change',
                    },
                ]
                // contractUrl: [
                //     {
                //         required: true,
                //         message: '请上传销售合同',
                //         trigger: 'change',
                //     },
                // ]
            },
            rules2: {
                salesId: [
                    {
                        required: true,
                        message: '请选择销售顾问',
                        trigger: 'change',
                    },
                ],
                cluesId: [
                    {
                        required: true,
                        message: '客户名称不能为空',
                        trigger: 'change',
                    },
                ],
                phone: [
                    {
                        required: true,
                        //首位1，第二位3-9，之后随机
                        pattern: /^(1[3-9])\d{9}$/,
                        message: '请输入正确的电话',
                        trigger: 'blur',
                    },
                ],
                salesAmount: [
                    {
                        required: true,
                        message: '销售金额不能为空',
                        trigger: 'change',
                    },
                ],
                paymentType: [
                    {
                        required: true,
                        message: '请选择付款类型',
                        trigger: 'change',
                    },
                ],
            },
            options: [],
            sysUserInfo: {},
            carInfo: null,
            payTypes: [{code: 1, value: '全款'}],
            financialCompanys: [{code: 1, value: '中国银行'}],
            financialStatus: [{code: 1, value: '贷款审批中'}],
            loanTerms: [{code: 1, value: '1年'}],
            salerList: [],//销售顾问
            customerList: [],//线索客户

        };
    },
    computed: {},
    created() {
    },
    mounted() {
        let that = this
        $.get(baseURL +'/workbench/workbench/sysuserinfo', function (r) {
            if (null != r.sysUserInfo) {
                setTimeout(() => {
                    that.getSalesLeadCustomer(r.sysUserInfo.userId);
                }, 500)
            }
        });

        this.getCongfigDefaultInfo();
        this.getSalesList();
        this.getDicData();
    },
    methods: {

        getCongfigDefaultInfo() {
            //获取车辆
            const params = parent.layer.boxParams.boxParams;
            this.carInfo = params;
            this.form.brandId = params.brandId;
            this.form.modelId = params.modelId;
            this.form.seriesId = params.seriesId;
            this.form.brandName = params.brandName;
            this.form.modelName = params.modelName;
            this.form.seriesName = params.seriesName;
            this.form.vinNo = params.vinNo;
            this.form.carBasicId = params.carBasicId;
            this.form.carOrderId = params.carOrderId;
            //获取用户信息
            // const sysUserInfo = window.localStorage.getItem("sysUserInfo");
            // this.sysUserInfo = JSON.parse(sysUserInfo);
            // setTimeout(() => {
            //     this.getSalesLeadCustomer(this.sysUserInfo?.userId);
            // }, 500)

            console.log('---------', this.sysUserInfo);
        },

        handleRemove(file, fileList){
            this.form.contractUrl = null
        },

        // 上传合格证图片
        handleUploadCertificateChange(file, fileList) {
            console.log('----', file, fileList)
            let that = this;
            var fileName = file.raw.name;
            var uid = file.raw.uid;
            var formData = new FormData();
            formData.append("files", file.raw);
            formData.append("path", 'carImageLb');
            that.activeFile = {};
            $.ajax({
                type: "POST",
                url: baseURL + '/file/uploadFile',
                contentType: false,
                processData: false,
                data: formData,
                success: function (r) {
                    console.log('图片上传成功-----------', r)
                    that.form.contractUrl = r.data[0]
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },

        getDicData() {
            let _this = this
            //获取付款类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "outCarPayType", function (r) {
                _this.payTypes = r.dict;
            });
            //获取金融公司
            $.get(baseURL + "sys/dict/getInfoByType/" + "financialCompany", function (r) {
                _this.financialCompanys = r.dict;
            });
            //获取金融状态
            $.get(baseURL + "sys/dict/getInfoByType/" + "financialStatus", function (r) {
                _this.financialStatus = r.dict;
            });
            //获取贷款期限
            $.get(baseURL + "sys/dict/getInfoByType/" + "loanTerm", function (r) {
                _this.loanTerms = r.dict;
            });
        },
        //获取销售顾问
        getSalesList() {
            let _this = this
            $.get(baseURL + '/workbench/workbench/sysuserinfo', function (r) {
                if (null != r.sysUserInfo) {
                    $.ajax({
                        async: false,
                        type: "GET",
                        url: baseURL + "sys/user/crmSaleUserList?deptId=" + r.sysUserInfo.deptId,
                        success: function (r) {
                            if (r.code == 0) {
                                _this.salerList = r.userList
                            }
                        }
                    });
                }
            });
        },
        //获取销售顾问下的线索客户
        getSalesLeadCustomer(userId) {
            if (userId) {
                let that = this
                $.ajax({
                    type: "GET",
                    url: baseURL + "crmClues/getCrmClues",
                    data: {userId: userId},
                    success: function (r) {
                        if (r.code == 0) {
                            that.customerList = r.data
                        }
                    }
                });
            } else {
                this.$message({message: '销售顾问不能为空'})
            }
        },
        // 选择销售顾问
        changesales(val) {
            // const obj = this.purchaseOrderList.find(function (i) {
            //     return i.userId === val
            // });
            this.customerList = []
            this.getSalesLeadCustomer(val);
            this.form.cluesSource = null;
            this.form.phone = null;

            this.form.cluesId = null;
            this.form.customerName = null;
            this.form.customerType = null;
            this.form.cluesSourceValue = null
            this.form.customerAddress = null
        },
        changeCustomer(val) {
            const obj = this.customerList.find(function (i) {
                return i.cluesId === val
            });
            this.form.customerName = obj.customerName;
            this.form.phone = obj.phone;
            this.form.customerType = obj.customerType;
            // 线索来源；1、电话营销 2、客户介绍 3、线下到访 4、网络搜索 5、抖音推广 6、渠道合作 7、其他
            this.form.cluesSource = obj.cluesSource;
            let source = {1: '电话营销', 2: '客户介绍', 3: '线下到访', 4: '网络搜索', 5: '抖音推广', 6: '渠道合作', 7: '其他'};
            this.form.cluesSourceValue = source[obj.cluesSource]
            this.form.customerAddress = obj.address
        },

        submitForm(val) {
            let that = this
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log('onSubmit', that.form)
                    let url = "crm/crmCarOrder/save"
                    // layer.confirm('确定保存吗？', function(index){
                    $.ajax({
                        type: "POST",
                        url: baseURL + url,
                        contentType: "application/json",
                        data: JSON.stringify(that.form),
                        success: function(r){
                            if(r.code == 0){
                                that.$confirm('操作成功',{
                                    confirmButtonText: '确定',
                                    showCancelButton:false,
                                    type:'success'
                                }).then(res=>{
                                    parent.layer.closeAll();
                                })

                            }else{
                                that.$confirm(r.msg,{
                                    confirmButtonText: '确定',
                                    showCancelButton:false,
                                    type:'error'
                                })
                            }
                        }
                    });
                }
            })

        },
        handleChange(val) {
            console.log('handleChange', val)
        },
        cancel(val) {
            parent.layer.closeAll();
        },
    },
};
const app = Vue.createApp(App);
for ([name, comp] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, comp);
}
app.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn,
});
app.mount("#rrapp");
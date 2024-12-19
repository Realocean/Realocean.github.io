layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');
const App = {
    data() {
        return {
            defaultTime: new Date(2000, 1, 1, 12, 0, 0),
            form: {
                purchaseOrderId:'',
                brandId: '',
                seriesId: '',
                modelId: '',
                brandName: '',
                seriesName: '',
                modelName: '',
                productType: '',//生产类型
                batteryBrand: '',//电池品牌
                batteryDegree: '',//电池度数
                productionTime: '',//生产日期
                purchaseNum: '',//采购数量
                purchasePrice: '',//采购单价
                purchaseTotalPrice: '',//采购总价
                purchaseTime: '',//采购日期
                orderNo: '',//采购订单编号
                payType: '',//支付方式
                amountPaid: '',//已支付金额
                manufacturer: '',//厂家
                dealer: '',//经销商
            },
            modeldata: [],
            modelKey: 0,
            brandList: [],
            carType: [],//产品类型
            batteryBrandList: [],//电池品牌
            batteryNumList: [],//电池度数
            rules: {
                modelId: [
                    {
                        required: true,
                        message: '请选择车辆品牌/车系/车型',
                        trigger: 'blur',
                    },
                ],
                productType: [
                    {
                        required: true,
                        message: '请选择车辆级别',
                        trigger: 'change',
                    },
                ],
                batteryBrand: [
                    {
                        required: true,
                        message: '请选择电池品牌',
                        trigger: 'change',
                    },
                ],
                batteryDegree: [
                    {
                        required: true,
                        message: '请选择电池数量',
                        trigger: 'change',
                    },
                ],
                productionTime: [
                    {
                        required: true,
                        message: '请选择生产日期',
                        trigger: 'change',
                    },
                ],
                purchaseNum: [
                    {
                        required: true,
                        message: '请输入采购数量',
                        trigger: 'change',
                    },
                ],
                purchasePrice: [
                    {
                        required: true,
                        message: '请输入采购单价',
                        trigger: 'change',
                    },
                ],
                purchaseTotalPrice: [
                    {
                        required: true,
                        message: '采购总价不能为空',
                        trigger: 'change',
                    },
                ],
                purchaseTime: [
                    {
                        required: true,
                        message: '请选择采购日期',
                        trigger: 'change',
                    },
                ],
                orderNo: [
                    {
                        required: true,
                        message: '请选择采购订单编号',
                        trigger: 'change',
                    },
                ],
                payType: [
                    {
                        required: true,
                        message: '请输入支付方式',
                        trigger: 'change',
                    },
                ],
                amountPaid: [
                    {
                        required: true,
                        message: '请输入支付金额',
                        trigger: 'change',
                    },
                ],
                // manufacturer: [
                //     {
                //         required: true,
                //         message: '请输入厂家',
                //         trigger: 'change',
                //     },
                // ],
                // dealer: [
                //     {
                //         required: true,
                //         message: '请输入经销商',
                //         trigger: 'change',
                //     },
                // ],
            },
        };
    },
    computed: {},
    created() {
      this.getDicData()
    },
    mounted() {
        console.log('mounted', this.form)
        let params = parent.layer.boxParams.boxParams;
        this.purchaseOrderId = params

        console.log('params', params, this.purchaseOrderId)
        let _this = this
        if(this.purchaseOrderId){
            $.get(baseURL + `crmPurchaseOrder/info/${this.purchaseOrderId}`,function(r){
                _this.form= r.data;
                // _this.tableData=_this.orderDetail?.crmCarBasicEntityList??[]

                if(r.data.seriesId && r.data.seriesId != null){
                    //下标0为一级菜单value
                    _this.modeldata[0] = r.data.brandId;
                    //下标1为二级菜单value
                    _this.modeldata[1] = r.data.seriesId;
                    //下标1为三级菜单value
                    _this.modeldata[2] = r.data.modelId;
                    _this.modelKey++;//改变key值，组件重新渲染，实现回填功能
                    console.log('--', _this.modeldata)
                }

            });
        }

    },
    methods: {

        inputChange(){
            // console.log('数量', this.form.purchaseNum, '--单价--', this.form.purchasePrice)

            this.form.purchaseTotalPrice = Number(this.form.purchaseNum*this.form.purchasePrice).toFixed(2)
        },

        getDicData(){
            let _this = this
            //获取产品类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "carType", function (r) {
                _this.carType = r.dict;
            });
            // 获取品牌数据源
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                _this.brandList = r.carTreeVoList
            });
            //获取电池品牌
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryBrand", function (r) {
                _this.batteryBrandList = r.dict;
            });
            //获取电池数量
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryDegree", function (r) {
                _this.batteryNumList = r.dict;
            });
        },

        handleBrandChange(val) {
            this.form.brandId = val[0]
            this.form.seriesId = val[1]
            this.form.modelId = val[2]
            this.modeldata = val;
            //下标1为三级菜单value
            this.form.brandName = this.$refs.model.getCheckedNodes()[0].pathLabels[0]
            this.form.seriesName = this.$refs.model.getCheckedNodes()[0].pathLabels[1]
            this.form.modelName = this.$refs.model.getCheckedNodes()[0].pathLabels[2]
            this.modelKey++;//改变key值，组件重新渲染，实现回填功能

        },
        // 保存采购单信息
        submitForm(val) {
            let that = this
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let url = that.form.purchaseOrderId?"crmPurchaseOrder/update":"crmPurchaseOrder/save"
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
layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');
const App = {
    data() {
        return {
            startDatetions:time =>{
                    return time.getTime() > Date.now();
            },
            q: {
                purchaseOrderId: '',
            },
            purchaseOrderList: [],
            form: {
                purchaseOrderId: null,
                orderNo: null,
                carUrl: null,
                brandId: null,
                modelId: null,
                seriesId: null,
                brandName: null,
                modelName: null,
                seriesName: null,
                batteryBrand: null,
                batteryNum: null,
                batteryDegree: null,
                batteryBrandValue: null,
                batteryNumValue: null,
                productionTime: null,
                infoParams: null
            },
            rules: {
                // orderNo: [
                //     {
                //         required: true,
                //         message: '请选择车采购单',
                //         trigger: 'change',
                //     },
                // ],
                modelId: [
                    {
                        required: true,
                        message: '请选择车辆品牌/车系/车型',
                        trigger: 'change',
                    },
                ],
                batteryDegree: [
                    {
                        required: true,
                        message: '请选择电池度数',
                        trigger: 'change',
                    },
                ]
            },
            options: [],
            imgListlbt: [],
            imgList: [],
            imageUrl: '',
            activeFile: {},
            modelInfo: '',
            batteryDegreeList:[],
            batteryBrandList:[],
            batteryNumList:[],
            carList:[{
                rid:uuid(16),
                vinNo: '',
                toStoreTime: moment(new Date()).format('YYYY-MM-DD'),
                certificateUrl: '',
                certificateExpireTime: '',
                recertificationStatus: '',
                carStorage: ''
            }],
            curCarIndex:null,
            dialogVisible:false,
            modelKey: 0,
            brandList: [],
            modeldata:[],
        };
    },
    computed: {},
    created() {
        this.getPurchaseOrderlist()
        this.getDicData()
    },
    mounted() {

    },
    methods: {

        addCar(){
            let lastCarInfo = {}
            if (this.carList.length>0) {
                //获取数组最后一项
                lastCarInfo = this.carList.at(-1);
            }
            let carForm = {
                rid:uuid(16),
                vinNo: '',
                toStoreTime: moment(new Date()).format('YYYY-MM-DD'),
                certificateUrl: '',
                certificateExpireTime: '',
                recertificationStatus: '',
                carStorage: lastCarInfo?.carStorage
            }
            // let carForm = {
            //     vinNo: '',
            //     toStoreTime: lastCarInfo?.toStoreTime,
            //     certificateUrl: '',
            //     certificateExpireTime: lastCarInfo?.certificateExpireTime,
            //     carStorage: lastCarInfo?.carStorage
            // }
            this.carList.push(carForm)
        },
        deleteCar(index){
            console.log('删除', index)
            this.carList.splice(index, 1)
            this.$forceUpdate()
        },
        getDicData(){
            let _this = this
            //获取电池度数
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryDegree", function (r) {
                _this.batteryDegreeList = r.dict;
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
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryNum", function (r) {
                _this.batteryNumList = r.dict;
            });
        },

        getPurchaseOrderlist() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "crmPurchaseOrder/list",
                data: that.q,
                success: function (r) {
                    if (r.code == 0) {
                        that.purchaseOrderList = r.data
                    }
                }
            });
        },
        // 采购单发生改变
        changePurchaseOrder(val) {

            console.log('val', val)

            if(val && val != null){
                const obj = this.purchaseOrderList.find(function (i) {
                    return i.orderNo === val
                });
                console.log('采购单信息----------', obj.brandName)
                this.modelInfo = `${obj.brandName}/${obj.seriesName}/${obj.modelName}`
                this.form.purchaseOrderId = obj.purchaseOrderId
                this.form.orderNo = obj.orderNo
                this.form.brandId = obj.brandId
                this.form.modelId = obj.modelId
                this.form.seriesId = obj.seriesId
                this.form.brandName = obj.brandName
                this.form.modelName = obj.modelName
                this.form.seriesName = obj.seriesName
                this.form.batteryBrand = obj.batteryBrand
                this.form.batteryNum = obj.batteryNum
                this.form.batteryDegree = obj.batteryDegree
                this.form.batteryBrandValue =  this.getDicValueBatteryBrand(obj.batteryBrand)
                this.form.batteryNumValue = this.getDicValueBatteryNum(obj.batteryNum)
                this.form.productionTime = obj.productionTime

                if(obj.modelId && obj.modelId != null){
                    //下标0为一级菜单value
                    this.modeldata[0] = obj.brandId;
                    //下标1为二级菜单value
                    this.modeldata[1] = obj.seriesId;
                    //下标1为三级菜单value
                    this.modeldata[2] = obj.modelId;
                    this.modelKey++;//改变key值，组件重新渲染，实现回填功能
                    console.log('--', this.modeldata)
                }
            }else {
                this.form.purchaseOrderId = null
            }


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

        handlePictureCardPreview(item) {
            console.log('---------预览图片',item);
            this.dialogVisible =true
        },

        // 删除
        handleRemove(file, fileList) {
            if (this.imgListlbt.length > 0) {
                for (var i = this.imgListlbt.length - 1; i >= 0; i--) {
                    if (this.imgListlbt[i].uid == file.uid) {
                        this.imgListlbt.splice(i, 1);
                    }
                }
            }
        },

        // 车型列表图片删除
        carhandleRemove(file, fileList, index) {
            // if (this.imgList.length > 0) {
            //     for (var i = this.imgList.length - 1; i >= 0; i--) {
            //         if (vm.imgList[i].uid == file.uid) {
            //             this.imgList.splice(i, 1);
            //         }
            //     }
            // }
            this.carList[index].certificateUrl = null
        },

        // 上传车辆图片
        handleUploadCarChange(file, fileList) {
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
                    console.log('上传成功-----------',  r)
                    that.form.carUrl = r.data[0]
                    that.imageUrl = imageURL + r.data[0]
                    console.log('图片地址-----------',  that.imageUrl)
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },


        // 上传合格证图片
        handleUploadCertificateChange(file, fileList, index) {
            console.log('----', file, fileList, index)
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
                    that.carList[index].certificateUrl = r.data[0]
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },

        submitForm(val) {
            let that = this
            if (this.carList.length >0){
              this.form.infoParams = this.carList;
            }else  {
                this.$message({message:'请添加车辆信息'})
                return
            }
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log('onSubmit', that.form)
                    let url = "crm/crmCarBasic/save"
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
        getDicValueBatteryBrand(code) {
            if (this.batteryBrandList.length > 0) {
                return this.batteryBrandList.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueBatteryNum(code) {
            if (this.batteryNumList.length > 0) {
                return this.batteryNumList.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        }
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
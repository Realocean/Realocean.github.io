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
                batteryDegreeValue:null,
                batteryBrandValue: null,
                batteryNumValue: null,
                productionTime: null,
                vinNo: '',
                toStoreTime: '',
                certificateUrl: '',
                certificateExpireTime: '',
                recertificationStatus: '',
                carStorage: ''
            },
            rules: {
                vinNo: [
                    {
                        required: true,
                        message: '请输入车辆vin码',
                        trigger: 'change',
                    },
                ],
                toStoreTime: [
                    {
                        required: true,
                        message: '请选择到店时间',
                        trigger: 'change',
                    },
                ],
                /*certificateExpireTime: [
                    {
                        required: true,
                        message: '请选择合格证时间',
                        trigger: 'change',
                    },
                ],
                carStorage: [
                    {
                        required: true,
                        message: '请输入车辆存放地址',
                        trigger: 'change',
                    },
                ]*/
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
                vinNo: '',
                toStoreTime: '',
                certificateUrl: '',
                certificateExpireTime: '',
                recertificationStatus: '',
                carStorage: ''
            }],
            curCarIndex:null,
            carUrl:null,
            fileList:[],
            carUrlfileList:[],
        };
    },
    computed: {},
    created() {
        this.getDicData()
    },
    mounted() {
       this.getCarInfo()
    },
    methods: {


        getCarInfo() {
            const params = parent.layer.boxParams.boxParams;
            let _this = this
            //获取电池度数
            $.get(baseURL + "crm/crmCarBasic/info/" + params.carBasicId, function (r) {
                _this.form = r.data;
                if(r.data.carUrl && r.data.carUrl != ''){
                    _this.carUrl = imageURL + r.data.carUrl
                }
                _this.modelInfo = `${params.brandName}/${params.seriesName}/${params.modelName}`
                _this.form.batteryDegreeValue = params.batteryDegreeValue;
                _this.form.batteryBrandValue = params.batteryBrandValue;
                _this.form.batteryNumValue= _this.getDicValueBatteryNum(r.data.batteryNum);

                if(r.data.carUrl && r.data.carUrl != ''){
                    _this.carUrlfileList = [{name: '', url:imageURL + r.data.carUrl}]
                }

                if(r.data.certificateUrl && r.data.certificateUrl != ''){
                    _this.fileList = [{name: '合格证', url:r.data.certificateUrl}]
                }
            });
        },

        getDicData(){
            let _this = this
            //获取电池度数
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryDegree", function (r) {
                _this.batteryDegreeList = r.dict;
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


        handlePictureCardPreview(item) {
            this.imageUrl = item.url;
        },

        handlePictureCardPreview0(item) {
            // this.imageUrl = item.url;
        },

        // 删除
        handleRemove0(file, fileList) {
            // if (this.imgListlbt.length > 0) {
            //     for (var i = this.imgListlbt.length - 1; i >= 0; i--) {
            //         if (this.imgListlbt[i].uid == file.uid) {
            //             this.imgListlbt.splice(i, 1);
            //         }
            //     }
            // }
            this.form.carUrl = null
        },

        // 删除
        handleRemove(file, fileList) {
            // if (this.imgListlbt.length > 0) {
            //     for (var i = this.imgListlbt.length - 1; i >= 0; i--) {
            //         if (this.imgListlbt[i].uid == file.uid) {
            //             this.imgListlbt.splice(i, 1);
            //         }
            //     }
            // }
            this.form.certificateUrl = null
        },

        // 车型列表图片删除
        carhandleRemove(file, fileList) {
            if (this.imgList.length > 0) {
                for (var i = this.imgList.length - 1; i >= 0; i--) {
                    if (vm.imgList[i].uid == file.uid) {
                        this.imgList.splice(i, 1);
                    }
                }
            }
        },

        // 上传车辆图片
        handleUploadCarChange0(file, fileList) {
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
                    // that.form.carUrl = r.data[0]
                    // that.imageUrl = baseURL + r.data[0]
                    that.form.carUrl = r.data[0]
                    that.carUrl = imageURL + r.data[0]
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
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
                    console.log('图片上传成功-----------', r)
                    // that.form.carUrl = r.data[0]
                    // that.imageUrl = baseURL + r.data[0]
                    that.form.certificateUrl = r.data[0]
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },


        // 上传合格证图片
        handleUploadChange(file, fileList) {
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
                    that.form.certificateUrl = r.data[0]
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },

        submitForm(val) {
            console.log('onSubmit', this.form)

            let that = this
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log('onSubmit', that.form)
                    let url = "crm/crmCarBasic/update"
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
        getDicValueBatteryDegree(code) {
            if (this.batteryDegreeList.length > 0) {
                return this.batteryDegreeList.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
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

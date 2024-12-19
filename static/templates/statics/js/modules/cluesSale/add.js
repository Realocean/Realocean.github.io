layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            form:{
                cluesSource:'',
                customerName: '',
                phone: '',
                address: '',
                company: '',
                companyBusiness: '',
                occupation: '',
                customerType: '',
                intentionLevel: '',
                provinceCode: '',
                provinceName: '',
                cityCode: '',
                cityName: '',
                areaCode: '',
                areaName: '',
                brandId: '',
                modelId: '',
                seriesId: '',
                brandName: '',
                modelName: '',
                seriesName: '',
            },
            provinceProp:{
                value:'code',
                label:'name',
                children:'cityList'
            },
            province:[],
            cluesSource:[],
            customerType:[],
            intentionLevel:[],
            brandList:[],
            rules: {
                customerName: [
                    {
                        required: true,
                        message: '姓名不能为空',
                        trigger: 'blur',
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
                cluesSource: [
                    {
                        required: true,
                        message: '线索来源不能为空',
                        trigger: 'change',
                    },
                ]
            },
            regiondata:[],
            modalKey:0,
            modeldata:[],
            modelKey:0,
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
        console.log('mounted', this.form)
        this.getProvinceData();
        this.getBrandData();

        this.cluesSource = cluesSource
        this.customerType = customerType
        this.intentionLevel = intentionLevel

        let intentParam = parent.layer.boxParams.boxParams;
        console.log('接受参数', intentParam)

        if(intentParam != null && intentParam.cluesId != null){
            // this.form = intentParam
            this.getOldData(intentParam.cluesId);
        }


    },
    methods: {
        getOldData(id){
            let _this = this
            $.getJSON(baseURL + `crmClues/info/${id}`, function (r) {
                if(r.code == 0){
                    _this.form = r.data

                    //在courseInfo课程基本信息，包含 一级分类id 和 二级分类id
                    // _this.courseInfo = r.data.courseInfoVo;

                    if(r.data.areaCode && r.data.areaCode != null){
                        //下标0为一级菜单value
                        _this.regiondata[0] = r.data.provinceCode;
                        //下标1为二级菜单value
                        _this.regiondata[1] = r.data.cityCode;
                        //下标1为三级菜单value
                        _this.regiondata[2] = r.data.areaCode;
                        _this.modalKey++;//改变key值，组件重新渲染，实现回填功能
                    }

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

                }
            });
        },

        getBrandData(){
            let _this = this
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                _this.brandList = r.carTreeVoList
            });
        },

        getProvinceData(){
            let _this = this
            //加载省市区文件内容
            var cache = localStorage.getItem("globalProvinces");
            if (cache == null) {
                $.getJSON(provinceUrl + "statics/js/province.js", function (r) {
                    // _this.province = r;
                    localStorage.setItem("globalProvinces", JSON.stringify(r));

                    r.map(i => {
                        JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                        i.cityList = JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                    })
                    _this.province = r
                    // console.log('请求到了', _this.province)
                });
            } else {
                let r2 = JSON.parse(cache)

                r2.map(i => {
                    JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                    i.cityList = JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                })

                _this.province = r2
                // console.log('缓存到了', _this.province)
            }
        },

        submitForm(val){
            let that = this

            console.log('onSubmit', that.form)

            this.$refs['form'].validate((valid) => {
                if (valid) {


                    let url = that.form.cluesId?"crmClues/update":"crmClues/save"
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
                                    // alert('操作成功', function(index){
                                    //     parent.layer.closeAll();
                                    //     // parent.vm.reload();
                                    // });
                                }else{
                                    that.$confirm(r.msg,{
                                        confirmButtonText: '确定',
                                        showCancelButton:false,
                                        type:'error'
                                    })
                                    // alert(r.msg);
                                }
                            }
                        });
                    // });

                }
            })

        },
        handleChange(val){
            this.form.provinceCode = val[0]
            this.form.cityCode = val[1]
            this.form.areaCode = val[2]

            this.form.provinceName = this.$refs.region.getCheckedNodes()[0].pathLabels[0]
            this.form.cityName = this.$refs.region.getCheckedNodes()[0].pathLabels[1]
            this.form.areaName = this.$refs.region.getCheckedNodes()[0].pathLabels[2]

            // console.log('handleChange', val)
            // console.log('region', this.$refs.region.getCheckedNodes()[0].pathLabels)
        },
        handleBrandChange(val){
            this.form.brandId = val[0]
            this.form.seriesId = val[1]
            this.form.modelId = val[2]

            this.form.brandName = this.$refs.model.getCheckedNodes()[0].pathLabels[0]
            this.form.seriesName = this.$refs.model.getCheckedNodes()[0].pathLabels[1]
            this.form.modelName = this.$refs.model.getCheckedNodes()[0].pathLabels[2]
        },
        cancel(val){
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
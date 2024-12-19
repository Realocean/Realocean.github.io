layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            form:{
                customerName: '',
                company: '',
                phone: '',
                companyBusiness: '',
                provinceCode: '',
                provinceName: '',
                cityCode: '',
                cityName: '',
                areaCode: '',
                areaName: '',
                occupation: '',
                address: '',
                customerType: '',
                followType: '',
                contactAccount: '',
                brandId: '',
                modelId: '',
                seriesId: '',
                brandName: '',
                modelName: '',
                seriesName: '',
                intentionLevel: '',
                toStoreStatus: '',
                approvalStatus: '',
                toStoreDate: '',
                nextDealDate: '',
                registrationStatus: '',
                nextMeasure: '',
                dealRecord: '',
            },
            regiondata:[],
            modalKey:0,
            modeldata:[],
            modelKey:0,
            province:[],
            brandList:[],
            intentionLevel:[],
            followResult:[],
            provinceProp:{
                value:'code',
                label:'name',
                children:'cityList'
            },
            cluesId:'',
            customerType:[],
            followType:[],
            oldDataList:[],
            rules: {
                customerName: [
                    {
                        required: true,
                        message: '姓名不能为空',
                        trigger: 'blur',
                    },
                ],
                customerType: [
                    {
                        required: true,
                        message: '客户类型不能为空',
                        trigger: 'blur',
                    },
                ],
                followType: [
                    {
                        required: true,
                        message: '跟进方式不能为空',
                        trigger: 'blur',
                    },
                ],
                contactAccount: [
                    {
                        required: true,
                        message: '联系账号不能为空',
                        trigger: 'blur',
                    },
                ],
                seriesId: [
                    {
                        required: true,
                        message: '意向车型不能为空',
                        trigger: 'blur',
                    },
                ],
                intentionLevel: [
                    {
                        required: true,
                        message: '意向等级不能为空',
                        trigger: 'blur',
                    },
                ],
                dealRecord: [
                    {
                        required: true,
                        message: '跟进记录不能为空',
                        trigger: 'blur',
                    },
                ],
                nextMeasure: [
                    {
                        required: true,
                        message: '下一步措施不能为空',
                        trigger: 'blur',
                    },
                ],
                phone: [
                    {
                        // required: true,
                        //首位1，第二位3-9，之后随机
                        pattern: /^(1[3-9])\d{9}$/,
                        message: '请输入正确的电话',
                        trigger: 'blur',
                    },
                ],
            },
            options:[],
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
        this.getProvinceData();
        this.getBrandData();

        this.customerType = customerType
        this.followType = followType
        this.intentionLevel = intentionLevel
        this.followResult = followResult

        console.log('mounted', parent.layer.boxParams.boxParams)
        this.cluesId = parent.layer.boxParams.boxParams.cluesId;
        this.getOldList();
    },
    methods: {

        getOldList(){
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + `crmClues/crmCluesDeal/getLastCluesDeal/${that.cluesId}`,
                // contentType: "application/json",
                // data: that.q,
                success: function(r){
                    if(r.code==0){
                        that.oldDataList = r.data

                        if(r.data && r.data.length>0){
                            that.form = r.data[r.data.length-1]

                            that.handlePlaceData(r.data[r.data.length-1]);

                            window.scrollTo(0, document.body.scrollHeight);
                        }else {
                            $.getJSON(baseURL + `crmClues/info/${that.cluesId}`, function (res) {
                                if(res.code == 0){
                                    that.form = res.data

                                    that.handlePlaceData(res.data);
                                }
                            });
                        }
                    }
                }
            });
        },

        handlePlaceData(placeData){
            //在courseInfo课程基本信息，包含 一级分类id 和 二级分类id
            // this.courseInfo = r.data.courseInfoVo;

            if(placeData.areaCode && placeData.areaCode != null){
                //下标0为一级菜单value
                this.regiondata[0] = placeData.provinceCode;
                //下标1为二级菜单value
                this.regiondata[1] = placeData.cityCode;
                //下标1为三级菜单value
                this.regiondata[2] = placeData.areaCode;
                this.modalKey++;//改变key值，组件重新渲染，实现回填功能
            }

            if(placeData.seriesId && placeData.seriesId != null){
                //下标0为一级菜单value
                this.modeldata[0] = placeData.brandId;
                //下标1为二级菜单value
                this.modeldata[1] = placeData.seriesId;
                //下标1为三级菜单value
                this.modeldata[2] = placeData.modelId;
                this.modelKey++;//改变key值，组件重新渲染，实现回填功能
                console.log('--', this.modeldata)
            }
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

                    that.form.cluesId = that.cluesId

                    $.ajax({
                        type: "POST",
                        url: baseURL + 'crmClues/crmCluesDeal/save',
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
                                // alert(r.msg);
                            }
                        }
                    });

                }
            })

        },
        getCustomerType(type){
            return getCustomerType(type)
        },
        getIntentionLevel(type){
            return getIntentionLevel(type)
        },
        getCluesSource(type){
            return getCluesSource(type)
        },
        getFollowResult(type){
            return getFollowResult(type)
        },
        getFollowType(type){
            return getFollowType(type)
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
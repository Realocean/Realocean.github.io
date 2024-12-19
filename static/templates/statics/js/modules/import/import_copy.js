var eventBus = new Vue();

function keepTwoDecimal(num) {
    var result = parseFloat(num);
    result = Math.round(num * 100) / 100;
    return result;
}

// 导入
Vue.component('import-download', {
    template: `<div>
           <div class="module-body">
                    <div class="module-file">
                        <div>
                            <div class="import—download-box">
                                <div class="import—download">
                                    <img class="img" :src="filterUrl('/statics/images/import/download.png')" alt="下载模板">
                                </div>
                                <div class="import—download-file">
                                    <div class="font-size-14 download-title">填写导入数据信息</div>
                                    <div class="font-size-14 download-tip">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除
                                    </div>
                                     <div style="display: flex">
<!--                                     <el-cascader-->
<!--                                            size="small"-->
<!--                                            v-model="value1"-->
<!--                                            :options="options"></el-cascader>-->
<!--                                        <div class="download-href pointer">-->
<!--                                            <div class="pointer" @click="changeSelect">下载模板</div>-->
<!--                                            <img class="download-icon" :src="filterUrl('/statics/images/import/download2.png')" alt="下载">-->
<!--                                        </div>-->
                                    <div class="layui-tab layui-tab-brief">
<!--                                          <ul class="layui-tab-title">-->
<!--                                            <li class="layui-this">-->
<!--                                             <el-tooltip class="item" effect="dark" content="简易模板为导入所需要的必要数据，都为必填数据" placement="top-start">-->
<!--                                                <span>简易模版<i class="layui-icon layui-icon-about" style="color: #3FACB3;font-size: 14px;margin-left: 2px"></i> </span>-->
<!--                                            </el-tooltip>-->
<!--                                             </li>-->
<!--                                           <li>-->
<!--                                             <el-tooltip class="item" effect="dark" content="完整模板可导入所有相关信息，包含必填信息和选填信息" placement="top-start">-->
<!--                                                <span>完整模版<i class="layui-icon layui-icon-about" style="color: #3FACB3;font-size: 14px;margin-left: 2px"></i> </span>-->
<!--                                            </el-tooltip>-->
<!--                                             </li>-->
<!--                                          </ul>-->
                                          <div class="layui-tab-content">
                                            <div class="layui-tab-item">
                                              <el-button  type="text" 
                                              style="color: #3FACB3;margin-right: 15px" 
                                              v-for="item in downLoadTemplateTypes[currentTab]" 
                                              @click="downloadExportTemplate(item, 1)">
                                              {{item.label}}<i class="el-icon-download el-icon--right"></i>
                                              </el-button>
                                            </div>
                                            <div class="layui-tab-item layui-show">
                                             <el-button  type="text" 
                                             style="color: #3FACB3;margin-right: 15px" 
                                             v-for="item in downLoadTemplateTypes[currentTab]" 
                                             @click="downloadExportTemplate(item,2)">
                                             {{item.label}}<i class="el-icon-download el-icon--right"></i>
                                             </el-button>
                                            </div>
                                          </div>
                                       </div>
                                    
                                    </div>

                                </div>
                            </div>
                            <div class="import—download-box">
                                <div class="import—download">
                                    <img class="img" :src="filterUrl('/statics/images/import/uploading.png')" alt="上传文件">
                                </div>
                                <div class="import—download-file">
                                    <div class="font-size-14 download-title">请上传导入文件</div>
                                    <div class="font-size-14 download-tip">文件后缀名必须为xls 或xlsx
                                        （即Excel格式），文件大小不得大于10M，最多支持导入3000条数据
                                    </div>
                                    <a class="download-href pointer" id="dddd">
                                    <div id="orderModel" v-if="currentTab==1" >
                                        <el-select size="small" v-model="value" placeholder="请选择" @change="changeOrderSelect">
                                                <el-option
                                                  v-for="item in orders"
                                                  :key="item.value"
                                                  :label="item.label"
                                                  :value="item">
                                                </el-option>
                                          </el-select>
                                        <input type="hidden" id="ot" value="">
                                    </div>
                                    
                                    <div id="customerModel" v-if="currentTab==2">
                                        <el-select size="small" v-model="value2" placeholder="请选择" @change="changeCustomerSelect">
                                                <el-option
                                                  v-for="item in customers"
                                                  :key="item.value"
                                                  :label="item.label"
                                                  :value="item">
                                                </el-option>
                                          </el-select>
                                          <input type="hidden" id="ct" value="">
                                    </div>

                                       <div class="layui-btn-container">
                                          <div v-show="currentTab==0" class="font-size-14 demoMore" lay-data="{url: baseURL+'car/tcarbasic/importTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==1 && orderCarShow==1" class="font-size-14 demoMore" lay-data="{url: baseURL+'order/order/inportsTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==1 && orderCarShow==2" class="font-size-14 verifyForm">请选择上传文件</div>
                                          <div v-show="currentTab==2 && customerShow==1" class="font-size-14 demoMore" lay-data="{url: baseURL+'customer/importCustomerTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==2 && customerShow==2" class="font-size-14 verifyForm">请选择上传文件</div>
                                          <div v-show="currentTab==3" class="font-size-14 demoMore" lay-data="{url: baseURL+'maintenance/insurancemanage/importTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==4" class="font-size-14 demoMore" lay-data="{url: baseURL+'maintenance/inspectionmanage/importTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==5" class="font-size-14 demoMore" lay-data="{url: baseURL+'maintenance/maintenancemanage/importExcelTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==6" class="font-size-14 demoMore" lay-data="{url: baseURL+'outinsuranceorder/ouinsuranceorder/importExcelTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==7" class="font-size-14 demoMore" lay-data="{url: baseURL+'carrepairorder/carrepairorder/importExcelTwo'}">请选择上传文件</div>
                                          <div v-show="currentTab==8" class="font-size-14 demoMore" lay-data="{url: baseURL+''}">请选择上传文件</div>
                                        </div>
                                        <img class="download-icon" :src="filterUrl('/statics/images/import/uploading2.png')" alt="下载">
                                    </a>
                                </div>
                                           
                            </div>
                            <div class="reminder-box">
                                <img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">
                                <span>特别提示</span><br>
                                下载导入模板，根据要求填写，填写完成之后上传文件<br>
                                导入过程中如发现同名客户，则更新这条客户数据
                            </div>
                        </div>
                    </div>
                </div>
               <!-- <div class="btn-group">
                    <button class="btn cancel-btn">取消</button>
                    <button class="btn next-btn">下一步</button>
                </div>-->
</div>`,
    props: {
        importUrl: {
            type: String
        },
        currentTab: {
            type: Number,
            default: 0
        },
        currentTabComponent: {
            type: String,
            default: 'import-download'
        }
    },

    data() {
        return {
            url: '',
            baseUrl: '',
            customers: [{
                value: '1',
                label: '企业'
            }, {
                value: '2',
                label: '个人'
            },],
            value2: '',

            orders: [{
                value: '1',
                label: '经租'
            }, {
                value: '2',
                label: '以租代购'
            }, {
                value: '5',
                label: '融租'
            }, {
                value: '6',
                label: '直购'
            }, {
                value: '7',
                label: '挂靠'
            }, {
                value: '8',
                label: '直营'
            },],
            value: '',

            options: [{
                value: '0',
                label: '车辆'
            }, {
                value: '1',
                label: '车辆订单',
                children: [{
                    value: 'jz',
                    label: '经租',
                }, {
                    value: 'yzdg',
                    label: '以租代购',
                }, {
                    value: 'rz',
                    label: '融租',
                }, {
                    value: 'zg',
                    label: '直购',
                }, {
                    value: 'gk',
                    label: '挂靠',
                }, {
                    value: 'zy',
                    label: '直营',
                }]
            }, {
                value: '2',
                label: '客户',
                children: [{
                    value: 'gr',
                    label: '个人'
                }, {
                    value: 'qy',
                    label: '企业'
                }]
            }, {
                value: '3',
                label: '车辆保险'
            }, {
                value: '4',
                label: '车辆年检'
            }, {
                value: '5',
                label: '车辆保养'
            }, {
                value: '6',
                label: '车辆出险'
            }, {
                value: '7',
                label: '车辆维修'
            }],
            value1: '',
            orderTypeSelect: false,
            importType: 1,
            importTypeSelect: false,
            importCType: 1,
            orderCarShow: 2,
            customerShow: 2,
            downLoadTemplateTypes:[
                //车辆
                [{
                    value: 'car',
                    label: '车辆',
                    completeUrl:'importData/cl/车辆数据信息.xlsx',
                    simpleUrl:'importData/cl/车辆数据信息.xlsx'
                }],
                //车辆订单
                [{
                    value: 'jz',
                    label: '经租订单',
                    completeUrl:'importData/order/jz/车辆订单-经租.xlsx',
                    simpleUrl:'importData/order/jz/车辆订单-经租.xlsx',
                }, {
                    value: 'yzdg',
                    label: '以租代购订单',
                    completeUrl:'importData/order/yzdg/车辆订单-以租代购.xlsx',
                    simpleUrl:'importData/order/yzdg/车辆订单-以租代购.xlsx',

                }, {
                    value: 'rz',
                    label: '融租订单',
                    completeUrl:'importData/order/rz/车辆订单-融租.xlsx',
                    simpleUrl:'importData/order/rz/车辆订单-融租.xlsx',
                }, {
                    value: 'zg',
                    label: '直购订单',
                    completeUrl:'importData/order/zg/车辆订单-直购.xlsx',
                    simpleUrl:'importData/order/zg/车辆订单-直购.xlsx',
                }, {
                    value: 'gk',
                    label: '挂靠订单',
                    completeUrl:'importData/order/gk/车辆订单-挂靠.xlsx',
                    simpleUrl:'importData/order/gk/车辆订单-挂靠.xlsx',
                }, {
                    value: 'zy',
                    label: '直营订单',
                    completeUrl:'importData/order/zy/车辆订单-直营.xlsx',
                    simpleUrl:'importData/order/zy/车辆订单-直营.xlsx',
                }],
                //客户
                [{
                    value: 'gr',
                    label: '个人',
                    completeUrl:'importData/kh/gr/客户-个人.xlsx',
                    simpleUrl:'importData/kh/gr/客户-个人.xlsx',
                }, {
                    value: 'qy',
                    label: '企业',
                    completeUrl:'importData/kh/qy/客户-企业.xlsx',
                    simpleUrl:'importData/kh/qy/客户-企业.xlsx',
                }],
                //车辆保险
                [{
                    value: 'bx',
                    label: '车辆保险',
                    completeUrl:'importData/clbx/车辆保险.xlsx',
                    simpleUrl:'importData/clbx/车辆保险.xlsx',
                }],
                [{
                    value: 'nj',
                    label: '车辆年检',
                    completeUrl:'importData/clnj/车辆年检.xlsx',
                    simpleUrl:'importData/clnj/车辆年检.xlsx',
                }],
                //车辆保养
                [{
                    value: 'by',
                    label: '车辆保养',
                    completeUrl:'importData/clby/车辆保养.xlsx',
                    simpleUrl:'importData/clby/车辆保养.xlsx',
                }],
                //车辆出险
                [{
                    value: 'cx',
                    label: '车辆出险',
                    completeUrl:'importData/clcx/车辆出险.xlsx',
                    simpleUrl:'importData/clcx/车辆出险.xlsx',
                }],
                //车辆维修
                [{
                    value: 'wx',
                    label: '车辆维修',
                    completeUrl:'importData/clwx/车辆维修.xlsx',
                    simpleUrl:'importData/clwx/车辆维修.xlsx',
                }]

            ],
        }
    },

    mounted() {
        let _self = this;
        var cType = '';
        var oType = '';

        layui.use(['upload', 'element', 'layer'], function () {
            let upload = layui.upload;
            element = layui.element;
            var $ = layui.jquery;
            var timer;//定义一个计时器

            $('.verifyForm').on('click', function () {
                if(_self.currentTab === 1){
                    layer.msg('请选择上传车辆订单类型');
                    return false;
                }
                if(_self.currentTab === 2){
                    layer.msg('请选择上传客户类型');
                    return false;
                }
            })

            upload.render({
                elem: '.demoMore',
                size: 500 * 1024 * 1024,
                accept: 'file', //普通文件
                acceptMime: '.xls,.xlsx',
                exts: 'xls|xlsx',
                // progress: function(obj) {
                //     var n = 0;
                //     timer = setInterval(function(){//按照时间随机生成一个小于95的进度，具体数值可以自己调整
                //         n = n + Math.random()*10|0;
                //         if(n>95){
                //             n = 95;
                //             clearInterval(timer);
                //         }
                //         console.log('进度条', n+'%');
                //         let objBefore = {
                //             status: 2,
                //             currentTabComponent: 'import-progress',
                //             percentage: n,
                //         }
                //         _self.$emit('change-status', objBefore);
                //         eventBus.status = {
                //             percentage:n
                //         }
                //         //element.progress('demo', n+'%');
                //     }, 50+Math.random()*100);
                // },
                before: function (obj) {
                    layer.load();
                    cType = $("#ct").val();
                    if(cType != '' && cType != undefined){
                        this.data.importCType = cType;
                    }

                    oType = $("#ot").val();
                    if(oType != '' && oType != undefined){
                        this.data.rentType = oType;
                    }
                },
                done: function (r) {
                    clearInterval(timer);

                    let objDone;
                    console.log(r);
                    _self.$emit('import-complete', objDone);
                    // if(r.resultFlag == undefined){
                    //     if(r.code == 0){
                    //         objDone = {
                    //             status: 4,
                    //             currentTabComponent: 'import-status',
                    //             progress: 100,
                    //             msg: r.message,
                    //             busType:'进入'
                    //         }
                    //     } else {
                    //         objDone = {
                    //             status: 3,
                    //             currentTabComponent: 'import-status',
                    //             progress: 100,
                    //             msg: r.message
                    //         }
                    //     }
                    //     _self.$emit('change-status', objDone);
                    //     eventBus.status = {
                    //         msg: r.message,
                    //         busType:'进入'
                    //     }
                    // } else {
                    //     if (r.resultFlag == 1 || r.resultFlag == 3) {
                    //         objDone = {
                    //             status: 4,
                    //             currentTabComponent: 'import-status',
                    //             progress: 100,
                    //             msg: r.msg,
                    //             busType:'进入'
                    //         }
                    //     } else {
                    //         console.log($("#ct").val());
                    //         objDone = {
                    //             status: 3,
                    //             currentTabComponent: 'import-status',
                    //             progress: 100,
                    //             msg: r.msg,
                    //             numberNo:r.numberNo,
                    //             rentType:r.rentType,
                    //             customerType:r.customerType
                    //         }
                    //     }
                    //
                    //     _self.$emit('change-status', objDone);
                    //     eventBus.status = {
                    //         msg: r.msg,
                    //         numberNo:r.numberNo,
                    //         rentType:r.rentType,
                    //         customerType:r.customerType,
                    //         busType:'进入'
                    //     }
                    // }
                },
                error: function (r) {
                    alert("导入失败！"+r);
                }
            });
            layer.closeAll('loading'); //关闭loading
        })
    },

    watch: {
        currentTab: {
            handler: function (n, o) {

            },
            immediate: true,
        }
    },

    methods: {
        filterUrl(url) {
            return this.importUrl + url
        },

        // 订单导入选择导入类型
        changeOrderSelect(data) {
            if (data != null && data != '') {
                this.importType = data.value;
                $("#ot").val(this.importType);
                this.orderCarShow = 1;
            }
        },

        // 客户导入选择导入类型
        changeCustomerSelect(data) {
            if (data != null && data != '') {
                this.importCType = data.value;
                $("#ct").val(this.importCType);
                this.customerShow = 1;
            }
        },
        // 下载导入模版
        downloadExportTemplate(obj, type){
           if (obj){
               if(type==1){
                   window.location.href = importURL+obj.simpleUrl
               }else {
                   window.location.href = importURL+obj.completeUrl
               }
           }else {
               alert('模版不存在');
           }
        },
        // 下载模板(废弃)
        changeSelect() {
            var data = this.value1;
            if (data != null && data != '') {
                if (data.length == 2) {
                    if (data[0] == '1') {
                        if (data[1] == 'jz') {
                            window.location.href = importURL + "importData/order/jz/jzdr.xlsx"; // 经租
                        } else if (data[1] == 'yzdg') {
                            window.location.href = importURL + "importData/order/yzdg/yzdgdr.xlsx"; // 以租代购
                        } else if (data[1] == 'rz') {
                            window.location.href = importURL + "importData/order/rz/rzdr.xlsx"; // 融租
                        } else if (data[1] == 'zg') {
                            window.location.href = importURL + "importData/order/zg/zgdr.xlsx"; // 直购
                        } else if (data[1] == 'gk') {
                            window.location.href = importURL + "importData/order/gk/gkdr.xlsx"; // 直购
                        } else if (data[1] == 'zy') {
                            window.location.href = importURL + "importData/order/zy/zydr.xlsx"; // 直购
                        }
                    } else if (data[0] == '2') {
                        if (data[1] == 'qy') {
                            window.location.href = importURL + "importData/kh/qy/qykhdr.xlsx"; // 企业
                        } else {
                            window.location.href = importURL + "importData/kh/gr/grkhdr.xlsx"; // 个人
                        }
                    }
                } else {
                    if (data[0] == '0') {
                        window.location.href = importURL + "importData/cl/cldr.xls";// 车辆
                    } else if (data[0] == '3') {
                        window.location.href = importURL + "importData/clbx/bxdr.xlsx";// 保险
                    } else if (data[0] == '4') {
                        window.location.href = importURL + "importData/clnj/clnjdr.xlsx";// 年检
                    } else if (data[0] == '5') {
                        window.location.href = importURL + "importData/clby/bydr.xlsx";// 保养
                    } else if (data[0] == '6') {
                        window.location.href = importURL + "importData/clcx/cxdr.xlsx"; // 出险
                    } else if (data[0] == '7') {
                        window.location.href = importURL + "importData/clwx/wxdr.xlsx"; //维修
                    }
                }
            } else {
                alert("请选择下载模板类型");
            }
        },
    }
});


// 进度条
Vue.component('import-progress', {
    template: `<div>
                 <div class="module-body">
                    <div class="module-file">
                        <div>
                            <div class="progress">
                            <!--<div class="layui-progress" lay-showpercent="true" lay-filter="demo" >
                                <div class="layui-progress-bar layui-bg-red" lay-percent="0%"></div>
                            </div>-->
                                <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" :format="format"></el-progress>
                                <p class="progress-tip">数据正在导入中，请耐心等待</p>
                            </div>
                            <div class="reminder-box">
                                <img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">
                                <span>特别提示</span><br>
                                导入过程请勿关闭页面，关闭之后需要重新导入
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn cancel-btn">取消</button>
                </div>
</div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        }

    },
    data() {
        return {
            baseUrl: '',
            percentage: 0
        }
    },
    updated() {
       // alert(this.percentage);
        this.percentage = eventBus.status.percentage;
    },
    mounted() {
        //alert(this.percentage);
        this.percentage = eventBus.status.percentage;
    },

    methods: {
        filterUrl(url) {
            return this.importUrl + url
        },

        format() {

            this.percentage = eventBus.status.percentage;
            return this.percentage === 100 ? '满' : `${this.percentage}%`;
        }
    }
})


// error and success
Vue.component('import-status', {
    template: `<div> 
                 <div class="module-body">
                    <div class="module-file">
                        <div class="file-error">
                            <div class="import—error-box">
                                <div class="import—error">
                                    <img v-if="status==3" class="img" :src="filterUrl('/statics/images/import/error.png')" alt="下载模板">
                                    <img v-if="status==4" class="img" :src="filterUrl('/statics/images/import/success.png')" alt="下载模板">
                                </div>
                                <div class="import—download-file">
                                    <div class="font-size-18 error-title">
                                      <span v-if="status==4">导入成功!</span>
                                      <span v-if="status==3">导入失败!</span>
                                    </div>
                                    <div class="font-size-14" :class="status==3?'error-tip':'success-tip'" v-html="msg"></div>
                                </div>
                            </div>
                            <div v-if="status==3">
                                <div class="download-btn-error pointer">
                                    <img class="download-error" :src="filterUrl('/statics/images/import/download3.png')" alt="下载">
                                    <button class="button-error" @click="downloadErrorData">下载导入失败的数据</button>
                                </div>
                                <p class="font-size-14 err-tip">请按照要求重新修改上传！</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="btn-group" v-if="status==3">
                    <button class="btn cancel-btn" @click="cancelModelData">取消</button>
                    <button class="btn next-btn" @click="cancelModelData">重新上传</button>
                </div>
                <div class="btn-group" v-if="status==4">
                    <button class="btn cancel-btn" @click="cancelModelData">继续上传</button>
                    <button class="btn next-btn" @click="hrefBussTypeHtml"><div class="font-size-14"  v-html="busType"></div></button>
                </div>
                </div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        },
        currentTab: {
            type: Number,
            default: 0
        },
        currentTabComponent: {
            type: String
        }
    },
    data() {
        return {
            baseUrl: '',
            msg: '',
            numberNo:'',
            busType:'',
            rentType:''
        }
    },
    watch: {
        importUrl: {
            handler: function (n, o) {
                this.baseUrl = n;
            },
            immediate: true,
        }
    },
    updated() {
        if(this.currentTab == 3){// 保险
            this.busType = eventBus.status.busType+'车辆保险列表';
        } else if(this.currentTab == 0){// 车辆
            this.busType = eventBus.status.busType+'车辆列表';
        } else if(this.currentTab == 1){// 车辆订单
            this.busType = eventBus.status.busType+'订单列表';
        } else if(this.currentTab == 2){ // 客户
            this.busType = eventBus.status.busType+'客户列表';
        } else if(this.currentTab == 4){ // 年检
            this.busType = eventBus.status.busType+'年检列表';
        } else if(this.currentTab == 5){ // 保养
            this.busType = eventBus.status.busType+'保养列表';
        } else if(this.currentTab == 6){ // 出险
            this.busType = eventBus.status.busType+'出险列表';
        } else if(this.currentTab == 7){ // 维修
            this.busType = eventBus.status.busType+'维修列表';
        }
    },
    mounted() {
        if(this.currentTab == 3){// 保险
            this.busType = eventBus.status.busType+'车辆保险列表';
        } else if(this.currentTab == 0){// 车辆
            this.busType = eventBus.status.busType+'车辆列表';
        } else if(this.currentTab == 1){// 车辆订单
            this.busType = eventBus.status.busType+'订单列表';
        } else if(this.currentTab == 2){ // 客户
            this.busType = eventBus.status.busType+'客户列表';
        } else if(this.currentTab == 4){ // 年检
            this.busType = eventBus.status.busType+'年检列表';
        } else if(this.currentTab == 5){ // 保养
            this.busType = eventBus.status.busType+'保养列表';
        } else if(this.currentTab == 6){ // 出险
            this.busType = eventBus.status.busType+'出险列表';
        } else if(this.currentTab == 7){ // 维修
            this.busType = eventBus.status.busType+'维修列表';
        }
    },
    activated(){
        this.msg = eventBus.status.msg;
    },

    methods: {
        filterUrl(url) {
            return this.baseUrl + url;
        },

        // 取消、继续上传和重新上传回到初始界面
        cancelModelData(){
            let _self = this;
            let objDo={
                status :1,
                currentTab :0,
                currentTabComponent :'import-download'
            }

            _self.$emit('change-status', objDo);
        },

        // 上传成功进入模块列表
        hrefBussTypeHtml(){
            console.log(this.currentTab);
            if(this.currentTab == 3){// 保险
                window.location.href = tabBaseURL + 'modules/maintenance/insurancemanage.html';
            } else if(this.currentTab == 0){// 车辆
                window.location.href = tabBaseURL + 'modules/car/tcarbasic.html';
            } else if(this.currentTab == 1){// 车辆订单错
                window.location.href = tabBaseURL + 'modules/order/orderlistnew.html';
            } else if(this.currentTab == 2){ // 客户
                window.location.href = tabBaseURL + 'modules/customer/customerlist.html';
            } else if(this.currentTab == 4){ // 年检
                window.location.href = tabBaseURL + 'modules/maintenance/inspectionmanage.html';
            } else if(this.currentTab == 5){ // 保养
                window.location.href = tabBaseURL + 'modules/maintenance/maintenancemanage.html';
            } else if(this.currentTab == 6){ // 出险
                window.location.href = tabBaseURL + 'modules/outinsuranceorder/outinsuranceorder.html';
            } else if(this.currentTab == 7){ // 维修
                window.location.href = tabBaseURL + 'modules/carrepairorder/carrepairorder.html';
            }
        },

        // 下载错误日志
        downloadErrorData(){
            this.numberNo = eventBus.status.numberNo;
            this.rentType = eventBus.status.rentType;
            console.log(this.currentTab);
            if(this.currentTab == 3){// 保险错误数据下载
                window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo='+this.numberNo;
            } else if(this.currentTab == 0){// 车辆错误数据下载
                window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo=' + this.numberNo;
            } else if(this.currentTab == 1){// 车辆订单错误数据下载

                window.location.href = baseURL + 'order/order/downxlserr?numberNo=' + this.numberNo+"&rentType=" + this.rentType;
            } else if(this.currentTab == 2){ // 客户错误数据下载
                var exportUrl;
                if(eventBus.status.customerType == 1){
                    exportUrl = 'customer/exportQyExcel?numberNo=';
                } else {
                    exportUrl = 'customer/exportGrExcel?numberNo=';
                }
                window.location.href = baseURL + exportUrl + this.numberNo;
            } else if(this.currentTab == 4){ // 年检错误数据下载
                window.location.href = baseURL + 'maintenance/inspectionmanage/exportExcel?numberNo='+this.numberNo;
            } else if(this.currentTab == 5){ // 保养错误数据下载
                window.location.href = baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo='+this.numberNo;
            } else if(this.currentTab == 6){ // 出险错误数据下载
                window.location.href = baseURL + 'outinsuranceorder/ouinsuranceorder/exportExcel?numberNo='+this.numberNo;
            } else if(this.currentTab == 7){ // 维修错误数据下载
                window.location.href = baseURL + 'carrepairorder/carrepairorder/exportExcel?numberNo='+this.numberNo;
            }

        }
    }
})


// 拖拽上传图片
Vue.component('import-upload', {
    template: `<div class="module-main" >
                  <div class="module-body">
                    <div class="module-file">
                        <div>
                            <el-upload drag
                                       class="upload-demo"
                                       ref='upload'
                                       action="#"
                                       :before-upload="beforeUpload"
                                       :on-success="upSuccess"
                                       :on-error="upError"
                                       :on-remove="handleRemove"
                                       :on-change="upChange"
                                       multiple
                                       :on-exceed="handleExceed"
                                       :auto-upload="false"
                                       :file-list="fileList">
                                <div class="upload-file">
                                    <img class="uploading-icon" :src="filterUrl('/statics/images/import/uploading3.png')" alt="上传">
                                    <p class="font-size-14 zip-tip">可点击或拖拽ZIP文件到此处上传文件</p>
                                </div>
                            </el-upload>
                            <div class="reminder-box">
                                <img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">
                                <span>如何创建图片压缩包</span>
                                <div class="reminder-tab">
                                    <div class="reminder-tip-item">
                                        <img class="reminder-tip-icon" :src="filterUrl('/statics/images/import/tip2.png')" alt="">
                                        <p>P58764561.JPG</p>
                                        <p>图片命名必须是以车架号命名</p>
                                    </div>
                                    <div class="reminder-tip-item">
                                        <img :src="filterUrl('/statics/images/import/tip3.png')" alt="">
                                        <p>cl_xsz</p>
                                        <p>文件夹以车辆行驶证拼音简写命名</p>
                                    </div>
                                    <div class="reminder-tip-item">
                                        <img :src="filterUrl('/statics/images/import/tip4.png')" alt="">
                                        <p>cl_xsz.zip</p>
                                        <p>压缩包以车辆行驶证拼音简写命名</p>
                                    </div>
                                </div>
                                <div class="reminder-tip-text">
                                    <p>注意事项：<br>
                                        1.本次上传行驶证图片，如车辆已有行驶证图片，则已有行驶证图片全部清除，以本次上传的图片为准； <br>
                                        2.每台车最多只能上传一张行驶证，图片格式仅支持JPG/JPEG/BMP/PNG格式；<br>
                                        3.将文件夹压缩ZIP格式上传图片,压缩文件以车辆行驶证拼音简写命名（比如cl_xsz、clxsz，不分大小写）； <br>
                                        4.单张图片不得大于30M,大于30M上传后，不会显示该图片； <br>
                                        5.支持一次性上传多个压缩文件，并且每个压缩文件大小不能超过500M.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               <!-- <div class="btn-group">
                    <button class="btn cancel-btn">取消</button>
                </div>-->
              </div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        }
    },
    data() {
        return {
            baseUrl: '',
            fileList: [
               /* {
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }*/
            ]

        }
    },
    watch: {
        importUrl: {
            handler: function (n, o) {
                this.baseUrl = n;
            },
            immediate: true
        }
    },
    mounted() {

    },

    methods: {

        //上传之前
        beforeUpload(file) {
            console.log(file);
            const fileSuffix = file.name.substring(
                file.name.lastIndexOf('.') + 1
            );
            const whiteList = ['zip'];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$message({
                    type: 'error',
                    message: '上传文件只能是 zip 格式',
                    showClose: true,
                    offset: 80,
                });
                this.fileList = [];
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 500;
            if (!isLt2M) {
                this.$message({
                    type: 'error',
                    message: '上传文件不能超过500M',
                    showClose: true,
                    offset: 80,
                });
                return false;
            }
            return true;
        },
        // 上传成功
        upSuccess(res) {
            /*this.$message({
                type: 'success',
                message: '上传成功',
                showClose: true,
                offset: 80,
            })*/
        },
        // 上传失败
        upError() {
            /*this.$message({
                type: 'error',
                message: '上传失败',
                showClose: true,
                offset: 80,
            });*/
        },

        //上传的文件改变时（覆盖原来的文件）
        upChange(file, fileList) {
            let _self = this;
            var flag = this.beforeUpload(file);
            if(flag) {
                console.log("上传车辆行驶证压缩包：" + file, fileList);
                var formData = new FormData();
                formData.append("files", file.raw);
                formData.append("path", 'carDriverImage');
                $.ajax({
                    type: "POST",
                    url: baseURL + '/file/uploadZipFile',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (r) {
                        if (r.code == 0) {
                           /* _self.fileList = [{
                                name: 'food.jpeg',
                                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                            }]*/
                            layer.msg('上传成功！');
                        } else {
                           /* _self.fileList = [{
                                name: 'food.jpeg',
                                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                            }]*/
                            layer.msg('上传失败！' + r.msg);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                        layer.msg('上传失败', {icon: 5});
                    }
                });
            }
        },
        handleRemove(file) {
            console.log(file);
            console.log(file);
        },
        handleExceed() {

        },
        filterUrl(url) {
            return this.baseUrl + url;
        }
    }
})

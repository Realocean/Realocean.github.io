$(function () {

    // layui.config({
    //     base: '../../statics/common/'
    // }).extend({
    //     soulTable: 'layui/soultable/ext/soulTable.slim'
    // });
    // layui.use(['form', 'element', 'table','soulTable'], function () {
    //
    // });




});
// document.write('<script src="/statics/js/api_saas.js"></script>');

var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        dialogVisible: false,
        videoTitle : '',
        playerOptions: {
            playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
            autoplay: false,  // 如果为true,浏览器准备好时开始回放
            muted: false,     // 默认情况下将会消除任何音频。
            loop: false,      // 是否视频一结束就重新开始。
            preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9',  // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: false,  // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
                type: "video/mp4",  // 类型
                src: ''// url地址
            }],
            poster: '',  // 封面地址
            notSupportedMessage: '此视频暂无法播放，请稍后再试',  // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
                timeDivider: true,           // 当前时间和持续时间的分隔符
                durationDisplay: true,       // 显示持续时间
                remainingTimeDisplay: false, // 是否显示剩余时间功能
                fullscreenToggle: true       // 是否显示全屏按钮
            }
        },
        url: null,//文件地址
        datalist:[
            // {
            //     name: '保单识别',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/保单识别.mp4',
            //     coverUrl:'保单识别'
            // },
            // {
            //     name: '保险管理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/保险管理.mp4',
            //     coverUrl:'保险管理'
            // },
            // {
            //     name: '保养管理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/保养管理.mp4',
            //     coverUrl:'保养管理'
            // },
            {
                name: '财务管理',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/财务管理.mp4',
                coverUrl:'财务管理'
            },
            // {
            //     name: '车辆',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/车辆.mp4',
            //     coverUrl:'车辆'
            // },
            // {
            //     name: '出险管理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/出险管理.mp4',
            //     coverUrl:'出险管理'
            // },
            {
                name: '订单换车',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/订单换车.mp4',
                coverUrl:'订单换车'
            },
            // {
            //     name: '订单退车',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/订单退车.mp4',
            //     coverUrl:'订单退车'
            // },
            {
                name: '订单续租',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/订单续租.mp4',
                coverUrl:'订单续租'
            },
            // {
            //     name: '风控预警',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/风控预警.mp4',
            //     coverUrl:'风控预警'
            // },
            {
                name: '工作台介绍',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/工作台介绍.mp4',
                coverUrl:'工作台介绍'
            },
            {
                name: '后台操作',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/后台操作.mp4',
                coverUrl:'后台操作'
            },
            {
                name: '吉祥租小程序下单',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/吉祥租小程序下单.mp4',
                coverUrl:'吉祥租小程序下单'
            },
            // {
            //     name: '客户',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/客户.mp4',
            //     coverUrl:'客户'
            // },
            // {
            //     name: '年检管理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/年检管理.mp4',
            //     coverUrl:'年检管理'
            // },
            // {
            //     name: '企业用车',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/企业用车.mp4',
            //     coverUrl:'企业用车'
            // },
            // {
            //     name: '权限',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/权限.mp4',
            //     coverUrl:'权限'
            // },
            // {
            //     name: '维修管理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/维修管理.mp4',
            //     coverUrl:'维修管理'
            // },
            // {
            //     name: '违章查询-马赛克处理',
            //     fileType: 2,//1.pdf, 2视频 3.图片
            //     fileTypeName: '视频',
            //     fileName: '操作视频/违章查询-马赛克处理.mp4',
            //     coverUrl:'违章查询-马赛克处理'
            // },
            {
                name: '无审核流下单',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/无审核流下单.mp4',
                coverUrl:'无审核流下单'
            },
            {
                name: '有审核流下单',
                fileType: 2,//1.pdf, 2视频 3.图片
                fileTypeName: '视频',
                fileName: '操作视频/有审核流下单.mp4',
                coverUrl:'有审核流下单'
            },

            {
            name: '车辆违章查询步骤',
            fileType: 1,//1.pdf, 2视频 3.图片
            fileTypeName: '文档',
            fileName: '车辆违章查询步骤.pdf',
            coverUrl:'车辆违章查询步骤'
        },{
            name: '行知汽车租售管理系统后台操作手册-PC端(2)',
            fileType: 1,//1.pdf, 2视频 3.图片
            fileTypeName: '文档',
            fileName: '行知汽车租售管理系统后台操作手册-PC端(2).pdf',
            coverUrl:'行知汽车租售管理系统后台操作手册-PC端(2)'
        },{
            name: '客户端小程序注册认证流程',
            fileType: 1,//1.pdf, 2视频 3.图片
            fileTypeName: '文档',
            fileName: '客户端小程序注册认证流程.pdf',
            coverUrl:'客户端小程序注册认证流程'
        },{
            name: '支付宝代扣小程序操作流程',
            fileType: 1,//1.pdf, 2视频 3.图片
            fileTypeName: '文档',
            fileName: '支付宝代扣小程序操作流程.pdf',
            coverUrl:'支付宝代扣小程序操作流程'
        },]
    },
    updated: function(){
        layui.form.render();

    },
    mounted(){
        this.url = guideURL
    },
    methods: {
        getUrl(furl){
            return this.url+furl
        },

        showImg (name, url) {
            let that = this
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: that.url+url,
                    title: name
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        // showDoc: function (fileName, url) {
        //     let that = this
        //     if (viewer != null){
        //         viewer.close();
        //         viewer = null;
        //     }
        //     viewer = new PhotoViewer([
        //         {
        //             src: that.url+url,
        //             title: fileName
        //         }
        //     ], {
        //         appendTo:'body',
        //         zIndex:99891018
        //     });
        // },

        showDoc: function (name, url) {
            let that = this
            var index = layer.open({
                title: name,
                type: 2,
                content: that.url+url,
                success: function (layero, num) {

                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },


        getFileUrl(fileName){
            return [this.url+fileName]
        },

        playvide(name, url){
            let videoUrl = this.url+url
            var loadstr = '<video width="100%" height="100%"  controls="controls" autobuffer="autobuffer"  autoplay="autoplay" loop="loop"><source src="'+videoUrl+'" type="video/mp4"></source></video>'

            layer.open({
                type: 1,
                area: ['100%', '100%'],
                title: name,
                content: loadstr,
            });
        },

        itemClick(item){
            if (item.fileType === 1) {//文档
                this.showDoc(item.name, item.fileName)
                // this.$router.push({path: '/pdf/detail', query: {pdfSrc: item.filePreviewList[0], pdfName:item.name}})
            } else if (item.fileType === 2) {//视频
                // this.playerOptions.sources[0].src = this.url + item.fileName;
                // this.videoTitle = item.name;
                // this.dialogVisible = true;
                this.playvide(item.name, item.fileName)
            } else if (item.fileType === 3) {//图片
                //图片预览
                this.showImg(item.name, item.fileName)
            }
        }
    }
});


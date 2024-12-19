//合同在线服务
var documentServer = "https://139.9.238.105:32020/";
// var provinceUrl = location.origin;
var provinceUrl = '';
var tabBaseURL = '/static/templates/'
var imageURL = provinceUrl + "/image-server/";
var importURL = provinceUrl + "/image-server/";
var fileSaveURL = provinceUrl + "/image-server/";
var fileURL = provinceUrl + "/image-server/";
//pdf查看固定地址
var pdfViewUrl = provinceUrl + '/image-server/pdfjs/web/viewer.html?file=';
// var baseURL = location.protocol + "/xz-admin-api/";
// var baseURL = location.protocol + "/xz-ys-api/";
var baseURL = "/xz-ys-api/";
var url = window.location.host;
// 这里为啥要多拼接一个'/'呢，因为代码里引用时，没有拼接，因此此处必须拼接
provinceUrl = provinceUrl + "/";
// 帮助视频地址
var guideURL = provinceUrl + "image-server/help/";

// 一般只有本地才会用到，所以注释掉
// document.write('<script src="/statics/js/api_saas.js"></script>');


window.globalConfigImg = {
    imageURL:imageURL
};

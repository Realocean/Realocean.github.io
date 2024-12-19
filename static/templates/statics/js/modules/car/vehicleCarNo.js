$(function () {
    if(parent.layui.larryElem != undefined){
        var params = parent.layui.larryElem.boxParams;
        vm.tCarBasic = params.param
        vm.vehicleCar = params.vehicleCar
        vm.openCurrent = true;
    }
    layui.use(['layer', 'form','laydate'], function () {
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        var laydate = layui.laydate;
        form.on('radio(businessCheck)', function (data) {
            vm.vehicleCar.isVehicleCarPhoto = data.value;
            if(vm.vehicleCar.isVehicleCarPhoto === '1'){
                vm.showLicense = false;
            }else{
                vm.showLicense = true;
            }
        });

        form.on('submit(save)', function () {
            vm.save();
            return false;
        });

        form.verify({
            carNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '车牌号不能为空';
                }
            },
        });
        laydate.render({
            elem: '#registerDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.vehicleCar.registerDate = value;
            }
        });
        laydate.render({
            elem: '#licenseDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.vehicleCar.licenseDate = value;
            }
        });
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        tCarBasic:{},
        choiceorderType:false,
        vehicleCar:{isVehicleCarPhoto:1},
        showLicense:false,
        imgDrivinglicenseFront:null,
        data:{},
        tCarBasicData:{},
        vehicleCarData:{},
        openCurrent:false
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        inputCarWeight:function(){
            this.vehicleCar.carWeight = checkNum(this.vehicleCar.carWeight);
        },
        save:function(){
            if(vm.vehicleCar.isVehicleCarPhoto === '2'){
                //上传行驶证，信息可能发生变更
                vm.tCarBasicData = {
                    carId:vm.tCarBasic.carId,
                    carOwner:vm.vehicleCar.carOwner,
                    carType:vm.vehicleCar.carType,
                    carOwnerAddr:vm.vehicleCar.carOwnerAddr,
                    useType:vm.vehicleCar.useType,
                    carModelNo:vm.vehicleCar.carModelNo,
                    registerDate:vm.vehicleCar.registerDate,
                    licenseDate:vm.vehicleCar.licenseDate,
                    documentNo:vm.vehicleCar.documentNo,
                    userNum:vm.vehicleCar.userNum,
                    carWeight:vm.vehicleCar.carWeight,
                    carNo:vm.vehicleCar.carNo
                };
                vm.vehicleCarData = {
                    carId:vm.tCarBasic.carId,
                    oldCarNo:vm.tCarBasic.carNo,
                    vinNo:vm.tCarBasic.vinNo,
                    newCarNo:vm.vehicleCar.carNo,
                    vehicleRemark:vm.vehicleCar.remark,
                    oldDriverImg:vm.tCarBasic.imgDrivinglicenseFront1,
                    newDriverImg:vm.imgDrivinglicenseFront,
                    isVehicleCarPhoto:vm.vehicleCar.isVehicleCarPhoto
                };
            }else{
                //不上传行驶证，仅有车牌号会发生变更
                vm.tCarBasicData = {
                    carId:vm.tCarBasic.carId,
                    carNo:vm.vehicleCar.carNo
                };
                vm.vehicleCarData = {
                    carId:vm.tCarBasic.carId,
                    oldCarNo:vm.tCarBasic.carNo,
                    vinNo:vm.tCarBasic.vinNo,
                    newCarNo:vm.vehicleCar.carNo,
                    vehicleRemark:vm.vehicleCar.remark,
                    oldDriverImg:vm.tCarBasic.imgDrivinglicenseFront1,
                    newDriverImg:vm.imgDrivinglicenseFront,
                    isVehicleCarPhoto:vm.vehicleCar.isVehicleCarPhoto
                };
            }
            vm.data = {
                carBasic:vm.tCarBasicData,
                vehicleCar:vm.vehicleCarData
            }
            if(vm.tCarBasic.carNo === vm.vehicleCar.carNo){
                alert('新换车牌号与原车牌号一致，未进行修改！');
                return false;
            }
            var url = "pay/carvehiclelog/save" ;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.data),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            // parent.vm.reload();
                            if(vm.openCurrent){
                                closeCurrent();
                            }
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel:function(){
            parent.layer.closeAll();
            if(vm.openCurrent){
                closeCurrent();
            }
        }
    }
});

// 裁剪上传
var cropper;
var index;
var image = document.getElementById('cardImage');

// 画布
function cropperFun(imgBase64Data) {

    cropper = new Cropper(image, {
        viewMode: 1,
//                dragMode: 'none',
//                initialAspectRatio: 1,
//                preview: '.before',
//                background: true,
//                autoCropArea: 0.6
    })
    image.cropper.replace(imgBase64Data);
};

// 上传
function imageChange1(img) {
    var reader = new FileReader();
    reader.readAsDataURL(img.files[0]);
    reader.onload = function (e) {
        $('#imgDrivinglicenseFront').attr('src', '');
        $('#imgDrivinglicenseFront').attr('src', e.target.result);

        cropperFun(e.target.result);
        index = layer.open({
            title: "图片裁剪",
            type: 1,
            area: ['100%', '100%'],
            content: $("#choiceorderType"),
            end: function () {
                vm.choiceorderType = false;
                layer.close();
            }
        });
    }
}

function imageClick() {
    $('#image2').val('');
    $('#image2').click();
};

// 裁剪
function clipImage() {
    vm.choiceorderType = false;
    var that = this;
    let baseUrl = image.cropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
    }).toDataURL('image/jpeg');
    $('#imgDrivinglicenseFront').attr('src', baseUrl);
    var arr = baseUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    var extension = mime.split('/')[1];

    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    var newFileImg = new File([u8arr], 'new_file_img.' + extension, {type: mime});
    var formatData = new FormData();
    formatData.append("files", newFileImg);
    formatData.append('path', "xsz_images")
    console.log(newFileImg);
    //上传图片
    uploadNewFile(formatData);
}

//上传裁剪后图片
function uploadNewFile(formatData) {
    $.ajax({
        type: "POST",
        url: baseURL + 'file/uploadFile',
        data: formatData,
        processData: false,
        contentType: false,
        async: false,
        success: function (res) {
            vm.imgDrivinglicenseFront = res.data[0];
            rcrXsz(res.data[0]);
            layer.close(index);
        },
        error: function (e) {
            layer.close(index);
            console.log(e);
        }
    });
}

/**
 * 行驶证识别
 */
function rcrXsz(pathUrl) {
    $.ajax({
        type: "GET",
        url: baseURL + "car/tcarbasic/getCarDataByXszUrl?drivingLicenseUrl=" + pathUrl,
        data: null,
        success: function (result) {
            if (result.code == 0) {
                alert("识别行驶证照片成功！")
                Vue.set(vm.vehicleCar, "carOwner", result.driverData.carOwner);
                Vue.set(vm.vehicleCar, "carType", result.driverData.carType);
                Vue.set(vm.vehicleCar, "carOwnerAddr", result.driverData.carOwnerAddr);
                Vue.set(vm.vehicleCar, "useType", result.driverData.useType);
                Vue.set(vm.vehicleCar, "carModelNo", result.driverData.carModelNo);
                Vue.set(vm.vehicleCar, "registerDate", result.driverData.registerDate);
                Vue.set(vm.vehicleCar, "licenseDate", result.driverData.licenseDate);
                Vue.set(vm.vehicleCar, "carNo", result.driverData.carPlateNo);
                Vue.set(vm.vehicleCar, "vinNo", result.driverData.vinNo);
                Vue.set(vm.vehicleCar, "engineNo", result.driverData.engineNo);
            } else {
                vm.choiceorderType = false;
                alert("未识别出行驶证照片！")
            }
        },
        error:function (res) {
            vm.choiceorderType = false;
            console.log(e);
        }
    });
}

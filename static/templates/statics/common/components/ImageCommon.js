//组件未开发完，目前只能简单预览
let ImageCommon = null;
ImageCommon = Vue.component("ImageCommon", {
    template: `<div class="component-upload-image">
        <el-upload
            multiple
            name="files"
            :data="uploadObjs"
            :accept="accept"
            :disabled="disabled"
            :action="uploadImgUrl"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :on-change="handleChange"
            :limit="limit"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            ref="imageUpload"
            :on-remove="handleDelete"
            :show-file-list="true"
            :headers="headers"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :class="{
                hide: this.fileList.length >= this.limit,
                uoloadSty: showBtnDealImg,
                disUoloadSty: noneBtnImg,
                hideRight: disabled,
            }"
        >
            <i class="el-icon-plus"
                ><span
                    style="
                        display: block;
                        color: #4cc5cc;
                        font-size: 12px;
                        position: relative;
                        top: 16px;
                    "
                    >{{ info }}</span
                ></i
            >

            <div class="file-wrap" slot="file" slot-scope="{ file }">
                <div
                    class="flex-colum-center file-name"
                    v-if="isFile(file.url)"
                >
<!--                    <el-image-->
<!--                        style="width: 30px; height: 30px" fit="cover"-->
<!--                        :src="fileImage"-->
<!--                    />-->
                    <img style="width: 30px; height: 30px" :src="fileImage">
                    <span class="file-name_inline">{{ file.fileName }}</span>
                </div>

                <img
                    v-else
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                />
                <span class="el-upload-list__item-actions">
                    <span
                        v-if="canOpen(file)"
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                    >
                        <i class="el-icon-download"></i>
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDelete(file, fileList)"
                    >
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <span
            v-if="
                disabled &&
                (fileList === undefined ||
                    fileList === null ||
                    fileList == '' ||
                    fileList == [])
            "
            >
<!--            &#45;&#45;-->
            </span
        >

        <!-- 上传提示 -->
        <div class="el-upload__tip" slot="tip" v-if="showTip">
            <template v-if="fileSize">
                请上传大小不超过
                <b style="color: #f56c6c">{{ fileSize }}MB</b></template
            >
            <template v-if="fileType">
                格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b
                >的文件,</template
            >
            <template v-if="fileType">
                最多 <b style="color: #f56c6c">{{ limit }}份</b></template
            >
        </div>

        <el-dialog
            :visible.sync="dialogVisible"
            title="预览"
            width="90%"
            append-to-body
        >


            <template v-if="isFile(dialogImageUrl)">
                <el-input
                    v-if="isTxt"
                    :autosize="{ minRows: 8, maxRows: 15 }"
                    v-model="txtContent"
                    placeholder=""
                    readonly
                    type="textarea"
                ></el-input>


<!--                <vue-office-docx-->
<!--                    v-else-if="isDoc"-->
<!--                    :src="dialogImageUrl"-->
<!--                    style="height: 100vh;"-->
<!--                />-->

<!--                <vue-office-excel-->
<!--                    v-else-if="isExcel"-->
<!--                    :src="dialogImageUrl"-->
<!--                    style="height: 100vh;"-->
<!--                />-->

                <iframe
                    v-else
                    :src="dialogImageUrl"
                    frameborder="1"
                    width="100%"
                    height="600"
                >
                    <head>
                        <meta
                            http-equiv="Content-Type"
                            content="text/html; charset=UTF-8"
                        />
                    </head>
                </iframe>
            </template>

            <img
                v-else
                :src="dialogImageUrl"
                style="display: block; max-width: 100%; margin: 0 auto"
            />
        </el-dialog>
    </div>`,
    props: {
        upType: {
            type: Number,
            default: 0, //0图片 1文件  2图片+文件
        },
        info: {
            type: String,
            default: "请选择",
        },
        value: {
            type: [String, Object, Array],
            default: () => {
                return [];
            },
        },
        // 图片数量限制
        limit: {
            type: Number,
            default: 20,
        },
        // 大小限制(MB)
        fileSize: {
            type: Number,
            default: 20,
        },
        // 文件类型, 例如['png', 'jpg', 'jpeg']
        fileType: {
            type: Array,
            default: () => ["png", "jpg", "jpeg"],
        },
        // 是否显示提示
        isShowTip: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            fileImage: "/statics/images/file_word.png",
            uploadObjs: {path: "xsz_images"},
            showBtnDealImg: true,
            noneBtnImg: false,
            number: 0,
            uploadList: [],
            dialogImageUrl: "",
            dialogVisible: false,
            hideUpload: false,
            // baseFileUrl: 'http://view.xdocin.com/xdoc?_xdoc=',
            baseFileUrl: "https://view.officeapps.live.com/op/view.aspx?src=",
            baseUrl: "http://xzcz.shopec.com.cn/image-server/",
            // baseUrl: imageURL,
            uploadImgUrl: baseURL + "file/uploadFile", // 上传的图片服务器地址
            headers: {
                // Authorization: "Bearer " + getToken(),
            },
            fileList: [],
            img: ".png, .jpg, .jpeg, .bmp, .gif, .webp, .psd, .svg, .tiff",
            file: ".doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .pdf, .csv, .ftr, .mov, .mp4, .msg",
            unKnowFile: ".csv, .ftr, .mov, .mp4, .msg, .ppt, .pptx",//不支持预览的文件类型
            txtContent: "",
            isTxt: false,
            isDoc: false,
            isExcel: false,
        }
    },
    watch: {
        value: {
            async handler(val) {
                if (val) {
                    console.log('val', val)
                    // 首先将值转为数组
                    // let list;
                    // if (Array.isArray(val)) {
                    //     list = val;
                    // } else {
                    //     await listByIds(val).then((res) => {
                    //         list = res.data;
                    //     });
                    // }
                    //
                    // // 然后将数组转为对象数组
                    // this.fileList = list.map((item) => {
                    //     // 此处name使用ossId 防止删除出现重名
                    //     item = {
                    //         name: item.ossId,
                    //         url: item.url,
                    //         ossId: item.ossId,
                    //         fileName: item.originalName,
                    //     };
                    //     return item;
                    // });
                    if (Array.isArray(val)) {
                        this.fileList = _.deepClone(val).map(item => {
                            return {
                                url: this.baseUrl + item,
                                fileName: "文件",
                            }
                        })
                    } else if (typeof val === 'string') {
                        console.log('aa', val.split(","))
                        this.fileList = val.split(",").map(item => {
                            return {
                                url: this.baseUrl + item,
                                fileName: "文件",
                            }
                        })
                    }

                    console.log('this.fileList', this.fileList)
                    this.noneBtnImg =
                        this.disabled || this.fileList.length >= this.limit;
                } else {
                    this.fileList = [];
                    this.noneBtnImg =
                        this.disabled || this.fileList.length >= this.limit;
                    return [];
                }
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        // 是否显示提示
        showTip() {
            return this.isShowTip && (this.fileType || this.fileSize);
        },
        accept() {
            const all = this.img + ", " + this.file;

            return this.upType == 2
                ? all
                : this.upType == 1
                    ? this.file
                    : this.img;
        },
    },
    methods: {


        isFile(url) {
            let fileExtension = url.slice(url.lastIndexOf(".") + 1);
            return this.file.indexOf(fileExtension) >= 0;
        },
        handleChange(file, fileList) {
            this.noneBtnImg = this.disabled || fileList.length >= this.limit;
        },
        // 上传前loading加载
        handleBeforeUpload(file) {
            console.log('file', file)
            if (this.disabled) {
                return;
            }
            if (this.fileSize) {
                const isLt = file.size / 1024 / 1024 < this.fileSize;
                if (!isLt) {
                    // this.$modal.msgError(`大小不能超过 ${this.fileSize} MB!`);
                    this.$confirm(`大小不能超过 ${this.fileSize} MB!`, {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'error'
                    })
                    return false;
                }
            }
            // this.$modal.loading("正在上传，请稍候...");
            this.number++;
        },
        // 文件个数超出
        handleExceed() {
            // this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
            this.$confirm(`上传文件数量不能超过 ${this.limit} 个!`, {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'error'
            })
        },
        downloadFile(fileName, url) {
            const a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            a.href = url
            a.download = fileName
            a.click()
            window.URL.revokeObjectURL(url)
        },

        // 上传成功回调
        handleUploadSuccess(res, file) {
            // this.$modal.closeLoading();
            if (res.code === 0) {
                this.uploadList.push({
                    // name: res.data.fileName,
                    url: this.baseUrl + res.data[0],
                    // ossId: res.data.ossId,
                });
                this.uploadedSuccessfully();
            } else {
                this.number--;

                // this.$modal.msgError(res.msg);
                this.$confirm(res.msg, {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'error'
                })
                this.$refs.imageUpload.handleRemove(file);
                this.uploadedSuccessfully();
            }
            this.$emit("uploadEnd", "success");
        },
        handleDownload(file) {
            console.log("文件---", file);

            this.downloadFile(file.url, file.url);
            // window.location.href = file.url;
        },
        // 删除图片
        handleDelete(file, fileList) {
            this.noneBtnImg = this.disabled || fileList.length >= this.limit;
            const findex = this.fileList.map((f) => f.name).indexOf(file.name);
            if (findex > -1) {
                let ossId = this.fileList[findex].ossId;
                delOss(ossId);
                this.fileList.splice(findex, 1);
                this.$emit("input", this.listToString(this.fileList));
            }
        },
        // 上传失败
        handleUploadError(res) {
            // this.$modal.msgError("上传失败，请重试");
            this.$confirm("上传失败，请重试", {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'error'
            })
            // this.$modal.closeLoading();
            this.$emit("uploadEnd", "error");
        },
        // 上传结束处理
        uploadedSuccessfully() {
            if (this.number > 0 && this.uploadList.length === this.number) {
                this.fileList = this.fileList.concat(this.uploadList);
                this.uploadList = [];
                this.number = 0;
                this.$emit("input", this.listToString(this.fileList));
                // this.$modal.closeLoading();
            }
        },

        rentContractUrl(url) {
            let that = this;
            this.isTxt = false;
            this.isDoc = false;
            this.isExcel = false;
            if (this.isFile(url)) {
                let fileExtension = url.slice(url.lastIndexOf(".") + 1);
                if (fileExtension == "pdf" || fileExtension == "PDF") {
                    console.log('pdf->',pdfViewUrl + url)
                    return pdfViewUrl + url;
                    // return url;
                } else if (fileExtension == "txt" || fileExtension == "TXT") {
                    this.isTxt = true;
                    downFile(url).then((res) => {
                        const reader = new FileReader();

                        reader.onload = function () {
                            that.txtContent = reader.result;
                        };
                        reader.readAsText(res);
                    });
                    return url;
                }
                    // else if (fileExtension == "doc" || fileExtension == "docx" || fileExtension == "DOC" || fileExtension == "DOCX") {
                    //     this.isDoc = true;
                    //     return url;
                    // } else if (fileExtension == "xls" || fileExtension == "xlsx" || fileExtension == "XLS" || fileExtension == "XLSX") {
                    //     this.isExcel = true;
                    //     return url;
                // }
                else {
                    return this.baseFileUrl + encodeURIComponent(url);
                }
            } else {
                return url;
            }
        },

        // 预览
        handlePictureCardPreview(file) {
            this.dialogVisible = true;
            this.dialogImageUrl = this.rentContractUrl(file.url);
            console.log("this.dialogImageUrl", this.dialogImageUrl);
        },

        //是否能预览
        canOpen(file) {
            let fileExtension = file.url.slice(file.url.lastIndexOf(".") + 1);
            return this.unKnowFile.indexOf(fileExtension.toLowerCase()) < 0
        },

        // 对象转成指定字符串分隔
        listToString(list, separator) {
            let strs = "";
            separator = separator || ",";
            for (let i in list) {
                if (list[i].ossId) {
                    strs += list[i].ossId + separator;
                }
            }
            return strs != "" ? strs.substr(0, strs.length - 1) : "";
        },
    },

})

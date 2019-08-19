<template>
    <el-dialog :visible.sync="visible" title="导入文件" :close-on-click-modal="false" :close-on-press-escape="false" width="26%">
        <el-upload
                :action="url"
                drag
                multiple
                :on-exceed="handleExceed"
                class="upload_demo"
                :before-upload="beforeUploadHandle"
                :on-success="successHandle"
                :on-remove="handleRemove"
                :on-change="handleChange"
                http-request="uploadSectionFile"
                :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
        </el-upload>
    </el-dialog>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        data () {
            return {
                visible: false,
                url: '',
                num: 0,
                file: [],
                fileTemp:null
            }
        },
        methods: {
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            handleChange(file, fileList){
                this.fileTemp = file.raw
            },

            handleRemove(file,fileList){
                this.fileTemp = null
            },
            init () {
                this.visible = true
                this.url = `${window.SITE_CONFIG['apiURL']}/oss/file/upload?token=${Cookies.get('token')}`
                this.num = 0
                this.fileList = []
            },
            // 上传之前
            beforeUploadHandle (file) {
                if (file.type !== 'xlsx' && file.type !== 'xls') {
                    this.$message.error(this.$t('upload.tip', { 'format': 'xlsx、xls' }))
                    return false
                }
                this.num++
            },
            // 上传成功
            successHandle (res, file, fileList) {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.fileList = fileList
                this.num--
                if (this.num === 0) {
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false
                            this.$emit('refreshDataList')
                        }
                    })
                }
            },
            uploadSectionFile: function (param) { //自定义文件上传
                var fileObj = param.file;
                // 接收上传文件的后台地址
                var FileController = "/file/item/upload";
                // FormData 对象
                var form = new FormData();
                // 文件对象
                form.append("file", fileObj);
                // 其他参数
                form.append("xxx", xxx);
                // XMLHttpRequest 对象
                var xhr = new XMLHttpRequest();
                xhr.open("post", FileController, true);
                xhr.upload.addEventListener("progress", vm.progressFunction, false); //监听上传进度
                xhr.onload = function () {
                    vm.Form.playUrl = xhr.response; //接收上传到阿里云的文件地址
                    vm.$message({
                        message: '恭喜你，上传成功!',
                        type: 'success'
                    });
                };
                xhr.send(form);
            },
            progressFunction: function () {
                if (vm.i == 0) { //控制上传中状态只执行一次上传
                    vm.showStatus();
                    vm.showProgress = true;
                    vm.i = 1;
                }
            },
            showStatus: function () {
                var intervalId = setInterval(function () {
                    $.get("/file/item/percent", {}, function (data) {
                        var percent = data;
                        if (percent >= 100) {
                            clearInterval(intervalId);
                            percent = 100;//不能大于100
                            vm.uploadPercent = percent;
                            vm.resetPercent(); //在文章开头的上篇文章中有此函数,用于重置后台的上传进度
                        }
                        vm.uploadPercent = percent;
                    }, "json");
                }, 1000);
            },
        }
    }
</script>

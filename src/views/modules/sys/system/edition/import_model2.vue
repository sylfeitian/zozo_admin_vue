<template>
    <div style="display: inline-block;">
       <el-button v-if="importAndExportOptions && importAndExportOptions.exportUrl" class="btn" type="primary" @click="exportExcel">{{importAndExportOptions.exportWord}}</el-button>
        <el-upload
            v-if="importAndExportOptions && importAndExportOptions.importUrl"
            style="display:inline-block;margin-left:20px;"
            class="upload-demo"
            ref="upload"
            :action='importAndExportOptions.importUrl'
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
            :headers="myHeaders"
            :before-upload="beforeAvatarUpload"
            name="file"
            :on-progress="handleProgress"
            @on-change="handleChange"
            >
                <el-button slot="trigger"  class="btn"  type="primary">{{uploadLoading?"导入中...":importAndExportOptions.importWord}}</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传excel格式视频，且不超过10M</div> -->
        </el-upload>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import qs from 'qs'
export default {
    name:'bread',
    props: ['importAndExportOptions','dataForm'],
    data () {
        return {
            myHeaders: {},//Cookies.get(teacher_token)
            uploadLoading:false,
        }
    },
    created() {
        this.myHeaders ={token:Cookies.get('token')} ;
    },
    methods: {
           // 导入
            importExcel(){
                // importRegister
            },
            // https://gitbook.cn/books/5d81cd6b90dbf8361802570f/index.html
            // 导出
            exportExcel(){
                // let url = ""
                // let kvArr = Object.entries(this.dataForm);
                // kvArr.forEach(v=>{
                //     if(Object.prototype.toString.call(v[1]) =='[object Object]'){
                //         arguments.callee(v[1]);
                //     }else{
                //         url += v.join('=')+'&'
                //     }
                // })
                // url  = url.substring(0,url.length-1);
                // url = this.importAndExportOptions.exportUrl + "?"+url;
                // window.open(url);

                 var params = qs.stringify({
                    'token': Cookies.get('token'),
                    ...this.dataForm
                })
                window.location.href = `${this.importAndExportOptions.exportUrl}?${params}`
                //  window.open(`${this.importAndExportOptions.exportUrl}?${params}`);
            },
            // 导入之前
            beforeAvatarUpload(file) {
                var allImageType = 'apk';
				console.log(file.name);
				var dessnamenum = file.name.indexOf('.') + 1;
				console.log(file.name.substring(dessnamenum))
		 	 	const isJPG = allImageType.indexOf(file.name.substring(dessnamenum)) != -1;
		
		      if (!isJPG) { 
		        this.$message.error('仅支持（apk）为后缀的文件!');
		      }
		      return isJPG ;
            },
            // 导入过程中
            handleProgress(event, file, fileList){
                this.uploadLoading = true;
                console.log([event, file, fileList]);

                if(file.percentage>=90){
                    this.progress = 90;
                }else{
                    this.progress =parseInt(file.percentage);
                }
            },
            // 导入成功
            uploadSuccess(response, file, fileList){
                // console.log(file.per);
                let that = this;
                 that.uploadLoading = false;
                if(response.code=='200'){
                    that.$message({
                        message: response.msg,
                        type: "success",
                        duration: 1500
                    })
                    // that.dataFormSubmit();
                    that.$emit("getDataList");
                }else{
                    // that.progress = 0;
                    that.$message({
                        message: response.msg,
                        type: "error",
                        duration: 1500
                    })
                }
            },
            // 导入失败回调
            uploadError(response, file, fileList) {
                let that = this;
                that.uploadLoading = false;
                console.log("上传文件失败response" +response);
                console.log("上传文件失败file" +file);
                console.log("上传文件失败fileList" +fileList);
                that.$message({
                    message: "导入失败，请重新导入",
                    type: "error",
                    duration: 1500
                })
            },
            handleChange(){

            },

    }
}
</script>
<style>

</style>


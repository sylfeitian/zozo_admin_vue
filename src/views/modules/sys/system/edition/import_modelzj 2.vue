<template>
    <el-upload
        class="upload-demo"
        :action="postfileuploadurl"
        :show-file-list="false"
        multiple
        :before-upload="beforeAvatarUpload">
        <el-button class="btn" type="primary" >上传文件</el-button>
    </el-upload>  
    <!--:http-request="httpRequest"-->
</template>
<script>
import qs from 'qs'

export default {
    name:'bread',
    props: ['postfileuploadurl'],
    data () {
        return {
            url:``,
        }
    },
    created() {
    },
    methods: {
    	httpRequest (options) {
    		console.log(options);
    		return;
    		postfileupload
	  		const self = this;
		    let reader = new FileReader()
		    reader.readAsDataURL(options.file)
		    self.imgBase64Array = [];
		    self.imgurl = [];    //参数file清空
		    reader.onload  = function(event){
	     		let img_base64 = this.result
	     		self.imgBase64Array.push(img_base64)    //弹框img的src
	     		self.imgurl.push({'imgStr':img_base64,'pictureName':options.file.name}) //post提交的base64
		    }
	        console.log(self.imgurl)
	   },
           beforeAvatarUpload(file) {
		      	var allImageType = 'apk';
				console.log(file.name);
				var dessnamenum = file.name.indexOf('.') + 1;
				console.log(file.name.substring(dessnamenum))
		 	 	const isJPG = allImageType.indexOf(file.name.substring(dessnamenum)) != -1;
		
		      if (!isJPG) { 
		        this.$message.error('仅支持（apk）为后缀的文件zj!');
		      }
		      return isJPG ;
		    },

    }
}
</script>
<style>

</style>


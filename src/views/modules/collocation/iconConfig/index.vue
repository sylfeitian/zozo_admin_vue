<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-button type="primary" @click="editConfig()">添加商品</el-button>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
	    <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column>
		<el-table-column
		    prop="id"
		    label="模块名称">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="选中图标"
		    width="220">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="未选中图标"
		    width="220">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
	    	label="操作"
            width="220">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="addActivity(scope.row.id)">编辑</el-button>
		    </template>
	  	</el-table-column>
	</el-table>
	<!-- 分页 -->
    <el-pagination
	    @size-change="pageSizeChangeHandle"
	    @current-change="pageCurrentChangeHandle"
	    :current-page="page"
	    :page-sizes="[10, 20, 50, 100]"
	    :page-size="limit"
	    :total="total"
	    layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>


    <el-dialog
        title="编辑图标"
        :visible.sync="editVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="editDataForm" :rules="dataRule" ref="editDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item label="轮播图名称：" prop="sgName">
                <el-input v-model="editDataForm.sgName" placeholder="请输入30字以内的名称" :maxlength="30"></el-input>
            </el-form-item>
            <div class="imgConfig">
                <el-form-item label="上传轮播图：" :prop="editDataForm.imageUrl1?'imageUrl2':'imageUrl1'">
                    <div class="imgItem">
                        <el-upload
                            style="margin-right:30px;"
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess1"
                            :before-upload="beforeAvatarUpload1">
                            <img v-if="editDataForm.imageUrl1" :src="editDataForm.imageUrl1" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span style="width:100px;text-align:center;">选中状态</span>
                    </div>
                    
                    <div class="imgItem">
                        <el-upload
                            class="avatar-uploader"
                            action="/admin-api/picture/base64"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload2">
                            <img v-if="editDataForm.imageUrl2" :src="editDataForm.imageUrl2" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span style="width:100px;text-align:center;">未选中状态</span>
                    </div>
                    
                </el-form-item>
            </div>
            <div style="margin-left:120px;width:280px;color:#999;">只能上传jpg/png格式文件，文件不能超过5M,建议尺寸：100*100px；建议大小：100kb</div>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('editDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('editDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { zozogoodsPage } from '@/api/api'
    import Bread from "@/components/bread";
    import { constants } from 'fs';
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: businessPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                dataListLoading:false,
                dataList:[],
                buttonStatus:false,
                editVisible:false,
                editDataForm:{
                    sgName:'',
                    imageUrl1:'',
                    imageUrl2:''
                },
                breaddata: ["配置管理", "底部icon配置"],
            }
        },
        computed:{
            dataRule(){
                return{
                    sgName : [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    imageUrl1 : [
                            { required: true, message: '选中状态不能为空', trigger: 'blur' },
                    ],
                    imageUrl2: [
                            { required: true, message: '未选中状态不能为空', trigger: 'blur' },
                    ]
                }
            }
        },
        created(){
            this.demo();
        },
        methods: {
            editConfig(){
                this.editVisible = true;
            },
            handleAvatarSuccess1(res, file) {
                this.editDataForm.imageUrl1 = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload1(file) {
                let isJPG = false;
                if(file.type == 'image/jpeg'||file.type=='image/png'){
                    isJPG = true;
                }
                let isLt2M = file.size / 1024 / 1024 < 5;
                console.log(file.type,isJPG)
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是jpg/png格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isJPG && isLt2M;
            },
            handleAvatarSuccess2(res, file) {
                this.editDataForm.imageUrl2 = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload2(file) {
                let isJPG = false;
                if(file.type == 'image/jpg'||file.type=='image/png'){
                    isJPG = true;
                }
                let isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是jpg/png格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isJPG && isLt2M;
            },
            noCheck(formName){
                this.$refs[formName].resetFields();
                this.editVisible = false;
                this.editDataForm.imageUrl1='';
                this.editDataForm.imageUrl2='';
            },
            subActivity(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        
                    }
                });
            },



            demo(){
                function placeholderPic(){
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize=w/20+'px';
                }
                    placeholderPic();
                window.onresize=function(){
                    placeholderPic();
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
    .el-input {
    width: 170px;
    height: 40px;
    }
    .activiDialog{
        .el-input {
            width: 300px;
        }
    }
    .imgConfig{
        width: 100%;
        /deep/.el-form-item__content{
            display: flex;
            .avatar-uploader{
                width: 100px;
                height: 100px;
                .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    display: block;
                }
            }
        }
        .imgItem{
            display: flex;
            flex-direction: column;
        }
    }

</style>

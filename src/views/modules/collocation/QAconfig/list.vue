<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <!-- <el-button style="float:right;margin-bottom:20px;" type="primary" @click="addHelp()">新增帮助类型</el-button> -->
    <el-button style="float:right;margin-bottom:20px;" type="primary" @click="toDetail('1212211')">新增帮助类型</el-button>

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
		    label="排序">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="帮助类型"
		    width="220">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="问题数量">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
	    	label="操作"
            width="220">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toDetail(scope.row.id)">查看</el-button>
		    	<el-button type="text" size="small" @click="addHelp(scope.row.id)">编辑</el-button>
		    	<el-button type="text" size="small">删除</el-button>
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
        :title="helpTitle"
        :visible.sync="editVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="editDataForm" :rules="dataRule" ref="editDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item label="帮助类型：" prop="sgName">
                <el-input v-model="editDataForm.sgName" placeholder="请输入10字以内的名称" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input v-model="editDataForm.sort" type="number" :maxlength="30"></el-input>
            </el-form-item>
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
                helpTitle:'新增帮助类型',
                dataListLoading:false,
                dataList:[],
                buttonStatus:false,
                editVisible:false,
                editDataForm:{
                    sgName:'',
                    sort:'0',
                },
                breaddata: ["配置管理", "Q&A配置"],
            }
        },
        computed:{
            dataRule(){
                return{
                    sgName : [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    sort : [
                            { required: true, message: '排序不能为空', trigger: 'blur' },
                    ]
                }
            }
        },
        created(){
            this.demo();
        },
        methods: {
            toDetail(id){
                this.$emit("mainListFun",id);
            },
            addHelp(id){
                this.editVisible = true;
                if(id){
                    this.helpTitle = '编辑帮助类型'
                }else{
                    this.helpTitle = '新增帮助类型'
                }
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
        width: 240px;
        height: 40px;
    }

</style>

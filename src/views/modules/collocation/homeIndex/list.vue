<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <!-- <el-button style="float:right;margin-bottom:20px;" type="primary" @click="addHelp()">新增帮助类型</el-button> -->
    <el-button style="float:right;margin-bottom:20px;" type="primary" @click="toDetail('1212211')">添加推荐</el-button>
    <el-button style="float:right;margin:0 20px;" type="primary" @click="deleteHandle()">批量删除</el-button>

    <el-table
        :data="dataList"
        v-loading="dataListLoading"
        border
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%">
        <el-table-column 
            type="selection" 
            header-align="center" 
            align="center" 
            width="50">
        </el-table-column>
	    <!-- <el-table-column
	    	type="index"
		    prop="$index"
			align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column> -->
		<el-table-column
		    prop="id"
		    label="搭配集合ID">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="封面图片"
		    width="160">
		</el-table-column>
		<el-table-column
		    prop="account"
            width="240"
		    label="搭配集合标题">
		</el-table-column>
        <el-table-column
		    prop="account"
            width="70"
		    label="性别">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="添加时间">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
	    	label="操作"
            width="220">
		    <template slot-scope="scope">
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
                breaddata: ["配置管理", "首页集合推荐"],
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

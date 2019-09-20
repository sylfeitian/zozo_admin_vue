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
		    prop="idJp"
            align="center"
		    label="搭配集合ID">
		</el-table-column>
        <el-table-column
		    prop="imageUrl"
            align="center"
		    label="封面图片"
		    width="260">
            <template slot-scope="scope">
		    	<img style="width:200px;height:100px;object-fit: contain" :src="scope.row.imageUrl" alt="">
		    </template>
		</el-table-column>
		<el-table-column
		    prop="title"
            width="240"
            show-overflow-tooltip
		    label="搭配集合标题">
            <template slot-scope="scope">
                <div class="words">{{scope.row.title}}</div>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="gender"
            width="70"
            align="center"
		    label="性别">
            <template slot-scope="scope">
                <span v-if="scope.row.gender == 0">男</span>
                <span v-if="scope.row.gender == 1">女</span>
                <span v-if="scope.row.gender == 2">儿童</span>
                <span v-if="scope.row.gender == 3">worlder</span>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="createDate"
            align="center"
		    label="添加时间">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
            align="center"
	    	label="操作"
            width="220">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    import { homeIndexPage,homeIndexDelete } from '@/api/url'
    import { zozogoodsPage } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: true,
                    getDataListURL: homeIndexPage,
                    getDataListIsPage: true,
                    deleteURL: homeIndexDelete,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                dataForm:{
                    recommendFlag:1,
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
        // background: 
    }
    .words{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;
    }
	/deep/ .cell {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

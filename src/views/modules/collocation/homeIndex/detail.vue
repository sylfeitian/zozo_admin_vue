<template>
  <div>
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="搭配集合ID：">
            <el-input v-model="dataForm.storeId" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="搭配集合标题：">
            <el-input v-model="dataForm.storeId" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户：">
            <el-input v-model="dataForm.storeId" placeholder="请输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="性别：">
            <el-select v-model="dataForm.sex" clearable  placeholder="请选择">
                <el-option
                    v-for="item in sexs"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button  class="btn" type="primary" @click="toSet()">设为推荐</el-button>
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
    </el-form>
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
            width="160"
		    label="搭配集合ID">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="封面图片"
		    width="160">
		</el-table-column>
		<el-table-column
		    prop="account"
            width="220"
		    label="搭配集合标题">
		</el-table-column>	
        <el-table-column
		    prop="account"
		    label="用户">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="状态">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="性别">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="日本发布时间">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="发布时间">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="浏览量">
		</el-table-column>	
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toSet(scope.row.id)">设为推荐</el-button>
		    	<!-- <el-button type="text" size="small">删除</el-button> -->
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
                dataForm:{
                    sex:'',
                    storeId:'',
                },
                dataListLoading:false,
                dataList:[],
                sexs:[
                    {id:'',name:'全部'},
                    {id:'0',name:'男'},
                    {id:'1',name:'女'},
                    {id:'2',name:'儿童'},
                ],
                breaddata: ["配置管理", "首页集合推荐","添加推荐"],
            }
        },
        created(){
            this.demo();
        },
        methods: {
            changePage(){
                this.$emit("showListFun");
            },
            //重置
            reset(){
                this.dataForm = {
                    sex:'',
                    storeId:'',
                };
                this.getDataList();
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

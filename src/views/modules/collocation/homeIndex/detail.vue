<template>
  <div>
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="搭配集合ID：">
            <el-input v-model.trim="dataForm.idJp" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="搭配集合标题：">
            <el-input v-model.trim="dataForm.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户：">
            <el-input v-model.trim="dataForm.userNickname" placeholder="请输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="性别：">
            <el-select v-model="dataForm.gender" clearable  placeholder="请选择">
                <el-option
                    v-for="item in sexs"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            <el-button  class="btn" type="primary" @click="toSet()">设为推荐</el-button>
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
		    prop="idJp"
            width="160"
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
		    prop="userNickname"
            align="center" 
            width="180"
		    label="用户">
		</el-table-column>
        <el-table-column
		    prop="sate"
            align="center" 
		    label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.sate == 0">未发布</span>
                <span v-if="scope.row.sate == 1">已发布</span>
                <span v-if="scope.row.sate == 2">取消发布</span>
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
		    prop="publishTimeJp"
            align="center" 
            width="220"
		    label="日本发布时间">
		</el-table-column>
        <el-table-column
		    prop="publishTime"
            align="center" 
            width="220"
		    label="发布时间">
		</el-table-column>
        <el-table-column
		    prop="totalViewsNum"
            align="center" 
		    label="浏览量">
		</el-table-column>	
	    <el-table-column
	   		prop="address"
               align="center" 
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" v-if="scope.row.recommendFlag == 0" @click="toSet(scope.row.id)">设为推荐</el-button>
		    	<span style="font-size: 12px" v-if="scope.row.recommendFlag == 1">已推荐</span>
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
    import { homeIndexPage } from '@/api/url'
    import { sethomeIndexPage } from '@/api/api'
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
                },
                dataForm:{
                    idJp:'',
                    title:'',
                    userNickname:'',
                    gender:'',
                },
                dataListLoading:false,
                dataList:[],
                sexs:[
                    {id:'',name:'全部'},
                    {id:0,name:'男'},
                    {id:1,name:'女'},
                    {id:2,name:'儿童'},
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
                    idJp:'',
                    title:'',
                    userNickname:'',
                    gender:'',
                };
                this.getDataList();
            },
            toSet(id){
                if(this.dataListSelections.length==0&&!id){
                    this.$message.error('还没选择')
                }else{
                    let aa = [];
                    let status = false;
                    if(id){
                        aa = [id];
                    }else{
                        this.dataListSelections.map(item=>{
                            if(item.recommendFlag == 1){
                                status = true;
                                this.$message.warning('已推荐的不能在设置了')
                            }else{
                                aa.push(item.id) 
                            }
                        })
                    }
                    this.dataListSelections
                    console.log('aa11111',aa)
                    if(!status){
                        sethomeIndexPage({ids:aa}).then((res)=>{
                            console.log('9999999',res)
                            if(res.code == 200){
                                this.$message.success('设置成功');
                                this.getDataList();
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }
                    
                }
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

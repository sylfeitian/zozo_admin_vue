<template>
  <div>
      <Bread  :breaddata="breaddata"></Bread>
      <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
         <el-form-item label="输入搜索：">
          <el-input v-model="dataForm.groupName" placeholder="请输入属性组名" clearable></el-input>
        </el-form-item>
        <el-form-item label="启用状态：">
            <el-select v-model="dataForm.groupStatus">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  calss="btn" type="primary" @click="getDataList()">查询</el-button>
          <el-button  calss="btn"  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
      </el-form>
      
      <el-form>
      	<el-form-item>
           
           <el-button type="primary"  @click="addOrEditHandle()" >新增分组</el-button>
           <el-button type="danger" plain @click="deleteHandle()" >批量删除</el-button>
           <!-- <el-button   calss="btn"  @click="reset()" type="primary" plain>导出</el-button> -->
        </el-form-item>
      </el-form>
      
      <el-table
        width="100%"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%"
        >  
          <el-table-column
            type="selection"
            width="70">
          </el-table-column>

          <el-table-column
          label="序号"
          width="70"
          align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
              <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
            </template>
        </el-table-column>
        
           <el-table-column
		      prop="id"
		      label="分组编号"
		      align="center"
          min-width="200">
		    </el-table-column>

        <el-table-column
		      prop="groupName"
		      label="分组名称"
		      align="center"
          min-width="200">
		    </el-table-column>

        <el-table-column
		      prop="createDate"
		      label="创建时间"
		      align="center"
          width="180">
		    </el-table-column>

        <!-- <el-table-column
		      prop="sort"
		      label="排序"
		      align="center"
          min-width="200">
		    </el-table-column> -->

         <el-table-column
		      prop="groupStatus"
		      label="启用状态"
		      align="center"
          min-width="200">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.groupStatus==1">已启用</el-tag>
              <el-tag type="warning" v-else>未启用</el-tag>
            </template>
		    </el-table-column>

        <el-table-column
		      label="操作"
		      min-width="300"
		      align="center"
		      >
            <template slot-scope="scope">
			    <el-button @click.native.prevent="addOrEditHandle(scope.$index,scope.row)" type="text"size="mini">编辑</el-button>
               	<el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
               	<el-button @click.native.prevent="forbitHandle(scope.$index,scope.row)"type="text"size="mini">
                <span v-if="scope.row.groupStatus==1" class="artdisable">{{scope.$index==currentIndex&&forbitLoading?"禁用中..":"禁用"}}</span>
                <span v-else class="artstart">{{scope.$index==currentIndex && forbitLoading?"启用中..":"启用"}}</span>
               </el-button>
            </template>
		    </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>

       	<!-- 弹窗, 新建 -->
	    	<addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { statusAttributegroup} from '@/api/api'

import { attributeGroup,deleteAttributeGroupUrl } from '@/api/url'
  
import addEditData from './model-add-edit-data'
import Bread from "@/components/bread"

export default {
  mixins: [mixinViewModule],
  data () {
    return {
    breaddata: ["商品", "属性管理", "属性分组"],
    mixinViewModuleOptions: {
      getDataListURL: attributeGroup,
      getDataListIsPage: true,
      // exportURL: '/admin-api/log/login/export',
      deleteURL: deleteAttributeGroupUrl,
      deleteIsBatch: false,
      deleteIsBatch: true,
      deleteIsBatchKey: 'id'
    },
    forbitLoading:false,
    currentIndex:-1,
    addEditDataVisible:false,
    dataForm:{
        groupName:"",
        groupStatus:'',
    },
    params:{
      "currentPage": 1, //当前页数
      "currentPageSize" : 10, //每页显示的条数
      // "roleType" : 2 //角色(1-老师2-学生)
    },
     totalPage: 0,
     statusOptions: [
        {id:'',name:"全部"},
        {id:'1',name:"启用"},
        {id:'2',name:"禁用"}
     ],
    }
  },
  components: {
    addEditData,
    Bread
  },
  created () {
  },
  mounted(){
    // this.getDataList();
  },
  methods: {
    // 新建和编辑
    addOrEditHandle(index=-1,row=""){
       this.setAddEditDataVisible(true);
        this.$nextTick(() => {
          this.$refs.addEditData.init(row)
        })
    },
    setAddEditDataVisible(boolargu){
      this.addEditDataVisible =  boolargu;
    },
    // 重置
    reset(){
        this.dataForm.groupName = "";
         this.dataForm.groupStatus = "";
          this.getDataList();
        
    },
    forbitHandle(index,row){
      this.currentIndex = index;
       var obj = {
        "id": row.id,
        "groupStatus":row.groupStatus==1?2:1  //
      }
      var msg = ""
      row.groupStatus==1?msg="禁用":msg="启用"
      this.$confirm('是否'+msg+'该分组?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.forbitLoading = true;
            statusAttributegroup(obj).then((res)=>{
                this.forbitLoading = false;
                // console.log(res);
                if(res.code==200){
                    this.getDataList();
                    this.$message({
                      message:res.msg,
                        type: 'success',
                        duration: 1500,
                    })
                }else{
                  this.$message({
                      message:res.msg,
                      type: 'error',
                      duration: 1500,
                  })
                }
            })
        
        }).catch(() => {});


   
    }
  }
}
</script>

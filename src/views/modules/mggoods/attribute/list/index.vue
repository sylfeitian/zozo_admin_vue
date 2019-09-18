<template>
  <div>
      <Bread  :breaddata="breaddata"></Bread>

      <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="输入搜索：">
          <el-input v-model="dataForm.attrName" placeholder="请输入属性名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  calss="btn" type="primary" @click="getDataList()">搜索</el-button>
          <el-button   calss="btn"  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
         
      </el-form>
      <el-form>
      	<el-form-item>
          
          <el-button type="primary"  @click="addOrEditHandle()" >新增属性</el-button>
          <el-button type="danger" plain  @click="deleteHandle()" >批量删除</el-button>
          <!-- <el-button   calss="btn"  @click="reset()" type="primary" plain>导出</el-button>-->
        </el-form-item>
      </el-form>
      
      <el-table
        width="100%"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%"
        @selection-change="dataListSelectionChangeHandle"
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
		      prop="attrName"
		      label="属性名称"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="attrValue"
		      label="属性值"
		      align="center"
          min-width="200">
		    </el-table-column>

        <el-table-column
		      label="操作"
		      align="center"
          width="120"
		      >
            <template slot-scope="scope">
			        <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
              <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
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
import { attributePageUrl,deleteAttributeUrl } from '@/api/url'
  
import addEditData from './model-add-edit-data'
import Bread from "@/components/bread"

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      breaddata: ["商品", "属性管理", "属性列表"],
      mixinViewModuleOptions: {
        getDataListURL: attributePageUrl,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: deleteAttributeUrl,
        deleteIsBatch: true,
        deleteIsBatchKey: 'id'
      },
      addEditDataVisible:false,
      dataForm:{
          attrName:'',
          // groupName:''
      },
    }
  },
  components: {
    addEditData,
     Bread,
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
        this.dataForm.attrName = "";
         this.getDataList();
    },
  }
}
</script>

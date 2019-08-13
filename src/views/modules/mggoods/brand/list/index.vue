<template>
  <div>
      <Bread  :breaddata="breaddata"></Bread>
      <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="输入搜索：">
          <el-input v-model="dataForm.brandInitials" placeholder="请输入品牌首字母" clearable></el-input>
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" clearable></el-input>
        </el-form-item>
           <!-- <el-form-item label="展示方式：">
            <el-option
              v-for="item in optionsApplication"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-form-item> -->
         <el-form-item label="审核状态：">
            <el-select
                v-model="dataForm.brandApply">
                <el-option
                  v-for="item in brandApplyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  calss="btn" type="primary" @click="getDataList()">查询</el-button>
          <el-button   calss="btn"  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />         
      </el-form>
      
      <el-form>
      	<el-form-item>
        
          <el-button type="primary"  @click="addOrEditHandle()" >新增品牌</el-button>
           <el-button type="danger" plain @click="deleteHandle()" >批量删除</el-button>
           <!--  <el-button   calss="btn"  @click="reset()" type="primary" plain>导出</el-button> -->
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
		      prop="id"
		      label="品牌编号"
		      align="center"
          min-width="220">
		    </el-table-column>

        <el-table-column
		      prop="brandInitials"
		      label="品牌首字母"
		      align="center"
          min-width="200">
		    </el-table-column>
        
        <el-table-column
		      prop="brandName"
		      label="品牌名称"
		      align="center"
          min-width="200">
		    </el-table-column>
        
        <el-table-column
		      prop="brandNameEn"
		      label="英文名称"
		      align="center"
          min-width="200">
		    </el-table-column>

        <el-table-column
		      prop="brandPic"
		      label="品牌LOGO"
		      align="center"
          min-width="200">
           <template slot-scope="scope">
                <img  style="width:50px;height:50px;" :src="scope.row.brandPic | filterImgUrl" alt="">
           </template>
		    </el-table-column>

        <el-table-column
		      prop="brandApply"
		      label="审核状态"
		      align="center"
          min-width="200">
            <template slot-scope="scope">
               <span v-if="scope.row.brandApply==0">待审核</span>
              <span v-else-if="scope.row.brandApply==1">通过</span>
              <span v-else-if="scope.row.brandApply==2">未通过</span>
              <span v-else>--</span>
           </template>
		    </el-table-column>

        <el-table-column
		      label="操作"
		      align="center"
          min-width="220"
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
import { brandPageUrl,deleteBrandUrl } from '@/api/url'
  
import addEditData from './model-add-edit-data'
import Bread from "@/components/bread"

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      breaddata: ["商品", "品牌管理", "品牌列表"],
    mixinViewModuleOptions: {
      getDataListURL: brandPageUrl,
      getDataListIsPage: true,
      // exportURL: '/admin-api/log/login/export',
      deleteURL: deleteBrandUrl,
      deleteIsBatch: false,
      deleteIsBatch: true,
      deleteIsBatchKey: 'id'
    },
    addEditDataVisible:false,
    dataForm:{
        brandInitials:'',//品牌首字母
        brandName:'',// 英文名称
        brandNameEn:'',//品牌名称
        brandApply:''//0为申请中，1为通过，默认为1
    },
    params:{
      "currentPage": 1, //当前页数
      "currentPageSize" : 10, //每页显示的条数
      // "roleType" : 2 //角色(1-老师2-学生)
    },
    brandApplyList:[
      {id:"",name:'全部'},
      {id:"0",name:'待审核'},
      {id:"1",name:'通过'},
      {id:"2",name:'未通过'},
    ],
     totalPage: 0,
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
        this.dataForm.brandInitials = "";
        this.dataForm.brandName = "";
        this.dataForm.brandNameEn = "";
        this.dataForm.brandApply = "";
         this.getDataList();
    },
  }
}
</script>

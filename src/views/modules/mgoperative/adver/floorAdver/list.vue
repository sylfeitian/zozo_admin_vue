<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>运营</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>楼层广告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="h5楼层名称：">
            <el-input v-model.trim.trim="dataForm.floorName" placeholder="h5楼层名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告标题：">
            <el-input v-model.trim.trim="dataForm.advTitle" placeholder="广告标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="启用时间：">
                <el-date-picker
                    v-model="startList"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期">
                </el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label="停用时间：">
                <el-date-picker
                    v-model="endList"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期">
                </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getDataList()">搜索</el-button>
            <el-button @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
        
    </el-form>
    <el-form>
    	<el-form-item>
        <el-button type="primary" @click="addOrAdit()">添加广告</el-button>
        <el-button type="danger" plain @click="deleteHandle()">批量删除</el-button>
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
	      width="70">
	    </el-table-column>
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
		    prop="imageUrl"
            width="140"
            align="center"
		    label="广告图">
            <template slot-scope="scope" v-if="scope.row.imageUrl">
                <img :src="$imgDomain + scope.row.imageUrl" alt="img" style=" object-fit: contain;width: 60px;height:60px;">
		    </template>
		</el-table-column>
        <el-table-column
		    prop="floorName"
            align="center"
		    label="h5楼层名称">
		</el-table-column>
        <el-table-column
		    prop="advTitle"
            align="center"
		    label="广告标题">
		</el-table-column>
        <el-table-column
		    prop="startDate"
            align="center"
            width="180"
		    label="启用时间">
		</el-table-column>
        <el-table-column
		    prop="endDate"
            width="180"
            align="center"
		    label="停用时间">
		</el-table-column>
        <el-table-column
		    prop="sort"
		    label="排序"
            align="center"
		    width="60">
		</el-table-column>
	    <el-table-column
	   		prop="address"
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
	        <el-button type="text" size="small" @click="addOrAdit(scope.row.id)">编辑</el-button>
	        <el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
// import { businessPageUrl } from '@/api/url'
// import { storeGrade } from '@/api/api'
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: '/admin-api/adv/page',
          getDataListIsPage: true,
          deleteURL: '/admin-api/adv',
          deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
      },
      dataForm: {
          advType:'1'
      },
      startList:[],
      endList:[]
    }
  },
  watch: {
    startList(newval,oldval) {
      if(newval){
          this.dataForm.startDate1 = newval[0];
          this.dataForm.startDate2 = newval[1];
      }else{
          this.dataForm.startDate1 = '';
          this.dataForm.startDate2 = '';
      }
    },
    endList(newval,oldval) {
      if(newval){
          this.dataForm.endDate1 = newval[0];
          this.dataForm.endDate2 = newval[1];
      }else{
          this.dataForm.endDate1 = '';
          this.dataForm.endDate2 = '';
      }
    }
  },
  methods: {
        addOrAdit(id){
            this.$emit("addOrAditFn",id);
        },
        reset() {
            this.startList = [];
            this.endList = [];
            this.dataForm = {};
            this.dataForm.advType = '1';
            this.getDataList();
        }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}

</style>

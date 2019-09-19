<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>运营</el-breadcrumb-item>
        <el-breadcrumb-item>移动端首页配置</el-breadcrumb-item>
        <el-breadcrumb-item>首页菜单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="菜单名称：">
            <el-input v-model="dataForm.menuName" placeholder="菜单名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="是否显示：">
            <el-select v-model="dataForm.showFlag" placeholder="请选择">
                <el-option
                    v-for="item in showFlagList"
                    :key="item.id"
                    :label="item.sgName"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
            <el-button type="primary" plain @click="reset()">重置</el-button>
        </el-form-item>
        <br />
    </el-form>
    <el-form>
    	<el-form-item>
        <el-button type="primary" @click="addOrAdit()">新增菜单</el-button>
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
            label="序号"
            align="center"
            width="70">
            <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
        </el-table-column>
		<el-table-column
		    prop="menuName"
		    label="菜单名称"
            align="center"
        >
            <template slot-scope="scope">
                <div>
                    <span style="width: 40px; height: 40px;margin-right:20px;" v-if="scope.row.menuIcon">
                        <img :src="$imgDomain + scope.row.menuIcon" alt="img" style=" object-fit: contain;width: 40px;">
                    </span>
                    <span>{{scope.row.menuName}}</span>
                </div>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="showFlag"
            align="center"
		    label="是否显示">
            <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.showFlag==0">不显示</el-tag>
                <el-tag type="success" v-else>显示</el-tag>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="createDate"
            align="center"
            width="180"
		    label="创建时间">
		</el-table-column>
        
        <el-table-column
		    prop="sort"
            align="center"
		    label="排序"
		    width="60">
		</el-table-column>
	    <el-table-column
	   		prop="address"
               width="140"
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
          getDataListURL: '/admin-api/mobile/indexmenu/page',
          getDataListIsPage: true,
          deleteURL: '/admin-api/mobile/indexmenu/batch',
          deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
      },
      dataForm: {
          showFlag:''
      },
      showFlagList:[
          {id:'',sgName:'全部'},
          {id:0,sgName:'不显示'},
          {id:1,sgName:'显示'}
      ]
    }
  },
  methods: {
        addOrAdit(id){
            this.$emit("addOrAdit",id);
        },
        reset() {
            this.dataForm = {
                showFlag:''
            };
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

<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>

    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="楼层名称：">
            <el-input v-model="dataForm.floorName" placeholder="楼层名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="是否显示：">
            <el-select v-model="dataForm.isShow" placeholder="请选择">
                <el-option
                    v-for="item in showFlagList"
                    :key="item.id"
                    :label="item.sgName"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
            <el-button type="primary" @click="getDataList()">查询</el-button>
            <el-button @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
    </el-form>
    <el-form>
    	<el-form-item>
        <el-button type="primary" @click="addOrAdit()">新增楼层</el-button>
    	</el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
	    <!-- <el-table-column
	      type="selection"
	      width="70">
	    </el-table-column> -->
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
		    prop="floorName"
            align="center"
		    label="楼层名称">
		</el-table-column>
		<!-- <el-table-column
		    prop="floorCode"
		    label="楼层标识">
		</el-table-column> -->
        <el-table-column
		    prop="isShow"
            align="center"
		    label="是否显示">
            <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.isShow==0">不显示</el-tag>
                <el-tag type="success" v-else>显示</el-tag>
		    </template>
		</el-table-column>
        <el-table-column
            align="center"
            width="180"
		    prop="createDate"
		    label="创建时间">
		</el-table-column>
        <el-table-column
		    prop="updateDate"
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
            align="center"
            width="140"
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
import Bread from "@/components/bread";
// import { businessPageUrl } from '@/api/url'
// import { storeGrade } from '@/api/api'
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: '/admin-api/webfloor/page',
          getDataListIsPage: true,
          deleteURL: '/admin-api/webfloor',
          deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
      },
      breaddata: ["运营", "移动端首页配置", "首页楼层"],
      dataForm: {
          isShow:''
      },
      showFlagList:[
          {id:'',sgName:'全部'},
          {id:0,sgName:'不显示'},
          {id:1,sgName:'显示'}
      ]
    }
  },
  components:{
        Bread
    },
  methods: {
        addOrAdit(id){
            this.$emit("addOrAdit",id);
        },
        reset() {
            this.dataForm = {
                isShow:''
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

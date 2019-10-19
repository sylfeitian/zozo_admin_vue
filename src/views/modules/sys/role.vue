<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <div class="mod-sys__role">
      <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
        <el-form-item label="名称：">
          <el-input v-model.trim.trim="dataForm.name" :placeholder="$t('role.name')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary">{{ $t('query') }}</el-button>
          <el-button  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
        
      </el-form>
      
      <el-form>
      	<el-form-item>
          <el-button v-if="$hasPermission('sys:role:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button v-if="$hasPermission('sys:role:delete')" type="danger" plain @click="deleteHandle()">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
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
        <el-table-column prop="name" :label="$t('role.name')" header-align="center" align="center" width="320"></el-table-column>
        <el-table-column prop="remark" :label="$t('role.remark')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope" v-if="scope.row.roleFlag!==1">
            <el-button v-if="$hasPermission('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:role:delete')" type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './role-add-or-update'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/admin-api/role/page',
        getDataListIsPage: true,
        deleteURL: '/admin-api/role',
        deleteIsBatch: true
      },
      breaddata: ["网站设置", "权限", "角色管理"],
      dataForm: {}
    }
  },
  components: {
    AddOrUpdate,
    Bread
  },
  methods:{
    reset(){
      this.dataForm = {};
      this.getDataList();
    }
  }
}
</script>

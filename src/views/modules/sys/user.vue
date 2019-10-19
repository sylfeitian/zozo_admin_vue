<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>

    <div class="mod-sys__user">
      <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
        <el-form-item label="用户名：">
          <el-input v-model.trim.trim="dataForm.username" :placeholder="$t('user.username')" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属角色：">
          <el-input v-model.trim.trim="dataForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary">{{ $t('query') }}</el-button>
          <el-button  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
      </el-form>
      <el-form>
      	<el-form-item>
          <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button v-if="$hasPermission('sys:user:delete')" type="danger" plain @click="deleteHandle()">批量{{ $t('deleteBatch') }}</el-button>
          <el-button v-if="$hasPermission('sys:user:export')" type="primary" plain @click="exportHandle()">{{ $t('export') }}</el-button>
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
        <el-table-column prop="username" :label="$t('user.username')" header-align="center" align="center" width="130px"></el-table-column>
        <el-table-column prop="roleName" label="所属角色" header-align="center" align="center"></el-table-column>
        <el-table-column prop="email" :label="$t('user.email')" header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="mobile" :label="$t('user.mobile')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" :label="$t('user.status')" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('user.status0') }}</el-tag>
            <el-tag v-else size="small" type="success">{{ $t('user.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('user.createDate')" header-align="center" align="center" width="180">
        </el-table-column>
        <el-table-column :label="$t('handle')" header-align="center" align="center">
          <template slot-scope="scope" v-if="scope.row.superAdmin!==1">
            <el-button v-if="$hasPermission('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:user:delete')" type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './user-add-or-update'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/admin-api/user/page',
        getDataListIsPage: true,
        deleteURL: '/admin-api/user',
        deleteIsBatch: true,
        exportURL: '/admin-api/user/export'
      },
      breaddata: ["网站设置", "权限", "管理员管理"],
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

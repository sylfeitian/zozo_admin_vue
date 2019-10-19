<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <div class="mod-sys__log-login">
      <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
        <el-form-item label="用户名：">
          <el-input v-model.trim="dataForm.creatorName" :placeholder="$t('logLogin.creatorName')" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="dataForm.status" :placeholder="$t('logLogin.status')" clearable>
            <el-option :label="$t('logLogin.status0')" :value="0"></el-option>
            <el-option :label="$t('logLogin.status1')" :value="1"></el-option>
            <el-option :label="$t('logLogin.status2')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
          <el-button type="primary" plain @click="reset()">重置</el-button>
        </el-form-item>
        <br />
      </el-form>
      <el-form>
      	<el-form-item>
          <el-button type="primary" plain @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
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
        <el-table-column prop="creator" :label="$t('logLogin.creatorName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="operation" :label="$t('logLogin.operation')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.operation === 0 ? $t('logLogin.operation0') : $t('logLogin.operation1') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('logLogin.status')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('logLogin.status0') }}</el-tag>
            <el-tag v-else-if="scope.row.status === 1" size="small" type="success">{{ $t('logLogin.status1') }}</el-tag>
            <el-tag v-else size="small" type="warning">{{ $t('logLogin.status2') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" :label="$t('logLogin.ip')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userAgent" :label="$t('logLogin.userAgent')" header-align="center" align="center" width="250" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" :label="$t('logLogin.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
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
    </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/admin-api/log/login/page',
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export'
      },
      breaddata: ["网站设置", "日志", "登录日志"],
      dataForm: {
        creatorName: '',
        status: ''
      }
    }
  },
  components: {
    Bread
  },
  methods:{
    reset(){
            this.dataForm = {
                 creatorName: '',
                  status: ''
            };
            this.getDataList();
    }
  }
}
</script>

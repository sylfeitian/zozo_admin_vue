<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>

    <div class="mod-sys__log-error">
      <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
        <el-form-item label="模块名称：">
          <el-input v-model.trim="dataForm.module" :placeholder="$t('logError.module')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary">{{ $t('query') }}</el-button>
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
        <el-table-column prop="module" :label="$t('logError.module')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="requestUri" :label="$t('logError.requestUri')" header-align="center" align="center" width="240"></el-table-column>
        <el-table-column prop="requestMethod" :label="$t('logError.requestMethod')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="requestParams" :label="$t('logError.requestParams')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ip" :label="$t('logError.ip')" header-align="center" align="center" width="140"></el-table-column>
        <el-table-column prop="userAgent" :label="$t('logError.userAgent')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" :label="$t('logError.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="infoHandle(scope.row.errorInfo)">{{ $t('logError.errorInfo') }}</el-button>
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
        getDataListURL: '/admin-api/log/error/page',
        getDataListIsPage: true,
        exportURL: '/admin-api/log/error/export'
      },
      dataForm: {
        module: ''
      },
      breaddata: ["网站设置", "日志", "异常日志"],
    }
  },
  components: {
    Bread
  },
  methods: {
    // 异常信息
    infoHandle (info) {
      this.$alert(info, this.$t('logError.errorInfo'), {
        customClass: 'mod-sys__log-error-view-info'
      })
    },
     reset(){
            this.dataForm = {
                 module: ''
            };
            this.getDataList();
    }
  }
}
</script>

<style lang="scss">
.mod-sys__log-error {
  &-view-info {
    width: 80%;
  }
}
</style>

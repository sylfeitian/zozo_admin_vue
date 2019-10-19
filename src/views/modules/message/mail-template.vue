<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <div class="mod-message__mail-template">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="名称：">
          <el-input v-model.trim="dataForm.name" :placeholder="$t('mail.name')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button type="primary" @click="configHandle()">{{ $t('mail.config') }}</el-button>
          <el-button type="danger" plain @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
        <el-table-column prop="name" :label="$t('mail.name')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subject" :label="$t('mail.subject')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('mail.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="sendHandle(scope.row.id)">{{ $t('mail.send') }}</el-button>
            <el-button type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 邮件配置 -->
      <config v-if="configVisible" ref="config"></config>
      <!-- 弹窗, 发送邮件 -->
      <send v-if="sendVisible" ref="send" @refreshDataList="getDataList"></send>
    </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './mail-template-add-or-update'
import Config from './mail-template-config'
import Send from './mail-template-send'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/message/mailtemplate/page',
        getDataListIsPage: true,
        deleteURL: '/message/mailtemplate',
        deleteIsBatch: true
      },
      breaddata: ["系统设置", "消息管理",'邮件模板'],
      dataForm: {
        name: ''
      },
      configVisible: false,
      sendVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Config,
    Send,
    Bread
  },
  methods: {
    // 邮件配置
    configHandle () {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 发送邮件
    sendHandle (id) {
      this.sendVisible = true
      this.$nextTick(() => {
        this.$refs.send.dataForm.id = id
        this.$refs.send.init()
      })
    }
  }
}
</script>

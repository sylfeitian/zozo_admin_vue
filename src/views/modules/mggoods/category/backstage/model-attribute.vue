<template>
    <!-- 属性 -->
    <el-dialog title="关联属性" :visible.sync="visible" :before-close="closeDialog">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item label="属性名称：">
          <el-input v-model="dataForm.attrName" placeholder="属性名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌分组：">
          <el-input v-model="dataForm.groupName" placeholder="品牌分组"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border style=" width:9%6;margin:auto"   ref="multipleTable" @selection-change="dataListSelectionChangeHandle">
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column property="attrName" label="属性名称"></el-table-column>
        <el-table-column property="attrValue" label="属性值"></el-table-column>
        <el-table-column property="attrGroupValue" label="属性分组"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
         <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
      </div>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { attributePageUrl } from '@/api/url'

export default {
    mixins: [mixinViewModule],
   data() {
    return {
        mixinViewModuleOptions: {
            getDataListURL: attributePageUrl,
            activatedIsNeed:false,
            getDataListIsPage: true,
            // // exportURL: '/admin-api/log/login/export',
            // deleteURL: deleteSpecUrl,
            // deleteIsBatch: false,
            // deleteIsBatch: true,
            // deleteIsBatchKey: 'id'
        },
        visible:false,
        dataForm:{
            attrName:'',
            groupName:'',
        },
        specData:[],
    }
  },
  created () {
  },
  methods: {
      init(){
        this.visible = true;
        this.$nextTick(()=>{
             this.search();
        })
      },
      search(){
          this.getDataList().then((res)=>{
              this.backScanHook();
          });
      },
       //   处理回显数据
       backScanHook(){
          this.dataListSelections = [];
          var attrIds = this.$parent.dataForm.attrIds;
          this.dataList.forEach((item,index)=>{
               if(attrIds.indexOf(item.id)!=-1){
                   this.dataListSelections.push(item);
               }
           })
            this.toggleSelection(this.dataListSelections);
      },
      //  处理回显事件
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      cancle(){
          this.closeDialog();
      },
      dataFormSubmit(){
          if(this.dataListSelections.length==0){
               this.$message({
                  message: "请勾选后再提交",
                  type: "warning",
                  duration: 1500
                })
              return
          }
           console.log( this.dataListSelections);
           this.$parent.dataForm.attrIds = []
           this.dataListSelections.forEach((item,index)=>{
               if(typeof(item) == "object"){
                    this.$parent.dataForm.attrIds.push(item.id);
               }else{
                   this.$parent.dataForm.attrIds.push(item);
               }
           })
           this.closeDialog();
      },
      closeDialog() {
        console.log("关闭窗口");
        this.visible = false;
        this.$parent.modelAttributeVisible = false;
      },
  }
}
</script>

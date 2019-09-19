<template>
    <!-- 属性 -->
    <el-dialog title="关联品牌" :visible.sync="visible" :before-close="closeDialog">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item label="品牌名称：">
          <el-input v-model="dataForm.brandName" placeholder="品牌名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="品牌分组：">
          <el-input v-model="dataForm.groupName" placeholder="品牌分组"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border style=" width:9%6;margin:auto"   ref="multipleTable" @selection-change="dataListSelectionChangeHandle">
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column property="brandName" label="品牌名称"></el-table-column>
        <el-table-column property="brandNameEn" label="品牌英文名"></el-table-column>
        
        <!-- <el-table-column property="attrValue" label="属性值"></el-table-column> -->
        <!-- <el-table-column property="attrGroupValue" label="属性分组"></el-table-column> -->
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
import { brandPageUrl } from '@/api/url'

export default {
    mixins: [mixinViewModule],
   data() {
    return {
        mixinViewModuleOptions: {
            getDataListURL: brandPageUrl,
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
            brandName:'',
            groupName:'',
        },
        specData:[],
        brandIds:[],
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
              this.backBrandHook();
          });
      },
       // 处理回显数据
       backBrandHook(){
          this.dataListSelections = [];
          this.brandIds = []
          this.$parent.dataForm.goodsClassBrandSaveDTOList.forEach((item,index)=>{
              this.brandIds.push(item.brandId);
          })
          this.dataList.forEach((item,index)=>{
               if(this.brandIds.indexOf(item.id)!=-1){
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
           this.brandIds = []
           this.$parent.dataForm.goodsClassBrandSaveDTOList = [];
           this.dataListSelections.forEach((item,index)=>{
                  this.brandIds.push(item.id);
                  this.$parent.dataForm.goodsClassBrandSaveDTOList.push({
                      "brandId":item.id,
                      "brandName":item.brandName,
                  });
           })
           this.closeDialog();
      },
      closeDialog() {
        console.log("关闭窗口");
        this.visible = false;
        this.$parent.modelBrandVisible = false;
      },
  }
}
</script>

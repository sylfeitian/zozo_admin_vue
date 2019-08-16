<template>
    	<el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            width="80%"
    	>
        <el-form
                :model="dataForm"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
                :inline="true"
        >
            <el-form-item label="商品名称：" prop="">
                <el-input v-model="dataForm.orderId" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品ID：" prop="">
                <el-input v-model="dataForm.orderId" placeholder="请输入skuID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            width="100%"
            :data="allstockdata.list"
            border=""
            v-loading="dataListLoading"
            style="width: 100%;margin-top:20px;"
    	    @select = "onTableSelect"
        >
            <el-table-column prop="skuIdJp" label="skuID" align="center"></el-table-column>
            <el-table-column prop="goodsName " label="商品名称" align="center"></el-table-column>
            <el-table-column prop="spe " label="规格" align="center"></el-table-column>
            <el-table-column prop="wareHouseName" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="beforeQty " label="库存" align="center"></el-table-column>
            <el-table-column prop="changeQty " label="操作" align="center">
            	
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
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                dataForm: {},
                title:'',
                visible : false,
                loading : false,
                formLabelWidth: '120px'
            }
        },
        props:['allstockdata'],
        created(){
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.title="查看详情";
//              this.$nextTick(() => {
//                  this.$refs['addForm'].resetFields();
//                  // this.getApplyPullList();
//              })
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
        }
    }
</script>

<style scoped>

</style>
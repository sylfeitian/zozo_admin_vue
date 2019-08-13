<template>
    <el-dialog
            class="model-add-edit-data"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="100%"
    >
        <el-table :data="dataList" border="" style="width: 100%">
            <el-table-column prop="" label="SKU编码"></el-table-column>
            <el-table-column prop="" label="商品条形码(UPC)"></el-table-column>
            <el-table-column prop="" label="商品名称(中文)"></el-table-column>
            <el-table-column prop="" label="商品英文名称"></el-table-column>
            <el-table-column prop="" label="品牌"></el-table-column>
            <el-table-column prop="" label="规格型号"></el-table-column>
            <el-table-column prop="" label="申报/合同单位"></el-table-column>
            <el-table-column prop="" label="HScode"></el-table-column>
            <el-table-column prop="" label="生成企业名称"></el-table-column>
            <el-table-column prop="" label="供应商"></el-table-column>
            <el-table-column prop="" label="原产地区"></el-table-column>
            <el-table-column prop="" label="商品单价(RMB)"></el-table-column>
            <el-table-column prop="" label="毛重(kg)"></el-table-column>
            <el-table-column prop="" label="净重(kg)"></el-table-column>
            <el-table-column prop="" label="保质期"></el-table-column>
            <el-table-column prop="" label="货物图片"></el-table-column>
            <el-table-column prop="" label="店铺名称"></el-table-column>
            <el-table-column prop="" label="商家ID"></el-table-column>
            <el-table-column prop="" label="商家联系方式"></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
    export default {
        name: "list",
        data () {
            return {
                visible : false,
                loading : false,
                dataList: [],
            }
        },
        methods: {
            init(row) {
                this.visible = true;
                this.row = row;
                this.$nextTick(() => {
                    // this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
            // changePage(){
            //     this.$emit("recordlistList");
            // }
        }
    }
</script>

<style scoped>

</style>
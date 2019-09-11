<template>
    <el-dialog
            class="model-add-edit-data"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="100%"
    >
        <el-table
                ref="addForm"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%">
            <el-table-column prop="eclpCode" label="ECLP编码"></el-table-column>
            <el-table-column prop="goodsCsIdJp" label="SKU编码"></el-table-column>
            <el-table-column prop="barcodes" label="商品条形码(UPC)"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称(中文)"></el-table-column>
            <el-table-column prop="goodsNameGlo" label="商品英文名称"></el-table-column>
            <el-table-column prop="brandName" label="品牌"></el-table-column>
            <el-table-column prop="spe" label="规格型号"></el-table-column>
            <el-table-column prop="declarationContractUnit" label="申报/合同单位"></el-table-column>
            <el-table-column prop="hsCode" label="HScode"></el-table-column>
            <el-table-column prop="generateBusinessName" label="生成企业名称"></el-table-column>
            <el-table-column prop="supplier" label="供应商"></el-table-column>
            <el-table-column prop="madeIn" label="原产地区"></el-table-column>
            <el-table-column prop="sellPrice" label="商品单价(RMB)"></el-table-column>
            <el-table-column prop="grossWeight" label="毛重(kg)"></el-table-column>
            <el-table-column prop="netWeight" label="净重(kg)"></el-table-column>
            <el-table-column prop="safeDays" label="保质期"></el-table-column>
            <el-table-column prop="imageUrl" label="货物图片"></el-table-column>
            <el-table-column prop="shopStoreName" label="店铺名称"></el-table-column>
            <el-table-column prop="storeName" label="商家ID"></el-table-column>
            <el-table-column prop="storeContactInformation" label="商家联系方式"></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
    import { backScanRegister } from '@/api/api'
    // import { getGoodsUrl } from '@/api/url'
    export default {
        name: "list",
        data () {
            return {
                // mixinViewModuleOptions: {
                //     getDataListURL: registerUrl,
                //     getDataListIsPage: true,
                //     // exportURL: '/admin-api/log/login/export',
                //     // deleteURL: deleteWare,
                //     deleteIsBatch: false,
                //     deleteIsBatch: true,
                //     deleteIsBatchKey: 'id'
                // },
                visible : false,
                loading : false,
                dataList: [],
                dataListLoading: false,
            }
        },
        props:["idJp"],
        methods: {
            init () {
                this.visible = true;
                this.$nextTick(() => {
                    // this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                    this.backScan();
                })
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    spuid:this.idJp,
                }
                this.dataListLoading = true;
                backScanRegister(obj).then((res)=>{
                    this.dataListLoading = false;
                    if(res.code == 200){
                        this.dataList = res.data;

                    }else{
                        this.$message({
                            message:res.msg,
                            type: 'error',
                            duration: 1500,
                        })
                    }
                })
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>
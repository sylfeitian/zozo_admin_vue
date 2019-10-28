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
            <el-table-column prop="goodsNo" label="ECLP编码"></el-table-column>
            <el-table-column prop="goodsCsIdJp" label="SKU编码"></el-table-column>
            <el-table-column prop="barcodes" label="商品条形码(UPC)"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称(中文)">
                <template slot-scope="scope">
                    <div :title="scope.row.goodsName">
                        {{scope.row.goodsName}}
                    </div>
                </template>
            </el-table-column>
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
            <el-table-column prop="imageUrl" label="货物图片">
                <template slot-scope="scope">
                    <div :title="scope.row.imageUrl">
                        {{scope.row.imageUrl}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shopStoreName" label="店铺名称"></el-table-column>
            <el-table-column prop="storeName" label="商家ID"></el-table-column>
            <el-table-column prop="storeContactInformation" label="商家联系方式"></el-table-column>
            <!-- <el-table-column prop="goodsCsIdJp" label="SKU"></el-table-column>
            <el-table-column prop="goodsName" label="*商品名称(中文)"></el-table-column>
            <el-table-column prop="sellerRecord" label="商品货号"></el-table-column>
            <el-table-column prop="hsCode" label="*HS"></el-table-column>
            <el-table-column prop="vatRate"  align="center" label="增值税"></el-table-column>
            <el-table-column prop="taxRate"   align="center"label="消费税"></el-table-column>
            <el-table-column prop="measurement"  align="center" label="计量单位（海关）"></el-table-column>
            <el-table-column prop="postalTaxNumber"  align="center" label="行邮税号"></el-table-column>
            <el-table-column prop="postalTaxRate"   align="center" label="行邮税率"></el-table-column>
            <el-table-column prop="customsRecordNumber" label="海关备案号"></el-table-column>
            <el-table-column prop="country"  align="center" label="原产国（海关）"></el-table-column>
            <el-table-column prop="qiRecordNumber" label="检验检疫备案号"></el-table-column>
            <el-table-column prop="qiMeasurement" label="计量单位（检验检疫）"></el-table-column>
            <el-table-column prop="spec" label="规格型号"></el-table-column>
            <el-table-column prop="qiCountry"  align="center" label="原产国（检验检疫）"></el-table-column>
            <el-table-column prop="netWeight"  align="center" label="净重"></el-table-column>
            <el-table-column prop="plantPackaging"  align="center" label="植物性包装"></el-table-column>
            <el-table-column prop="taxRateIdentification"  align="center" label="税率标识"></el-table-column>
            <el-table-column prop="legalUnit1"   align="center"label="法定第一计量单位"></el-table-column>
            <el-table-column prop="legalAmount2"   align="center"label="法定第二数量"></el-table-column>
            <el-table-column prop="pattern"  align="center" label="模式"></el-table-column>
            <el-table-column prop="serviceProviderCode" label="服务商代码"></el-table-column>
            <el-table-column prop="storeName"  align="center" label="店铺名称"></el-table-column>
            <el-table-column prop="merchantId" label="商家ID"></el-table-column>
            <el-table-column prop="barcodes" label="UPC"></el-table-column>
            <el-table-column prop="goodsNameEn"  align="center" label="商品英文名称"></el-table-column>
            <el-table-column prop="brandName"  align="center" label="品牌"></el-table-column>
            <el-table-column prop="hgsbys"  align="center" label="申报要素"></el-table-column>
            <el-table-column prop="ingredient"   align="center"label="成分"></el-table-column>
            <el-table-column prop="sellPrice" label="商品单价">
                 <template slot-scope="scope">
                   ￥<span>{{scope.row.sellPrice?scope.row.sellPrice:"0.00"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="safeDays" align="center" label="保质期">
                 <template slot-scope="scope">
                   <span>{{scope.row.safeDays?scope.row.safeDays:"0"}}天</span>
                </template>
            </el-table-column>
            <el-table-column prop="manufacturer" label="生产企业"></el-table-column> -->
            <!-- <el-table-column prop="goodsCsIdJp" label="提交时间"></el-table-column>
            <el-table-column prop="goodsCsIdJp" label="完成时间"></el-table-column>
            <el-table-column prop="goodsCsIdJp" label="备注"></el-table-column> -->



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

<style lang="scss" scoped>
   /deep/ .cell{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /*/deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/

</style>
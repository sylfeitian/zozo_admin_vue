<template>
    <el-dialog
            class="model-add-edit-data"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="30%"
    >
        <el-table
                ref="addForm"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%">
            <el-row class="info" style="width: 900px;">
                <el-col :span="12"><div class="grid-content">{{dataList.name}}</div></el-col>
                <el-col :span="12"><div class="grid-content">{{dataList.value}}</div></el-col>
            </el-row>
        </el-table>
    </el-dialog>
</template>

<script>
    import { getZozogoodsSize } from '@/api/api'
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
                row:"",
                row2:"",
            }
        },
        // props:["idJp"],
        methods: {
            init (row,row2) {
                this.visible = true;
                this.row = row;
                this.row2 = row2;
                // this.sizeId = this.dataList.sizeIdJp;
                this.spuid = this.dataList.idJp;
                this.$nextTick(() => {
                    // this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                    this.backScan();
                })
            },
            // 编辑回显
            backScan(){
                console.log(this.row);
                  console.log(this.row2);
                  var idJp = ""
                //   如果是备案商品
                if(this.row.origin && this.row.origin=="recordinformation"){
                     if(!this.row.skuIdJp){
                        this.$message.error("后端返回的skuIdJp为空")
                        this.closeDialog();
                        return;
                     }
                     idJp = this.row.skuIdJp
                }else{ //  否则是商品管理
                    if(!this.row.idJp){
                        this.$message.error("后端返回的idJp为空")
                        this.closeDialog();
                        return;
                     }
                     idJp = this.row.idJp
                }
                if(!this.row2.sizeIdJp){
                    this.$message.error("后端返回的sizeIdJp为空")
                    this.closeDialog();
                    return;;
                }
                var obj  = {
                    spuId:idJp,
                    sizeIdJp: this.row2.sizeIdJp
                }
                this.dataListLoading = true;
                getZozogoodsSize(obj).then((res)=>{
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
                this.visible = false;
                this.$parent.sizeDataVisible = false;
            },
            // changePage(){
            //     this.$emit("recordlistList");
            // }
        }
    }
</script>

<style lang="scss" scoped>
    .grid-content {
        border: 1px solid #ebeef5;
        height: 54px;
        line-height: 54px;
        text-align: center
    }
</style>
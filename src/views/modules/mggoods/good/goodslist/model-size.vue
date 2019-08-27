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
            }
        },
        // props:["idJp"],
        methods: {
            init () {
                this.visible = true;
                this.sizeId = this.dataList.sizeId;
                this.spuid = this.dataList.idJp;
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
                    sizeId: this.sizeId
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
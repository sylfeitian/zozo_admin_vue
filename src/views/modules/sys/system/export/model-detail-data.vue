<template>
    <el-dialog
        class="model-add-edit-data"
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
        <el-form
            :model="dataForm"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="导入成功条数：">
                <span>{{dataForm.successfulNumber}}</span>
            </el-form-item>
            <el-form-item label="导入失败条数：">
                <span>{{dataForm.failureNumber}}</span>
                <importAndExport v-if="dataForm.failureNumber>0" :btType="'text'" :downType="1" :importAndExportOptions="importAndExportOptions" :dataForm="dataForm2"  @getDataList="getDataList" style="margin-left:10px;"></importAndExport>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    // import { backScanColor,updateColor } from '@/api/api'
    import importAndExport from "@/components/import-and-export"
    import { sysexportmanagementExport} from "@/api/io.js"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    exportUrl:sysexportmanagementExport,//导出接口
                    exportWord:"导出详情",
                },
                visible : false,
                loading : false,
                dataForm: {
                    id: "",
                    successfulNumber: "",
                    failureNumber: "",
                    sysManagerId:""
                },
                dataForm2: {
                    sysManagerId:""
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        components:{
            importAndExport
        },
        computed:{},
        mounted(){},
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.title="查看详情";
                // this.dataForm.id = row.id
                this.backScan(row);
                // this.$nextTick(() => {
                //     this.$refs['addForm'].resetFields();
                //     // this.getApplyPullList();
                // })
            },
            //编辑回显
            backScan(row){
                console.log(row)
                this.dataForm = row;
                this.dataForm2.sysManagerId = this.dataForm.id;
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.detailDataVisible = false;
            },
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
</style>
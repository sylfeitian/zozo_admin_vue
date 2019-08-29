<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <el-button style="float:right;margin-bottom:20px" type="primary" @click="activiVisible=true">添加</el-button>
        <el-table
            :data="dataList"
            v-loading="dataListLoading"
            border
            style="width: 100%">
            <el-table-column
                type="index"
                prop="$index"
                    align="center"
                label="序号"
                width="70">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="id"
                label="秒杀时段名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="account"
                label="每日开始时间">
            </el-table-column>
            <el-table-column
                prop="account"
                label="每日结束时间">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="启用">
                <template slot-scope="scope">
                    <el-switch
                        @change = "changeSwitch($event,scope.row.id)"
                        v-model="scope.row.gradeName">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
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

        <!-- 修改弹框 -->
        <el-dialog
            :title="activiTitle"
            :visible.sync="activiVisible"
            :close-on-click-modal = "false"
            :show-close = "false"
            class="activiDialog"
            width="36%">
            <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()" label-width="120px">
                <el-form-item label="秒杀时段名称：" prop="sgName">
                    <el-input v-model="activiDataForm.sgName" placeholder="请输入50字以内的标题" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="每日开始时间：" prop="startTime">
                    <el-date-picker
                        v-model="activiDataForm.startTime"
                        type="datetime"
                        value-format="yyyy-MM-dd"
                        placeholder="选择每日开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="每日结束时间：" prop="endTime">
                    <el-date-picker
                        v-model="activiDataForm.endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd"
                        placeholder="选择每日结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio-group v-model="activiDataForm.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noCheck('activiDataForm')">取 消</el-button>
                <el-button type="primary" @click="subActivity('activiDataForm')" :loading="buttonStatus">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
    data () {
        return {
            mixinViewModuleOptions: {
                getDataListURL: businessPageUrl,
                getDataListIsPage: true,
                exportURL: '/admin-api/store/export',
                deleteURL: '/admin-api/store',
                deleteIsBatch: true,
                // deleteIsBatchKey: 'id'
            },
            buttonStatus:false,
            activiVisible:false,
            activiDataForm:{
                sgName:'',
                startTime:'',
                endTime:'',
                status:'1'
            },
            activiTitle:'添加时间段',
            breaddata: ["营销管理", "秒杀活动","秒杀时间段"],
        }
    },
    computed:{
        dataRule(){
            return{
                sgName : [
                    { required: true, message: '秒杀时段名称不能为空', trigger: 'blur' },
                ],
                startTime : [
                        { required: true, message: '开始时间不能为空', trigger: 'blur' },
                ],
                endTime : [
                        { required: true, message: '结束时间不能为空', trigger: 'blur' },
                ],
                status : [
                        { required: true, message: '启用状态不能为空', trigger: 'blur' },
                ]
            }
        }
    },
    created(){
        this.demo();
    },
    methods: {
        changePage(){
            this.$emit('timeshowList')
        },
        changeSwitch($event,id){
            //$event：当前状态值false或true，id:要启用或禁用的时间段id
            console.log('======',$event,id)
        },
        //取消弹框
        noCheck(formName){
            this.$refs[formName].resetFields();
            this.activiVisible = false;
        },
        //提交新增编辑活动
        subActivity(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                }
            });
        },


        demo(){
            function placeholderPic(){
                var w = document.documentElement.offsetWidth;
                document.documentElement.style.fontSize=w/20+'px';
            }
                placeholderPic();
            window.onresize=function(){
                placeholderPic();
            }
        },
    }
    };
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog{
    .el-input {
        width: 300px;
    }
}

</style>

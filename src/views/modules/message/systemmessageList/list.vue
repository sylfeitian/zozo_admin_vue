<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="消息标题：">
                <el-input v-model="dataForm.messageTitle" ></el-input>
            </el-form-item>
            <el-form-item label="推送方式：">
                <el-select v-model="dataForm.sendMode" placeholder="请选择"  style="margin-left: 10px;width: 140px;">
                    <el-option label="站内信"  value="0"></el-option>
                    <el-option label="友盟" value="1"></el-option>
                    <el-option label="短信" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息类型：">
                <el-select v-model="dataForm.messageType" placeholder="请选择"  style="margin-left: 10px;width: 140px;">
                    <el-option label="私信"  value="0"></el-option>
                    <el-option label="系统信息" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="add()" type="primary" style="float: right;margin-bottom: 10px;">推送消息</el-button>
        <el-table
                width="100%"
                ref="multipleTable"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;maigin-top:10px;"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="messageTitle" label="消息标题" align="center"></el-table-column>
            <el-table-column prop="sendTime" label="发送时间" align="center"></el-table-column>
            <el-table-column prop="" label="发送人" align="center"></el-table-column>
            <el-table-column prop="receiver" label="推送对象" align="center"></el-table-column>
            <el-table-column prop="sendMode" label="推送方式" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.sendMode == 1" >友盟</div>
                    <div v-else-if="scope.row.sendMode == 0" >站内信</div>
                    <div v-else >短信</div>
                </template>
            </el-table-column>
            <el-table-column prop="messageType" label="消息类型" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.messageType == 1" >系统信息</div>
                    <div v-else-if="scope.row.messageType == 0" >私信</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row)" type="text"size="mini">查看</el-button>
                    <el-button @click.native.prevent="deleteList(scope.row.id)" type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button @click="cotrolGoodsShow()" type="primary" style="margin-left: 10px;">批量删除</el-button>
            </div>
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
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { getmessagepage } from '@/api/url';
    import { deleteMessage } from '@/api/api';
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getmessagepage,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                activeName: "",
                selectVal:"",
                breaddata: [ "消息中心", "消息列表"],
                dataForm: {},
                value: '',
                multipleSelection:[],
                dataList: [],
                currentIndex:"",
                dataListLoading: false,
                forbitLoading:false,
                timeArr: "", //日本发布时间数据
                timeArr2: "", //发布时间数据
                startCreateDate: "",
                endCreateDate: "",
                endPaymentTime: "",
                startPaymentTime: "",
                isIndeterminate: false,
                checkAll: false,
            }
        },
        components: {
            Bread
        },
        created () {
            // 第一次请求数据
            // this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            add(){
                this.$emit("add");
            },
            reset(formName) {
                this.dataForm.messageTitle = "";
                this.dataForm.messageType = "";
                this.dataForm.sendMode = "";
                this.getDataList();
            },
            cotrolGoodsShow(){
                var ids = this.getIds();
                var obj = {
                    data:ids,
                }
                this.$confirm('是否删除所选数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMessage(obj).then((res)=>{
                        if(res.code==200){
                            this.getDataList();
                            this.$message({
                                message:res.msg,
                                type: 'success',
                                duration: 1500,
                            })
                        }else{
                            this.$message({
                                message:res.msg,
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    })

                }).catch(() => {});
            },
            deleteList(id){
                var ids= [];
                ids.push(id);
                var obj = {
                    data:ids,
                }
                this.$confirm('是否删除当前数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(obj)
                    deleteMessage(obj).then((res)=>{
                        if(res.code==200){
                            this.getDataList();
                            this.$message({
                                message:res.msg,
                                type: 'success',
                                duration: 1500,
                            })
                        }else{
                            this.$message({
                                message:res.msg,
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    })

                }).catch(() => {});
            },
            getIds(){
                var ids= [];
                this.multipleSelection.forEach((item,index)=>{
                    if("object" == typeof(item)){
                        ids.push(item.id);
                    }else{
                        ids.push(id);
                    }
                })
                return ids;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(this.multipleSelection.length == 10) this.checkAll = true;
                else this.checkAll = false;
            },
            handleCheckAllChange(val) {
                if(val) this.$refs.multipleTable.toggleAllSelection();
                else this.$refs.multipleTable.clearSelection();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .grayLine{
        border-bottom: 0!important;
    }
    .bottomFun {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bottomFunLeft {
            width: 450px;
            display: flex;
            align-items: center;
        }
    }
</style>
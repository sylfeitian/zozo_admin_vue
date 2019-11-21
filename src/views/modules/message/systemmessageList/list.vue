<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="消息标题：">
                <el-input v-model.trim="dataForm.messageTitle" ></el-input>
            </el-form-item>
            <el-form-item label="推送方式：">
                <el-select v-model="dataForm.sendMode" placeholder="请选择"  style="margin-left: 10px;width: 140px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="站内信" value="0"></el-option>
                    <el-option label="友盟" value="1"></el-option>
                    <el-option label="短信" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息类型：">
                <el-select v-model="dataForm.messageType" placeholder="请选择"  style="margin-left: 10px;width: 140px;" :popper-append-to-body="true">
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.messageTypeName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="add()" type="primary" style="float: left;margin-bottom: 10px;">推送消息</el-button>
        <el-table
                width="100%"
                ref="multipleTable"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;maigin-top:10px;"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="messageTitle" label="消息标题" align="center"></el-table-column>
            <el-table-column prop="sendTime" sortable="custom" label="发送时间" align="center"></el-table-column>
            <el-table-column prop="creator" label="发送人" align="center"></el-table-column>
            <el-table-column prop="receiverPeople" label="推送对象" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.receiverPeople == 0" >全部</div>
                    <div v-else-if="scope.row.receiverPeople == 1" >{{scope.row.messageCount}}人</div>
                </template>
            </el-table-column>
            <el-table-column prop="sendMode" label="推送方式" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.sendMode == 1" >友盟</div>
                    <div v-else-if="scope.row.sendMode == 0" >站内信</div>
                    <div v-else >短信</div>
                </template>
            </el-table-column>
            <el-table-column prop="messageType" label="消息类型" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.messageType == 0" >活动推送</div>
                    <div v-else-if="scope.row.messageType == 1" >购物车内商品降价</div>
                    <div v-else-if="scope.row.messageType == 2" > 到货通知</div>
                    <div v-else-if="scope.row.messageType == 3" > 退款通知</div>
                    <div v-else-if="scope.row.messageType == 4" > 优惠券到期通知</div>
                    <div v-else-if="scope.row.messageType == 5" > 收藏的商品降价</div>
                    <div v-else-if="scope.row.messageType == 6" > 发货通知</div>
                    <div v-else-if="scope.row.messageType == 7" > 清关失败</div>
                    <div v-else-if="scope.row.messageType == 8" > 秒杀活动提醒</div>
                    <div v-else-if="scope.row.messageType == 9" > 限量商品提醒</div>
                    <div v-else-if="scope.row.messageType == 10" > 收藏的店铺上新</div>
                    <div v-else-if="scope.row.messageType == 11" > 收藏的品牌上新</div>
                    <div v-else-if="scope.row.messageType == 12" > 售后审核通过</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row.id)" type="text"size="mini">查看</el-button>
                    <el-button @click.native.prevent="deleteList(scope.row.id)" type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="查看消息" :visible.sync="dialogTableVisible">
            <el-form>
                <el-form-item label="推送类型：">
                    <span>{{messageDetail.sendMode == 1?"友盟":messageDetail.sendMode == 0?"站内信":"短信"}}</span>
                </el-form-item>
                <el-form-item label="推送对象：">
                    <span>{{messageDetail.receiverPeople == 0?"全部":messageDetail.messageCount+"人"}}</span>
                </el-form-item>
                <el-form-item label="消息标题：">
                    <span>{{messageDetail.messageTitle}}</span>
                </el-form-item>
                <el-form-item label="消息内容：">
                    <div style="overflow: auto;" class="messcontent" v-html="messageDetail.messageContent"></div>
                </el-form-item>
            </el-form>
        </el-dialog>
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
    import { deleteMessage,getMessageDetail,messageTypePage } from '@/api/api';
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getmessagepage,
                    getDataListIsPage: true,
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                dialogTableVisible:false,
                breaddata: [ "消息中心", "消息列表"],
                dataForm: {},
                messageDetail:{},
                value: '',
                multipleSelection:[],
                dataList: [],
                dataListLoading: false,
                checkAll: false,
                options: [],
            }
        },
        components: {
            Bread
        },
        created () {
            this.getDataList();
            this.getMessageTypePage();
        },
        methods: {
            getMessageTypePage(){
                messageTypePage().then((res)=>{
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.options = res.data
                }).catch(() => {})
            },
            sortChange(val){
                if(val.order == "descending") this.dataForm.descOrAsc = 0;
                else if(val.order == "ascending") this.dataForm.descOrAsc = 1;
                this.getDataList();
            },
            add(){
                this.$emit("add");
            },
            showDetail(id){
                this.dialogTableVisible = true;
                let that = this;
                getMessageDetail({id:id}).then((res)=>{
                    if(res.code == 200){
                        that.messageDetail = res.data;
                    }
                })
            },
            reset() {
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
                if(this.multipleSelection.length == this.dataList.length) this.checkAll = true;
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
    /deep/ .messcontent p {
        margin:0!important;
    }
</style>
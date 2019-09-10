<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="仓库名称/ID：">
                <el-input v-model="dataForm.warehousename" ></el-input>
            </el-form-item>
            <el-form-item label="仓库种类：">
                <el-select v-model="dataForm.type" placeholder="请选择">
                    <el-option label="发货仓" value="0"></el-option>
                    <el-option label="退货仓" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="启用状态：">
                <el-select v-model="dataForm.isEnable" placeholder="请选择">
                    <el-option label="不启用" value="0"></el-option>
                    <el-option label="启用" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="addOrAdit()" >添加仓库</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" align="center"></el-table-column>
            <el-table-column prop="addressInfo" label="仓库所在地" align="center"></el-table-column>
            <el-table-column label="仓库种类" align="center">
                <template slot-scope="scope">
                    <span  v-if="scope.row.type==0">发货仓</span>
                    <span  v-if="scope.row.type==1">退货仓</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="负责人" align="center"></el-table-column>
            <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="isEnable" label="状态" align="center">
                <template slot-scope="scope">
                    <span  v-if="scope.row.isEnable==0">不启用</span>
                    <span  v-if="scope.row.isEnable==1">启用</span>
                </template>
            </el-table-column>
            <el-table-column prop="isEnable" label="启用" align="center">
                <template slot-scope="scope">
                    <div style="position: relative;">
                        <el-switch
                                v-model="scope.row.isEnable"
                                :active-value="1"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                        >
                        </el-switch>
                        <div  @click="switchHandle('singe',scope.row)" class="hiddenSwitch">
                            <!-- 遮罩层 -->
                            <!-- {{scope.row.recommendFlag}} -->
                        </div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrAdit(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                    <el-button @click.native.prevent="showDetail(scope.row)"type="text"size="mini">查看</el-button>
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
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
        <!-- 弹窗, 新建/编辑 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        <!-- 弹窗, 查看 -->
<!--        <showData  v-if="showDataVisible" ref="showData" @searchDataList="getDataList"></showData>-->
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import { wareUrl, deleteWare } from '@/api/url'
    import { editWare } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: wareUrl,
                    getDataListIsPage: true,
                    deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                // activeName: "",
                breaddata: [ "仓库管理"],
                dataForm: {
                    warehousename: "",
                    type: "",
                    isEnable: "",

                },
                isEnable:'',
                value: '',
                dataList: [],
                dataListLoading: false,
                addEditDataVisible:false,
                // showDataVisible:false,
                forbitLoading:false,
                startCreateDate: "",
                endCreateDate: "",
                endPaymentTime: "",
                startPaymentTime: "",
                isIndeterminate: false,
                checkAll: false,
            }
        },
        components: {
            Bread,
            addEditData,
            // showData
        },
        created () {
            // 第一次请求数据
            // this.activeName =  this.status == undefined ? "" : this.status;
            // this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            getData(){
                this.page =1;
                this.getDataList();
            },
            showDetail(row){
                this.$emit("showDetail",row);
            },
            // showDetail(index=-1,row=""){
            //     this.setShowDataVisible(true);
            //     this.$nextTick(() => {
            //         this.$refs.showData.init(row)
            //     })
            // },
            // setShowDataVisible(boolargu){
            //     this.showDataVisible =  boolargu;
            // },
            // addOrAdit(id){
            //     this.$emit("addOrAdit",id);
            // },
            // 编辑
            addOrAdit(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            },
            reset() {
                this.dataForm.warehousename = "";
                this.dataForm.type = "";
                this.dataForm.isEnable = "";
                this.getDataList();
            },
            switchHandle(index,row){
                console.log(row);
                this.currentIndex = index;
                var obj = {
                    "storeId": row.id,
                    "isEnable":row.isEnable?0:1
                }


                var msg = ""
                row.isEnable==1?msg="不启用":msg="启用"
                this.$confirm('是否进行'+msg+'操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    editWare(obj).then((res)=>{
                        this.forbitLoading = false;
                        // console.log(res);
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
        }
    }
</script>

<style lang="scss" scoped>
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
    .hiddenSwitch{
        position: absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
    }
</style>
<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="店铺ID：">
                <el-input v-model="dataForm.idJp" placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model="dataForm.storeName" placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item  label="营业状态：">
                <el-select v-model="dataForm.operateFlag" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="" class="btn" type="primary" style="float: right;">导入店铺信息</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top: 60px;"
        >
            <el-table-column prop="idJp" label="店铺id" align="center"></el-table-column>
            <el-table-column prop="storeLogo" label="店铺logo" align="center"></el-table-column>
            <el-table-column prop="storeNameJp" label="店铺日本名称" align="center"></el-table-column>
            <el-table-column prop="storeNameGlo" label="全球名称" align="center"></el-table-column>
            <el-table-column prop="storeName" label="店铺中文名称" align="center"></el-table-column>
            <el-table-column label="营业状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.operateFlag==0" type="success">营业中</el-tag>
                    <el-tag v-if="scope.row.operateFlag==1" type="info">已停业</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="japanState" label="日本店铺状态" align="center"></el-table-column>
            <el-table-column prop="updateDate" label="更新时间" align="center"></el-table-column>
            <el-table-column prop="mainTag" label="店铺主风格标签" align="center"></el-table-column>
            <el-table-column prop="subTag" label="店铺副风格标签" align="center"></el-table-column>
            <el-table-column prop="" label="设为推荐" align="center">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.recommendFlag"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @click="switchHandle('singe',scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="售卖品牌" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.native.prevent="editHandle" size="mini">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.$index, scope.row)" size="mini">编辑</el-button>
                    <el-button  @click="forbitHandle('singe',scope.row)" type="text" size="mini" >
                        <span  v-if="scope.row.operateFlag==0">营业</span>
                        <span  v-if="scope.row.operateFlag==1" class="artclose">停业</span>
                    </el-button>
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
        <!-- 弹窗, 查看 -->
        <addEditData  v-if="addDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        <!-- 弹窗, 编辑 -->
        <editData  v-if="editDataVisible" ref="editData" @searchDataList="getDataList"></editData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import editData from './model-edit-data'
    import { shopPageUrl } from '@/api/url'
    import { operateShopStore, recommendShopStore } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: shopPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/shopStore',
                    deleteURL: '/admin-api/shopStore',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                value: true,
                breaddata: [ "基础资料管理", "店铺管理"],
                options: [],
                dataForm: {
                    idJp: "",//店铺ID
                    storeName: "",//店铺名称
                    operateFlag:""//营业状态:0营业;1停业
                },
                dataList: [],
                dataListLoading: false,
                addDataVisible:false,
                editDataVisible:false,
                multipleSelection:[],
                operateShopStore:[{ id: '0', name: '营业中' },{ id: '1', name: '已停业' }],//营业状态
            }
        },
        created(){
            // let obj = {
            //     params:{
            //         page:1,
            //         limit:10,
            //     }
            // }
            // shopStorePage(obj).then((res)=>{
            //     console.log('店铺信息',res)
            //     if(res.code == 200 && res.data.list){
            //         // this.operateShopStore = [...this.operateShopStore,...res.data.list]
            //         this.dataList = res.data.list;
            //     }
            // })
            this.getDataList();
        },
        components: {
            Bread,
            addEditData,
            editData
        },
        methods: {
            // 重置
            reset() {
                this.dataForm.idJp = "";//店铺ID
                this.dataForm.storeName = "";//店铺名称
                this.dataForm.operateFlag = "";//营业状态
                this.getDataList();
            },
            // 新建
            addHandle(index=-1,row=""){
                this.setAddDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddDataVisible(boolargu){
                this.addDataVisible =  boolargu;
            },
            //编辑
            editHandle (index=-1,row="") {
                this.setEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.editData.init(row)
                })
            },
            setEditDataVisible(boolargu){
                this.editDataVisible =  boolargu;
            },
            // 控制营业状态
            cotrolOperateFlag(type,rowOrstatus){
                var ids= [];
                var operateFlag = 0;
                console.log(this.rowOrstatus)
                 //单个
                ids = [rowOrstatus.id]
                operateFlag = rowOrstatus.operateFlag==1?0:1;
                var obj = {
                    ids:ids,
                    operateFlag:operateFlag,
                }
            },
            forbitHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "operateFlag":row.operateFlag==1?2:1  //
                }
                var msg = ""
                row.operateFlag==1?msg="停业":msg="营业"
                this.$confirm('是否进行'+msg+'操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    operateShopStore(obj).then((res)=>{
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
            switchHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "recommendFlag":row.recommendFlag==1?0:1  //0不推荐1推荐
                }
                var msg = ""
                row.recommendFlag==1?msg="不推荐":msg="推荐"
                this.$confirm('是否进行'+msg+'操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    recommendShopStore(obj).then((res)=>{
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
    @import "@/element-ui/theme-variables.scss";
    .grayLine {
        border-bottom: 0!important;
    }
</style>
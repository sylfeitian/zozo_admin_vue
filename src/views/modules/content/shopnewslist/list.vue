<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="ID：">
                <el-input v-model="dataForm.idJp" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="标题：">
                <el-input v-model="dataForm.title" ></el-input>
            </el-form-item>
            <el-form-item label="店铺：">
                <el-input v-model="dataForm.storeName" ></el-input>
            </el-form-item>
            <el-form-item label="日本发布时间：">
                <el-date-picker
                        v-model="timeArr"
                        type="datetimerange"
                        value-format="yyyy-MM-dd"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="发布时间：">
                <el-date-picker
                        v-model="timeArr2"
                        type="datetimerange"
                        value-format="yyyy-MM-dd"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">待发布</el-radio-button>
            <el-radio-button label="1">已发布</el-radio-button>
            <el-radio-button label="2">已取消发布</el-radio-button>
        </el-radio-group>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:10px;"
                @selection-change="handleSelectionChange"
                ref="multipleTable"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="idJp" label="ID" align="center"></el-table-column>
            <el-table-column prop="imageUrl" label="封面图片" align="center">
                <template slot-scope="scope">
                    <img
                            :src="scope.row.imageUrl"
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="shopName" label="店铺" align="center"></el-table-column>
            <el-table-column prop="goodsCount" label="相关商品" align="center"></el-table-column>
            <el-table-column prop="showWeb" label="发布状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.showWeb == 1" type="success">已发布</el-tag>
                    <el-tag v-else-if="scope.row.showWeb == 0" type="success">待发布</el-tag>
                    <el-tag v-else type="info">取消发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="showWebJp" label="日本发布状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.showWebJp == 1" type="success">已发布</el-tag>
                    <el-tag v-else type="info">取消发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="publishTimeJp" label="日本发布时间" align="center"></el-table-column>
            <el-table-column prop="publishTime" label="发布时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row)" type="text" size="mini">查看</el-button>
                    <el-button @click.native.prevent="addOrAdit( scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button @click.native.prevent="forbitHandle(scope.$index,scope.row)" type="text" size="mini">
                        <span v-if="scope.row.showWeb==1" class="artdisable">{{scope.$index==currentIndex&&forbitLoading?"取消发布中..":"取消发布"}}</span>
                        <span v-else class="artstart">{{scope.$index==currentIndex && forbitLoading?"发布中..":"发布"}}</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-select v-model="selectVal" @change="cotrolGoodsShow(selectVal)" placeholder="批量操作" style="margin-left: 10px;width: 140px;">
                    <el-option label="批量发布"  value="0"></el-option>
                    <el-option label="取消批量发布" value="1"></el-option>
                </el-select>
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
    import { getStoreNewspage } from '@/api/url';
    import { storeNewsPutoperating,storeNewsPutoperatingAll } from '@/api/api';   //发布/取消发布
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getStoreNewspage,
                    getDataListIsPage: true,
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                activeName: "",
                breaddata: [ "内容管理", "店铺新闻管理"],
                dataForm: {},
                selectVal:"",
                multipleSelection:[],
                dataList: [],
                dataListLoading: false,
                forbitLoading:false,
                timeArr: "", //日本发布时间数据
                timeArr2: "", //发布时间数据
                checkAll: false,
                currentIndex:'',
            }
        },
        components: {
            Bread
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataForm.idJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataForm.idJp = newV.replace(newV[i],"")
                    }
                }
            }
        },
        created () {
            // 第一次请求数据
            this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            showDetail(id){
                this.$emit("showDetail",id);
            },
            addOrAdit(id){
                this.$emit("addOrAdit",id);
            },
            getData() {
                this.dataForm.publishJpStartTime =  this.timeArr[0];
                this.dataForm.publishJpEndTime = this.timeArr[1];
                this.dataForm.publishStartTime = this.timeArr2[0];
                this.dataForm.publishEndTime = this.timeArr2[1];
                this.page = 1;
                this.getDataList();
            },
            reset() {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.id = "";
                this.dataForm.title = "";
                this.dataForm.storeName = "";
                this.dataForm.showWeb = "";
                this.dataForm.publishJpStartTime = "";
                this.dataForm.publishJpEndTime = "";
                this.dataForm.publishStartTime = "";
                this.dataForm.publishEndTime = "";
                this.getDataList();
            },
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.showWeb = null
                }else if(tab== "1"){
                    this.dataForm.showWeb = "1"
                }else if(tab== "0"){
                    this.dataForm.showWeb = "0"
                } else if(tab== "2"){
                    this.dataForm.showWeb = "2"
                }
                this.changeVal = val;
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            forbitHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "operating":row.showWeb==1?0:1  //
                }
                var msg = ""
                row.showWeb==1?msg="禁用":msg="启用"
                this.$confirm('是否'+msg+'该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    storeNewsPutoperating(obj).then((res)=>{
                        this.forbitLoading = false;
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
            cotrolGoodsShow(type){
                var ids = this.getIds();
                var obj = {
                    ids:ids,
                    operating:type==1?0:1,
                }
                var msg = ""
                type==1?msg="取消发布":msg="发布"
                this.$confirm('是否'+msg+'该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    storeNewsPutoperatingAll(obj).then((res)=>{
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
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
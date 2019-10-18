<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getData()" >
            <el-form-item label="ID：">
                <el-input v-model="dataForm.idJp" maxlength="30" placeholder="请输入编号"></el-input>
            </el-form-item>
            <el-form-item label="标题：">
                <el-input v-model="dataForm.title" placeholder="请输入标题关键字"></el-input>
            </el-form-item>
            <el-form-item label="发布人：">
                <el-input v-model="dataForm.publisher" ></el-input>
            </el-form-item>
            <el-form-item label="日本发布时间：">
                <el-date-picker
                        v-model="timeArr"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="发布时间：">
                <el-date-picker
                        v-model="timeArr2"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">待发布</el-radio-button>
            <el-radio-button label="1">已发布</el-radio-button>
            <el-radio-button label="2">已取消发布</el-radio-button>
        </el-radio-group>
        <el-button @click="add()" type="primary" style="float: right;margin-bottom: 10px;">新增时尚记事</el-button>
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
            <el-table-column prop="idJp" label="ID" align="center"></el-table-column>
            <el-table-column prop="mainImageUrl " label="封面图片" align="center">
                <template slot-scope="scope">
                    <img
                            :src="scope.row.mainImageUrl "
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" align="center">
                 <template slot-scope="scope">
                    <div :title="scope.row.title" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="scope.row.title">
                        {{scope.row.title}}
                    </div>
                    <div :title="scope.row.titleJp" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-else-if="scope.row.titleJp">
                        {{scope.row.titleJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="itmeCount" label="相关商品" align="center"></el-table-column>
            <el-table-column  label="发布人" align="center">
                 <template slot-scope="scope">
                    <span v-if="scope.row.mediaName">{{scope.row.mediaName}}</span>
                    <span v-else-if="scope.row.publisher">{{scope.row.publisher}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="发布状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 1" type="success">已发布</el-tag>
                    <el-tag v-else-if="scope.row.state == 0" type="info">待发布</el-tag>
                    <el-tag v-else type="info">取消发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="isOpen" label="日本发布状态" align="center">
                <template slot-scope="scope" >
                    <div v-if="scope.row.fashionFlag == 0">
                        <el-tag v-if="scope.row.isOpen == 1" type="success">已发布</el-tag>
                        <el-tag v-else type="info">取消发布</el-tag>
                    </div>
                    <div v-else>
                        <span>/</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="publishTimeJp" label="日本发布时间" align="center"></el-table-column>
            <el-table-column prop="publishTime" label="发布时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row)" type="text" size="mini">查看</el-button>
                    <el-button @click.native.prevent="addOrAdit(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button :disabled="scope.row.fashionFlag == 0&& scope.row.isOpen != 1" @click.native.prevent="forbitHandle(scope.$index,scope.row)" type="text" size="mini">
                        <span v-if="scope.row.state==1" class="artdisable" :class="{'artclose':scope.row.isOpen == 2}">{{scope.$index==currentIndex&&forbitLoading?"取消发布中..":"取消发布"}}</span>
                        <span v-else class="artstart" :class="{'artclose':scope.row.isOpen == 2}">{{scope.$index==currentIndex && forbitLoading?"发布中..":"发布"}}</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <!-- <el-select v-model="selectVal" placeholder="批量操作" @change="cotrolGoodsShow(selectVal)" style="margin-left: 10px;width: 140px;">
                    <el-option label="批量发布"  value="1"></el-option>
                    <el-option label="取消批量发布" value="2"></el-option>
                </el-select> -->
                <div style="margin-left: 20px;display: inline-block;" >
                    <el-button @click="cotrolGoodsShow(0)"  type="primary" v-if="activeName=='0' || activeName=='2' || activeName==''" >批量发布</el-button>
                    <el-button @click="cotrolGoodsShow(1)"  type="primary" v-if="activeName=='1' || activeName==''">取消批量发布</el-button>
                </div>
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
    import { getlookfashionpage } from '@/api/url';
    import { fashionPutoperating,fashionPutoperatingAll } from '@/api/api';   //发布/取消发布
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getlookfashionpage,
                    getDataListIsPage: true,
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                activeName: "",
                selectVal:"",
                breaddata: [ "内容管理", "时尚纪实"],
                dataForm: {},
                multipleSelection:[],
                dataList: [],
                currentIndex:"",
                dataListLoading: false,
                forbitLoading:false,
                timeArr: "", //日本发布时间数据
                timeArr2: "", //发布时间数据
                checkAll: false,
            }
        },
        components: {
            Bread
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataForm.idJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                        this.dataForm.idJp = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataForm.idJp = newV.substr(0,30)
                }
            }
        },
        created () {
            // 第一次请求数据
            // this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            showDetail(id){
                this.$emit("showDetail",id);
            },
            addOrAdit(row){
                if(row.fashionFlag == 0) this.$emit("addOrAdit",row);
                else if(row.fashionFlag == 1) this.$emit("add",row);
            },
            add(id){
                this.$emit("add",id);
            },
            getData() {
                console.log("timeArr::::");
                console.log(this.timeArr);
              if(this.timeArr && this.timeArr.length!=0){
                this.dataForm.publishJpStartTime =  this.timeArr[0];
                this.dataForm.publishJpEndTime = this.timeArr[1];
             }else{
                this.dataForm.publishJpStartTime = ""
                this.dataForm.publishJpEndTime = ""
              }

              if(this.timeArr2 && this.timeArr2.length!=0){
               this.dataForm.publishStartTime = this.timeArr2[0];
                this.dataForm.publishEndTime = this.timeArr2[1];
              }else{
                this.dataForm.publishStartTime = ""
                this.dataForm.publishEndTime = ""
              }
                this.page = 1;
                this.getDataList();
            },
            reset() {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.idJp = "";
                this.dataForm.title = "";
                this.dataForm.publisher = "";
                this.dataForm.state = "";
                this.dataForm.publishJpStartTime = "";
                this.dataForm.publishJpEndTime = "";
                this.dataForm.publishStartTime = "";
                this.dataForm.publishEndTime = "";
                this.page = 1;
                this.getDataList();
            },
            handleClick(tab,val) {
            	this.page = 1;
                if(tab== ""){
                    this.dataForm.state = null
                }else if(tab== "1"){
                    this.dataForm.state = "1"
                }else if(tab== "0"){
                    this.dataForm.state = "0"
                } else if(tab== "2"){
                    this.dataForm.state = "2"
                }
                this.changeVal = val;
                this.getDataList();
            },
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
                    "operating":row.state==1?2:1  //
                }
                var msg = ""
                row.state==1?msg="取消发布":msg="发布"
                this.$confirm('是否'+msg+'该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    fashionPutoperating(obj).then((res)=>{
                        this.forbitLoading = false;
                        if(res.code==200){
                            this.getDataList();
                            this.$message({
                                message:res.data,
                                type: 'success',
                                duration: 1500,
                            })
                        }else{
                            this.$message({
                                message:res.data,
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    })

                }).catch(() => {});
            },
            cotrolGoodsShow(type){
                var ids = this.getIds(type);
                if(ids[0]){
                    var obj = {
                        ids:ids,
                        operating:type==1?2:1,
                    }
                    var msg = ""
                    type==2?msg="取消发布":msg="发布"
                    this.$confirm('是否'+msg+'该分组?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        fashionPutoperatingAll(obj).then((res)=>{
                            if(res.code==200){
                                this.getDataList();
                                this.$message({
                                    message:res.data,
                                    type: 'success',
                                    duration: 1500,
                                })
                            }else{
                                this.$message({
                                    message:res.data,
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                        })

                    }).catch(() => {});
                }else{
                    if(this.multipleSelection[0]){
                        this.$message({
                            message:"所勾选数据无法进行该操作",
                            type: 'error',
                            duration: 1500,
                        })
                    }else{
                        this.$message({
                            message:"未勾选数据",
                            type: 'error',
                            duration: 1500,
                        })
                    }
                }

            },
            getIds(type){
                var ids= [];
                this.multipleSelection.forEach((item,index)=>{
                    if("object" == typeof(item)){
                        if(item.isOpen == 1||item.fashionFlag == 1){
                            if(type == 0 && item.state != 1) ids.push(item.id);
                            else if(type == 1&&item.state == 1) ids.push(item.id);
                        }
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
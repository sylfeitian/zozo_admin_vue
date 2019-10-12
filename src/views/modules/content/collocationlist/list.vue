<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="ID：">
                <el-input v-model="dataForm.idJp" maxlength="30" placeholder="请输入编号"></el-input>
            </el-form-item>
            <el-form-item label="标题：">
                <el-input v-model="dataForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="用户：">
                <el-input v-model="dataForm.userNickname" placeholder="请输入用户昵称"></el-input>
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
            <el-table-column prop="imageUrl" label="封面图片" width="100" align="center">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.imageUrl"
                        alt=""
                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" align="center">
                <template slot-scope="scope">
                    <div :title="scope.row.title" v-if="scope.row.title">
                        {{scope.row.title}}
                    </div>
                    <div :title="scope.row.titleJp" v-else-if="scope.row.titleJp">
                        {{scope.row.titleJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="userNickname" label="用户" align="center"></el-table-column>
            <el-table-column prop="lookCount" width="80" label="搭配数量" align="center"></el-table-column>
            <el-table-column prop="sate" width="120" label="发布状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sate == 1" type="success">已发布</el-tag>
                    <el-tag v-if="scope.row.sate == 2" type="info">取消发布</el-tag>
                    <el-tag v-if="scope.row.sate == 0" type="info">待发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="120" prop="jpPublishState"  label="日本发布状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.jpPublishState == 1" type="success">已发布</el-tag>
                    <el-tag v-else type="info">取消发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="publishTimeJp" label="日本发布时间" align="center"></el-table-column>
            <el-table-column prop="publishTime" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="styles" label="风格标签" align="center">
                <template slot-scope="scope">
                    <span v-for="(v,index) in scope.row.styles" :key="index">{{index==0?v.name:"、"+v.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalViewsNum" label="浏览量" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row)" type="text" size="mini">查看</el-button>
                    <el-button @click.native.prevent="addOrAdit(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button :disabled="scope.row.jpPublishState == 0" @click.native.prevent="forbitHandle(scope.$index,scope.row)"type="text"size="mini">
                        <span v-if="scope.row.sate==1" class="artdisable" :class="{'artclose':scope.row.jpPublishState == 0}">{{scope.$index==currentIndex&&forbitLoading?"取消发布中..":"取消发布"}}</span>
                        <span v-else class="artstart" :class="{'artclose':scope.row.jpPublishState == 0}">{{scope.$index==currentIndex && forbitLoading?"发布中..":"发布"}}</span>
                    </el-button>
                    <el-button @click.native.prevent="openStyle(scope.row.id)" type="text" size="mini">管理风格标签</el-button>
                    <el-dialog title="管理风格标签" :visible.sync="dialogTableVisible">
                        <el-form :inline="true" style="text-align:left;" class="grayLine topGapPadding"  >
                            <el-form-item label="关联风格标签：">
                                <el-select v-model="name" :filter-method="getStyle" @change="saveList" filterable placeholder="请选择">
                                    <el-option
                                            v-for="(item,index) in options"
                                            :key="index"
                                            :label="item.styleName"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width:100%;" label="已关联风格标签：">
                                <div style="margin-left: 20px;">
                                        <el-tag
                                                :key="index"
                                                v-for="(tag,index) in styleList"
                                                style="margin-bottom: 10px;margin-right: 5px"
                                                :disable-transitions="false"
                                                closable
                                                @close="handleClose(index)">
                                            {{tag.styleName}}
                                        </el-tag>
                                </div>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="res">取 消</el-button>
                            <el-button type="primary" @click="saveStyle(id)">确 定</el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <!-- <el-select v-model="selectVal" @change="cotrolGoodsShow(selectVal)" placeholder="批量操作" style="margin-left: 10px;width: 140px;">
                    <el-option label="批量发布"  value="0"></el-option>
                    <el-option label="取消批量发布"  value="1"></el-option>
                </el-select> -->
               <el-button @click="cotrolGoodsShow(0)" style="margin-left: 20px;"  type="primary" >批量发布</el-button>
                <el-button @click="cotrolGoodsShow(1)"  type="primary" >取消批量发布</el-button>
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
    import { getlookfolderpage } from '@/api/url'
    import { folderPutoperating,folderPutoperatingAll,getStyleName ,saveFolderStyle,getlookfolderdetail} from '@/api/api';   //发布/取消发布
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
			        getDataListURL: getlookfolderpage,
			        getDataListIsPage: true,
			        // exportURL: '/admin-api/log/login/export',
			        deleteURL: '',
			        dataListLoading: false, 
			        deleteIsBatch: true,
			        deleteIsBatchKey: 'id'
			    },
                options:"",
                activeName: "",
                dialogTableVisible:false,
                breaddata: [ "内容管理","搭配集合管理"],
                name:"",
                dataForm: {
                	idJp:null,
                	title:null,
                	userNickname:null,
                	sate:null,
                	publishStartTime:null,
                	publishEndTime:null,
                	publishStartTimeJp:null,
                	publishEndTimeJp:null,
                },
                id:"",
                value: '',
                styleList:[],
                dataList: [],
                dataListLoading: false,
                forbitLoading:false,
                multipleSelection:[],
                selectVal:"",
                timeArr: [], //日本发布时间数据
                timeArr2: [], //发布时间数据
                startCreateDate: "",
                endCreateDate: "",
                endPaymentTime: "",
                startPaymentTime: "",
                isIndeterminate: false,
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
                if(newV.length>30){
                    this.dataFormShow.idJp = newV.substr(0,30)
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
            saveList(val){
                let is = true;
                this.styleList.map((v)=>{
                    if(v.id == this.options[val].id){
                        this.$message({
                            message: "风格标签不能重复选择",
                            type: 'error',
                        });
                       is = false
                    }
                })
                if(is) this.styleList.push(this.options[val])
            },
            openStyle(id){
                this.dialogTableVisible = true;
                this.id = id;
                this.getStyle();
            },
            getStyle(){
                getStyleName({
                    params:{styleName:this.name}
                }).then((res)=>{
                    this.options = res;
                })
            },
            res(){
              this.dialogTableVisible = false;
              this.name = "";
              this.id = "";
              this.styleList = [];
              this.options = [];
            },
            saveStyle(id){
                console.log(id)
                let that = this;
                let data = {};
                let list = [];
                that.styleList.map((v,i)=>{
                    list.push(v.id)
                })
                data.styleIds = list;
                data.folderId = id;
                saveFolderStyle(data).then((res)=>{
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            onClose:function () {
                                that.res();
                                that.getDataList();
                            }
                        });
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                    }
                })
            },
            handleClose(index) {
                this.styleList.splice(index, 1);
            },
            showDetail(row){
                this.$emit("showDetail",row);
            },
            addOrAdit(id){
                this.$emit("addOrAdit",id);
            },
            getData() {
                 console.log("timeArr::::");
                console.log(this.timeArr);
              if(this.timeArr && this.timeArr.length!=0){
                this.dataForm.publishStartTimeJp =  this.timeArr[0];
                this.dataForm.publishEndTimeJp = this.timeArr[1];
             }else{
                this.dataForm.publishStartTimeJp = ""
                this.dataForm.publishEndTimeJp = ""
              }

              if(this.timeArr2 && this.timeArr2.length!=0){
                this.dataForm.publishStartTime = this.timeArr2[0];
                this.dataForm.publishEndTime = this.timeArr2[1];
              }else{
                this.dataForm.publishStartTime = ""
                this.dataForm.publishEndTime = ""
              }
                this.page =1;
                this.getDataList();
            },
            reset(formName) {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.idJp = "";
                this.dataForm.title = "";
                this.dataForm.userNickname = "";
                this.dataForm.sate = "";
                this.dataForm.publishStartTimeJp = "";
                this.dataForm.publishEndTimeJp = "";
                this.dataForm.startPaymentTime = "";
                this.dataForm.publishEndTime = "";
                this.dataForm.publishStartTime = "";
                this.getDataList();
            },
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.sate = null
                }else if(tab== "1"){
                    this.dataForm.sate = "1"
                }else if(tab== "0"){
                    this.dataForm.sate = "0"
                } else if(tab== "2"){
                    this.dataForm.sate = "2"
                }
                this.changeVal = val;
                this.getDataList();
            },

            forbitHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "operating":row.sate==1?2:1  //
                }
                var msg = ""
                row.sate==1?msg="取消":msg=""
                this.$confirm('确定要'+msg+'发布该内容吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    folderPutoperating(obj).then((res)=>{
                        this.forbitLoading = false;
                        // console.log(res);
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
                    folderPutoperatingAll(obj).then((res)=>{
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
            getIds(type){
                var ids= [];
                console.log(this.multipleSelection);
                this.multipleSelection.forEach((item,index)=>{
                    if("object" == typeof(item)&&item.jpPublishState == 1){
                        if(type == 0 && item.sate != 1) ids.push(item.id);
                        else if(type == 1&&item.sate == 1) ids.push(item.id);
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
</style>
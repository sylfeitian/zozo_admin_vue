<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="ID：">
                <el-input v-model="dataForm.idJp" maxlength="30" ></el-input>
            </el-form-item>
            <el-form-item label="用户：">
                <el-input v-model="dataForm.nickName" ></el-input>
            </el-form-item>
            <el-form-item label="日本发布时间：">
                <el-date-picker
			      	v-model="valuetime1"
			     	type="daterange"
			      	range-separator="-"
			      	start-placeholder="开始日期"
			      	end-placeholder="结束日期"
			      	value-format="yyyy-MM-dd"
			      	@blur='acttime1'>
			    </el-date-picker>
            </el-form-item>
            <el-form-item label="发布时间：">
               <el-date-picker
		      		v-model="valuetime2"
		      		type="daterange"
		      		range-separator="-"
		      		start-placeholder="开始日期"
		      		end-placeholder="结束日期"
		      		value-format="yyyy-MM-dd"
		      		@blur='acttime2'>
		    	</el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">已发布</el-radio-button>
            <el-radio-button label="0">已取消发布</el-radio-button>
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
            <el-table-column prop="idJp" width="100" label="ID" align="center"></el-table-column>
            <el-table-column prop="imageUrl" label="封面图片" width="150" align="center">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.imageUrl320"
                        alt=""
                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户" align="center"></el-table-column>
            <el-table-column prop="goodsNums" width="80" label="相关商品" align="center"></el-table-column>
            <el-table-column prop="state" width="120" label="发布状态" align="center">
            	<template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 1" type="success">已发布</el-tag>
					<el-tag v-else type="info">取消发布</el-tag>
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
            <el-table-column prop="totalFavNum" label="收藏量" width="80" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="240">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.row)"type="text"size="mini">查看</el-button>
                    <el-button @click.native.prevent="addOrAdit(scope.row)"type="text"size="mini">编辑</el-button>
                    <el-button v-if="scope.row.jpPublishState == 1" @click.native.prevent="forbitHandle(scope.$index,scope.row)"type="text"size="mini">
                        <span v-if="scope.row.state==1" class="artdisable">{{scope.$index==currentIndex&&forbitLoading?"取消发布中..":"取消发布"}}</span>
                        <span v-else class="artstart">{{scope.$index==currentIndex && forbitLoading?"发布中..":"发布"}}</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <!-- <el-select v-model="selectVal" placeholder="批量操作" @change="cotrolGoodsShow(selectVal)" style="margin-left: 10px;width: 140px;">
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
    import mixinViewModule from '@/mixins/view-module';
    import Bread from "@/components/bread";
    import { getlookpage } from '@/api/url';
    import { putoperating,putoperatingAll } from '@/api/api';   //发布/取消发布
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
			        getDataListURL: getlookpage,
			        getDataListIsPage: true,
			        // exportURL: '/admin-api/log/login/export',
			        deleteURL: '',
			        dataListLoading: false, 
			        deleteIsBatch: true,
			        deleteIsBatchKey: 'id'
			    },
                activeName: "",
                breaddata: [ "内容管理", "搭配管理"],
                dataForm: {
                	idJp:null,  //编号
                	state:null,    //发布状态
                	nickName: null,  //用户昵称
                	publishStartTime: null,  //发布开始时间
                	publishEndTime: null,  //发布结束时间
                	publishStartTimeJp: null,  //日本发布开始时间
                	publishEndTimeJp:null,  //日本发布结束时间
                },
                value: '',
                selectVal:"",
                multipleSelection:[],
                dataList: [],
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
                valuetime1:'',   //日本发布时间
                valuetime2:'',   //发布时间
                currentIndex:'',
            }
        },
        components: {
            Bread
        },
        watch:{
			valuetime2(val){
		      if(!val){
		      	this.dataForm.publishStartTime = '';
		    	this.dataForm.publishEndTime = '';
		      }
		    },
		    valuetime1(val){
		      if(!val){
		      	this.dataForm.publishStartTimeJp = '';
		    	this.dataForm.publishEndTimeJp = '';
		      }
		    },
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
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
        },
        methods: {
            getData(){
                this.page =1;
                this.getDataList();
            },
            showDetail(row){     //查看
                this.$emit("showDetail",row);
            },
            addOrAdit(id){
                this.$emit("addOrAdit",id);
            },
            //发布开始结束时间
		    acttime2(){
		    	this.dataForm.publishStartTime = this.valuetime2[0];
		    	this.dataForm.publishEndTime = this.valuetime2[1];
		    },
		    //日本发布开始结束时间
		    acttime1(){
		    	this.dataForm.publishStartTimeJp = this.valuetime1[0];
		    	this.dataForm.publishEndTimeJp = this.valuetime1[1];
		    },
            reset() {
                this.valuetime1 = [];
                this.valuetime2 = [];
                this.dataForm.idJp = null;
                this.dataForm.state = null;
                this.dataForm.nickName = null;
                this.dataForm.publishStartTime = null;
                this.dataForm.publishEndTime = null;
                this.dataForm.publishStartTimeJp = null;
                this.dataForm.publishEndTimeJp = null;
                this.getDataList();
            },
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.state = null
                }else if(tab== "1"){
                    this.dataForm.state = "1"
                }else if(tab== "0"){
                    this.dataForm.state = "0"
                }
                this.changeVal = val;
                this.getDataList();
            },
            forbitHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "operating":row.state==1?0:1  //1发布   0取消发布
                }
                var msg = ""
                row.state==1?msg="取消发布":msg="发布"
                this.$confirm('是否'+msg+'该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    putoperating(obj).then((res)=>{
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
                    putoperatingAll(obj).then((res)=>{
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
                console.log(this.multipleSelection);
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
    .cell div{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /*/deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/

</style>
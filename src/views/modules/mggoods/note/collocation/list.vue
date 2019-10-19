<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="ID：">
                <el-input v-model.trim.trim="dataForm.id" ></el-input>
            </el-form-item>
            <el-form-item label="标题：">
                <el-input v-model.trim.trim="dataForm.id" ></el-input>
            </el-form-item>
            <el-form-item label="用户：">
                <el-input v-model.trim.trim="dataForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="发布状态：" prop="paymentStatus">
                <el-select v-model="dataForm.paymentStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已取消发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日本发布时间：">
                <el-date-picker
                        v-model="timeArr"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="发布时间：">
                <el-date-picker
                        v-model="timeArr2"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="addOrAdit()">搜索</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >搜索</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="upper">已发布</el-radio-button>
            <el-radio-button label="lower">已取消发布</el-radio-button>
        </el-radio-group>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="memberAvatar" label="封面图片" align="center">
                <template slot-scope="scope">
                    <img
                            :src="$imgDomain + scope.row.memberAvatar"
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="name" label="标题" align="center"></el-table-column>
            <el-table-column prop="japanDesc" label="用户" align="center"></el-table-column>
            <el-table-column prop="desc" label="相关商品" align="center"></el-table-column>
            <el-table-column prop="japanName" label="发布状态" align="center"></el-table-column>
            <el-table-column prop="name" label="日本发布状态" align="center"></el-table-column>
            <el-table-column prop="japanDesc" label="日本发布时间" align="center"></el-table-column>
            <el-table-column prop="desc" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="desc" label="收藏量" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.$index, scope.row)"type="text"size="mini">查看</el-button>
                    <el-button @click.native.prevent="addOrAdit(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                    <el-button @click.native.prevent="forbitHandle(scope.$index,scope.row)"type="text"size="mini">
                        <span v-if="scope.row.groupStatus==1" class="artdisable">{{scope.$index==currentIndex&&forbitLoading?"取消发布中..":"取消发布"}}</span>
                        <span v-else class="artstart">{{scope.$index==currentIndex && forbitLoading?"发布中..":"发布"}}</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-select v-model="dataForm.paymentStatus" placeholder="批量操作" style="margin-left: 10px;width: 140px;">
                    <el-option label="批量发布" value="0"></el-option>
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
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                activeName: "",
                breaddata: [ "内容管理", "搭配管理"],
                dataForm: {},
                value: '',
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
            }
        },
        components: {
            Bread
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
                this.dataForm.startCreateDate = this.timeArr && this.timeArr[0];
                this.dataForm.endCreateDate = this.timeArr && this.timeArr[1];
                this.dataForm.startPaymentTime = this.timeArr2[0];
                this.dataForm.endPaymentTime = this.timeArr2[1];
                this.getDataList();
            },
            reset(formName) {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.startCreateDate = "";
                this.dataForm.endtime = "";
                this.dataForm.startPaymentTime = "";
                this.dataForm.endPaymentTime = "";
                this.$refs[formName].resetFields();
                this.getDataList();
            },
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.goodsShow = ""
                }else if(tab== "upper"){
                    this.dataForm.goodsShow = "1"
                }else if(tab== "lower"){
                    this.dataForm.goodsShow = "0"
                }
                this.changeVal = val;
                console.log(this.changeVal)
                this.getDataList();
            },
            forbitHandle(index,row){
                this.currentIndex = index;
                var obj = {
                    "id": row.id,
                    "groupStatus":row.groupStatus==1?2:1  //
                }
                var msg = ""
                row.groupStatus==1?msg="禁用":msg="启用"
                this.$confirm('是否'+msg+'该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forbitLoading = true;
                    statusAttributegroup(obj).then((res)=>{
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
            handleCheckAllChange(val) {
                this.checkednodeslist = val ? this.dataList : [];  //dataList  nodeslist
                this.isIndeterminate = false;
                console.log(this.checkednodeslist + '当前选中的复选框')
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
<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="仓库名称/ID：">
                <el-input v-model="dataForm.id" ></el-input>
            </el-form-item>
            <el-form-item label="仓库种类：" prop="">
                <el-select v-model="dataForm.paymentStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已取消发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="启用状态：" prop="">
                <el-select v-model="dataForm.paymentStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已取消发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="addOrAdit()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="addoraditList()" >重置</el-button>
                <el-button  class="btn" type="primary" plain @click="addOrAdit()" >添加仓库</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
            <el-table-column prop="" label="仓库所在地" align="center"></el-table-column>
            <el-table-column prop="" label="仓库种类" align="center"></el-table-column>
            <el-table-column prop="" label="负责人" align="center"></el-table-column>
            <el-table-column prop="" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="" label="状态" align="center"></el-table-column>
            <el-table-column prop="" label="启用" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrAdit(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                    <el-button @click.native.prevent="addoraditList(scope.$index, scope.row)"type="text"size="mini">查看</el-button>
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
    // import showData from './model-show-data'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                activeName: "",
                breaddata: [ "仓库管理"],
                dataForm: {},
                value: '',
                dataList: [],
                dataListLoading: false,
                addEditDataVisible:false,
                // showDataVisible:false,
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
            Bread,
            addEditData,
            // showData
        },
        created () {
            // 第一次请求数据
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            addoraditList(id){
                this.$emit("addoraditList",id);
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
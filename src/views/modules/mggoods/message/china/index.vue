<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="分类名称：">
                <el-input v-model="dataForm.conditionName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="addOrEditHandle()"  class="btn" type="primary" style="float: right;">添加</el-button>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 54px">
            <el-table-column
                    label="排序"
                    align="center">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
            <el-table-column prop="japanDesc" label="分类属性" align="center"></el-table-column>
            <el-table-column prop="memberAvatar" label="分类图片" align="center">
                <template slot-scope="scope">
                    <img
                            :src="$imgDomain + scope.row.memberAvatar"
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="state" label="是否显示" align="center">
                <el-switch
                        v-model="dataList.state"
                        @change="changeReturnStatus"
                ></el-switch>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.native.prevent="addRowFn" size="mini">新增下级</el-button>
                    <el-button type="text" @click.native.prevent="editRowFn" size="mini">编辑</el-button>
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
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import addEditData from './model-add-edit-data'
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "中国分类"],
                dataForm: {
                    conditionName: "",//分类名称
                },
                value: '',
                dataListLoading: false,
                addEditDataVisible:false,

            }
        },
        components: {
            Bread,
            addEditData
        },
        methods: {
            // checkChange(list){
            //     console.log("check-change");
            //     console.log(list);
            // },
            // nodeClick(list){
            //     console.log("node-click");
            //     console.log(list);
            // },
            // currentChange(list){
            //     console.log("current-change");
            //     console.log(list);
            // },
            reset() {
                this.dataForm.conditionName = "";
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            },
            // 新增下级
            addRowFn(row){
                console.log(row)
                row.type="addNext"
                this.addOrEditHandle(row)
            },
            // 编辑回调
            editRowFn(row){
                console.log(row);
                row.type="edit"
                this.addOrEditHandle(row)
            },
            changeReturnStatus(val) {
                this.dataList.state = val;
            },
        }
    }
</script>

<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>
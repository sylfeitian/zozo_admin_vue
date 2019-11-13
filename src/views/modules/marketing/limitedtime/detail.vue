<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <div>
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="商品名称：">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品ID：">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="店铺名称：">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="品牌名称：">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="上架状态：">
                    <el-select v-model="dataForm.showWeb" placeholder="请选择">
                    <el-option
                        v-for="item in showOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可售状态：">
                    <el-select v-model="dataForm.sellState" placeholder="请选择">
                    <el-option
                        v-for="item in stateOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">搜索</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addOrUpdateHandle()">导出</el-button>
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    style="width: 100%;margin-top: 10px;">
                <el-table-column
                        type="index"
                        prop="$index"
                        label="序号"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" align="center" width="180">
                    <template slot-scope="scope">
                    <div
                        @click="detShowChange(scope.row)"
                        style="cursor:pointer;color:#2260D2;"
                    >{{scope.row.idJp}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center">
                    <template slot-scope="scope">
                    <div :title="scope.row.name">{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="所属店铺" align="center">
                    <template slot-scope="scope">
                    <div>{{scope.row.storeName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="所属品牌" align="center">
                    <template slot-scope="scope">
                    <div>{{scope.row.brandName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="sellPrice" label="标准价" align="center">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.discountPrice?scope.row.discountPrice:'0.00'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="sellPrice" label="促销价" align="center">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.discountPrice?scope.row.discountPrice:'0.00'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" align="center" min-width="100">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.showWeb==0" type="info">待上架</el-tag>
                    <el-tag v-if="scope.row.showWeb==1" type="success">已上架</el-tag>
                    <el-tag v-if="scope.row.showWeb==2" type="success">已下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="可售状态" align="center">
                    <template slot-scope="scope">
                    <div>
                        <span v-if="scope.row.sellState == 1 ">可售</span>
                        <span v-if="scope.row.sellState== 0 ">不可售</span>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="limit"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!-- 弹窗, 新建 -->
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { dictUrl,deleteDict } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: false,
                    getDataListURL: dictUrl,
                    getDataListIsPage: true,
                    deleteURL: deleteDict,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: ["营销管理", "限时折扣", "查看商品"],
                dataForm: {
                    dictName: '',
                    dictType: '',
                    dictValue: '',
                    pid:''
                },
                showOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "待上架" },
                    { id: "1", label: "已上架" },
                    { id: "2", label: "已下架" }
                ],
                stateOptions: [{id:"",label:"全部"},{ id: "0", label: "不可售" }, { id: "1", label: "可售" }],
                dataListLoading: false,
                row:""
            }
        },
        components: {
            Bread
        },
         watch:{
            'dataForm.dictName':function(newV,oldV) {
                var chineseCount=0,characterCount=0;
                for(let i=0;i<newV.length;i++){
                    if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //汉字
                        chineseCount=chineseCount+2;
                    }else if(/[0-9a-zA-Z]/g.test(newV[i])){ //数字、字母
                        characterCount=characterCount+1;
                    }else{ // 只能输入文字、字母、数字
                        this.dataForm.dictName = newV.replace(newV[i],"")
                    }
                    var count=chineseCount+characterCount;
                    if(count>600){ //输入字符大于600的时候过滤
                        this.dataForm.dictName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        // created() {
        //     this.getDataList()
        // },
        methods: {
            init (row){
                this.row = row;
                this.dataForm.pid = row.id;
                this.getDataList()
            },
            showList(id){
                this.$emit("showList",id);
            },
            reset(){
                this.dataForm.dictName = "";
                this.getDataList();
            },
            changePage(){
                this.$emit("showList");
            },
        }
    }
</script>


<style scoped>

</style>
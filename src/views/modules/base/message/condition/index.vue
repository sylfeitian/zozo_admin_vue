<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <!-- <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <el-form-item label="分类条件ID：">
                <el-input v-model.trim.trim="dataFormShow.conditionId" ></el-input>
            </el-form-item>
            <el-form-item label="分类条件名称：">
                <el-input v-model.trim.trim="dataFormShow.conditionName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form> -->
        <!-- <el-button @click="addOrEditHandle()"  class="btn" type="primary">导入信息</el-button>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 10px;">
            <el-table-column prop="idJp" label="分类条件ID" align="center"></el-table-column>
            <el-table-column prop="nameJp" label="日本分类条件名称" align="center"></el-table-column>
            <el-table-column prop="name" label="分类条件名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table> -->
        <!-- 分页 -->
        <!-- <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination> -->
        <div class="importBtn">
            <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getTree"></importAndExport>
        </div>
        <MyTableTree 
            v-loading="dataListLoading"
            :firstColName="'分类条件ID'"
            :children="'list'"
            :label="'name'"
            :mate="treeConfig" 
            ref="MyTree" 
            @act-click="actshowFlag"
            @check-change="checkChange"
            @node-click="nodeClick"
            @current-change="currentChange">
        </MyTableTree>
      	<!-- 分页 -->
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="formData.page"
            :page-sizes="[10,20, 50, 100]"
            :page-size="formData.limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>


        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getTree"></addEditData>
    </div>
</template>

<script>
    // import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
  
    import MyTableTree from "@/components/treeTable/MyTableTree.vue";
    import importAndExport from "@/components/import-and-export"
    import { importTag} from '@/api/io'
    // import {tagPage} from "@/api/url.js"

    import {tagPage} from "@/api/api.js"
    export default {
        // mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    importUrl:importTag,//导入接口
                    importWord:"导入信息"
                },
                // mixinViewModuleOptions: {
                //     getDataListURL: tagPage,
                //     getDataListIsPage: true,
                //     activatedIsNeed:false,
                //     // exportURL: '/admin-api/log/login/export',
                //     // deleteURL: deleteShopStyle,
                //     deleteIsBatch: false,
                //     deleteIsBatch: true,
                //     deleteIsBatchKey: 'id'
                // },
                breaddata: [ "基础资料管理", "分类条件信息"],
                dataListLoading: false,
                dataForm:{},
                dataFormShow: {
                    conditionId: "",//分类条件ID
                    conditionName: "",//分类条件信息名称
                },
                formData:{  
                    page:1,   
                    limit: 10,
                    parentId:0,
                    delFlag:0
                },
                total: 0,
                value: '',
                addEditDataVisible:false,
                formLabelWidth: '120px',
                treeConfig: {
                    //等于 el-tree 的选项配置
                    options: {
                        'show-checkbox': false
                    },
                    //自定义表格列 目前只支持文本渲染
                    columns: [
                        // {
                        //     label: '排序',
                        //     prop: function (a,data){ if(data.sort){return data.sort}else{return 0}},
                        //     span: 8
                        // },
                        {
                            label: '日本分类条件名称',
                            prop: "nameJp",
                            span:8
                        },
                        {
                            label: '分类条件名称',
                            prop:'name',
                            span: 8
                        }
                    ],
                    
                    //操作按钮列表
                    actions: [
                        {
                            type: "",//同el-button 的 type
                            prop:  "编辑",  //支持函数返回html 和 文本字符串
                            action: this.addOrEditHandle, //按钮点击触发的函数 回调函数是该行的row
                            className: "artedit"
                        }
                    ],
                    //tree 的数据来源
                    rows: [],
                },
            }
        },
        components: {
            Bread,
            addEditData,
            MyTableTree,
            importAndExport
        },
        created(){
            this.getTree();
        },
        methods: {
            // getData(){
            //     this.page =1;
            //     this.dataForm = {};
            //     for(let key in this.dataFormShow){
            //         this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
            //     }
            //     console.log(this.dataForm);
            //     this.getDataList()
            // },
             // 每页数
            sizeChangeHandle (val) {
                this.formData.page= 1;
                this.formData.limit = val;
                this.getTree();
            },
            // 当前页
            currentChangeHandle (val) {
                this.formData.page = val;
                this.getTree();
            },
            checkChange(list){
                console.log("check-change");
                console.log(list);
            },
            nodeClick(event, list){
                console.log("node-click");
                console.log(event, list);
            },
            //是否显示
            actshowFlag(data){
                showCategoryCn(data,false).then((res)=>{
                console.log(res);
                if(res.code == 200){
                    this.$message.success("设为"+(data.showFlag==1?'显示':'不显示')+"成功")
                    this.getTree();
                }else{
                    this.$message(res.msg);
                }
                });
            },
            currentChange(list){
                console.log("current-change");
                console.log(list);
            },
            getTree() {
                let obj = {
                    params:this.formData
                }
                    // 获取表格数据
                tagPage(obj).then(res => {
                    //Promise后 对数据格式进行处理
                    if (res.code == 200) {
                        var data = res.data.list;
                        this.total = res.data.total;
                        console.log(data);
                            //处理树形数据
                        // this.treeConfig.rows =  data; 
                        var dataStr = JSON.stringify(data);
                        dataStr = dataStr.replace(/idJp/g,"label")
                        dataStr = dataStr.replace(/childs/g,"children")
                        this.treeConfig.rows = [].concat(JSON.parse(dataStr));
                        
                        console.log("treeTable数据:");
                        console.log(this.treeConfig.rows);

                        var dataArray = JSON.stringify(this.treeConfig.rows);
                        var dataArrayStr = dataArray.replace(/id/g,"value");
                        dataArrayStr = dataArrayStr.replace(/\[]/g,'""');
                        this.$parent.dataArray = JSON.parse(dataArrayStr);
                        console.log( dataArrayStr );
                    }
                });
            },
            reset() {
                this.dataFormShow.conditionName = "";//分类条件信息名称
                this.dataForm.conditionName = "";//分类条件信息名称
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            }
        }
    }
</script>

<style scoped>
.importBtn{
    float:right;
    margin-bottom: 8px;
    z-index: 99;
    position: relative;
}
</style>
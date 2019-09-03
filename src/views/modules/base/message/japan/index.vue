<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-button @click="addOrEditHandle()"  class="btn" type="primary">导入信息</el-button>

        <MyTableTree
                v-loading="dataListLoading"
                :children="'list'"
                :label="'name'"
                :mate="treeConfig"
                ref="MyTree"
                @check-change="checkChange"
                @node-click="nodeClick"
                @current-change="currentChange"
                style="margin-top: 10px;"
        >
        </MyTableTree>

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
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getTree"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import TableTreeColumn from "@/components/table-tree-column";
    import MyTableTree from "./tree.vue";
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import { categoryJpPageTier } from '@/api/api'
    import { categoryJpUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: categoryJpUrl,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteShopStyle,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "日本分类"],
                // dataForm: {
                //     selectName: "",//分类名称
                // },
                value: '',
                addEditDataVisible:false,
                treeConfig: {
                    //等于 el-tree 的选项配置
                    options: {
                        'show-checkbox': true
                    },
                    //自定义表格列 目前只支持文本渲染
                    columns: [
                        {
                            label: '分类ID',
                            prop: 'idJp',
                            span: 6
                        },
                        {
                            label: "更新时间",
                            prop: 'updateDate',
                            span: 6
                        },
                        {
                            label: '分类名称',
                            prop:'name',
                            span: 6
                        },
                    ],

                    //操作按钮列表
                    actions: [
                        {
                            type: "",//同el-button 的 type
                            prop:  "编辑",  //支持函数返回html 和 文本字符串
                            action: this.addOrEditHandle //按钮点击触发的函数 回调函数是该行的row
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
            TableTreeColumn,
            MyTableTree
        },
        created() {
            this.getTree();
        },
        methods: {
            getTree() {
                let obj = {
                    params:this.formData
                }
                categoryJpPageTier(obj).then(res => {
                    //Promise后 对数据格式进行处理
                    if (res.code == 200) {
                        var data = res.data.list;
                        this.total = res.data.total;
                        console.log(data);
                        //处理树形数据
                        // this.treeConfig.rows =  data;
                        var dataStr = JSON.stringify(data);
                        dataStr = dataStr.replace(/nameJp/g,"label")
                        dataStr = dataStr.replace(/list/g,"children")
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
                this.dataForm.selectName = "";//商品名称/商品货号
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(row){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            },
            checkChange(list){
                console.log("check-change");
                console.log(list);
            },
            nodeClick(event, list){
                console.log("node-click");
                console.log(event, list);
            },
            currentChange(list){
                console.log("current-change");
                console.log(list);
            }
        }
    }
</script>

<style scoped>

</style>
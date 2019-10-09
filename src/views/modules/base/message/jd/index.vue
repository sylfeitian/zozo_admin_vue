<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
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
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="formData.page"
                :page-sizes="[10, 20, 50, 100]"
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
    import MyTableTree from "./tree.vue";
    import TableTreeColumn from "@/components/table-tree-column";
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import { jdCateUrl } from '@/api/url'
    import { jdCateSubcollection,jdCatePage } from '@/api/api'
    
    export default {
        // mixins: [mixinViewModule],
        data () {
            return {
                  dataListLoading:false,
                // mixinViewModuleOptions: {
                //     getDataListURL: jdCateUrl,
                //     getDataListIsPage: true,
                //     activatedIsNeed:false,
                //     // exportURL: '/admin-api/log/login/export',
                //     // deleteURL: deleteShopStyle,
                //     deleteIsBatch: false,
                //     deleteIsBatch: true,
                //     deleteIsBatchKey: 'id'
                // },
                breaddata: [ "商品管理", "京东分类"],
                addEditDataVisible:false,
                formData:{
                    page:1,
                    limit:10,
                    parentId:0
                },
                total: 0,
                treeConfig: {
                    //等于 el-tree 的选项配置
                    options: {
                        'show-checkbox': false
                    },
                    //自定义表格列 目前只支持文本渲染
                    columns: [
                        {
                            label: '京东分类名称',
                            prop: 'categoryName',
                            span: 9
                        },
                        {
                            label: "关联分类",
                            prop: 'name',
                            span: 9
                        }
                    ],

                    //操作按钮列表
                    actions: [
                        {
                            type: "",//同el-button 的 type
                            prop:  this.returnRelat,  //支持函数返回html 和 文本字符串
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
            MyTableTree,
            TableTreeColumn,
            addEditData
        },
        // watch:{
        //     'limit' (val) {
        //         this.getData();
        //     }
        // },
        created() {
            this.getTree();
        },
        methods: {
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
            getTree() {
                 let obj = {
                    params:this.formData
                }
                this.dataListLoading = true;
                jdCatePage(obj).then(res => {
                     this.dataListLoading = false;
                    if (res.code == 200) {
                        var data = res.data.list;
                        this.total = res.data.total;
                        console.log(data);
                        //处理树形数据
                        // this.treeConfig.rows =  data;
                        data.forEach((item, index) => {
                            console.log(item, index)
                            item.label = item.id;
                            item.name = "",
                            item.level=1
                            item.relateList && item.relateList.forEach((item2, index2) => {
                                item.name += (" "+item2.name);
                            });
                        })
                        this.treeConfig.rows = data

                    }
                });
            },
            returnRelat(row){
                    return "关联分类";
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
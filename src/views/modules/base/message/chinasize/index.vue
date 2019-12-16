<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <el-form-item label="中国尺码名称：">
                <el-input v-model.trim="dataFormShow.name" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
        	<el-button @click="addOrEditHandle()"  class="btn" type="primary" >添加</el-button>
        </el-form>
        <el-table
            width="100%"
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;margin-top: 10px;"
        >
            <el-table-column
                    label="序号"
                    width="70"
                    align="center">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column>

            <el-table-column
                    prop="name"
                    label="尺码名称"
                    align="center">
            </el-table-column>

            <el-table-column
                    prop="sizeJp"
                    label="关联日本尺码"
                    width="600"
                    align="center">
            </el-table-column>

            <el-table-column
                    label="操作"
                    align="center"
                    width="240">
                <template slot-scope="scope">
                	<el-button @click.native.prevent="lookHandle(scope.$index, scope.row)"type="text"size="mini">查看关联尺码</el-button>
                    <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="footer">
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

       	<!--查看关联尺码-->
        <el-dialog
		  title="查看关联尺码"
		  :visible.sync="dialogVisible"
          style="text-align: center;"
		  width="30%">
		  <span class="artitem" v-for='(item,index) in itemlist' :key='index'>{{item}}</span>
		</el-dialog>
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import {updatasizeCn} from '@/api/api'
    import {getsizeCndata,delsizeCndata} from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
		          getDataListURL: getsizeCndata,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: delsizeCndata,
		          dataListLoading: false,
		          deleteIsBatch: false,
		          deleteIsBatchKey: 'id'
			    },
                breaddata: [ "商品管理", "中国尺码"],
                addEditDataVisible:false,
                dataFormShow: {
                    name: "",//中国尺码名称
                },
                addEditDataVisible:false,
                dataList: [],
                dataListLoading: false,
                dialogVisible: false,   //查看关联尺码
                itemlist: [],//关联尺码
            }
        },
        components: {
            Bread,
            addEditData
        },
        watch:{
            'dataFormShow.name':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.name = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        methods: {
            getData(){
                this.page =1;
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.name = "";
                this.dataForm.name = "";
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
            lookHandle(index,row){    //查看关联尺码
            	if(row.sizeJp){
            		this.itemlist = row.sizeJp.split(",");
            		this.dialogVisible = true;
            	}else{
            		this.$message('无关联日本尺码')
            	}
            	
            }
        }
    }
</script>

<style lang="scss" scoped>
	.artitem{
		padding:0 10px;
		margin-right: 10px;
		margin-bottom: 10px;
		background: #EEE;
	}
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>
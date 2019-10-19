<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <!-- <el-button style="float:right;margin-bottom:20px;" type="primary" @click="addHelp()">新增帮助类型</el-button> -->
    <el-button style="float:right;margin-bottom:20px;" type="primary" @click=" addHelp()">新增帮助类型</el-button>

    <el-table
        :data="dataList"
        v-loading="dataListLoading"
        border
        style="width: 100%">
	    <el-table-column
	    	type="index"
		    prop="$index"
			align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column>
		<el-table-column
		    prop="sort"
			align="center"
		    label="排序">
            <template slot-scope="scope">
                <el-input
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row)"
                        :min="0"
                        type="number"
                ></el-input>
            </template>
		</el-table-column>
        <el-table-column
		    prop="type"
		    label="帮助类型"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="num"
			align="center"
		    label="问题数量">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
	    	label="操作"
			align="center"
            width="220">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toDetail(scope.row)">查看</el-button>
		    	<el-button type="text" size="small" @click="addHelp(scope.row.id)">编辑</el-button>
		    	<el-button type="text" size="small" @click="delItem(scope.row.id)">删除</el-button>
		    </template>
	  	</el-table-column>
	</el-table>
	<!-- 分页 -->
    <div class="footerBox">
        <div class="footerBtn">
            <el-button @click="changeSortSave()" type="primary">保存排序</el-button>
        </div>
        <el-pagination
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>


    <el-dialog
        :title="helpTitle"
        :visible.sync="editVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="editDataForm" :rules="dataRule" ref="editDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item label="帮助类型：" prop="sgName">
                <el-input v-model.trim.trim="editDataForm.sgName" placeholder="请输入10字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
            	 <el-input-number v-model="editDataForm.sort" min="1" max="10000000"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('editDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('editDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { QamainList } from '@/api/url'
    import { zozogoodsPage,delQuestiontype,saveQuestiontype,putQuestiontype,getQuestiontype,putQuestionanswer,cartConfigSort } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: QamainList,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/store/export',
                    // deleteURL: '/admin-api/store',
                    // deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                helpTitle:'新增帮助类型',
                dataListLoading:false,
                dataList:[],
				isSave:true,
                dataContent:"",
                buttonStatus:false,
                editVisible:false,
                editDataForm:{
                    sgName:'',
                    sort:'0',
                },
                breaddata: ["配置管理", "Q&A配置"],
                sortList: [],
            }
        },
        computed:{
            dataRule(){
                return{
                    sgName : [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    sort : [
                            { required: true, message: '排序不能为空', trigger: 'blur' },
                    ]
                }
            }
        },
		watch: {
			'editDataForm.sgName': function (newV, oldV) {
				var chineseCount = 0, characterCount = 0;
				for (let i = 0; i < newV.length; i++) {
					if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
						chineseCount = chineseCount + 2;
					} else { //字符
						characterCount = characterCount + 1;
					}
					var count = chineseCount + characterCount;
					if (count > 20) { //输入字符大于20的时候过滤
						this.editDataForm.sgName = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
					}
				}
			}
			},
			created(){
            this.demo();
        },
        methods: {
            delItem(id){
                this.$confirm('是否删除该数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let obj = [];
                    obj.push(id)
                    delQuestiontype({data:obj}).then((res)=>{
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
            toDetail(id){
                this.$emit("mainListFun",id);
            },
            addHelp(id){
                this.editVisible = true;
                if(id){
                    this.helpTitle = '编辑帮助类型';
                    this.isSave = false;
                    var obj  = {
                        id:id
                    }
                    getQuestiontype(obj).then((res)=>{
                        if(res.code == 200){
                            this.dataContent = res.data;
							this.editDataForm.sgName = this.dataContent.type;
							this.editDataForm.sort = this.dataContent.sort;
                        }
                    })
                }else{
                    this.helpTitle = '新增帮助类型';
                    this.isSave = true;
                }
            },
            //更改排序
            changeSort(row) {
                this.sortList.push(row);
            },
            //保存排序
            changeSortSave() {
                if (this.sortList.length == 0) {
                    this.$message({
                    type: "warning",
                    message: "请选择修改排序的数据"
                    });
                    return false;
                }
                const obj = this.sortList;
                cartConfigSort(obj).then(res => {
                    if (res.code == 200) {
                    this.$message({
                        message: res.msg,
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                        this.getDataList();
                        }
                    });
                    } else {
                    this.$message({
                        message: res.msg,
                        type: "error",
                        duration: 1500,
                        onClose: () => {
                        this.getDataList();
                        }
                    });
                    }
                });
            },
            noCheck(formName){
                this.$refs[formName].resetFields();
                this.editVisible = false;
                this.editDataForm.sgName='';
                this.editDataForm.sort='';
                this.dataContent='';
            },
            subActivity(formName){
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm(`确定提交表单信息?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                if(that.isSave){
                                    let obj = {
                                        type:that.editDataForm.sgName,
										sort:that.editDataForm.sort
									}
                                    saveQuestiontype(obj).then((res)=>{
                                        if(res.code == 200){
                                            this.$message({
                                                message: res.msg,
                                                type: 'success',
                                                onClose:function () {
                                                    that.noCheck("editDataForm");
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
								}else{
                                    that.dataContent.type = that.editDataForm.sgName;
                                    that.dataContent.sort = that.editDataForm.sort;
                                    putQuestiontype(that.dataContent).then((res)=>{
                                        if(res.code == 200){
                                            this.$message({
                                                message: res.msg,
                                                type: 'success',
                                                onClose:function () {
                                                    that.noCheck("editDataForm")
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
								}
                            })
                            .catch(() => {});
                    }
                });
            },



            demo(){
                function placeholderPic(){
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize=w/20+'px';
                }
                    placeholderPic();
                window.onresize=function(){
                    placeholderPic();
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
    .el-input {
        width: 240px;
        height: 40px;
    }
	/deep/ .cell {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
    .footerBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>

<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>

        <div class="mod-sys__log-error">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="showedition">更新版本</el-button>
                </el-form-item>
                <br />
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
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
                <el-table-column prop="systemType" width="90" label="端口" header-align="center" align="center" :formatter="systemTypeStatus"></el-table-column>
                <el-table-column prop="versionNum" width="100" label="版本号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="versionDescription" label="版本描述" header-align="center" align="center"></el-table-column>
                <el-table-column prop="forceUpdateFlag" width="110" label="是否强制更新" header-align="center" align="center">
                	<template slot-scope="scope">
                		{{scope.row.forceUpdateFlag ? '是' : '否'}}
                	</template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="200"  header-align="center" align="center"></el-table-column>
            	<el-table-column
			   		prop="address"
			    	label="操作"
					align="center"
					fixed="right"
					width="100">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="delSystem(scope.row.id)">删除</el-button>
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
        </div>
        <el-dialog
            class="modeledit"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="500px"
    	>
    	<div><span style="display:inline-block; width:100px; margin-right: 10px; text-align: right;">端口：</span> <span class="artccc">{{detail && detail.systemType=='1'?'IOS':'安卓'}}</span></div>
    	<div><span style="display:inline-block; width:100px; margin-right: 10px; text-align: right;">版本号：</span>  <span class="artccc">{{detail &&  detail.versionNum}}</span></div>
    	<div><span style="display:inline-block; width:100px; margin-right: 10px; text-align: right;">版本描述：</span>  <span class="artccc">{{detail &&  detail.versionDescription}}</span></div>
    	<div><span style="display:inline-block; width:100px; margin-right: 10px; text-align: right;">文件包：</span>  <span class="artccc">{{detail &&  detail.filePath }}</span></div>
    	<div><span style="display:inline-block; width:100px; margin-right: 10px; text-align: right;">是否强制更新：</span>  <span class="artccc"> {{detail &&  detail.forceUpdateFlag ? '是' : '否'}}</span></div>
    	</el-dialog>
    	
    	<el-dialog
            class="modeledit"
            :title="'更新版本'"
            :close-on-click-modal="false"
            :visible.sync="visiblecopy"
            :before-close="closeDialogcopy"
            width="30%"
    	>
    	<el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit('dataForm')"
            label-width="120px"
        >
            <el-form-item label="端口号：" prop="systemType" >
                <el-radio v-model="dataForm.systemType" label="1">Android</el-radio>
  				<el-radio v-model="dataForm.systemType" label="2">IOS</el-radio>
            </el-form-item>
            <el-form-item label="版本号：" prop="versionNum">
                <el-input  v-model="dataForm.versionNum" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="版本描述：" prop="versionDescription">
                 <el-input type="textarea" placeholder="请输入200字以内的内容" v-model="dataForm.versionDescription"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="签名MD5：" prop="md5Sign" >
                <el-input v-model.trim="dataForm.md5Sign" placeholder="请输入"></el-input>
           </el-form-item>
            <el-form-item v-if="isShow" label="文件包：" prop="filePath" >
                <uploud-model ref="apkupload" @getDataurl="getDataurl" :importAndExportOptions="importAndExportOptions" :btType="'primary'" :dataForm="dataForm" @getDataList="getDataList"></uploud-model>
            </el-form-item>
            <el-form-item label="是否强制更新：" prop="forceUpdateFlag">
                <el-radio v-model="dataForm.forceUpdateFlag" label="1">是</el-radio>
  				<el-radio v-model="dataForm.forceUpdateFlag" label="0">否</el-radio>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormCancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit('dataForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
            </el-form-item>
        </el-form>
    	</el-dialog>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { getsysversionmange,exportError } from '@/api/url'
    import uploudModel from './import_model'
    import { sysversionmangedetail ,addfileupload,getsysversidel} from '@/api/api'
	import { postfileupload } from '@/api/io'
    

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
			        getDataListURL: getsysversionmange,
			        getDataListIsPage: true,
			        // exportURL: '',
			        deleteURL: '',
			        deleteIsBatch: false,
			        deleteIsBatchKey: 'id'
			    },
                dataForm: {
                    systemType: "",   //端口
                    versionNum:"",   //版本号
                    versionDescription:"", //版本描述
                    forceUpdateFlag:'0',  //是否强制更新
                    md5Sign:"",  //签名MD5
                    filePath:"", //apk路径  
                    targetSize:'', //apk大小
                },
                breaddata: ["系统管理", "版本管理"],
                timeArr: "", //操作时间数据
                dataListLoading: false,
                moduleOption:[],
                title:'查看',
                visible : false,
                visiblecopy : false,
                loading : false,
                detail:null,
                dataRule:{
                	systemType: [
			            { required: true, message: '请输入', trigger: 'blur' },
			        ],
			        versionNum: [
			            { required: true, message: '请输入版本号,版本号仅数字', trigger: 'blur' },
			        ],
			        versionDescription: [
			            { required: true, message: '请输入', trigger: 'blur' },
			            { min:1,max:200 ,message: '最大可输入200字以内的内容', trigger: 'blur' },
			        ],
			        md5Sign: [
			            { required: true, message: '请输入', trigger: 'blur' },
			        ],
			        forceUpdateFlag: [
			            { required: true, message: '请选择', trigger: 'blur' },
			        ],
			        filePath: [
			            { required: true, message: '请选择', trigger: 'blur' },
			        ],
                },
                systemTypeStatus:function(row){
                    return row.systemType  == 1 ?  'Android': 'IOS';
                },
                isShow: true,
                importAndExportOptions:{
                    importUrl:postfileupload,//导入接口
                    importWord:"上传文件",
                    // exportUrl:exportRegisterUrl,//导出接口
                    // exportWord:"导出数据",
                },
                postfileuploadurl:postfileupload,
            }
        },
        components: {
            Bread,
            uploudModel
        },
        watch:{  
            timeArr(val){
                if(!val){
                    this.dataForm.createDateStart = '';
                    this.dataForm.createDateEnd = '';
                }
            },
            'dataForm.systemType':function(newV,oldV) {
                if(newV == 1){
                	this.isShow = true;
                }else{
                	this.isShow = false;
                }
            },
            'dataForm.md5Sign': function(newV,oldV){
            	for (let i = 0; i < newV.length; i++) {
                    if(!(/^[0-9a-zA-Z]+$/.test(newV))){
            			this.dataForm.md5Sign = oldV; 
                        this.$message({
	                        message: '只能输入数字或字母',
	                        type: status,
	                        duration: 1500
	                    })
                    }
              }
            }
        },
        created() {
            
        },
        mounted(){
        	//this.$refs.refuploud.init();
        },
        methods: {
            delSystem(id){
                const params={
                    id:id
                }
                getsysversidel(params).then(res=>{
                    if(res.code==200){
                        this.$message({
	                        message: res.msg,
	                        type: 'success',
	                        duration: 1500
                        })
                        this.dataForm.systemType = "";
                        this.getDataList()
                    }else{
                        this.$message({
	                        message: res.msg,
	                        type: 'warning',
	                        duration: 1500
	                    })
                    }
                })
            },
           	showDetail(row){
           		sysversionmangedetail(row).then((res)=>{
           			if (res.code == "200") {
           				this.detail = res.data;
                    } else{
                    	this.$message({
	                        message: res.msg,
	                        type: status,
	                        duration: 1500
	                    })
                    }
                    
           		})
           		this.visible = true;
           		
           	},
           	closeDialog() {
                this.visible = false;
            },
            closeDialogcopy() {
            	this.visiblecopy = false;
            },
           	showedition(){
           		this.visiblecopy = true;
           		this.isShow = true;
                this.dataForm.systemType = "1";
                this.dataForm.versionNum = "";
                this.dataForm.versionDescription = "";
                this.dataForm.forceUpdateFlag = "0";
                this.dataForm.md5Sign = "";
                this.dataForm.filePath = "";
                this.$nextTick(()=>{
                    this.$refs.apkupload.importWord = '上传文件'
                })
                
           	},
           	dataFormCancel(){
                this.visiblecopy = false;
                this.closeDialogcopy();
            },
            getDataurl(apkurl,targetSize){
                this.dataForm.filePath = apkurl
                this.dataForm.targetSize = targetSize;
            },
            // 提交
            dataFormSubmit(formName) {
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addfileupload(this.dataForm).then((res)=>{
                        	if (res.code == "200") {
		           				this.$message({
			                        message: '更新版本成功',
			                        type: 'success',
			                        duration: 1500
			                    })
                                   this.visiblecopy = false;
                                   this.dataForm.systemType = "";
                                   this.getDataList();
		                    } else{
		                    	this.$message({
			                        message: res.msg,
			                        type: status,
			                        duration: 1500
			                    })
		                    }
                        })
                    } else {
                        //console.log('error 添加失败!!');
                        return false;
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
    .mod-sys__log-error {
        &-view-info {
            width: 80%;
        }
    }
    .modeledit .artccc{
    	color: #ccc;
    }
    .el-dialog__body>div{
    	margin-top: 15px;
    }
</style>

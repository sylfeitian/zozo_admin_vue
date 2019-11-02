<template>
    <el-dialog
        class="model-add-edit-data"
        :title="type == 0 ?'修改尺码': '关联尺码' "
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="尺码ID：" prop="idJp">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="尺码名称：" prop="name">
                <span>{{dataForm.name}}</span>
            </el-form-item>
            <el-form-item label="关联尺码：" prop="cnSizeId">
            	<el-select
		          v-model="dataForm.cnSizeId"
		          placeholder="请选择"
                  filterable
                  remote
                  :remote-method="remoteMethod"
		          :loading="optionLoading"
                 >
                  <!-- @change="chooseCnSize" -->
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
            </el-form-item>
<!--            <el-form-item style="text-align: center; ">-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
<!--                <el-button @click="dataFormCancel()">取消</el-button>-->
<!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                       :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {uploadsizejptag,getsizecn} from '@/api/api'
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                optionLoading: false,
                dataForm: {
                	id:"",
                    idJp: "",//尺码ID
                    name: "",//日本尺码名称
                    cnSizeName: "",//尺码名称
                    cnSizeId:"",//中国尺码id

                },
                goodKindList1:[],
                dataRule : {
                    idJp : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    name : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    cnSizeId : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                type: "",
                formLabelWidth: '120px',
                list: []
            }
        },
        components:{
        },
        computed:{
        	
        },
        mounted(){
            // this.list = data.map(item => {
            //     return { value: item, label: item };
            // });
        	
        },
        methods: {
        	//获取尺码
        	artgetsize(){
                // getsizecn().then(({data})=>{
                // 	if(data){
                // 		this.goodKindList1 = data;
		        //   	}else {
			    //       	this.$message.error("服务器错误");
		        //   	}
                //     })
                this.goodKindList1 = [{"id":this.dataForm.cnSizeId,"name":this.dataForm.cnSizeName}];

        	},
            init (row,type) {
                this.visible = true;
                console.log(typeof this.dataForm)
                this.dataForm = cloneDeep(row);
                this.artgetsize();
                this.type  = type;
                this.list = cloneDeep(this.goodKindList1);
//              this.$nextTick(() => {
//                  this.$refs['addForm'].resetFields();
//                  // this.getApplyPullList();
//              })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        console.log(this.dataForm);
                        var obj = {
                           ...this.dataForm,
                            cnSizeId:this.dataForm.cnSizeId,
                            id:this.dataForm.id
                        }
                        uploadsizejptag(obj).then((res) => {
                            this.loading = false;
                            let status = null;
                            if(res.code == "200"){
                                res.msg = "修改成功";
                                 status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
                                this.closeDialog();

                            }else{
                                status = "error";
                            }

                            this.$message({
                                message: res.msg,
                                type: status,
                                duration: 1500
                            })
                        })
                    } else {
                        //console.log('error 添加失败!!');
                        return false;
                    }
                })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditisshow = false;
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.optionLoading = true;
                    var obj = {
                        name:query,
                    }
                    getsizecn().then((res)=>{
                        this.optionLoading = false;
                        console.log(res);
                        console.log(this.goodKindList1)
                        this.goodKindList1 = res.data.filter(item => {
                        return item.name.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                        });
                     })
                } else {
                this.goodKindList1 = [];
                }
               
            }
    
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
</style>
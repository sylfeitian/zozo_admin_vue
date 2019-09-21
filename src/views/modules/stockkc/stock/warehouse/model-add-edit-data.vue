<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="50%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="仓库名称：" prop="warehouseName">
                <el-input v-model="dataForm.warehouseName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库种类：" prop="type">
                <el-select v-model="dataForm.type" placeholder="请选择">
                    <el-option label="发货仓" :value="0"></el-option>
                    <el-option label="退货仓" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="仓库负责人：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="负责人联系方式：" prop="phone" :label-width="formLabelWidth">
                <el-input v-model="dataForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库所在地：" prop="addressInfo" :label-width="formLabelWidth">
                <el-select v-model="dataForm.provinceId" placeholder="省"
                           style="margin-right:10px;"
                           @visible-change="changeArea(dataForm.provinceId, 1)">
                    <el-option
                            v-for="item in optionsArea1"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="dataForm.cityId" placeholder="市"
                           style="margin-right:10px;"
                           @visible-change="changeArea(dataForm.cityId, 2)">
                    <el-option
                            v-for="item in optionsArea2"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="dataForm.areaId" placeholder="区"
                           style="margin-right:10px;"
                           @visible-change="changeArea(dataForm.areaId, 3)">
                    <el-option
                            v-for="item in optionsArea3"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="dataForm.streetId" placeholder="街"
                           @visible-change="changeArea(dataForm.streetId,4)">
                    <el-option
                            v-for="item in optionsArea4"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-input type="textarea" v-model="dataForm.addressInfo" placeholder="请输入详细地址" :rows="4" style="margin-top: 20px;"></el-input>
            </el-form-item>
<!--            <el-form-item style="text-align: center;margin-left: -120px!important;">-->
<!--                <el-button  @click="dataFormCancel()">取消</el-button>-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
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
    import { backScanWare,addWare, updataWare} from '@/api/api'
    import { areaFirst, areaByParentId, verifyWare } from "@/api/api"
    export default {
        name: "model-add-edit-data",
        data () {
            var validatorWarehouseName = (rule, value, callback) => {
                if (value != '') {
                     var obj  ={
                        params:{
                            id:this.row?this.row.id:"",
                            name:value
                        }
                     }
                    verifyWare(obj).then((res)=>{
                        if(res){
                            callback()
                        }else{
                            callback(new Error('仓库名称已经存在'))
                        }
                    })

                } else {
                    callback()
                }
            }
            return {
                visible : false,
                loading : false,
                dataForm: {
                    provinceId: "",
                    provinceName:"",
                    cityId: "",
                    cityName:"",
                    areaId: "",
                    areaName:"",
                    streetId: "",
                    streetName:"",
                    warehouseName:"",
                    name:"",
                    phone:"",
                    type:"",
                    addressInfo:""

                },
                optionsArea1:[],
                optionsArea2:[],
                optionsArea3:[],
                optionsArea4:[],
                dataRule : {
                    warehouseName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validatorWarehouseName, trigger: 'blur'}
                    ],
                    type : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    name : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    phone : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    addressInfo : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                orderBase:{},
                row:"",
                receiverInfo:{},
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                var orderBase = row.orderBase
                var receiverInfo = row.receiverInfo
                console.log(row)
                this.visible = true;
                this.row = row;
                console.log(row)
                if(row){
                    this.title="编辑仓库";
                    this.backScan();
                }else{
                    this.title="添加仓库"

                }
                //获取地址一级下拉
                this.getFirstData();

                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            getFirstData(){
                areaFirst().then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        this.optionsArea1 = res.data;
                    }
                })
            },
            changeArea(id,argu2,reset=true){
                if(!id){
                    return
                }
                var obj ={
                    id:id
                }
                if(argu2==1 && reset){
                    this.dataForm.cityId = "";
                    this.dataForm.areaId = "";
                    this.dataForm.streetId = "";
                    this.optionsArea2 = []
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==2 && reset){
                    this.dataForm.areaId = "";
                    this.dataForm.streetId = "";
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==3 && reset){
                    this.dataForm.streetId = "";
                    this.optionsArea4 = []
                }else if(argu2==4 && reset){
                    // 选到最后一级了
                }
                areaByParentId(obj).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        if(argu2==1){
                            this.optionsArea2 = res.data;
                        }else if(argu2==2){
                            this.optionsArea3 = res.data;
                        }else if(argu2==3){
                            this.optionsArea4 = res.data;
                        }else if(argu2==4){
                            // 选到最后一级了

                        }
                    }
                })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                }
                backScanWare(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                        this.preOptionsArea1 = [];
                        // this.orderBase = orderBase;
                        // Object.assign(this.dataForm,receiverInfo);
                        var receiverInfo  = res.data
                        // this.preOptionsArea1 = [];
                        this.optionsArea2[0] = {id:receiverInfo.cityId,name:receiverInfo.cityName};
                        this.optionsArea3[0] = {id:receiverInfo.areaId,name:receiverInfo.areaId};
                        this.optionsArea4[0] =  {id:receiverInfo.streetId,name:receiverInfo.streetName};
                        // receiverInfo.provinceId && this.changeArea(receiverInfo.provinceId,1,false);
                        // receiverInfo.cityId && this.changeArea(receiverInfo.cityId,2,false);
                        // receiverInfo.areaId && this.changeArea(receiverInfo.areaId,3,false);

                    }else{

                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj={
                            warehouseName: this.dataForm.warehouseName,
                            type: this.dataForm.type,
                            name: this.dataForm.name,
                            phone:this.dataForm.phone,
                            areaId: this.dataForm.areaId,
                            cityId: this.dataForm.cityId,
                            provinceId: this.dataForm.provinceId,
                            streetId: this.dataForm.streetId,
                            addressInfo: this.dataForm.addressInfo ,
                            // isEnable: 1
                        }
                        console.log(obj)
                        if(this.row) obj.id = this.row.id;
                        var fn = this.row?updataWare:addWare;
                        fn(obj).then((res) => {
                            this.loading = false;
                            // alert(JSON.stringify(res));
                            let status = null;
                            if(res.code == "200"){
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
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item__label {
        width: 130px!important;
    }
    /deep/ .el-form-item__content{
        margin-left: 130px!important;
    }
    /deep/ .el-select--default{
        width: 146px!important;
    }
</style>
<template>
    <el-dialog
            class="model-add-edit-data"
            title="订单跟踪"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="60%"
    >
                <el-form
                    :model="dataForm"
                    :rules="dataRule"
                    ref="addForm"
                    @keyup.enter.native="dataFormSubmit('addForm')"
                    label-width="120px">
                        <el-form-item label="收货人姓名：" prop="memberRealName">
                                <el-input v-model="dataForm.memberRealName" maxlength="60" placeholder="请输入收货人姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码：" prop="mobPhone">
                                <el-input v-model="dataForm.mobPhone" maxlength="60" placeholder="请输入手机号码"></el-input>
                        </el-form-item>  
                        <el-form-item label="所在区域：" prop="province">
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
                            <el-select v-model="dataForm.stressId" placeholder="街"
                                @visible-change="changeArea(dataForm.stressId,4)">
                                <el-option
                                    v-for="item in optionsArea4"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item> 
                         <el-form-item label=" 详细地址：" prop="address">
                                <el-input   
                                    type="textarea"
                                    :autosize="{ minRows: 3, maxRows: 6}"
                                    v-model="dataForm.address"  
                                    placeholder="请输入详细地址">
                                </el-input>
                        </el-form-item> 
                </el-form>
			    <span slot="footer" class="dialog-footer">
		     		    <el-button @click="closeDialog()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
    </el-dialog>
</template>

<script>
import {orderReceiver,areaFirst,areaByParentId} from "@/api/api.js"
import { isMobile,isPhone } from '@/utils/validate'
    export default {
        name: "model-order-data",
        data () {
            return {
                visible : false,
                loading : false,
                active: 0,
                logisticsSn:'',
                logisticsData:[],
                optionsArea1:[],
                optionsArea2:[],
                optionsArea3:[],
                optionsArea4:[],
                receiverInfo:{ },
                 dataForm : {
                    memberRealName:'',
                    mobPhone:'',
                    address: "",
                    area: "",
                    areaId: "",
                    city: "",
                    cityId: "",
                    memberRealName: "",
                    mobPhone: "",
                    province: "",
                    provinceId: "",
                    stressId: "",
                    townArea: "",
                 },
                 orderBase:{},
                 row:{},
                dataRule : {
			        memberRealName : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
			        ],
			        mobPhone: [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
					],
					province: [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
					],
					address: [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
					],
				},
            }
        },
        methods: {
            init(orderBase,receiverInfo,row) {
                this.visible = true;
                this.orderBase = orderBase;
                Object.assign(this.dataForm,receiverInfo);
                this.row = row;
                this.preOptionsArea1 = [];
                this.optionsArea2[0] = {id:receiverInfo.cityId,name:receiverInfo.city}
                this.optionsArea3[0] = {id:receiverInfo.areaId,name:receiverInfo.areaId} 
                this.optionsArea4[0] =  {id:receiverInfo.stressId,name:receiverInfo.townArea}
                this.getFirstData();
                receiverInfo.provinceId && this.changeArea(receiverInfo.provinceId,1,false);
                receiverInfo.cityId && this.changeArea(receiverInfo.cityId,2,false);
                receiverInfo.areaId && this.changeArea(receiverInfo.areaId,3,false);
            },
            // 获取第一级地区数据
            getFirstData(){
                areaFirst().then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        this.optionsArea1 = res.data;
                    }
                })
            },
            // 切换地区获取下级联动地区数据
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
                    this.dataForm.stressId = "";
                    this.optionsArea2 = []
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==2 && reset){
                    this.dataForm.areaId = "";
                    this.dataForm.stressId = "";
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==3 && reset){
                    this.dataForm.stressId = "";
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
            
           // 提交
			dataFormSubmit(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj={
                                    "address": this.dataForm.address,
                                    "areaId": this.dataForm.areaId,
                                    "area": this.dataForm.area,
                                    "areaInfo": this.dataForm.province+""+ this.dataForm.city+""+this.dataForm.area+""+this.dataForm.townArea,
                                    "cityId": this.dataForm.cityId,
                                    "memberRealName": this.dataForm.memberRealName,
                                    "mobPhone": this.dataForm.mobPhone,
                                    "orderAddressId": this.orderBase.orderAddressId,// this.row.orderSn,
                                    "orderId":  this.row.id,// this.row.orderSn,
                                    "provinceId": this.dataForm.provinceId,
                                    "stressId":this.dataForm.stressId,
								}
								orderReceiver(obj).then((res) => {
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
								return false;
						}
				})
			},
            closeDialog() {
                console.log("关闭窗口");
                 this.visible = false;
                this.$parent.reciverInfoVisible = false;
            },
        }
    }
</script>

<style scoped>
.logisticsWarp{
    width: 90%;
    margin: auto;
}
</style>
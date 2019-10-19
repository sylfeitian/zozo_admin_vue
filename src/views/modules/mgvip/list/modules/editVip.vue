<template>
    <div>
        <el-form label-width="100px" :model="dataForm" :rules="dataRule"  class="elForm" ref="editForm">
            <el-form-item label="用户ID：">
                 <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="手机号码：" prop="memberMobile">
                <el-input  v-model="dataForm.memberMobile"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
                    <el-radio v-model="dataForm.memberSex" :label="0">保密</el-radio>
                    <el-radio v-model="dataForm.memberSex" :label="1">男</el-radio>
                    <el-radio v-model="dataForm.memberSex" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="生日："  prop="memberBirthday">
                  <el-date-picker
                        v-model="dataForm.memberBirthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="memberRealName">
                  <el-input v-model.trim="dataForm.memberRealName"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
                <div style="display:flex">
                    <el-input v-if="showIdCard" v-model="dataForm.idCardTemp" :disabled="true"></el-input>
                    <el-input  v-else="showIdCard"  v-model="dataForm.idCard" ></el-input>
                    <div style="width:40px;color:#1890FF; cursor: pointer;" @click="changeShowIdCard">修改</div>
                </div>
                  
            </el-form-item>
            <!-- <el-form-item label="原密码：">
                   <span>{{dataForm.memberPasswd}}</span>
            </el-form-item> -->
            <el-form-item label="新密码："  prop="newPasswd">
                   <el-input v-model.trim="dataForm.newPasswd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码："  prop="confirmPasswd">
                  <el-input  v-model="dataForm.confirmPasswd"></el-input>
            </el-form-item>
            <el-form-item label="账户启用状态：">
                  <el-switch
                    v-model="dataForm.memberState"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" style="padding-left:40%">
            <el-button type="primary" @click="dataFormSubmit('editForm')">保存</el-button>
        </div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { isMobile,isIdCard } from '@/utils/validate'
    import {zozomemberEditDetail,updateZozomember} from "@/api/api.js"
    export default {
        data () {
            var  validatorMemberMobile = (rule, value, callback) => {
                if (!isMobile(value)) {
                 return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
                }
                callback()
            }
            var validatorConfirmPasswd = (rule, value, callback) => {
                if (value!=this.dataForm.newPasswd) {
                 return callback(new Error("两次密码不一致"))
                }
                callback()
            }
            var validatorIdCard = (rule, value, callback) => {
                 if (value != '' && !isIdCard(value)) {
                    callback(new Error('身份证号输入有误'))
                } else {
                callback()
                }
            }
            return {
                row:"",
                showIdCard:true,
                dataForm:{
                    memberMobile:'',
                    memberSex:0,
                    memberBirthday:'',
                    memberRealName:'',
                    idCard:'',
                    idCardTemp:'',//最后6位显示*
                    memberPasswd:'',
                    newPasswd:'',
                    confirmPasswd:'',
                    memberState:'',
                },
                dataRule : {
			        memberMobile : [
                      { required: true, message: '必填项不能为空', trigger: 'blur' },
                      { validator: validatorMemberMobile, trigger: 'blur'}
                    ],
                    memberBirthday : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    idCard: [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    memberRealName : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    idCard : [
                      { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validatorIdCard, trigger: 'blur'}
                    ],
                    newPasswd : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    confirmPasswd : [
                      { required: true, message: '必填项不能为空', trigger: 'blur' },
                      { validator: validatorConfirmPasswd, trigger: 'blur'}
			        ],
				},
            }
        },

        components:{
         
        },
        watch:{
            'dataForm.idCard':function(newV,oldV) {
               this.dataForm.idCardTemp =   this.dataForm.idCard.slice(0,12)+"******"
            },
        },
        methods:{
            init(row){
                this.row= row,
                this.getData();
            },
            // 回显数据
            getData(){
                var obj  = {
                    id: this.row.id,
                }
                zozomemberEditDetail(obj).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        this.dataForm = res.data;
                        if(this.dataForm.idCard){
                            this.dataForm.idCardTemp =   this.dataForm.idCard.slice(0,12)+"******"
                        }
                        if(this.dataForm.memberState == 0) this.dataForm.memberState = true;
                        else if(this.dataForm.memberState == 1) this.dataForm.memberState = false;
                    }
                })
            },
            // 修改会员信息
            dataFormSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dataForm.memberState == true) this.dataForm.memberState = 0;
                        else if(this.dataForm.memberState == false) this.dataForm.memberState = 1;
                        var obj = cloneDeep(this.dataForm);
                        updateZozomember(obj).then((res)=>{
                            console.log(res);
                            if(res.code==200){
                                this.$message.success(res.msg)
                                this.$emit("changePage")
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        return false;
                    }
				})
			},
            changeShowIdCard(){
                    this.showIdCard = !this.showIdCard;
            },
        }
    }
</script>

<style scoped>
.elForm{
    width:40%;
    margin-left:20%;
    margin-top:40px;
}
</style>
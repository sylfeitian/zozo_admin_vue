<template>
  <div class="storeAddorUpdata">
    <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
    <el-form :inline="true" class="topGapPadding" :model="dataForm" :rules="dataRule" ref="dataForm"  @keyup.enter.native="submitStore()" label-width="102px">
      <div class="formMode">
        <div style="margin-bottom:20px;font-size:16px;font-weight: 600;">管理员</div>
        <div class="itemMode">
          <el-form-item prop="account" label="登录账号：">
              <el-input v-model.trim.trim="dataForm.account" :disabled="storeId?true:false" clearable @blur="tocnki"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" v-if="!storeId">
              <el-input v-model.trim.trim="dataForm.password" clearable type="password" @focus="changePw"></el-input>
          </el-form-item>
         <el-form-item label="电话：">
              <el-input v-model.trim.trim="dataForm.mobilePhone" clearable></el-input>
          </el-form-item>
          <div style="width:392px" v-if="storeId"></div>
        </div>
      </div>
      <div class="formMode">
        <div style="margin-bottom:20px;font-size:16px;font-weight: 600;">商家信息</div>
        <div class="itemMode">
          <el-form-item label="商家ID：" v-if="storeId">
              <el-input v-model.trim.trim="dataForm.id" placeholder="" :disabled="true"  clearable></el-input>
          </el-form-item>
          <el-form-item label="logo：">
            <div style="width:250px">
              <img-cropper
                ref="cropperImg1"
                :index="'cropperImg1'"
                :imgWidth='"60px"'
                :imgHeight='"60px"'
                @GiftUrlHandle="GiftUrlHandle"
              ></img-cropper>
            </div>
          </el-form-item>
          <div style="width:392px"></div>
        </div>
        <div class="itemMode">
          <el-form-item label="商家名称：">
              <el-input v-model.trim.trim="dataForm.saveStoreDTO.storeName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="店铺等级：">
              <!-- <el-input v-model.trim.trim="dataForm.saveStoreDTO.gradeId" placeholder="" clearable></el-input> -->
              <el-select v-model="dataForm.saveStoreDTO.gradeId" clearable  placeholder="请选择">
                <el-option
                    v-for="item in storeGradeList"
                    :key="item.id"
                    :label="item.sgName"
                    :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户类型：">
              <!-- <el-input v-model.trim.trim="dataForm.saveStoreDTO.storeType" placeholder="" clearable></el-input> -->
              <el-select v-model="dataForm.saveStoreDTO.storeType" clearable  placeholder="请选择">
                <el-option
                    v-for="item in storeTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="itemMode">
          <el-form-item label="经营范围：">
              <!-- <el-input v-model.trim.trim="dataForm.storeClassId" placeholder="" clearable></el-input> -->
              <el-select v-model="dataForm.storeClassId" multiple placeholder="请选择">
                <el-option
                  v-for="item in storeClassList"
                  :key="item.id"
                  :label="item.gcName"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="formMode">
        <div style="margin-bottom:20px;font-size:16px;font-weight: 600;">公司信息</div>
        <div class="itemMode">
          <el-form-item label="公司名称：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.companyName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="法人姓名：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.legalPersonName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="办公电话：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.companyPhone" placeholder="" clearable></el-input>
          </el-form-item>
        </div>
        <div class="itemMode">
          <el-form-item label="注册地址：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.companyAddress" placeholder="与注册证书地址一致" clearable></el-input>
          </el-form-item>
          <el-form-item label="办公地址：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.companyAddressDetail" placeholder="可以收发信件的有效地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="注册资金：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.companyRegisteredCapital " placeholder="" clearable></el-input>
          </el-form-item>
        </div>
        <div class="itemMode">
          <el-form-item label="公司注册证书：">
              <div style="width:250px">
                <img-cropper
                  ref="cropperImg2"
                  :index="'cropperImg2'"
                  :imgWidth='"60px"'
                  :imgHeight='"60px"'
                  @GiftUrlHandle="GiftUrlHandle">
                </img-cropper>
              </div>
          </el-form-item>
          <el-form-item label="税号：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.taxpayerId" placeholder="" clearable></el-input>
          </el-form-item>
          <div style="width:392px"></div>
        </div>
      </div>
      <div class="formMode">
        <div style="margin-bottom:20px;font-size:16px;font-weight: 600;">结算信息</div>
        <div class="itemMode">
          <el-form-item label="银行开户名称：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.bankAccountName " placeholder="开户行账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="开户行名称：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.bankName " placeholder="开户行账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="开户行账号：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.bankAccountNumber" placeholder="" clearable></el-input>
          </el-form-item>
        </div>
        <div class="itemMode">
          <el-form-item label="支付宝姓名：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.alipayName " placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="支付宝账号：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.alipayAccountNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <div style="width:392px"></div>
        </div>
        <div class="itemMode">
          <el-form-item label="微信姓名：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.wechatName " placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="微信账号：">
              <el-input v-model.trim.trim="dataForm.saveStoreAuthDTO.wechatAccountNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <div style="width:392px"></div>
        </div>
        <div class="itemMode" v-if="storeId">
          <el-form-item label="是否启用：">
              <el-radio-group v-model="dataForm.isEnable">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">禁用</el-radio>
              </el-radio-group>
          </el-form-item>
        </div>
      </div>

    </el-form>
    <div style="display: flex;justify-content: center;">
      <el-button @click="changePage">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submitStore()" :loading="buttonStatus">{{ $t('confirm') }}</el-button>
    </div>
      
  </div>
</template>

<script>
import { businessPageUrl } from '@/api/url'
import cloneDeep from 'lodash/cloneDeep'
import {addStore,updatestore,storeNews} from '@/api/api'
import imgCropper from "@/components/model-photo-cropper";
import { uploadPicBase64,storeScope } from '@/api/api'
import { storeGrade,storeCnki } from '@/api/api'
import { isMobile,isPhone } from '@/utils/validate'
import Bread from "@/components/bread";
  
export default {
  data () {
    return {
      dataForm: {
        isEnable:'0',
        account:'',
        password:'',
        mobilePhone:'',
        saveStoreDTO:{
          storeName:"",
          "gradeId": '',
          "storeAddress": "",
          "storeAuth": '',
          "storeLogo": "",
          "storeName": "",
          "storeType": ''
        },
        saveStoreAuthDTO:{
          "alipayAccountNumber": "",
          "alipayName": "",
          "bankAccountName": "",
          "bankAccountNumber": "",
          "bankName": "",
          "companyAddress": "",
          "companyAddressDetail": "",
          "companyAreaId": '',
          "companyCityId": '',
          "companyName": "",
          "companyPhone": "",
          "companyProvinceId": '',
          "companyRegisteredCapital": '',
          "electronicBusinessLicense": "",
          "legalPersonName": "",
          "storeId": '',
          "taxpayerId": "",
          "wechatAccountNumber": "",
          "wechatName": ""
        },
        storeClassId:[]
      },
      breaddata: ["商家系统", "商户管理", "商户列表",'商家编辑'],
      storeClassList:[],
      storeGradeList:[],
      storeTypes:[
          {value: 1,label: '自营商户'},
          {value: 2,label: '普通商户'}
      ],
      buttonStatus:false,
      uploading:false,
      subStatus:true,
      storeId:null,
      dataRule:{
          account: [
            { required: true, message: '账号不能为空！', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空！', trigger: 'blur' }
          ]
        }
    }
  },
  components:{
      imgCropper,
      Bread
	},
  created(){
    let obj1 = {
          params:{
              page:1,
              limit:100,
              gcParentId:0
          }
      }
    storeScope(obj1).then((res)=>{
        console.log(res)
        if(res.code == 200 && res.data.list){
          this.storeClassList = res.data.list;
          if(res.data.list){
            this.dataForm.storeClassId = res.data.list.map(item=>{
              return item.id
            })
          }
        }
    })

    let obj2 = {
            params:{
                page:1,
                limit:100,
            }
        }
      storeGrade(obj2).then((res)=>{
          console.log('商家等级',res)
            if(res.code == 200 && res.data.list){
                this.storeGradeList = res.data.list
            }
      })
  },
  methods: {
    init(id){
			this.$nextTick(()=>{
        if(id){
          var obj  = {
							id:id
					}
					storeNews(obj).then((res)=>{
            console.log('回显',res.data)
							if(res.code == 200){
                this.startObj = cloneDeep(res.data);//深拷贝回显详情初始数据
                if(res.data.storeDTO.storeLogo){
                  this.$nextTick(()=>{
                      this.$refs.cropperImg1.cropper.imgShow  = true
                      this.$refs.cropperImg1.cropper.cropImg  = res.data.storeDTO.storeLogo;
                  })
                }
                if(res.data.storeAuthDTO&&res.data.storeAuthDTO.electronicBusinessLicense){
                  this.$nextTick(()=>{
                      this.$refs.cropperImg2.cropper.imgShow  = true
                      this.$refs.cropperImg2.cropper.cropImg  = res.data.storeAuthDTO.electronicBusinessLicense;
                  })
                }
                if(res.data.storeClassDTOList&&res.data.storeClassDTOList.length!=0){
                  this.dataForm.storeClassId = res.data.storeClassDTOList.map(item=>{
                    return item.classId
                  })
                }else{
                  this.dataForm.storeClassId = this.storeClassList.map(item=>{
                    return item.id
                  })
                }
                this.storeId = res.data.storeDTO.id;
                this.dataForm.id = res.data.storeUserDTO.id;
                Object.assign(this.dataForm, res.data.storeUserDTO)
                Object.assign(this.dataForm.saveStoreDTO, res.data.storeDTO)
                if(res.data.storeAuthDTO){
                  Object.assign(this.dataForm.saveStoreAuthDTO,res.data.storeAuthDTO)
                }
                this.dataForm.isEnable = JSON.stringify(res.data.isEnable)
							}
					})
        }
			})
    },
    changePw(e){
      this.dataForm.password = ''
    },
    //查重
    tocnki(e){
      console.log('失焦信息',e.target.value)
      if(e.target.value){
        let obj = {
            params:{
                account:e.target.value
            }
        }
        storeCnki(obj).then((res)=>{
            if(res.code == 200){
              this.subStatus = true;
            }else{
              this.subStatus = false;
              this.$message({
                  message:res.msg,
                  type: 'error',
                  duration: 1500,
              })
            }
        })
      }
    },
    //提交
    submitStore(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(!this.subStatus){
            this.$message({
                message:'登录账号有问题',
                type: 'error',
                duration: 1500,
            })
            return
          }
          // ||!isPhone(this.dataForm.mobilePhone)
          if(!isMobile(this.dataForm.mobilePhone)&&this.dataForm.mobilePhone){
                this.$message({
                    message:'电话格式不正确',
                    type: 'error',
                    duration: 1500,
                })
                return
            }

          this.buttonStatus = true;
          if(this.storeId){//编辑
            var aa = this.dataForm;
            var bb = {
              id:aa.id,
              isEnable:aa.isEnable,
              mobilePhone:aa.mobilePhone,
              password:aa.password,
              storeAuthDTO:aa.saveStoreAuthDTO,
              findStoreDTO:aa.saveStoreDTO,
              classId:aa.storeClassId
            }
            updatestore(bb).then((res)=>{
                this.buttonStatus = false;
                if(res.code==200){
                    this.changePage();
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
          }else{
            addStore(this.dataForm).then((res)=>{
              this.buttonStatus = false;
                if(res.code==200){
                    this.changePage();
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
                  // this.goBack();
                }
            })
          }
        }
      })
    },
    GiftUrlHandle(val,index){
      this.uploadPic(val,index);
    },
    uploadPic(base64,index){
      let that = this;
      const params = { "imgStr": base64 };
      return new Promise(function(resolve){
        uploadPicBase64(params).then(res =>{
          that.uploading = true;
          if(res && res.code == 200){
              var url = res.data.url
              if(index == 'cropperImg1'){
                that.dataForm.saveStoreDTO.storeLogo = url;
              }else{
                that.dataForm.saveStoreAuthDTO.electronicBusinessLicense = url;
              }
            resolve("true")
          }else {
            if(that.storeId){
              if(that.startObj.storeDTO.storeLogo){
                that.$nextTick(()=>{
                    that.$refs.cropperImg1.cropper.imgShow  = true
                    that.$refs.cropperImg1.cropper.cropImg  = that.startObj.storeDTO.storeLogo;
                })
              }else{
                that.$refs.cropperImg1.cropper.imgShow  = false
              }
              if(that.startObj.storeAuthDTO.electronicBusinessLicense){
                that.$nextTick(()=>{
                    that.$refs.cropperImg2.cropper.imgShow  = true
                    that.$refs.cropperImg2.cropper.cropImg  = that.startObj.storeAuthDTO.electronicBusinessLicense;
                })
              }else{
                that.$refs.cropperImg2.cropper.imgShow  = false
              }
            }else{
              if(index == 'cropperImg1'){
                that.$refs.cropperImg1.cropper.imgShow  = false
              }else{
                that.$refs.cropperImg2.cropper.imgShow  = false
              }
            }
            that.$message({
                message:res.msg,
                type: 'error',
                duration: 1500,
            })
            resolve("false")
          }
        })
      });
    },
   
    changePage(){
      this.$emit("addoraditList");
    }
  }
};
</script>
<style lang="scss">
  .storeAddorUpdata{
    .formMode{
      padding-top: 30px;
      border-bottom: 20px solid #ECEDF1;
      .el-input{
        width: 250px !important;
        height: auto !important;
      }
      &:first-child{
        padding-top: 0;
      }
      &:last-child{
        border: none;
      }
      .itemMode{
        padding-left: 20px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  
</style>

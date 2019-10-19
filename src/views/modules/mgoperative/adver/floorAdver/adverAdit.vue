<template>
  <div class="adverFloor">
    <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  @keyup.enter.native="submitStore()" label-width="130px">
        <el-form-item prop="relationId" label="楼层类别：">
            <el-select v-model="dataForm.relationId" clearable :disabled="advId?true:false" placeholder="请选择">
                <el-option
                    v-for="item in slectList"
                    :key="item.id"
                    :label="item.floorName"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="advTitle" label="广告标题：">
            <el-input v-model.trim="dataForm.advTitle" placeholder="" clearable></el-input>
        </el-form-item>
         <el-form-item prop="imageUrl" label="图片：">
            <img-cropper
                ref="imageUrl"
                :index="'1'"
                :imgWidth='"100px"'
                :imgHeight='"100px"'
                @GiftUrlHandle="GiftUrlHandle">
            </img-cropper>
        </el-form-item>
        <el-form-item label="广告链接（URL）：">
            <el-input v-model.trim="dataForm.relationTarget" placeholder="Http://xxxxxx.com" clearable @blur="urlChange"></el-input>
        </el-form-item>
        <el-form-item prop="radio" label="启用时间：">
            <el-radio v-model="dataForm.radio" label="1">立即启用</el-radio>
            <el-radio v-model="dataForm.radio" label="2" style="margin-right:30px">定时启用</el-radio>
            <el-date-picker
                v-if="timeStatus"
                v-model="dataForm.startDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
                placeholder="选择启用时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="停用时间：">
            <el-date-picker
                v-model="dataForm.endDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
                placeholder="选择停用时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="1" :max="10000000"></el-input-number>
        </el-form-item>
        <div class="btnSub">
            <el-button @click="changePage">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submitStore()" :loading="buttonStatus">{{ $t('confirm') }}</el-button>
        </div>
    </el-form>
  </div>
</template>

<script>
import imgCropper from "@/components/model-photo-cropper";
import cloneDeep from 'lodash/cloneDeep'
import { floorClassAdveAdd,plainAdveUpdate } from '@/api/api'
import { uploadPicBase64,adverDetail,floorAdveSlect } from '@/api/api'
import { isURL } from '@/utils/validate'
import Bread from "@/components/bread";

  
export default {
  // mixins: [mixinViewModule],
    data () {
        return {
            timeStatus:false,
            dataForm: {
                advTitle: "",
                relationId: '',
                endDate: "",
                imageUrl: "",
                relationTarget: "",
                sort: 1,
                startDate: this.parseTime(new Date()),
                radio:'1',
                advType: 1
            },
      breaddata: ["运营", "广告管理", "楼层广告列表",'楼层广告编辑'],

            buttonStatus:false,
            subStatus:true,
            uploading:false,
            advId:null,
            slectList:[]
        }
    },
    computed: {
        dataRule () {
            return {
                relationId: [
                    { required: true, message: '广告类别不能为空', trigger: 'blur' }
                ],
                advTitle: [
                    { required: true, message: '广告标题不能为空！', trigger: 'blur' }
                ],
                imageUrl: [
                    { required: true, message: '图片不能为空！', trigger: 'blur' }
                    // {
                    //     validator: function (rule, value, callback) {
                    //         console.log('9999',value)
                    //         console.log('9999','dataForm.imageUrl')
                    //     }, trigger: 'change'
                    // }
                ],
                sort: [
                    { required: true, message: '排序不能为空！', trigger: 'blur' }
                ],
                radio: [
                    { required: true, message: '启用时间不能为空！', trigger: 'blur' }
                ]
            }
        }
    },
    watch:{
        'dataForm.radio'(val, oldVal){//普通的watch监听
            if(val=='2'){
                this.timeStatus = true;
            }else{
                this.timeStatus = false;
                this.dataForm.startDate = this.parseTime(new Date());
            }
        },
    },
    components:{
        imgCropper,
        Bread
    },
    created(){
        floorAdveSlect().then((res)=>{
            if(res.code == 200&&res.data){
                this.slectList = res.data
            }
        })
    },
    methods: {
        parseTime(d) {
            let year = d.getFullYear();
            let mon = d.getMonth()+1;
            let day = d.getDate();
            let hour = d.getHours();
            let minutes = d.getMinutes() ;
            let seconds = d.getSeconds();
            let s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day)+' '+(hour<10?('0'+hour):hour) + ":"+ (minutes<10?('0'+minutes):minutes) +":"+(seconds<10?('0'+seconds):seconds);
            return s
        },
        init(id){
            this.$nextTick(()=>{
                this.advId = id;
                if(id){
                    var obj  = {
                        id:id
                    }
                    adverDetail(obj).then((res)=>{
                        console.log('回显',res.data)
                        if(res.code == 200){
                            this.startObj = cloneDeep(res.data);//深拷贝回显详情初始数据
                            this.$nextTick(()=>{
                                this.$refs.imageUrl.cropper.imgShow  = true
                                this.$refs.imageUrl.cropper.cropImg  = res.data.imageUrl;
                            })
                            Object.assign(this.dataForm,res.data);
                            if(res.data.startDate){
                                this.dataForm.radio = '2';
                                this.dataForm.startDate = res.data.startDate;
                            }
                        }
                    })
                }
            })
        },
        urlChange(e){
            if(e.target.value&&!isURL(e.target.value)){
                this.subStatus = false;
                this.$message({
                    message:'链接格式不正确',
                    type: 'error',
                    duration: 1500,
                })
            }else{
                this.subStatus = true;
            }
        },
        // 提交
        submitStore(){
            console.log(this.dataForm.startDate)
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if(!this.subStatus){
                        this.$message({
                            message:'链接地址格式有问题',
                            type: 'error',
                            duration: 1500,
                        })
                        return
                    }
                    if(!this.dataForm.startDate){
                        this.$message.error('定时启用时间不能为空！')
                        return
                    }
                    this.buttonStatus=true;
                    if(this.advId){//编辑
                        let aa = this.dataForm;
                        let bb = {
                            advTitle: aa.advTitle,
                            endDate: aa.endDate,
                            id: this.advId,
                            imageUrl: aa.imageUrl,
                            relationTarget: aa.relationTarget,
                            sort: aa.sort,
                            startDate: aa.startDate
                        }
                        plainAdveUpdate(bb).then((res)=>{
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
                                // this.changePage();
                            }
                            this.buttonStatus = false;
                        })
                    }else{
                        floorClassAdveAdd(this.dataForm).then((res)=>{
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
                                // this.changePage();
                            }
                            this.buttonStatus = false;
                        })
                    }
                }
            })
        },
        GiftUrlHandle(val){
            this.uploadPic(val);
        },
        uploadPic(base64){
            let that = this;
            const params = { "imgStr": base64 };
            return new Promise(function(resolve){
                uploadPicBase64(params).then(res =>{
                    that.uploading = true;
                    if(res && res.code == "200"&&res.data){
                        var url = res.data.url
                        that.dataForm.imageUrl = url;
                        resolve("true")
                    }else {
                        if(that.advId){
                            if(that.startObj.imageUrl){
                                that.$nextTick(()=>{
                                    that.$refs.imageUrl.cropper.imgShow  = true
                                    that.$refs.imageUrl.cropper.cropImg  = that.startObj.imageUrl;
                                })
                            }else{
                                that.$refs.imageUrl.cropper.imgShow  = false
                            }
                            
                        }else{
                            that.$refs.imageUrl.cropper.imgShow  = false
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
        //返回上级
        changePage(){
            this.$emit("addoraditList");
        }
    }
};
</script>
<style lang="scss">
    .adverFloor{
        .el-input{
            width: 240px !important;
        }
        .el-form{
            padding-top: 50px;
            width: 1100px;
            margin: 0 auto;
        }
        .btnSub{
            margin-top: 30px;
            padding: 0 180px;
        }
    }
</style>

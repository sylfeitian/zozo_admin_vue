<template>
  <div class="homeFloor">
    <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  @keyup.enter.native="submitStore()" label-width="140px">
        <el-form-item prop="floorName" label="楼层名称：">
            <el-input v-model.trim.trim="dataForm.floorName" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item prop="floorCode" label="楼层标识:">
            <el-input v-model.trim.trim="dataForm.floorCode" placeholder="" :disabled="floorId?true:false" clearable @blur="tocnki"></el-input>
        </el-form-item> -->
        <el-form-item prop="jiaoyan" label="展示内容：">
            <el-input v-model.trim.trim="dataForm.jiaoyan" style="display:none" v-if="picList.length == 6" ></el-input>
            <div class="picMain">
                <div>
                    <img src="~@/assets/img/nopic.png" @click="changeClass(0)" v-if="!picList[0]" alt="图标" style="margin-right:30px;" class="img1">
                    <img :src="picList[0]" alt="img" @click="changeClass(0)" v-if="picList[0]" style="margin-right:30px" class="img1">

                    <img src="~@/assets/img/nopic.png" @click="changeClass(1)" alt="图标" v-if="!picList[1]" class="img1">
                    <img :src="picList[1]" alt="img" @click="changeClass(1)" v-if="picList[1]" class="img1">
                </div>
                <div>
                    <img src="~@/assets/img/nopic.png" @click="changeClass(2)" alt="图标" v-if="!picList[2]" class="img2" style="margin-right:10px">
                    <img :src="picList[2]" alt="img" @click="changeClass(2)" v-if="picList[2]" class="img2" style="margin-right:10px">
                    
                    <img src="~@/assets/img/nopic.png" @click="changeClass(3)" alt="图标" v-if="!picList[3]" class="img2" style="margin-right:10px">
                    <img :src="picList[3]" alt="img" @click="changeClass(3)" v-if="picList[3]" class="img2" style="margin-right:10px">
                    
                    <img src="~@/assets/img/nopic.png" @click="changeClass(4)" alt="图标" v-if="!picList[4]" class="img2" style="margin-right:10px">
                    <img :src="picList[4]" alt="img" @click="changeClass(4)" v-if="picList[4]" class="img2" style="margin-right:10px">
                    
                    <img src="~@/assets/img/nopic.png" @click="changeClass(5)" alt="图标" v-if="!picList[5]" class="img2">
                    <img :src="picList[5]" alt="img" @click="changeClass(5)" v-if="picList[5]" class="img2">

                </div>
            </div>
        </el-form-item>
        <el-form-item prop="nameIcon" label="楼层名称图片：">
            <img-cropper
                ref="nameIcon"
                :index="'nameIcon'"
                :imgWidth='"100px"'
                :imgHeight='"100px"'
                @GiftUrlHandle="GiftUrlHandle">
            </img-cropper>
        </el-form-item>
        <el-form-item prop="actionType" label="查看更多跳转类型：">
            <el-radio-group v-model="dataForm.actionType" @change="toGetType">
                <el-radio-button label="link">链接</el-radio-button>
                <el-radio-button label="searchGoodsByClass">展示分类</el-radio-button>
                <el-radio-button label="searchByKeyWord">关键字</el-radio-button>
                <el-radio-button label="goodsDetail">商品详情</el-radio-button>
                <el-radio-button label="xianshiqiangList">限时抢购</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="actionParams " label="链接地址：" v-if="dataForm.actionType == 'link'">
            <el-input v-model.trim.trim="dataForm.actionParams" placeholder="Http://xxxxxx.com" clearable @blur="outChange"></el-input>
        </el-form-item>
        <el-form-item prop="actionParams " label="所属分类：" v-if="dataForm.actionType == 'searchGoodsByClass'">
            <el-input v-model.trim.trim="dataForm.goodsClassName" placeholder="" clearable v-if="floorId&&!faClassStatus" @focus="toFaClassStatus"></el-input>
            <el-select v-model="otherObj.actionParams0" filterable placeholder="请选择" v-if="faClassStatus||!floorId" @change="classChangeOne">
                <el-option
                    v-for="item in fagoodsClassList1"
                    :key="item.id"
                    :label="item.gcName "
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="otherObj.actionParams1" filterable placeholder="请选择" @change="classChangetwo" v-if="fagoodsClassList2&&fagoodsClassList2.length!=0">
                <el-option
                    v-for="item in fagoodsClassList2"
                    :key="item.id"
                    :label="item.gcName "
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="otherObj.actionParams2" filterable placeholder="请选择"  @change="classChangethr" v-if="fagoodsClassList3&&fagoodsClassList3.length!=0">
                <el-option
                    v-for="item in fagoodsClassList3"
                    :key="item.id"
                    :label="item.gcName "
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="actionParams " label="关键字：" v-if="dataForm.actionType == 'searchByKeyWord'">
            <el-input v-model.trim.trim="dataForm.actionParams" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item prop="actionParams " label="商品名称：" v-if="dataForm.actionType == 'goodsDetail'">
            <el-select v-model="dataForm.actionParams" filterable placeholder="请选择" @change="getChange">
                <el-option
                    v-for="item in goodsList"
                    :key="item.id"
                    :label="item.goodsName "
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item prop="actionParams " label="楼层名称444:" v-if="dataForm.actionType == 'xianshiqiangList'">
            <el-input v-model.trim.trim="dataForm.actionParams " placeholder="" clearable></el-input>
        </el-form-item> -->
        <el-form-item prop="isShow" label="是否显示：">
            <el-radio-group v-model="dataForm.isShow">
                <el-radio label="1">显示</el-radio>
                <el-radio label="0">不显示</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="sort" label="优先级排序：">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :max="10000000" class="floorInput"></el-input-number>
        </el-form-item>
        <div class="btnSub">
            <el-button @click="changePage">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submitStore()" :loading="buttonStatus">{{ $t('confirm') }}</el-button>
        </div>
    </el-form>

    <!-- 图片弹框 -->
    <el-dialog
        title="类型配置"
        :visible.sync="photoVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        width="44%">
        <el-form :model="dataForm1" :rules="dataRuleOther" ref="dataRuleOther" label-width="120px">
            <el-form-item label="标题：" prop="title">
                <div>
                    <el-input v-model.trim.trim="dataForm1.title" style="display:none" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].title"></el-input>
                    <el-input v-model.trim.trim="dataForm.webFloorLinkConfigDTOList[dataNum].title"></el-input>
                </div>
                <span style="color:#f56c6c" v-if="!dataForm.webFloorLinkConfigDTOList[dataNum].title&&imgStatus">标题不能为空</span>
            </el-form-item>
            <el-form-item label="副标题：">
                <el-input v-model.trim.trim="dataForm.webFloorLinkConfigDTOList[dataNum].subTitle"></el-input>
            </el-form-item>
            <el-form-item prop="classImg" label="上传图片：">
                <el-input v-model.trim.trim="dataForm1.classImg" style="display:none" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].imgUrl"></el-input>
                <img-cropper
                    ref="classImg"
                    :index="dataNum"
                    :imgWidth='"100px"'
                    :imgHeight='"100px"'
                    @GiftUrlHandle="GiftUrlHandle">
                </img-cropper>
                <span style="color:#f56c6c" v-if="!dataForm.webFloorLinkConfigDTOList[dataNum].imgUrl&&imgStatus">图片还没上传</span>
            </el-form-item>
            <el-form-item prop="linkType" label="跳转类型：">
                <div>
                    <el-input v-model.trim.trim="dataForm1.linkType" style="display:none" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].linkType"></el-input>
                    <el-radio-group v-model="dataForm.webFloorLinkConfigDTOList[dataNum].linkType" @change="toGetTypeChild">
                        <el-radio-button label="link">链接</el-radio-button>
                        <el-radio-button label="searchGoodsByClass">展示分类</el-radio-button>
                        <el-radio-button label="searchByKeyWord">关键字</el-radio-button>
                        <el-radio-button label="goodsDetail">商品详情</el-radio-button>
                        <el-radio-button label="xianshiqiangList">限时抢购</el-radio-button>
                    </el-radio-group>
                </div>
                <span style="color:#f56c6c" v-if="!dataForm.webFloorLinkConfigDTOList[dataNum].linkType&&imgStatus">跳转类型不能为空</span>
            </el-form-item>
            <el-form-item prop="actionParams" label="链接地址：" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].linkType == 'link'">
                <el-input v-model.trim.trim="dataForm.webFloorLinkConfigDTOList[dataNum].typeKeyWord" placeholder="Http://xxxxxx.com" clearable @blur="innerChange"></el-input>
            </el-form-item>
            <el-form-item prop="actionParams" label="所属分类：" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].linkType == 'searchGoodsByClass'">
                <el-input v-model.trim.trim="dataForm.webFloorLinkConfigDTOList[dataNum].gcName" clearable v-if="floorId&&!chClassStatus" @focus="toChClassStatus"></el-input>
                <el-select v-model="otherObj.actionParams3" filterable placeholder="请选择" v-if="chClassStatus||!floorId" @change="childClassChangeOne">
                    <el-option
                        v-for="item in fagoodsClassList1"
                        :key="item.id"
                        :label="item.gcName "
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="otherObj.actionParams4" filterable placeholder="请选择" @change="childClassChangetwo" v-if="chgoodsClassList2&&chgoodsClassList2.length!=0">
                    <el-option
                        v-for="item in chgoodsClassList2"
                        :key="item.id"
                        :label="item.gcName "
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="otherObj.actionParams5" filterable placeholder="请选择"  @change="childClassChangethr" v-if="chgoodsClassList3&&chgoodsClassList3.length!=0">
                    <el-option
                        v-for="item in chgoodsClassList3"
                        :key="item.id"
                        :label="item.gcName "
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="actionParams" label="关键字：" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].linkType == 'searchByKeyWord'">
                <el-input v-model.trim.trim="dataForm.webFloorLinkConfigDTOList[dataNum].typeKeyWord" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item prop="actionParams" label="商品名称：" v-if="dataForm.webFloorLinkConfigDTOList[dataNum].linkType == 'goodsDetail'">
                <el-select v-model="dataForm.webFloorLinkConfigDTOList[dataNum].typeKeyWord" filterable placeholder="请选择" @change="getChangeChild">
                    <el-option
                        v-for="item in goodsList"
                        :key="item.id"
                        :label="item.goodsName "
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="startCheck">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import imgCropper from "@/components/model-photo-cropper";
import cloneDeep from 'lodash/cloneDeep'
import { uploadPicBase64,flooradveDetail,updateMobbileFloor,addMobbileFloor } from '@/api/api';
import { mobbileFloorCnki,mobbileGoodsList,mobbileClassGoodsList } from '@/api/api'
import { isURL } from '@/utils/validate'
import Bread from "@/components/bread";

  
export default {
    data () {
        return {
            dataForm: {
                jiaoyan:'',
                actionType:'link',
                sort:1,
                isShow:'1',
                actionParams: "",
                floorCode: "",
                floorName: "",
                goodsClassName: "",
                goodsName: "",
                nameIcon: "",
                webFloorLinkConfigDTOList: [
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                    {description: "",gcName: "",imgMarking: "",imgUrl: "",linkType: "",subTitle: "",title: "",typeKeyWord: ""},
                ]
            },
      breaddata: ["运营", "移动端首页配置", "首页楼层",'编辑楼层'],

            otherObj:{
                actionParams0:'',
                actionParams1:'',
                actionParams2:'',
                actionParams3:'',
                actionParams4:'',
                actionParams5:''
            },
            startObj:'',//回显的初始数据
            buttonStatus:false,
            imgStatus:false,
            photoVisible:false,
            subStatus:true,
            innerStatus:true,
            faClassStatus:false,
            chClassStatus:false,
            picList:[],
            goodsList:[],
            fagoodsClassList1:[],
            fagoodsClassList2:[],
            fagoodsClassList3:[],
            chgoodsClassList2:[],
            chgoodsClassList3:[],
            uploading:false,
            floorId:null,
            dataNum:0,
            dataForm1:{// 伪验证
                title:'1212',
                linkType:'212',
                classImg:'2121'
            },
            dataRuleOther:{
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                classImg :[
                    { required: true, message: '上传图片不能为空', trigger: 'blur' }
                ],
                linkType :[
                    { required: true, message: '跳转类型不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
        dataRule () {
            return {
                floorName: [
                    { required: true, message: '楼层名称不能为空', trigger: 'blur' }
                ],
                floorCode: [
                    { required: true, message: '楼层标识不能为空！', trigger: 'blur' }
                ],
                nameIcon: [
                    { required: true, message: '楼层图标不能为空！', trigger: 'blur' }
                ],
                actionType: [
                    { required: true, message: '跳转类型不能为空！', trigger: 'blur' }
                ],
                isShow: [
                    { required: true, message: '是否显示不能为空！', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '优先级排序不能为空！', trigger: 'blur' }
                ],
                jiaoyan: [
                    { required: true, message: '展示内容没有填完', trigger: 'blur' }
                ]
            }
        },
    },
   
    components:{
        imgCropper,
        Bread
    },
    created(){
        let obj = {
            params:{
                page:1,
                limit:9999,
            }
        }
        mobbileGoodsList(obj).then((res)=>{
            if(res.code == 200&&res.data.list){
                this.goodsList = res.data.list;
            }else{
                this.$message({
                    message:res.msg,
                    type: 'error',
                    duration: 1500,
                })
            }
        })
        this.getClassList(0);
    },
    methods: {
        //回显
        init(id){
            this.$nextTick(()=>{
                if(id){
                    this.floorId = id;
                    flooradveDetail({id:id}).then((res)=>{
                        console.log('楼层详情',res)
                        if(res.code == 200&&res.data){
                            this.$nextTick(()=>{
                                this.$refs.nameIcon.cropper.imgShow  = true;
                                this.$refs.nameIcon.cropper.cropImg  = this.$imgDomain + res.data.nameIcon;
                            })
                            Object.assign(this.dataForm,res.data);
                            this.dataForm.webFloorLinkConfigDTOList = res.data.webFloorLinkConfigDTOList;
                            this.startObj = cloneDeep(res.data);//深拷贝回显详情初始数据
                            this.dataForm.isShow = JSON.stringify(res.data.isShow);
                            this.picList = res.data.webFloorLinkConfigDTOList.map(item=>{
                                return this.$imgDomain + item.imgUrl
                            })
                        }
                    })
                }else{
                    this.faClassStatus = true;
                }
            })
        },
        toFaClassStatus(){
            this.faClassStatus = true;
        },
        toChClassStatus(){
            this.chClassStatus = true;
        },
        //分类列表
        getClassList(id,status,index){
            let obj = {
                params:{
                    page:1,
                    limit:9999,
                    gcParentId:id
                }
            }
            mobbileClassGoodsList(obj).then((res)=>{
                if(res.code == 200&&res.data.list){
                    if(!status&&!index){
                        this.fagoodsClassList1 = res.data.list;
                    }else if(status == 'father'&&index == '1'){
                        this.fagoodsClassList2 = res.data.list;
                    }else if(status == 'father'&&index == '2'){
                        this.fagoodsClassList3 = res.data.list;
                    }else if(status == 'child'&&index == '1'){
                        this.chgoodsClassList2 = res.data.list;
                    }else if(status == 'child'&&index == '2'){
                        this.chgoodsClassList3 = res.data.list;
                    }
                }else{
                    this.$message({
                        message:res.msg,
                        type: 'error',
                        duration: 1500,
                    })
                }
            })
        },
        //外部返回分类名称和id的方法
        fatherFn(id,obj){
            this.dataForm.actionParams  = id;
            obj.map(item=>{
                if(item.id == id){
                    this.dataForm.goodsClassName  = item.gcName;
                }
            })
            console.log(this.dataForm.goodsClassName,this.dataForm.actionParams)
        },
        //内部返回分类名称和id的方法
        childFn(id,obj){
            this.dataForm.webFloorLinkConfigDTOList[this.dataNum].typeKeyWord = id;
            obj.map(item=>{
                if(item.id == id){
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].gcName = item.gcName;
                }
            })
        },
        classChangeOne(val){
            this.getClassList(val,'father','1');
            this.fatherFn(val,this.fagoodsClassList1)
            this.otherObj.actionParams1 = '';
            this.otherObj.actionParams2 = '';
        },
        classChangetwo(val){
            this.getClassList(val,'father','2');
            this.fatherFn(val,this.fagoodsClassList2)
            this.otherObj.actionParams2 = '';
        },
        classChangethr(val){
            this.fatherFn(val,this.fagoodsClassList3)
        },
        childClassChangeOne(val){
            this.getClassList(val,'child','1');
            this.childFn(val,this.fagoodsClassList1)
            this.otherObj.actionParams4 = '';
            this.otherObj.actionParams5 = '';
        },
        childClassChangetwo(val){
            this.getClassList(val,'child','2');
            this.childFn(val,this.chgoodsClassList2)
            this.otherObj.actionParams2 = '';
        },
        childClassChangethr(val){
            this.childFn(val,this.chgoodsClassList3)
        },
        //外部跳转类型
        toGetType(val){
            console.log('变化值',val)
            this.faClassStatus = false;
            if(this.startObj.actionType!=val){
                this.dataForm.actionParams = '';
                this.dataForm.goodsClassName = '';
                this.dataForm.goodsName = '';
            }else{
                this.dataForm.actionParams = this.startObj.actionParams;
                this.dataForm.goodsClassName = this.startObj.goodsClassName;
                this.dataForm.goodsName = this.startObj.goodsName;
            }
        },
        //内部跳转类型
        toGetTypeChild(val){
            console.log('变化值',val,)
            if(this.startObj){
                if(this.startObj.webFloorLinkConfigDTOList[this.dataNum].linkType!=val){
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].typeKeyWord = '';
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].gcName = '';
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].goodsName = '';
                }else{
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].typeKeyWord = this.startObj.webFloorLinkConfigDTOList[this.dataNum].typeKeyWord;
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].gcName = this.startObj.webFloorLinkConfigDTOList[this.dataNum].gcName;
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].goodsName = this.startObj.webFloorLinkConfigDTOList[this.dataNum].goodsName;
                }
            }else{
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].typeKeyWord = '';
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].gcName = '';
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].goodsName = '';
            }
                
        },
        //外部商品详情
        getChange(val){
            this.goodsList.map(item=>{
                if(item.id == val){
                    console.log(item.goodsName)
                    this.dataForm.goodsName = item.goodsName;
                }
            })
        },
        // 内部商品详情
        getChangeChild(val){
            this.goodsList.map(item=>{
                if(item.id == val){
                    console.log(item.goodsName)
                    this.dataForm.webFloorLinkConfigDTOList[this.dataNum].goodsName = item.goodsName;
                }
            })
        },
        //点击展示内容
        changeClass(num){
            this.imgStatus = false;
            this.photoVisible = true;
            this.dataNum = num;
            if(this.floorId){
                if(this.dataForm.webFloorLinkConfigDTOList[num].imgUrl){
                    this.$nextTick(()=>{
                        this.$refs.classImg.cropper.imgShow  = true;
                        this.$refs.classImg.cropper.cropImg  = this.picList[num];
                    })
                }
            }else if(!this.floorId&&!this.dataForm.webFloorLinkConfigDTOList[num].imgUrl){
                this.$nextTick(()=>{
                    this.$refs.classImg.cropper.imgShow  = false;
                })
            }
        },
        // 取消关闭弹框
        handleClose(){
            this.photoVisible = false;
            this.innerStatus = true;
            this.imgStatus = false;
            if(!this.floorId){
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].imgUrl = '';
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].title = '';
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].linkType = '';
                this.$nextTick(()=>{
                    this.$refs.classImg.cropper.imgShow  = false;
                })
                this.picList[this.dataNum] = '';
                this.$refs['dataRuleOther'].resetFields();//校验隐藏
            }else{
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].imgUrl = this.startObj.webFloorLinkConfigDTOList[this.dataNum].imgUrl;
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].title = this.startObj.webFloorLinkConfigDTOList[this.dataNum].title;
                this.dataForm.webFloorLinkConfigDTOList[this.dataNum].linkType = this.startObj.webFloorLinkConfigDTOList[this.dataNum].linkType;
                this.picList[this.dataNum] = this.$imgDomain + this.startObj.webFloorLinkConfigDTOList[this.dataNum].imgUrl;
            }
        },
        //确认关闭弹框
        startCheck(){
            this.imgStatus = true;
            if(this.dataForm.webFloorLinkConfigDTOList[this.dataNum].imgUrl&&this.dataForm.webFloorLinkConfigDTOList[this.dataNum].title&&this.dataForm.webFloorLinkConfigDTOList[this.dataNum].linkType){
                this.$refs['dataRuleOther'].validate((valid) => {
                    if (valid) {
                        if(!this.innerStatus){
                            this.$message({
                                message:'链接地址格式有问题',
                                type: 'error',
                                duration: 1500,
                            })
                            return
                        }
                        this.photoVisible = false;
                    }
                })
            }
        },
        //外部校验链接地址
        outChange(e){
            console.log(e.target.value)
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
        //内部校验链接地址
        innerChange(e){
            if(e.target.value&&!isURL(e.target.value)){
                this.innerStatus = false;
                this.$message({
                    message:'链接格式不正确',
                    type: 'error',
                    duration: 1500,
                })
            }else{
                this.innerStatus = true;
            }
        },
        // 提交
        submitStore(){
            if(this.picList.length == 6){
                this.dataForm.jiaoyan = 'url';
            }
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
                    this.buttonStatus = true;
                    if(this.floorId){
                        updateMobbileFloor(this.dataForm).then((res)=>{
                            if(res.code == 200){
                                this.$message({
                                    message:res.msg,
                                        type: 'success',
                                        duration: 1500,
                                })
                                this.changePage()
                            }else{
                                this.$message({
                                    message:res.msg,
                                    type: 'error',
                                    duration: 1500,
                                })
                                // this.changePage()
                            }
                            this.buttonStatus = false;
                        })
                    }else{
                        addMobbileFloor(this.dataForm).then((res)=>{
                            if(res.code == 200){
                                this.$message({
                                    message:res.msg,
                                        type: 'success',
                                        duration: 1500,
                                })
                                this.changePage()
                            }else{
                                this.$message({
                                    message:res.msg,
                                    type: 'error',
                                    duration: 1500,
                                })
                                // this.changePage()
                            }
                            this.buttonStatus = false;
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
                    if(res && res.code == 200&&res.data){
                        var url = res.data.url
                        if(index == 'nameIcon'){
                            that.dataForm.nameIcon = url;
                        }else{
                            that.dataForm.webFloorLinkConfigDTOList[index].imgUrl = url;
                            that.dataForm.webFloorLinkConfigDTOList[index].imgMarking = JSON.stringify(index)
                            that.picList[index] = that.$imgDomain + url;
                        }
                        resolve("true")
                    }else {
                        if(that.floorId){
                            if(that.startObj.nameIcon){
                                that.$nextTick(()=>{
                                    that.$refs.nameIcon.cropper.imgShow  = true
                                    that.$refs.nameIcon.cropper.cropImg  = that.startObj.nameIcon;
                                })
                            }else{
                                that.$refs.nameIcon.cropper.imgShow  = false
                            }
                            if(that.startObj.webFloorLinkConfigDTOList[that.dataNum].imgUrl){
                                that.$nextTick(()=>{
                                    that.$refs.classImg.cropper.imgShow  = true
                                    that.$refs.classImg.cropper.cropImg  = that.startObj.webFloorLinkConfigDTOList[that.dataNum].imgUrl;
                                })
                            }else{
                                that.$refs.classImg.cropper.imgShow  = false
                            }
                        }else{
                            if(index == 'nameIcon'){
                                that.$refs.nameIcon.cropper.imgShow  = false
                            }else{
                                that.$refs.classImg.cropper.imgShow  = false
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
        //返回上级
        changePage(){
            this.$emit("addoraditList");
        }
    }
};
</script>
<style lang="scss">
    .homeFloor{
        .el-input{
            width: 300px !important;
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
        .floorInput{
            width: 130px !important;
            .el-input{
                width: 130px !important;
            }
        }
        .picMain{
            display: flex;
            flex-direction: column;
            div{
                display: flex;
            }
            .img1{
                object-fit: contain;
                width: 200px;
                height: 200px;
            }
            .img2{
                object-fit: contain;
                width: 100px;
                height:130px;
            }
        }
    }
    
</style>

<template>
  <div v-loading="dataLoding">
     <div class="topMoudel">
        <h3>新手任务<span>&nbsp;&nbsp;新手任务每个用户只奖励一次，相关值必须为大于0的整数</span></h3>
        <div class="topItem">
            <label class="topItemLeft" for="">设置头像</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.headerSettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>

        <div class="topItem">
            <label class="topItemLeft" for="">设置昵称</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.nicknameSettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>

        <div class="topItem">
            <label class="topItemLeft" for="">实名认证</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.realNameAuthPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>

        <div class="topItem">
            <label class="topItemLeft" for="">设置性别</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.genderSettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>
        
        <div class="topItem">
            <label class="topItemLeft" for="">设置生日</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.birthdaySettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>

        <div class="topItem">
            <label class="topItemLeft" for="">设置身高</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.heightSettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>

        <div class="topItem">
            <label class="topItemLeft" for="">分享获取积分</label>
            <div class="topItemRight">
                <span>积分奖励：</span>
                <el-input-number v-model="dataForm.shareSettingPoints" :step="1" :min="0" :max="1000000"></el-input-number><span>&nbsp;分</span>
            </div>
        </div>
     </div>

     <div class="midMoudel">
        <h3>日常购物奖励<span>&nbsp;&nbsp;日常任务奖励多次，相关值必须为大于0的整数</span> </h3>
        <div class="midItem">
            <label class="midItemLeft" for="">购物消费：</label>
            <div class="midItemRight">
                <el-input-number v-model="dataForm.consumptionSettingPoints" :step="1" :min="0">
                   <template slot="append">元</template>
                </el-input-number>
                <span>元&nbsp;&nbsp;奖励1分（以实际订单金额为准）</span>
            </div>
        </div>
          <div class="midItem">
            <label class="midItemLeft" for="">订单实际支付金额低于：</label>
            <div class="midItemRight">
                <el-input-number v-model="dataForm.minOrderMount" :step="1" :min="0">
                   <template slot="append">元</template>
                </el-input-number>
                <span>元&nbsp;&nbsp;不送积分</span>
            </div>
        </div>
          <div class="midItem">
            <label class="midItemLeft" for="">单笔订单最高可获得：</label>
            <div class="midItemRight">
                <el-input-number v-model="dataForm.maxOrderPoints" :step="1" :min="0">
                   <template slot="append">分</template>
                </el-input-number>
                <span>分&nbsp;&nbsp;积分</span>
            </div>
        </div>
     </div>
     
      <div class="bottomMoudel">
        <h3>积分获取说明</h3>
        <quill-editor-img @artmessageContent='artmessageContent' ref="myTextEditor"></quill-editor-img>
     </div>

      <div  class="bottombtWarp">
        <el-button type="primary" @click="dataFormSubmit()">{{saveLoading?"保存中":"保存"}}</el-button> 
      </div>

  </div>
</template>

<script>
  import quillEditorImg from "@/components/quillEditor"
  import {updatehoppointssettings,getShoppointssettings} from "@/api/api.js"
  export default {
    data() {
      return {
        dataLoding:false,
        saveLoading:false,
        dataForm:{
          "birthdaySettingPoints": 0,//生日设置奖励积分
          "consumptionSettingPoints": 0,
          "genderSettingPoints": 0,//性别设置奖励积分 ,
          "headerSettingPoints": 0,//头像设置奖励分值 ,
          "heightSettingPoints": 0,//身高设置奖励积分 ,
          "id": 0,
          "limitShareTimes": 0,//限制分享次数 ,
          "maxOrderPoints": 0,//订单最高可获取金额 
          "minOrderMount": 0,
          "nicknameSettingPoints": 0,//昵称设置奖励积分 ,
          "pointsDescription": "string",//积分获取说明 ,
          "realNameAuthPoints": 0,//实名认证奖励积分 ,
          "shareSettingPoints": 0,//分享拉新奖励积分 ,
          "weightSettingPoints": 0,//: 体重设置奖励积分
        }
      };
    },
    components: {
      quillEditorImg,
    },
    created() {
      this.backScan();
    },
    methods: {
      artmessageContent(messageContent){
          this.dataForm.pointsDescription = messageContent;
      },
      backScan(){
          this.dataLoding=true
        getShoppointssettings().then((res)=>{
          this.dataLoding=false
            if(res.code==200){
                this.dataForm = res.data;
                this.$refs.myTextEditor.dataForm.messageContent = this.dataForm.pointsDescription
            }else{
              this.$message.error(res.msg);
            }
        })
      },
      dataFormSubmit(){
          var obj = this.dataForm;
          this.saveLoading = true;
          updatehoppointssettings(obj).then((res)=>{
             this.saveLoading = false;
              if(res.code==200){
                  this.$message.success(res.msg);
                  this.backScan();
              }else{
                this.$message.error(res.msg);
              }
          })
      }
    }
  };
</script>
<style  lang="scss" scoped>

.el-dialog {
  width: 40%;
}
h3{
  margin-top: 40px;
  span{
    font-weight: 400;
    font-size: 14px;
    color: #CCCCCC;
  }
}
// 顶部
.topMoudel{
  .topItem{
    display: flex;
    .topItemLeft{
      display: inline-block;
      width: 246px;
      height: 50px;
      line-height: 50px;
      text-align: right;
      padding-right: 10px;
      background-color: #f0f2f5;
      border:1px solid #ebebeb;
    }
    .topItemRight{
      width: 794px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border:1px solid #ebebeb;
    }
  }
}
// 中部
.midMoudel{
  .midItem{
    display: flex;
    .midItemLeft{
      display: inline-block;
      width: 246px;
      height: 50px;
      line-height: 50px;
      text-align: right;
      padding-right: 10px;
      background-color: #f0f2f5;
      border:1px solid #ebebeb;
    }
    .midItemRight{
      width: 794px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border:1px solid #ebebeb;
    }
  }
}
// 底部
.bottomMoudel{

}


.bottombtWarp{
  margin: 40px auto 40px;
  text-align: center;
  
}
</style>

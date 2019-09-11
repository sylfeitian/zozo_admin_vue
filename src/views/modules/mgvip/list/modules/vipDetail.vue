<template>
    <div v-loading="dataLoading">
      <div class="topMoudel">
          <div class="topLeft">
              <img :src="allData.memberAvatar | filterImgUrl" alt="">
              <span class="nickname">{{allData.nickName }}</span>
          </div>
           <div class="topMiddle">
                <div class="topItem">
                    <label for="">会员ID</label><span>{{allData.memberCode}}</span>
                </div>  
                <div class="topItem">
                    <label for="">账号</label><span>{{allData.memberName}}</span>
                </div>
                <div class="topItem">
                     <label for="">性别</label><span>{{allData.memberSex==1?"女":allData.memberSex==2?"男":"保密"}}</span>
                 </div>
                <div class="topItem">
                    <label for="">生日</label><span>{{allData.memberBirthday }}</span>
                </div>
                <div class="topItem">
                     <label for="">身高</label><span>{{allData.height }}</span>
                </div>
          </div>
           <div class="topRight">
                <div class="topItem">
                     <label for="">体重</label><span>{{allData.weight }}</span>
                </div>
                <div class="topItem">
                     <label for="">手机号</label><span>{{allData.memberMobile }}</span>
                </div>
                <div class="topItem">
                     <label for="">实名认证</label>
                     <span>
                        <span> {{allData.certificationStatus==0?"未认证":"已认证"}}  </span>
                        <span v-if="allData.certificationStatus!=0 && allData.idCard"> ({{allData.idCard.slice(0,12)+"******"}}) </span>
                        <span v-if="allData.certificationStatus!=0" @click="lookIncardInfo"  class="look">查看</span>
                     </span>
                </div>
                <div class="topItem">
                     <label for="">注册时间</label><span>{{allData.createDate }}</span>
                </div>
                <div class="topItem">
                     <label for="">账户绑定</label><span>{{allData.bind}}</span>
                </div>
          </div>
      </div>
      <br>
     <h3>统计信息</h3>
      <div class="bottomMoudel">
            <div class="bottomItem">
                <label>消费金额</label>
                <span>¥{{allData.consumeAmount?allData.consumeAmount:0}}</span>
            </div>
             <div class="bottomItem">
                <label>订单数量</label>
                 <span>{{allData.orderNums?allData.orderNums:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>可用积分</label>
                 <span>{{allData.availablePoint?allData.availablePoint:0}}</span>
            </div>
             <div class="bottomItem">
                <label>累计积分</label>
                 <span>{{allData.jifen?allData.jifen:0}}</span>
            </div>
             <div class="bottomItem">
                <label>优惠券（张）</label>
                 <span>{{allData.couponNum?allData.couponNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>商品评价</label>
                 <span>{{allData.goodsNum?allData.goodsNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>退货记录</label>
                 <span>{{allData.returnGoodsNum?allData.returnGoodsNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>登录次数</label>
                 <span>{{allData.loginNum?allData.loginNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>收藏商品</label>
                 <span>{{allData.collectionGoodsNum ?allData.collectionGoodsNum:0}}</span>
            </div>
             <div class="bottomItem">
                <label>收藏搭配</label>
                 <span>{{allData.lookNum?allData.lookNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>收藏记事</label>
                 <span>{{allData.collectionLogNum?allData.collectionLogNum:0 }}</span>
            </div>
             <div class="bottomItem">
                <label>收藏品牌</label>
                 <span>{{allData.collectionBreadNum?allData.collectionBreadNum:0 }}</span>
            </div>
            <div class="bottomItem">
                <label>收藏店铺</label>
                 <span>{{allData.collectionStoreNum?allData.collectionStoreNum:0 }}</span>
            </div>
      </div>


      <el-dialog
        title="身份证信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        
         <el-form label-width="100px" :model="dataForm" :rules="dataRule"  class="elForm" ref="editForm">
            <el-form-item label="身份证号码：">
                 <span>{{myIdCardInfo.idCard}}</span>
            </el-form-item>
            <el-form-item label="身份证正反面：" >
               <div class="idCardImgWarp">
                    <img :src="myIdCardInfo.idcartPositiveUrl | filterImgUrl" alt="">
                    <img :src="myIdCardInfo.idcartReverseUrl | filterImgUrl"  alt="">
               </div>
            </el-form-item>
        </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {zozomemberDetail} from "@/api/api.js"
    import {idCardInfo} from "@/api/api.js"
    export default {
        data () {
            return {
                myIdCardInfo:{},
                dialogVisible:false,
                row:'',
                dataLoading:false,
                allData:{},
            }
        },
        components:{
         
        },
        methods:{
           init(row){
              this.row= row,
               this.getData();
            },
            getData(){
                var obj  = {
                    id:this.row.id,
                }
                this.dataLoading = true;
                zozomemberDetail(obj).then((res)=>{
                    this.dataLoading = false;
                    console.log(res);
                    if(res.code==200){
                        this.allData  = res.data;
                        this.allData.jifen = this.allData.availablePoint + this.allData.consumeAmount;
                    }
                })
            },
            // 查看身份证正反面信息
            lookIncardInfo(){
                var obj = {
                id:this.row.id
                }
                idCardInfo(obj).then((res)=>{
                    if(res.code==200){
                        this.dialogVisible = true;
                        this.myIdCardInfo = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            handleClose(){
                this.dialogVisible = false;
            }
        }
    }
</script>

<style lang="scss"  scoped>
.topMoudel{
    margin-top:40px;
     height:  225px;
     display: flex;
      
     .topLeft{
         width: 238px;
         height: 225px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 1px solid #ebebeb;
         img{
             width: 80px;
            height: 80px;
         }
        .nickname{
            margin-top:20px;
        }
     }
    .topMiddle{
    }
    .topItem{
        display: flex;
        height: 45px;
        width:430px;
         box-sizing:border-box;
          border: 1px solid #ebebeb;
         &>label{
            display: inline-block;
            width: 123px;
            height: 45px;
            text-align: right;
            line-height: 45px;
            background-color: rgba(240, 242, 245, 1);
            padding-right:10px;
        }
        &>span{
            display: inline-block;
            text-align: left;
            height: 45px;
            width: 307px;;
            line-height: 45px;
            padding-left:10px;
        }
    }
    
}


.bottomMoudel{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    .bottomItem{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 90px;
        min-width: 100px;
        box-sizing: content-box;
        border-left: 1px solid #ebebeb;
        border-right: 1px solid #ebebeb;
        &>label,&>span{
            width: 130px;
            display: inline-block;
            height: 45px;
            line-height: 45px;
            text-align: center;
        }
        &>label{
            background-color: rgba(240, 242, 245, 1);
            border-top: 1px solid #ebebeb;
        }
        &>span{
             border-bottom: 1px solid #ebebeb;
        }
    }
}

.look{
    cursor: pointer;
    color: #1890FF;
}
.idCardImgWarp{
    img{
        width: 158px;
        height: 100px;
        margin-right: 10px;
    }
}
</style>
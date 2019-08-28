<template>
    <el-dialog
            class="model-add-edit-data"
            title="订单跟踪"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="30%"
            
    >
        <div class="logisticsWarp" v-loading="loading">
            <el-steps direction="vertical" :active="active">
                <!-- v-for="" -->
                <el-step :title="item.opeRemark" :description="item.opeTime"  v-for="(item,index) in logisticsData" :key="index"></el-step>
            </el-steps>
        </div>
    </el-dialog>
</template>

<script>
import {logisticsInfo} from "@/api/api.js"
    export default {
        name: "model-order-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm : {},
                active: 0,
                logisticsSn:'',
                logisticsData:[],
            }
        },
        methods: {
            init (logisticsSn) {
                this.visible = true;
                this.logisticsSn = logisticsSn;
                this.getInfo();
            },
            getInfo(){
                  var obj = {
                      logisticsSn:this.logisticsSn
                  }
                  this.loading = true;
                  logisticsInfo(obj).then((res)=>{
                      this.loading = false;
                      console.log(res);
                      if(res.code==200){
                        this.logisticsData = res.data;
                        if(this.logisticsData.length!=0){
                            this.active = this.logisticsData.length-1
                        }
                      }else{
                        this.$message({
                            message:res.msg,
                            type: 'error',
                            duration: 800,
                        })
                        this.closeDialog();
                      }
                  })
            },
            closeDialog() {
                console.log("关闭窗口");
                 this.visible = false;
                this.$parent.logisticsVisible = false;
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
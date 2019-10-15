<template>
    <div>
     <Bread :breaddata="breaddata" @changePage="changePage" :index="index"></Bread>
       <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="vipDetail">会员详情</el-radio-button>
            <el-radio-button label="editVip">编辑资料</el-radio-button>
            <el-radio-button label="loginLog">登录日志</el-radio-button>
        </el-radio-group>
  
        <vipDetail v-if="activeName=='vipDetail'"  ref="vipDetailCompon"></vipDetail>
        <editVip  v-else-if="activeName=='editVip'" @changePage = "changePage" ref="editVipCompon"></editVip>
        <loginLog  v-else-if="activeName=='loginLog'" ref="loginLogCompon"></loginLog>
    </div>
</template>

<script>
import Bread from "@/components/bread";
    import vipDetail from "./modules/vipDetail.vue"
    import editVip from "./modules/editVip.vue"
    import loginLog from "./modules/loginLog.vue"
    export default {
        data () {
            return {
              row:"",
              activeName: "",
            }   
        },
        props:["breaddata","index"],
        components:{
            vipDetail,
            editVip,
            loginLog,
            Bread
        },
        methods:{
            init(row){
                this.row = row;
                this.activeName = row.activeName
                this.handleClick(this.activeName);
            },
            handleClick(tab) {
                // if(tab== "vipDetail"){
                // }else if(tab== "editVip"){
                // }else if(tab== "loginLog"){
                // }
                this.$nextTick(()=>{
                     this.$refs[tab+"Compon"].init(this.row)
                })
            },
            changePage(){
                 this.$emit("controlShowPage",1)
            },
        }
    }
</script>

<style>
</style>
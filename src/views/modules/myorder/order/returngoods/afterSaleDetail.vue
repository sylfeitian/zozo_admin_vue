<template>
    <div>
    <Bread :breaddata="breaddata" @changePage="goBack" :index="'2'"></Bread>
     <el-button size="mini" type="text" @click="goBack()">返回</el-button>
    </div>
</template>

<script>
    import {aftersaleReturnDetail } from "@/api/api";
        import Bread from "@/components/bread";
    export default {
        data () {
            return {
                row:'',
            }
        },
        props: ['breaddata'],
        components:{
            Bread,
        },
        methods:{
            init(row){
                // row.id = 123666;
                this.row = row;
                this.getAfterSaleDetail();    
            },
            getAfterSaleDetail(){
                var obj  = {
                    aftersaleSn:12313212,
                }
                aftersaleReturnDetail(obj).then((res)=>{
                    console.log(res);
                    if(res.code=200){

                    }else{
                        this.$message({
                            message:res.msg,
                            type: 'error',
                            duration: 800,
                        }) 
                    }
                })
            },
            goBack(){
                this.$emit("orderDetListFn");
            }

        }
    }
</script>

<style>
</style>
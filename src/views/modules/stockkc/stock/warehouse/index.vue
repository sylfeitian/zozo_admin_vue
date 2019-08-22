<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @addoraditList="addoraditList"></list>
        <addoradit v-if="addoraditVisible" ref="addoraditCompon" @showList="showList"></addoradit>
    </div>
</template>

<script>
    import list from "./list"
    import addoradit from "./addoradit"
    export default {
        data () {
            return {
                mainVisible:true,
                addoraditVisible:false
            }
        },
        components:{
            list,
            addoradit
        },
        methods: {
            addoraditList(id){
                this.addoraditVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.addoraditCompon.init(id);
                })
            },
            showList(){
                this.addoraditVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
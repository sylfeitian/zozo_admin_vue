<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @showDetail="showDetail" @addOrAdit="addOrAdit" @add="add"></list>
        <detail v-if="dtailVisible" ref="detailCompon" @showList="showList"></detail>
        <addoradit v-if="addoraditVisible" ref="addoraditCompon" @addoraditList="addoraditList"></addoradit>
        <add v-if="addVisible" ref="addCompon" @addList="addList"></add>
    </div>
</template>

<script>
    import list from "./list"
    import detail from "./details"
    import addoradit from "./edit"
    import add from "./add"
    export default {
        data () {
            return {
                mainVisible:true,
                dtailVisible:false,
                addoraditVisible:false,
                addVisible:false
            }
        },
        components:{
            list,
            detail,
            addoradit,
            add
        },
        methods:{
            showDetail(row){
                this.dtailVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.detailCompon.init(row);
                })
            },
            addOrAdit(id){
                this.addoraditVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.addoraditCompon.init(id);
                })
            },
            add(){
                this.addVisible = true;
                this.mainVisible = false;
            },
            showList(){
                this.dtailVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            },
            addoraditList(){
                this.addoraditVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            },
            addList(){
                this.addVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            }

        }
    }
</script>

<style>
</style>
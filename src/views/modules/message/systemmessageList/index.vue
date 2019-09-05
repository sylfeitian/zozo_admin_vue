<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @showDetail="showDetail" @addOrAdit="addOrAdit" @add="add"></list>
        <add v-if="addVisible" ref="addCompon" @addList="addList"></add>
    </div>
</template>

<script>
    import list from "./list"
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
            add
        },
        methods:{
            add(){
                this.addVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.addoraditCompon.init();
                })
            },
            showList(){
                this.dtailVisible = false;
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
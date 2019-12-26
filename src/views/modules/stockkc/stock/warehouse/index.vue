<template>
    <div>
        <keep-alive>
            <list v-if="mainVisible" ref="listCompon" @showDetail="showDetail"></list>
        </keep-alive>
        <detail v-if="detailVisible" ref="detailCompon" @showList="showList"></detail>
    </div>
</template>

<script>
    import list from "./list"
    import detail from "./detail"
    export default {
        data () {
            return {
                mainVisible:true,
                detailVisible:false
            }
        },
        components:{
            list,
            detail
        },
        methods: {
            showDetail(row){
                this.detailVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.detailCompon.init(row);
                })
            },
            showList(){
                this.detailVisible = false;
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
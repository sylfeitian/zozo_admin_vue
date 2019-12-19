<template>
    <div>
        <keep-alive>
            <list v-if="mainVisible" ref="listCompon" @showDetail="showDetail" @addOrAdit="addOrAdit"></list>
        </keep-alive>
        <detail v-if="detailVisible" ref="detailCompon" @logMore="showList" @operational="operational"></detail>
        <operation v-if="operationVisible" ref="operationCompon" @operationList="operationList" @operationalList="operationalList"></operation>
    </div>
</template>

<script>
    import list from "./list"
    import detail from "../../../mggoods/good/goodslist/detail"
    import operation from "./operation"
    // import mixinViewModule from '@/mixins/view-module'
    export default {
        // mixins: [mixinViewModule],
        data () {
            return {
                mainVisible:true,
                detailVisible:false,
                operationVisible:false
            }
        },
        components:{
            list,
            detail,
            operation
        },
        methods:{
            showDetail(row){
                this.detailVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.detailCompon.init(row);
                })
            },
            addOrAdit(id){
                this.operationVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.operationCompon.init(id);
                })
            },
            showList(){
                this.detailVisible = false;
                this.mainVisible = true;
            },
            operationList(){
                this.operationVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            },
            operational () {
                this.detailVisible = false;
                this.operationVisible = true;
                this.$nextTick(()=>{
                    this.$refs.detailCompon.getDataList();
                })
            },
            operationalList () {
                this.detailVisible = true;
                this.operationVisible = false;
                this.$nextTick(()=>{
                    this.$refs.operationVisible.getDataList();
                })
            },
        }
    }
</script>

<style>
</style>
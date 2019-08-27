<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @detShowChange="detShowChange" @editList="editList"></list>
<!--        <operationallog v-if="operationallogVisible" ref="operationallogCompon" @operationallogList="operationallogList" @more="more"></operationallog>-->
        <detail v-if="detailVisible" ref="detailCompon" @logMore="logMore"></detail>
        <edit v-if="editVisible" ref="editCompon" @showList="showList"></edit>
    </div>
</template>

<script>
    import list from "./list"
    // import operationallog from "./operationalLog"
    import detail from "./detail";
    import edit from "./edit";
    import Bread from "@/components/bread";
    export default {
        data () {
            return {
                mainVisible:true,
                detailVisible:false,
                operationallogVisible:false,
                editVisible: false
            }
        },
        components: {
            Bread,
            detail,
            list,
            // operationallog,
            edit
        },
        methods: {
            detShowChange (row) {
                this.detailVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.detailCompon.init(row);
                })
            },
            operationallogList () {
                this.detailVisible = false;
                this.operationallogVisible = true;
                // this.$nextTick(()=>{
                //     this.$refs.operationallogCompon.init(row);
                // })
            },
            // detailList () {
            //     this.detailVisible = false;
            //     this.recordlistVisible = true;
            // },
            logMore () {
                this.detailVisible = false;
                this.mainVisible = true;
            },
            // operational () {
            //     this.detailVisible = false;
            //     this.operationallogVisible = true;
            //     this.$nextTick(()=>{
            //         this.$refs.operationallogCompon.init();
            //     })
            //
            // },
            more () {
                this.detailVisible = true;
                this.operationallogVisible = false;
            },
            editList (row) {
                this.mainVisible = false;
                this.editVisible = true;
                this.$nextTick(()=>{
                    this.$refs.editCompon.init(row);
                })
            },
            showList () {
                this.mainVisible = true;
                this.editVisible = false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .grayLine{
        border-bottom: 0!important;
    }
</style>
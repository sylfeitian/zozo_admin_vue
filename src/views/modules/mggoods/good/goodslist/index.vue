<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @detShowChange="detShowChange" @editList="editList"></list>
        <operationallog v-if="operationallogVisible" ref="operationallogCompon" @operationallogList="operationallogList" @more="more"></operationallog>
        <detail v-if="detailVisible" ref="detailCompon" @logMore="logMore" @operational="operational"></detail>
        <edit v-if="editVisible" ref="editCompon"></edit>
    </div>
</template>

<script>
    import list from "./list"
    import operationallog from "./operationalLog"
    import detail from "./detail";
    import edit from "./edit";
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
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
            operationallog,
            edit
        },
        methods: {
            detShowChange () {
                this.detailVisible = true;
                this.mainVisible = false;
                // this.$nextTick(()=>{
                //     this.$refs.detailCompon.init(row);
                // })
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
            operational () {
                this.detailVisible = false;
                this.operationallogVisible = true;
            },
            more () {
                this.detailVisible = true;
                this.operationallogVisible = false;
            },
            editList () {
                this.mainVisible = false;
                this.editVisible = true;
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
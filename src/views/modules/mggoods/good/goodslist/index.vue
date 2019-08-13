<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @detShowChange="detShowChange"></list>
        <operationallog v-if="operationallogVisible" ref="operationallogCompon" @operationallogList="operationallogList" @more="more"></operationallog>
        <detail v-if="detailVisible" ref="detailCompon" @detailList="detailList" @logMore="logMore" @operational="operational"></detail>
    </div>
</template>

<script>
    import list from "./list"
    import operationallog from "./operationalLog"
    import detail from "./detail";
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mainVisible:true,
                detailVisible:false,
                operationallogVisible:false
            }
        },
        components: {
            Bread,
            detail,
            list,
            operationallog
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
            // logMore () {
            //     this.detailVisible = false;
            //     this.recordlistVisible = true;
            // },
            operational () {
                this.detailVisible = false;
                this.operationallogVisible = true;
            },
            more () {
                this.detailVisible = true;
                this.operationallogVisible = false;
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
<template>
    <div>
        <keep-alive>
            <list v-if="mainVisible" ref="listCompon" @detShowChange="detShowChange" ></list>
        </keep-alive>
        <detail v-if="detailVisible" ref="detailCompon" @logMore="logMore"></detail>
    </div>
</template>

<script>
    import list from "./list"
    // import operationallog from "./operationalLog"
    import detail from "../goodslist/detail";
     export default {
        data () {
            return {
                mainVisible:true,
                detailVisible:false,
            }
        },
        components: {
            detail,
            list,
        },
        methods: {
            detShowChange (row) {
                this.detailVisible = true;
                this.mainVisible = false;
                row.origin = "recordinformation"
                this.$nextTick(()=>{
                    this.$refs.detailCompon.init(row);
                })
            },
             logMore () {
                this.detailVisible = false;
                this.mainVisible = true;
            },
        }
     }
</script>

<style lang="scss" scoped>

</style>
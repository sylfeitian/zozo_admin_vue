<template>
    <table class="mailTable" :style="styleObject" v-if="s_showByRow">
        <tr v-for="index in rowCount">
            <td class="column">{{tableData[index-1].key}}</td>
            <td>{{tableData[index-1].value}}</td>
<!--            <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>-->
<!--            <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>-->
        </tr>
    </table>
    <table class="mailTable" :style="styleObject" v-else>
        <tr v-for="index in rowCount">
            <td class="column">{{tableData[index-1].key}}</td>
            <td>{{tableData[index-1].value}}</td>
            <td class="column">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].key : ''}}</td>
            <td>{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].value : ''}}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        data() {
            return {
                styleObject: {},
                s_showByRow: true,
            };
        },
        props: ['tableData', 'tableStyle', 'showByRow'],
        computed: {
            rowCount: function() {
                return Math.ceil(this.tableData.length);
            }
        },
        created() {
            this.styleObject = this.tableStyle;
            if(this.showByRow !== undefined){
                this.s_showByRow = this.showByRow;
            }
        },
    }
</script>
<style scoped>
    table{
        width: 300px!important;
    }
   .mailTable{border:1px solid #E6EAEE;text-align: center}
　　.mailTable, .mailTable tr, .mailTable tr td{ border:1px solid #E6EAEE; }
　　.mailTable{ font-size: 12px; color: #71787E; }
　　.mailTable tr td{ border:1px solid #E6EAEE; width: 100px; height: 50px; line-height: 50px; box-sizing: border-box; padding: 0 10px; }
　　.mailTable tr td.column { background-color: #EFF3F6; color: #393C3E; }
   .mailTable tr {
       height: 40px;
   }
   .mailTable tr td{
       width: 150px;
   }
</style>
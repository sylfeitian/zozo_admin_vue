<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="30%"
    >
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"

        >
            <el-steps direction="vertical" :active="active" finish-status="success" align-center>
                <el-step title="步骤 1" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="步骤 2" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="步骤 3" description="这段就没那么长了"></el-step>
            </el-steps>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "model-order-data",
        data () {
            return {
                active: 0
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.title="订单跟踪";
            }
        }
    }
</script>

<style scoped>

</style>
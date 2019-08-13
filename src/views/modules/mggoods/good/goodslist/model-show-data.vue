<template>
    <el-dialog
            class="model-show-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="40%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >

        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "model-show-data"
    }
</script>

<style scoped>

</style>
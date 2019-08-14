<template>
    <div>
        <Bread :breaddata="orderDetData" @changePage="getList(1)" :index="'2'"></Bread>
        <el-steps
                align-center
        >
            <el-step title="提交订单" icon="el-icon-document"></el-step>
            <el-step title="付款成功" icon="el-icon-mobile-phone" description=""></el-step>
            <el-step title="商品出库" icon="el-icon-goods" description=""></el-step>
            <el-step title="待收货" icon="el-icon-time" description=""></el-step>
            <el-step title="完成" icon="el-icon-circle-check" description=""></el-step>
        </el-steps>
    </div>
</template>
<script>
    import Bread from "@/components/bread";
    import Clipboard from "clipboard";

    export default {
        data() {
            return {
                textarea: "",
                dialogFormVisible: false,
                orderDetData: ["订单系统", "订单管理", "订单列表", "订单详情"],
                form: {
                    desc: "",
                    resource: 0
                }
            };
        },
        components: {
            Bread
        },
        props: ["data", "addressInfo", "orderLog", "orderData", "packageInfo"],
        methods: {
            //页面跳转 1-列表页
            getList(nums) {
                this.$emit("changePage", nums);
            },

            //添加备注
            addRemarks() {
                this.dialogFormVisible = !this.dialogFormVisible;
            },
            copyOrder() {
                var clipboard = new Clipboard(".btn");
                let that = this;
                clipboard.on("success", e => {
                    that.$message({
                        message: "订单号复制成功",
                        type: "success",
                        duration: 1000
                    });
                    clipboard.destroy();
                });

                clipboard.on("error", e => {
                    that.$message({
                        message: "订单号复制失败，请重新复制",
                        type: "error",
                        duration: 1000
                    });
                    clipboard.destroy();
                });
            }
        }
    };
</script>
<style scoped>
    .creater {
        display: inline-block;
        width: 80px;
        margin: 0 15px;
    }
    .el-textarea {
        width: 30%;
    }
    .inforTit{
        width: 100px;
        font-weight: 600;
        text-align: left;
        color:#333;
        display: inline-block;
    }
    .title{
        font-size: 16px;
        font-weight: 700;
    }
    #bar {
        border: none;
        margin-right: 10px;
        min-width: 180px;
        display: inline-block;
    }
    .orderUerInfo {
        width: 100%;
        height: auto;
        margin-top: 20px;
        border: 1px solid #d1d1d1;
    }
    .orderDe {
        /* border: 1px solid #333; */
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .orderDelf,
    .orderDerg {
        /* display: flex; */
        display: flex;
        align-items: center;
    }
    .orderDelf div {
        margin-left: 20px;
    }
    .orderDerg div {
        margin-right: 20px;
    }
    .buyerInfo {
        box-sizing: border-box;
        border-radius: 5px;
        padding: 0px 8px;
        height: auto;
        /* margin: 5px 10px; */
        border: 1px solid #d1d1d1;
        display: flex;
    }
    .buyerInfo ul {
        width: 50%;
        padding: inherit;
    }
    .buyerInfo ul li {
        list-style-type: none;
        padding: 3px;
    }
    .orderRecord {
        widows: 100%;
        height: auto;
        height: 200px;
        display: flex;
        margin-top: 10px;
        border: 1px solid #d1d1d1;
    }
    .orderText {
        width: 80%;
        height: 100%;
        display: flex;
        padding: 10px;

        justify-content: flex-start;
    }
    .orderInfo {
        width: 20%;
        padding: 20px 0 0 30px;
        border-right: 1px solid #d1d1d1;
        text-align: left;
        height: 100%;
    }
    .el-textarea {
        width: 100%;
    }
    .el-textarea__inner {
        height: 100%;
        resize: none;
    }
    .orderConfig {
        width: 100%;
        border: 1px solid #d1d1d1;
        height: auto;
        display: flex;
        justify-content: flex-start;
        margin-top: 10px;
    }
    .orderConList {
        width: 25%;
        padding: 20px 0 0 30px;
        border-right: 1px solid #d1d1d1;
        text-align: left;
        height: auto;
    }
    .summary {
        width: 100%;
        display: flex;
        margin-top: 20px;
        justify-content: flex-end;
    }
    .summary ul li {
        list-style: none;
        width: 200px;
        line-height: 30px;
    }
    .operationRecord {
        width: 100%;
        padding-left: 20px;
        margin: 20px 0;
        height: auto;
        border: 1px solid #d1d1d1;
    }
    .operationRecord p {
        line-height: 30px;
    }
    .el-table {
        margin-top: 20px;
    }
</style>

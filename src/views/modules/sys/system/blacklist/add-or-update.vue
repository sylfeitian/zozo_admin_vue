<template>
    <el-dialog
            title="添加黑名单"
            :visible.sync="outerVisible"
            @click="goBack"
            :show-close="false"
            width="40%"
    >
        <el-form label-width="100px" :model="dataForm">
            <el-form-item label="账号：">
                <el-input v-model="memberInfo.memberName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="收货地址：">
                <el-select
                        disabled
                        v-model="dataForm.memberAreaid"
                        placeholder="请选择"
                        loading-text="加载中···"
                        @visible-change="getGoodsClass(0)"
                >
                    <!-- 市级 -->
                    <el-option
                            v-for="item in goodscalssOption0"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        disabled
                        v-model="dataForm.memberCityid"
                        placeholder="请选择"
                        @visible-change="getGoodsClass(1)"
                >
                    <el-option
                            v-for="item in goodscalssOption1"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        disabled
                        v-model="dataForm.memberProvinceid"
                        placeholder="请选择"
                        @visible-change="getGoodsClass(2)"
                >
                    <el-option
                            v-for="item in goodscalssOption2"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select disabled v-if="dataForm.stressId" v-model="dataForm.stressId" placeholder="请选择">
                    <el-option
                            v-for="item in goodscalssOption3"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="restPass">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { isMobile } from "@/utils/validate";
    import { restPassword, setMemberPass, areaList, proList } from "@/api/api";
    export default {
        components: {},
        data() {
                return {
                value: [],
                outerVisible: true,
                innerVisible: false,
                dialogVisible: "",
                form: {},
                dataForm: {
                    memberName: "",
                    memberAreaid: "",
                    memberCityid: "",
                    memberProvinceid: "",
                    stressId: ""
                },
                goodscalssOption0: [],
                goodscalssOption1: [],
                goodscalssOption2: [],
                goodscalssOption3: [],
            };
        },
        props: ["memberInfo", "memberInfoSourse"],
        methods: {
            init() {
                this.getCity("");
                this.dataForm.memberAreaid = this.memberInfo.memberProvinceid;
                this.dataForm.memberCityid = this.memberInfo.memberCityid;
                this.dataForm.memberProvinceid = this.memberInfo.memberAreaid;
                this.dataForm.stressId = this.memberInfo.stressId;
                this.getAreaList(this.dataForm.memberAreaid);
                this.getProList(this.dataForm.memberCityid);
                this.getStrList(this.dataForm.memberProvinceid);
            },
            getCity() {
                //所有一级区域
                areaList().then(res => {
                    if (res.code == 200) {
                        this.goodscalssOption0 = res.data;
                    }
                });
            },
            getAreaList(id) {
                //二级
                proList({ id }).then(res => {
                    if (res.code == 200) {
                        this.goodscalssOption1 = res.data;
                    }
                });
            },
            getProList(id) {
                //三级
                proList({ id }).then(res => {
                    if (res.code == 200) {
                        this.goodscalssOption2 = res.data;
                    }
                });
            },
            getStrList(id) {
                //四级
                proList({ id }).then(res => {
                    if (res.code == 200) {
                        console.log(res.data, "333");
                        this.goodscalssOption3 = res.data;
                    }
                });
            },
            closeInner() {
                this.innerVisible = false;
                this.form.phone = "";
            },
            handleChange(value) {
                console.log(value);
            },
            //取消
            cancel() {
                this.outerVisible = false;
                this.$emit("changeWindow");
                //回传主页面。false
            },
            //返回列表页
            goBack() {
                console.log("关闭");
                this.$emit("changeWindow");
            },
            //重置密码
            restPass() {
                console.log(this.memberInfo, "111", this.dataForm);
                const obj = {
                    id: this.memberInfo.id,
                    memberAreaid: this.dataForm.memberAreaid,
                    memberCityid: this.dataForm.memberCityid,
                    memberPasswd: "string",
                    stressId: this.dataForm.stressId,
                    memberProvinceid: this.dataForm.memberProvinceid
                };
                setMemberPass(obj).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            message: res.msg,
                            type: "success",
                            duration: 1000
                        });
                        this.$emit("changeWindow");
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 1000
                        });
                    }
                });
            },
            //获取密码
            sendMsg() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        const obj = {
                            id: this.memberInfo.id,
                            mobile: this.form.phone
                        };
                        restPassword(obj).then(res => {
                            if (res.code == 200) {
                                this.$message({
                                    message: res.msg,
                                    type: "success",
                                    duration: 1000
                                });
                                this.innerVisible = !this.innerVisible;
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: "error",
                                    duration: 1000
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .el-select {
        width: 15%;
    }
    .header {
        text-align: center;
        font-weight: bold;
    }
    .el-input {
        width: 50%;
    }
    .el-dialog {
        width: 40% !important;
    }
    .rest {
        margin-left: 15px;
        display: inline-block;
        padding: 8px 10px;
        color: dodgerblue;
    }
    .dialog-footer {
        width: 91%;
    }
    /* /deep/.el-dialog {
      width: 30% !important;
    } */
    .el-form {
        width: 140%;
    }
    /* .restPass{text-align: center;} */
</style>

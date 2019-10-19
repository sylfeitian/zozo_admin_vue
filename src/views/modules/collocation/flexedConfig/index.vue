<template>
    <div class="flexedConfig">
        <Bread :breaddata="breaddata"></Bread>
        <div class="modle">
            <div class="titleTops">库存显示配置</div>
            <div class="modleItem">
                <el-form :model="dataForm1">
                    当库存大于
                    <el-input style="width:220px;" type="text" v-model="dataForm1.inventory" placeholder="请输入数字"
                              clearable></el-input>
                    显示<span style="color:red;">有库存</span>，反之显示库存较少
                </el-form>
                <div class="btns1">
                    <el-button type="primary" @click="addActivity1()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
            <div class="titleTops">确认订单页面提示</div>
            <div class="modleItem">
                <el-form :model="dataForm2" label-width="70px">
                    <el-form-item label="文案：">
                        <el-input type="textarea" :rows="10" :maxlength="1000"  show-word-limit placeholder="请输入内容"
                                  v-model="dataForm2.copywriting"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="dataForm2.isShow">
                            <el-radio :label="1">显示</el-radio>
                            <el-radio :label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2">
                    <el-button type="primary" @click="addActivity2()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
            <div class="titleTops">确认订单弹窗提示</div>
            <div class="modleItem">
                <el-form :model="dataForm3" label-width="70px">
                    <el-form-item label="文案：">
                        <el-input type="textarea" :rows="10" :maxlength="1000" show-word-limit placeholder="请输入内容"
                                  v-model="dataForm3.copywriting"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="dataForm3.isShow">
                            <el-radio :label="1">显示</el-radio>
                            <el-radio :label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2">
                    <el-button type="primary" @click="addActivity3()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
            <div class="titleTops">默认搜索词配置</div>
            <div class="modleItem">
                <el-form :model="dataForm4" label-width="70px">
                    <el-form-item label="全部：">
                        <el-input v-model.trim.trim="dataForm4.all" placeholder="请输入50字以内内容"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="男：">
                        <el-input v-model.trim.trim="dataForm4.man" placeholder="请输入50字以内内容"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="女：">
                        <el-input v-model.trim.trim="dataForm4.woman" placeholder="请输入50字以内内容"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="儿童：">
                        <el-input v-model.trim.trim="dataForm4.child" placeholder="请输入50字以内内容"
                                  clearable></el-input>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2 btns3">
                    <el-button type="primary" @click="addActivity4()">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {settingAll, settingSearch, settingStock, settingPage, settingPopup} from '@/api/api'
    import Bread from "@/components/bread";

    export default {
        data() {
            return {
                breaddata: ["配置管理", "固定显示配置"],
                dataForm1: {
                    inventory: '',//库存数
                },
                dataForm2: {
                    id: '',
                    copywriting: '',//文案
                    isShow: 1,

                },
                dataForm3: {
                    id: '',
                    copywriting: '',
                    isShow: 1,
                },
                dataForm4: {
                    id: '',
                    all: '',
                    man: '',
                    woman: '',
                    child: ''
                }
            }
        },
        components: {
            Bread
        },
        watch: {
            'dataForm1.inventory': function (newV, oldV) {
                for (let i = 0; i < newV.length; i++) {
                    // 输入框仅可输入6位数字，不允许有小数点
                    if (!/^[0-9]$/.test(newV[i])) {
                        this.dataForm1.inventory = newV.replace(newV[i], "")
                    }
                    if (newV.length > 6) {
                        this.dataForm1.inventory = newV.substr(0, 6)
                    }
                }
            },
            'dataForm2.copywriting': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 2000) { //输入字符大于2000的时候过滤
                        this.dataForm2.copywriting = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm3.copywriting': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 2000) { //输入字符大于2000的时候过滤
                        this.dataForm3.copywriting = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm4.all': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 100) { //输入字符大于100的时候过滤
                        this.dataForm4.all = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm4.man': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 100) { //输入字符大于100的时候过滤
                        this.dataForm4.man = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm4.woman': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 100) { //输入字符大于100的时候过滤
                        this.dataForm4.woman = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm4.child': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 100) { //输入字符大于100的时候过滤
                        this.dataForm4.child = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
        },
        created() {
            this.getSettingAll();
        },
        methods: {
            getSettingAll() {
                settingAll({}).then((res) => {
                    console.log('所有配置', res)
                    if (res.code == 200) {
                        res.data.map((item) => {
                            if (item.name == 'inventoryDisplay') {
                                this.dataForm1.id = item.id;
                                JSON.parse(item.value).inventory ? this.dataForm1.inventory = JSON.parse(item.value).inventory : '';
                            } else if (item.name == 'orderConfirmPage') {
                                this.dataForm2.id = item.id;
                                JSON.parse(item.value).copywriting ? this.dataForm2.copywriting = JSON.parse(item.value).copywriting : '';
                                JSON.parse(item.value).isShow ? this.dataForm2.isShow = JSON.parse(item.value).isShow : '';
                            } else if (item.name == 'orderConfirmPopup') {
                                this.dataForm3.id = item.id;
                                JSON.parse(item.value).copywriting ? this.dataForm3.copywriting = JSON.parse(item.value).copywriting : '';
                                JSON.parse(item.value).isShow ? this.dataForm3.isShow = JSON.parse(item.value).isShow : '';
                            } else if (item.name == 'defaultSearchTerm') {
                                this.dataForm4.id = item.id;
                                JSON.parse(item.value).all ? this.dataForm4.all = JSON.parse(item.value).all : '';
                                JSON.parse(item.value).woman ? this.dataForm4.woman = JSON.parse(item.value).woman : '';
                                JSON.parse(item.value).man ? this.dataForm4.man = JSON.parse(item.value).man : '';
                                JSON.parse(item.value).child ? this.dataForm4.child = JSON.parse(item.value).child : '';
                            }
                        })
                    }
                })
            },
            addActivity1() {
                if (this.dataForm1.inventory) {
                    settingStock(this.dataForm1).then((res) => {
                        console.log('库存显示配置', res)
                        if (res.code == 200) {
                            this.$message.success('库存显示配置成功');
                            this.getSettingAll();
                        } else {
                            this.$message.success(res.msg);
                        }
                    })
                } else {
                    this.$message.warning('库存数不能为空！');
                }
            },
            addActivity2() {
                settingPage(this.dataForm2).then((res) => {
                    console.log('订单页面提示配置', res)
                    if (res.code == 200) {
                        this.$message.success('确认订单页面提示配置成功');
                        this.getSettingAll();
                    } else {
                        this.$message.success(res.msg);
                    }
                })
            },
            addActivity3() {
                settingPopup(this.dataForm3).then((res) => {
                    console.log('确认订单弹窗提示配置', res)
                    if (res.code == 200) {
                        this.$message.success('确认订单弹窗提示配置成功');
                        this.getSettingAll();
                    } else {
                        this.$message.success(res.msg);
                    }
                })
            },
            addActivity4() {
                // if (!this.dataForm4.all && !this.dataForm4.child && !this.dataForm4.man && !this.dataForm4.woman) {
                //     this.$message.warning('配置不能为空！');
                // } else {
                    settingSearch(this.dataForm4).then((res) => {
                        console.log('默认搜索词配置', res)
                        if (res.code == 200) {
                            this.$message.success('默认搜索词配置成功');
                            this.getSettingAll();
                        } else {
                            this.$message.success(res.msg);
                        }
                    })
                // }


            }
        }
    }
</script>

<style lang="scss" scoped>
    .flexedConfig {
        .modle {
            width: 100%;
            display: flex;
            flex-direction: column;

            .el-input {
                width: 360px;
            }

            .titleTops {
                width: 100%;
                padding: 12px 0;
                margin-left: 20px;
                font-weight: bold;
            }

            .modleItem {
                width: 100%;
                padding: 40px;

                .btns1 {
                    width: 100%;
                    display: flex;
                    margin-left: 450px;
                    // justify-content: center;
                    margin-top: 100px;
                }

                .btns2 {
                    margin-top: 40px;
                }

                /deep/ .el-textarea {
                    width: 360px;

                    .el-input__count {
                        float: right;
                    }
                }
            }
        }
    }
</style>



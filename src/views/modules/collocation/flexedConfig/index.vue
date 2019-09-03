<template>
    <div class="flexedConfig">
        <div class="modle">
            <div class="titleTops">库存显示配置</div>
            <div class="modleItem">
                <el-form :model="dataForm1">
                    当库存大于<el-input style="width:220px;" type="number" :maxlength="6" show-word-limit v-model="dataForm1.storeId" placeholder="请输入请输入数字" clearable></el-input>显示<span style="color:red;">有库存</span>，反正显示库存较少
                </el-form>
                <div class="btns1">
                    <el-button type="primary" @click="addActivity()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
            <div class="titleTops">确认订单页面提示</div>
            <div class="modleItem">
                <el-form :model="dataForm2" label-width="70px">
                    <el-form-item label="文案："> 
                        <el-input type="textarea" :rows="10" :maxlength="1000" show-word-limit placeholder="请输入内容" v-model="dataForm2.textarea"> </el-input>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="dataForm2.radio">
                            <el-radio label="0">显示</el-radio>
                            <el-radio label="1">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2">
                    <el-button type="primary" @click="addActivity()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
            <div class="titleTops">确认订单弹窗提示</div>
            <div class="modleItem">
                <el-form :model="dataForm3" label-width="70px">
                    <el-form-item label="文案："> 
                        <el-input type="textarea" :rows="10" :maxlength="1000" show-word-limit placeholder="请输入内容" v-model="dataForm3.textarea"> </el-input>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="dataForm3.radio">
                            <el-radio label="0">显示</el-radio>
                            <el-radio label="1">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2">
                    <el-button type="primary" @click="addActivity()">保存</el-button>
                </div>
            </div>
        </div>

        <div class="modle">
             <div class="titleTops">默认搜索词配置</div>
            <div class="modleItem">
                <el-form :model="dataForm4" label-width="70px">
                    <el-form-item label="全部：">
                        <el-input v-model="dataForm4.allvalue" placeholder="请输入50字以内内容" :maxlength="50" show-word-limit clearable></el-input>
                    </el-form-item>
                    <el-form-item label="男：">
                        <el-input v-model="dataForm4.man" placeholder="请输入50字以内内容" :maxlength="50" show-word-limit clearable></el-input>
                    </el-form-item>
                    <el-form-item label="女：">
                        <el-input v-model="dataForm4.wuman" placeholder="请输入50字以内内容" :maxlength="50" show-word-limit clearable></el-input>
                    </el-form-item>
                    <el-form-item label="儿童：">
                        <el-input v-model="dataForm4.child" placeholder="请输入50字以内内容" :maxlength="50" show-word-limit clearable></el-input>
                    </el-form-item>
                </el-form>
                <div class="btns1 btns2 btns3">
                    <el-button type="primary" @click="addActivity()">保存</el-button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                dataForm1:{
                    storeId:'',//库存数
                },
                dataForm2:{
                    textarea:'',//文案
                    radio:'0',

                },
                dataForm3:{
                    textarea:'',
                    radio:'0',
                },
                dataForm4:{
                    allvalue:'',
                    man:'',
                    wuman:'',
                    child:''
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .flexedConfig{
        .modle{
            width: 100%;
            display: flex;
            flex-direction: column;
            .el-input{
                width: 360px;
            }
            .titleTops{
                width: 100%;
                padding: 12px 0;
                margin-left: 20px;
                font-weight: bold;
            }
            .modleItem{
                width: 100%;
                padding: 40px;
                .btns1{
                    width:100%;
                    display: flex;
                    margin-left: 450px;
                    // justify-content: center;
                    margin-top: 100px;
                }
                .btns2{
                    margin-top: 40px;
                }
                /deep/.el-textarea{
                    width: 360px;
                    .el-input__count{
                        float: right;
                    }
                }
            }
        }
    }
</style>



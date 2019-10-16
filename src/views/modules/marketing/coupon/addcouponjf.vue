<template>
    <div>
        <el-form :model="dataForm" label-width="140px" :rules="dataRule" class="demo-ruleForm" ref="addForm">
            <el-form-item label="优惠券名称：" prop="name">
                <el-input v-model="dataForm.name" type="text" placeholder="请输入50字以内的内容" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="所需积分：" prop="memberPoints">
                <el-input v-model="dataForm.memberPoints" type="text" min="0" max="1000000" placeholder="1000"
                          style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="总发行量：" prop="totalNums">
                <el-input v-model="dataForm.totalNums" type="text" min="0" max="1000000" placeholder="1000"
                          style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="面额：" prop="faceValue">
                <el-input placeholder="20" v-model="dataForm.faceValue" style="width:220px;">
                    <template slot="append">元</template>
                </el-input>
                <div>面值只能是数值，0.01-1000000，限2位小数</div>
            </el-form-item>
            <el-form-item label="领取开始时间：" prop="getStartTime">
                <el-date-picker
                        v-model="dataForm.getStartTime"
                        type="datetime"
                         value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始时间"
                        style="width: 200px">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="领取结束时间：" prop="getEndTime">
                <el-date-picker
                        v-model="dataForm.getEndTime"
                        type="datetime"
                         value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间"
                        style="width: 200px">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="artfromitem" label="使用门槛：" prop="threshold">
                <div>单笔订单满</div>
                <el-input v-model="dataForm.threshold" type="text" max="1000000" placeholder="0"
                          style="width:400px;"></el-input>
                <div>元可用（输入“0”为无门槛优惠券）</div>
            </el-form-item>
            <el-form-item class="artfromitem" label="每人限领：" prop="limitNum">
                <el-input v-model="dataForm.limitNum" type="text" max="1000000" placeholder="1"
                          style="width:400px;"></el-input>
                <div>张 &nbsp;&nbsp;&nbsp;&nbsp; 0代表不限制，每人最多限制5张</div>
            </el-form-item>
            <el-form-item label="有效期：" prop="totalNums">
                <!--            <el-input v-model="dataForm.totalNums" type="number"  max="1000000" placeholder="1000"  style="width:400px;"></el-input>-->
                <el-radio v-model="validityPeriodType" label="0">
                    <span>日期范围</span>&nbsp;
                    <el-date-picker
                            v-model="valuetime"
                             format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @blur='acttime'>
                    </el-date-picker>
                </el-radio>
                <br>
                <el-radio v-model="validityPeriodType" label="1">
                    <span>固定天数</span>&nbsp;
                    <el-input placeholder="20" v-model="dataForm.validityDays" maxlength="3" style="width:220px;">
                        <template slot="append">天</template>
                    </el-input>
                </el-radio>
            </el-form-item>
            <el-form-item label="备注：" prop="bei">
                <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="dataForm.bei"
                        maxlength="300"
                        style="width:400px;">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="goList()">返回</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">
                    {{saveLoading?"提交中...":"确认"}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {addActivityPoint, editActivityPoint, backScanActivity} from '@/api/api'
    import vueFilter from '@/utils/filter'

    var validnumber = (rule, value, callback) => {
        if (value / 1 > 1000000) {
            callback(new Error('请输入1000000以内的数字'))
        } else if (value <= 0) {
            callback(new Error('只能输入大于0的数'))
        } else {
            callback()
        }
    };
    var validmemberPoints = (rule, value, callback) => {
        if (value / 1 > 100000) {
            callback(new Error('请输入100000以内的数字'))
        } else if (value <= 0) {
            callback(new Error('只能输入大于0的数'))
        } else {
            callback()
        }
    };
    var validthreshold = (rule, value, callback) => {
        if (value / 1 > 1000000) {
            callback(new Error('请输入1000000以内的数字'))
        } else if (value <= 0) {
            callback(new Error('只能输入大于0的数'))
        } else {
            callback()
        }
    };
    var validfaceValue = (rule, value, callback) => {
        if (value / 1 > 1000000) {
            callback(new Error('请输入1000000以内的数字'))
        } else if (value <= 0) {
            callback(new Error('只能输入大于0的数'))
        } else if (value.indexOf('.') != -1 && value.substr(value.indexOf('.') + 1).length > 2) {
            callback(new Error('小数点后只能有两位'))
        } else {
            callback()
        }
    };
    export default {
        props: ['type', 'editSatusId'],
        data() {
            return {
                saveLoading: false,
                activeName2: 'first',
                datatextarea: '',
                dataForm: {
                    bei: "",//备注 ,
                    faceValue: "",//面额 ,
                    getEndTime: "",//领取结束时间
                    getStartTime: "",//: 领取开始时间 ,
                    name: "",//优惠券名称 ,
                    threshold: "",//使用门槛 ,
                    totalNums: "",//总发行量 , ,
                    validityDays: "",// 有效天数 ,
                    limitNum: "",//每人限领数量 ,
                    memberPoints: '',//兑换优惠券用的积分数
                    validityPeriodType: "0",//有效期类型，0：日期范围，1：固定天数
                    startTime: '',//生效日期
                    endTime: '',// 截止日期
                },
                validityPeriodType: "0",
                row: "",
                valuetime: "",
                dataRule: {
                    name: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                    getStartTime: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                    getEndTime: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                    limitNum: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                    memberPoints: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                        { validator: validmemberPoints, trigger: 'blur' },
                    ],
                    totalNums: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                        {validator: validnumber, trigger: 'blur'},
                    ],
                    threshold: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                        {validator: validthreshold, trigger: 'blur'},
                    ],
                    faceValue: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                        {validator: validfaceValue, trigger: 'blur'},
                    ],
                    gcParentId: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                    gcSort: [
                        {required: true, message: '必填项不能为空', trigger: 'blur'},
                    ],
                },
                pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.dataForm.getEndTime) {   //先选的结束时间
                            return time.getTime() > new Date(this.dataForm.getEndTime).getTime() || time.getTime() < Date.now() - 8.64e7;
                        } else {//还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
                            return time.getTime() < Date.now() - 8.64e7
                        }

                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        if (this.dataForm.getStartTime) {
                            return time.getTime() < new Date(this.dataForm.getStartTime).getTime() - 8.64e7;//可以选择同一天
                        } else if (!this.dataForm.getStartTime) {
                            return time.getTime() < Date.now() - 8.64e7
                        }
                    }
                },
                value1isshow: false,
                value2isshow: false,
                value1Time: {},
                value2Time: {},
                value2timedisabled: false,
//    startsecond: vueFilter.formHMS(Date.now()),  //当前时间
            }
        },
        components: {},
        created() {
            if (!this.type) {
                this.getInfo();//判断为编辑时获取详情
            } else {
                this.dataForm = {
                    bei: "",//备注 ,
                    faceValue: "",//面额 ,
                    getEndTime: "",//领取结束时间
                    getStartTime: "",//: 领取开始时间 ,
                    name: "",//优惠券名称 ,
                    threshold: "",//使用门槛 ,
                    totalNums: "",//总发行量 , ,
                    validityDays: "",// 有效天数 ,
                    limitNum: "",//每人限领数量 ,
                    memberPoints: '',//兑换优惠券用的积分数
                    validityPeriodType: "0",//有效期类型，0：日期范围，1：固定天数
                    startTime: '',//生效日期
                    endTime: '',// 截止日期
                }
            }
        },
        watch: {
            dataForm: { //监听的对象
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    //选择了开始时间
                    if (newV.getStartTime) {
                        this.value1isshow = true;
                        var currentTime = vueFilter.dateToStr();
                        //选择的是今天
                        if (this.dataForm.getStartTime.substr(0, 10) == currentTime.substr(0, 10)) {
                            this.value1Time = {
                                selectableRange: `${currentTime.substr(11)} - 23:59:59`
                            };
                        } else {
                            this.value1Time = {
                                selectableRange: '00:00:00 - 23:59:59'
                            };
                        }
                    } else {
                        this.value1isshow = false;
                        this.dataForm.value1 = '';
                    }


                    //选择了结束时间
                    if (newV.getEndTime) {
                        this.value2isshow = true;
                    } else {    //清空了结束时间
                        this.value2isshow = false;
                        this.dataForm.value2 = '';
                    }
                }
            },
            // 优惠卷名称
            'dataForm.name': function (newV, oldV) {

                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 100) { //输入字符大于100的时候过滤
                        this.dataForm.name = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            // 总发行量
            'dataForm.totalNums':function(newV,oldV) {

                for(let i=0;i<newV.length;i++){
                    // 只能输入数字
                    if(!/[0-9]/g.test(newV[i])){
                        this.dataForm.totalNums = newV.replace(newV[i],"")
                    }
                }
            },
            // 面额
            'dataForm.faceValue':function(newV,oldV) {

                for(let i=0;i<newV.length;i++){
                    // 只能输入数字和小数点
                    if(!/[0-9|\.]/g.test(newV[i])){
                        this.dataForm.faceValue = newV.replace(newV[i],"")
                    }
                }
            },
            // 使用门槛
            'dataForm.threshold': function (newV, oldV) {

                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字
                    if (!/[0-9]/g.test(newV[i])) {
                        this.dataForm.threshold = newV.replace(newV[i], "")
                    }
                }
            },
            // 所需积分
            'dataForm.memberPoints': function (newV, oldV) {

                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字
                    if (!/[0-9]/g.test(newV[i])) {
                        this.dataForm.memberPoints = newV.replace(newV[i], "")
                    }
                }
            },
            // 没人限领
            'dataForm.limitNum':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 只能输入数字
                    if(!/[0-9]/g.test(newV[i])){
                        this.dataForm.limitNum = newV.replace(newV[i],"")
                    }
                }
            },
            // 备注
            'dataForm.bei': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 600) { //输入字符大于600的时候过滤
                        this.dataForm.bei = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            }

        },
        methods: {
            dateToStr: function (datatime){   //获取当前时间
                var dateTime = datatime || new Date();
                var year = dateTime.getFullYear();
                var month = dateTime.getMonth()+1;//js从0开始取
                var date = dateTime.getDate();
                var hour = dateTime.getHours();
                var minutes = dateTime.getMinutes();
                var second = dateTime.getSeconds();
        
                if(month<10){
                    month = "0" + month;
                }
                if(date<10){
                    date = "0" + date;
                }
                if(hour <10){
                    hour = "0" + hour;
                }
                if(minutes <10){
                    minutes = "0" + minutes;
                }
                if(second <10){
                    second = "0" + second ;
                }
                return year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second;
            },
            //编辑详情接口方法
            getInfo() {
                var obj = {
                    id: this.editSatusId,
                };
                backScanActivity(obj).then((res) => {
                    console.log(res);
                    if (res.code == 200) {
                        this.dataForm = res.data;
                        this.dataForm.validityDays = res.data.validityDays// 有效天数 ,
                        this.dataForm.memberPoints =  res.data.memberPoints//兑换优惠券用的积分数
                        this.validityPeriodType =  res.data.validityPeriodType.toString();//有效期类型，0：日期范围，1：固定天数
                        this.dataForm.startTime = this.dateToStr(new Date(res.data.startTime)) //生效日期
                        this.dataForm.endTime =  this.dateToStr(new Date(res.data.endTime)) // 截止日期 
                        if(res.data.startTime && res.data.endTime){
                            this.valuetime = [res.data.startTime,res.data.endTime]
                        }
                    }
                })
            },
            //返回
            goList() {
                this.$emit('changePage')
            },
            artvalue1time() {
                if (this.dataForm.value1) {
                    this.value2timedisabled = false;
                } else {
                    this.value2timedisabled = true;
                }
            },
            artvalue2time() {
                this.value2timedisabled = false;
                if (this.dataForm.value1 && this.dataForm.getStartTime == this.dataForm.getEndTime) {    //选择了开始时间      日期是同一天
                    this.value2Time = {
                        selectableRange: `${vueFilter.dateToStr(this.dataForm.value1).substr(10)} - 23:59:59`
                    };
                } else if (this.dataForm.value1) {
                    this.value2Time = {
                        selectableRange: `00:00:00- 23:59:59`
                    };
                } else {
                    this.value2Time = {
                        selectableRange: `00:00:00- 23:59:59`
                    };
                    this.value2timedisabled = true;
                    this.$message('请先选择开始时间');
                }
            },
            //开始结束时间
            acttime() {
                this.dataForm.startTime = this.valuetime[0];
                this.dataForm.endTime = this.valuetime[1];
            },
            // 提交
            dataFormSubmit(formName) {
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            bei: this.dataForm.bei,// 备注 ,
                            endTime: this.dataForm.endTime,//截止日期 ,
                            faceValue: this.dataForm.faceValue,//面额 ,
                            getEndTime: this.dataForm.getEndTime,//领取结束时间 ,
                            getStartTime: this.dataForm.getStartTime,//领取开始时间 ,
                            limitNum: this.dataForm.limitNum,//每人限领数量 ,
                            memberPoints: this.dataForm.memberPoints,// 兑换优惠券用的积分数 ,
                            name: this.dataForm.name,//优惠券名称 ,
                            startTime: this.dataForm.startTime,//生效日期 ,
                            threshold: this.dataForm.threshold,//使用门槛 ,
                            totalNums: this.dataForm.totalNums,//总发行量 ,
                            validityDays: this.dataForm.validityDays,//有效天数 ,
                            validityPeriodType: this.validityPeriodType,//有效期类型，0：日期范围，1：固定天数
                        }
                        if(parseInt(this.dataForm.threshold)<=parseInt(this.dataForm.faceValue)) {
                            this.$message({
                                message: "提交失败，面额必须小于使用门槛",
                                type: "error",
                                duration: 1500
                            })
                            return false
                        }else if(parseInt(this.dataForm.limitNum)>parseInt(this.dataForm.totalNums)){
                            this.$message({
                                message: "提交失败，限领数量不能大于总发行量",
                                type: "error",
                                duration: 1500
                            })
                            return false
                        }
                        if (this.editSatusId) obj.id = this.editSatusId//优惠券活动id
                        var fn = this.type ?addActivityPoint:editActivityPoint ;
                        fn(obj).then((res) => {
                            this.loading = false;
                            // alert(JSON.stringify(res));
                            let status = null;
                            if (res.code == "200") {
                                status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
                                this.goList();

                            } else {
                                status = "error";
                            }

                            this.$message({
                                message: res.msg,
                                type: status,
                                duration: 1500
                            })
                        })
                    } else {
                        //console.log('error 添加失败!!');
                        return false;
                    }
                })
            },

        }
    };
</script>
<style lang="scss" scoped>
    .el-input {
        width: 170px;
        height: 40px;
    }

    /*------------------------修改type=number的样式------------------------------------------------*/
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    .artfromitem {
        /deep/ .el-form-item__content {
            display: flex;

            .el-input.el-input--default {
                margin: 0 10px;
            }
        }
    }

    .el-form-item__content > div {
        color: #999999;
    }

    .artvalue12time {
        margin: -55px 0 0 231px;
    }
</style>

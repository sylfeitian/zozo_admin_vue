<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <!-- <el-form-item label="商家ID：">
            <el-input v-model.trim.trim="dataForm.storeId" placeholder="商品ID" clearable></el-input>
        </el-form-item> -->
        <el-form-item  label="商家名称：">
            <el-input v-model.trim.trim="dataForm.storeName" placeholder="商家名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="商家等级：">
            <el-select v-model="dataForm.gradeId" placeholder="请选择">
                <el-option
                    v-for="item in storeGradeList"
                    :key="item.id"
                    :label="item.sgName"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item  label="商家类别：">
            <el-select v-model="dataForm.storeType" placeholder="请选择">
                <el-option
                    v-for="item in storeTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
            <!-- <el-date-picker
                v-model="value4"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束日期">
            </el-date-picker> -->
            <el-date-picker
                v-model="value4"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getDataList()">搜索</el-button>
            <el-button @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
        
    </el-form>
    <el-form>
    	<el-form-item>
        <el-button type="primary" @click="addOrAdit()">新增商户</el-button>
        <el-button type="primary" plain @click="exportHandle()">导出</el-button>
    	</el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
	    <el-table-column
            type="index"
            prop="$index"
            label="序号"
            align="center"
            width="70">
            <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
        </el-table-column>
	    <!-- <el-table-column
	      type="selection"
	      width="70">
	    </el-table-column> -->
		<el-table-column
		    prop="id"
		    label="商户ID"
            align="center"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="storeName"
            width="200"
		    label="商户">
            <template slot-scope="scope">
                <div style="float:left">
                    <span style="width: 40px; height: 40px;margin-right:20px;" v-if="scope.row.storeLogo">
                        <img :src="$imgDomain + scope.row.storeLogo" alt="img" style=" object-fit: contain;width: 40px;height:40px;border-radius:50%;">
                    </span>
                    <span>{{scope.row.storeName}}</span>
                </div>
		    </template>
		</el-table-column>
		<el-table-column
		    prop="account"
            align="center"
		    label="商户管理账号">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
            align="center"
		    label="商家等级">
		</el-table-column>
		<el-table-column
		    prop="createDate"
            align="center"
            width="180"
		    label="创建时间">
		</el-table-column>
        <el-table-column
		    prop="creator"
            align="center"
		    label="商户类别">
            <template slot-scope="scope">
		    	<span>{{scope.row.storeType==2?'普通商户':'自营商户'}}</span>
		    </template>
		</el-table-column>
	    <el-table-column
            width="240"
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
					 <el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>
					 <el-button type="text" size="small" @click="addOrAdit(scope.row.id)">编辑</el-button>
					 <el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
					 <el-button type="text" size="small" @click="changeNumber(scope.row.account)">修改密码</el-button>
		    </template>
	  	</el-table-column>
	</el-table>
	<!-- 分页 -->
    <el-pagination
	    @size-change="pageSizeChangeHandle"
	    @current-change="pageCurrentChangeHandle"
	    :current-page="page"
	    :page-sizes="[10, 20, 50, 100]"
	    :page-size="limit"
	    :total="total"
	    layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 修改密码 -->
    <el-dialog
        title="修改密码"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="storedialog"
        width="30%">
        <el-form :model="numberDataForm" :rules="dataRule" ref="numberDataForm" @keyup.enter.native="numberSubmitHandle()" label-width="120px">
            <el-form-item label="新密码：" prop="newPassword">
                <el-input v-model.trim.trim="numberDataForm.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input v-model.trim.trim="numberDataForm.confirmPassword" type="password"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck">取 消</el-button>
            <el-button type="primary" @click="numberSubmitHandle" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { businessPageUrl } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: businessPageUrl,
          getDataListIsPage: true,
          exportURL: '/admin-api/store/export',
          deleteURL: '/admin-api/store',
          deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
      },
      buttonStatus:false,
      centerDialogVisible:false,
      value4:[],
      breaddata: ["商家系统", "商户管理", "商户列表"],
      dataForm: {
          storeType:'',
          gradeId:''
      },
      numberDataForm:{
        newPassword: '',
        confirmPassword: '',
        username:''
      },
      storeTypes:[
          {value: '',label: '全部'},
          {value: '1',label: '自营商户'},
          {value: '2',label: '普通商户'}
      ],
      storeGradeList:[
          {id:'',sgName:'全部'}
      ],//商家等级列表
    }
  },
  computed: {
    dataRule () {
      var validateComfirmPassword = (rule, value, callback) => {
          console.log(this.numberDataForm.newPassword,value)
        if (this.numberDataForm.newPassword !== value) {
          return callback(new Error(this.$t('updatePassword.validate.comfirmPassword')))
        }
        callback()
      }
      return {
        newPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateComfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Bread
  },
  watch: {
     value4(newval,oldval) {
      console.log(newval,oldval)
      if(newval){
          this.dataForm.startTime = newval[0];
          this.dataForm.endTime = newval[1];
      }else{
          this.dataForm.startTime = '';
          this.dataForm.endTime = '';
      }
    }
  },
  created(){
      let obj = {
            params:{
                page:1,
                limit:100,
            }
        }
      storeGrade(obj).then((res)=>{
          console.log('商家等级',res)
            if(res.code == 200 && res.data.list){
                this.storeGradeList = [...this.storeGradeList,...res.data.list]
            }
      })
  },
  methods: {
        showDetail(id){
	    	this.$emit("showDetail",id);
        },
        addOrAdit(id){
            this.$emit("addOrAdit",id);
        },
        reset() {
            this.value4 = [];
            this.dataForm = {
                storeType:'',
                gradeId:''
            };
            this.getDataList();
        },
        changeNumber(account){
            this.centerDialogVisible = true;
            this.numberDataForm.username = account;
        },
        numberSubmitHandle(){
            this.$refs['numberDataForm'].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.$http.put('/admin-api/store/update/password', this.numberDataForm).then(({ data: res }) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.$message({
                    message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.centerDialogVisible = false
                        }
                    })
                })
            })
        },
        noCheck(){
            this.centerDialogVisible = false
            this.$refs['numberDataForm'].resetFields();//校验隐藏
        },
  }
};
</script>
<style lang="scss">
.storedialog{
    .el-input {
        // width: 280px;
    }
}

</style>

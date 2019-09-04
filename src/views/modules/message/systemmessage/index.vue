<template>
  <div>
  	<Bread :breaddata="breaddata" ></Bread>
	  <el-table
		  	:data="dataForm"
		  	ref='dataList'
		  	border
		  	style="width: 100%"
		  	v-loading="dataListLoading">

			<el-table-column
			    prop="messageTypeName"
			    label="推送类型"
			    align="center">
			</el-table-column>
			<el-table-column
			    prop="isSendInner"
			    label="站内信"
			    align="center">
			    <template slot-scope="scope">
			        <el-switch
					  v-model="scope.row.isSendInner"
					  @change="putState(scope.row.id,scope.row.isSendInner,1)"
					  >
					</el-switch>
					<span class="artblue" @click="show('isSendInner')">模板设置</span>
			    </template>
			</el-table-column>
			<el-table-column
			    prop="isSendUmeng"
			    label="APP推送"
			    align="center">
				<template slot-scope="scope">
					<el-switch
							v-model="scope.row.isSendUmeng"
							@change="putState(scope.row.id,scope.row.isSendUmeng,2)"
							>
					</el-switch>
					<span class="artblue" @click="show('isSendUmeng')">模板设置</span>
				</template>
			</el-table-column>
			<el-table-column
			    prop="isSendSms"
			    label="短信 "
			    align="center">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.isSendSms"
							@change="putState(scope.row.id,scope.row.isSendSms,3)"
							>
					</el-switch>
					<span class="artblue" @click="show('isSendSms')">模板设置</span>
				</template>
			</el-table-column>
		</el-table>
		  <el-dialog title="消息模板设置" :visible.sync="dialogTableVisible">
			  <el-form>
				  <el-form-item label="消息类型：">
					  <span></span>
				  </el-form-item>
				  <el-form-item label="推送方式：">
					  <span></span>
				  </el-form-item>
				  <el-form-item label="标签说明：">
					  <span></span>
				  </el-form-item>
				  <el-form-item label="消息标题：" style="height: 100%!important;">
					  <el-input type="text" placeholder="请输入标题名称"></el-input>
				  </el-form-item>
				  <el-form-item label="消息内容：" style="height: 100%!important;">
					  <el-input  type="textarea" :rows="5" placeholder="请输入内容"></el-input>
				  </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
				  <el-button @click="dialogTableVisible = false">取 消</el-button>
				  <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
			  </div>
		  </el-dialog>

	  <el-dialog title="短信模板设置" :visible.sync="dialogTableVisibleOne">
		  <el-form>
			  <el-form-item label="消息类型：">
				  <span></span>
			  </el-form-item>
			  <el-form-item label="模板编码：" style="height: 100%!important;">
				  <el-select v-model="selectVal" placeholder="请选择" @change="cotrolGoodsShow(selectVal)" style="margin-left: 10px;width: 140px;">
					  <el-option label="批量发布"  value="1"></el-option>
					  <el-option label="取消批量发布" value="2"></el-option>
				  </el-select>
				  <p style="color: #bebebe;line-height: 14px;">请填写在阿里短信后台配置的短信模板编码</p>
			  </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
			  <el-button @click="dialogTableVisibleOne = false">取 消</el-button>
			  <el-button type="primary" @click="dialogTableVisibleOne = false">确 定</el-button>
		  </div>
	  </el-dialog>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Bread from "@/components/bread";
import { getmessagepage, putMessageState } from '@/api/api'
  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
	      	breaddata: ["消息中心", "系统消息设置"],
            dataList: [],
            dataListLoading: false,
            dialogTableVisible: false,
            dialogTableVisibleOne: false,
            dataForm: {},
            selectVal:""
	    };
	},
	created() {
        getmessagepage().then((res)=>{
            if(res.code == 200){
                this.dataForm = res.data;
                this.dataForm.map((v,i)=>{
                    if(v.isSendInner) v.isSendInner = false;
                    else v.isSendInner = true;
                    if(v.isSendSms) v.isSendSms = false;
                    else v.isSendSms  = true;
                    if(v.isSendUmeng) v.isSendUmeng = false;
                    else v.isSendUmeng  = true;
				})
            }
        })
	},
	components: {
		Bread
	},
	methods: {
  	    show(name){
  	        if(name == "isSendSms") this.dialogTableVisibleOne = true;
  	        else this.dialogTableVisible = true;
		},
  	    putState(id,isCheck,type){
            let that = this;
                putMessageState({
					id:id,
					isSendInner:type==1?isCheck?0:1:"",
                    isSendUmeng:type==2?isCheck?0:1:"",
                    isSendSms:type==3?isCheck?0:1:"",
				}).then((res)=>{
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            onClose:function () {
                                getmessagepage().then((res)=>{
                                    if(res.code == 200){
                                        that.dataForm = res.data;
                                        that.dataForm.map((v,i)=>{
                                            if(v.isSendInner) v.isSendInner = false;
                                            else v.isSendInner = true;
                                            if(v.isSendSms) v.isSendSms = false;
                                            else v.isSendSms  = true;
                                            if(v.isSendUmeng) v.isSendUmeng = false;
                                            else v.isSendUmeng  = true;
                                        })
                                    }
                                })
                            }
                        });
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                    }
                })
		}
	}
};
</script>
<style lang="scss" scoped>

 .grayBtnWarp{
 	overflow: hidden;
 	.grayBtnWarp-right{
 		float:right;
 		
 	}
 	/*margin:20px 340px 0;
 	display:flex;
 	justify-content: space-around;*/
 	
 }
/deep/ table{
 	width: auto !important;
 }
/deep/ .el-table__header{
 	width: auto !important;
 }
.grayLine{
	border-bottom: 0!important;
}
.artblue{
	color: blue;
	margin-left: 10px;
}
</style>


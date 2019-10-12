<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="收货人信息"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
            :before-close="closeDialog">

            <el-form
		    		ref="addForm"
		    		@keyup.enter.native="dataFormSubmit('addForm')"
		    		>
                        <el-form-item  label="收货人：">
                               <span v-if="receiverInfo">{{receiverInfo.memberRealName}}</span>
                        </el-form-item><br>

                        <el-form-item  label="手机号码：" >
                           <span v-if="receiverInfo && receiverInfo.mobPhone">{{receiverInfo.mobPhone}}</span>
                        </el-form-item><br>

                        <el-form-item  label="收货地址：" >
                            <span class="grid-content" v-if="receiverInfo">
                                {{receiverInfo.areaInfo}}
                            </span>
                        </el-form-item><br>
						 <el-form-item  label="详细地址：" >
                            <span class="grid-content" v-if="receiverInfo">
                                {{receiverInfo.address}}
                            </span>
                        </el-form-item>

				</el-form>
	</el-dialog>
</template>
<script>
	
	import { orderCancel} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
                visible:false,
			    receiverInfo:""
			}
		},
		components:{
        },
		computed:{},
		mounted(){},
		methods:{
			init (receiverInfo) {
                this.visible = true;
				this.receiverInfo = receiverInfo;
			},
			closeDialog() {
                this.visible = false;
				this.$parent.modelUserInforDetailVisible = false;
			},
		},
	}
</script>
<style scoped>
 .attrList{
	 height: 60px;
	 line-height: 90px;
	 border-top: 2px dotted gainsboro;
	 padding-left: 16px;
 }
 .el-textarea{
	 width: 100%;
 }
</style>

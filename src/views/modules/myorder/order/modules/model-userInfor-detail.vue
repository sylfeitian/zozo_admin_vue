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
	
	import { receiverDetail} from '@/api/api'

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
        // created(){
		//     this.getReceiverDetail()
        // },
		computed:{},
		mounted(){},
		methods:{
			init (id,orderId) {
			    // 此处引起争议 后台说要反过来 加油！！！
                var obj ={
			        id:orderId,
                    orderId: id
                }
                this.visible = true;
                receiverDetail(obj).then((res)=>{
                    if(res.code==200){
                         this.receiverInfo = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
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

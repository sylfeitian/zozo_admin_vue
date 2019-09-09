<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="artborder artfirst">
    	 <span class='arttitle'>今日汇率：</span>
    	 <span class="artnumber">{{rate}}</span>
    	 <span class="artmoney">1日元兑换{{rate}}人民币</span>
    	 <span class="artgreen artpointer" @click="artgethistoryRate">查看历史汇率</span>
    	 <span class="artRefresh artpointer" @click="artrefresh"><i class="el-icon-refresh"></i> &nbsp;刷新</span>
    </div>
    <!-- secound -->
    <div class="artsecound">
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/order.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日订单总数</div>
    	 	 	<div>{{ data && data.todayOrdersNum || 0}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/moneytoday.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日销售总数</div>
    	 	 	<div>{{ data && data.todayAmount || 0}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/money.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>昨日销售总数</div>
    	 	 	<div>{{ data && data.yesterdayAmount || 0}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/trend.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>近7天销售总数</div>
    	 	 	<div>{{ data && data.sevenAmount || 0}}</div>
    	 	 </div>
    	 </div>
    </div>
    <!-- third-->
    <div class="artthird">
    	<div class="arttitle">待处理事务</div>
    	<div class="artcon">
	    	<div class="artitem">
	    		<div class="artitems">
	    			待处理订单<span>（<em>{{ data && data.toProcessOrdersNum || 0  }}</em>）</span>
	    		</div>
	    		<div class="artitems">
	    			待备案商品<span>（<em>{{ data && data.toRecordGoodsNum || 0 }}</em>）</span>
	    		</div>
	    	</div>
	    	<div class="artitem">
	    		<div class="artitems">
	    			待付款订单<span>（<em>{{ data && data.toPayOrdersNum || 0}}</em>）</span>
	    		</div>
	    		<div class="artitems">
	    			待发货订单<span>（<em>{{ data && data.toSendOrdersNum || 0  }}</em>）</span>
	    		</div>
	    	</div>
    	</div>
    </div>
    <!-- forth -->
    <div class="artforth">
    	<div class="artone">
    		<div class="arttitle">商品总览</div>
    			<div class="artitems">
    				<div class="artred">
    					<div>{{ data && data.toUpGoodsNum || 0 }}</div>
    					待上架
    				</div>
    				<div class="artred">
    					<div>{{ data && data.upGoodsNum || 0 }}</div>
    					已上架
    				</div>
    				<div class="artred">
    					<div>{{ data && data.downGoodsNum || 0 }}</div>
    					已下架
    				</div>
    				<div class="artred">
    					<div>{{ data && data.allGoodsNum || 0 }}</div>
    					全部商品
    				</div>
    			</div>
    	</div>
    	<div class="artone">
    		<div class="arttitle">用户总览</div>
    			<div class="artitems">
    				<div class="artred">
    					<div>{{ data && data.todayNewMemberNum || 0}}</div>
    					今日新增
    				</div>
    				<div class="artred">
    					<div>{{ data && data.yesterdayNewMemberNum || 0 }}</div>
    					昨日新增
    				</div>
    				<div class="artred">
    					<div>{{ data && data.monthNewMemberNum || 0 }}</div>
    					本月新增
    				</div>
    				<div class="artred">
    					<div>{{ data && data.memberNum || 0 }}</div>
    					会员总数
    				</div>
    			</div>
    	</div>
    </div>
    <el-dialog title="历史汇率" :visible.sync="dialogTableVisible" width="60%">
    	<list ref="detailCompon"></list>
	</el-dialog>
    
  </el-card>
</template>

<script>
    import { gethomepage, gethomepageRate } from '@/api/api'
    import filter from '@/utils/filter'
    import list from "./list"
    export default {
        data () {
            return {
            	data:null,
            	timer:null,
            	dialogTableVisible: false,
            	rate:'',
            }
        },
       	components: {
		    	list,
		  	},
        watch:{
				},
				created(){
					this.getdata();
				  this.timer = setInterval(()=>{
				  	var currentTime = filter.dateToStr().substr(11,2);
				  	if(currentTime == "06"){
				  		this.getdata();
				  	}
//				  	 console.log(currentTime);
				  },1000)
				},
				mounted(){
					this.getdata();
				},
				beforeDestroy() {
				    if(this.timer) {
				        clearInterval(this.timer);
				    }
				},
        methods: {
        	artgethistoryRate(){
        		this.dialogTableVisible = true;
        		this.$nextTick(()=>{
							this.$refs.detailCompon.init();
						})
        	},
        	artrefresh(){
        		this.getdata();
        	},
        	getdata(){
        		gethomepage().then((res)=>{
        			if(res && res.code == 200){
        				this.data = res.data;
        			}else{
        				this.$message(res.msg)
        			}
        		}).catch(()=>{
        				this.$message(res.msg)
        		})
        		gethomepageRate().then((res)=>{
        			if(res && res.code == 200){
        				console.log(res);
        				this.rate =res.data.rate;
        			}else{
        				this.$message(res.msg)
        			}
        		}).catch(()=>{
        			this.$message(res.msg)
        		})
        	},
        },
    }
</script>

<style lang="scss" scoped>
	.artborder{
		padding-left: 20px;
		border: 1px solid #ccc;
	}
	.artpointer{
		cursor: pointer;
	}
	
	.artfirst{
		height: 50px;
		line-height: 50px;
		.arttitle{
			font-size: 16px;
			font-weight: 700;
		}
		.artnumber{
			margin-left: 20px;
			margin-right: 20px;
			padding: 2px 20px;
			background: #F1DEAB;
		}
		.artmoney{
			color: #ccc;
			font-size: 12px;
		}
		.artgreen{
			margin-left: 20px;
			color: green;
			text-decoration: underline;
			font-size: 12px;
		
		}
		.artRefresh{
			float: right;
			border: 1px solid #ccc;
			margin-top: 12px;
			margin-right: 5px;
			padding: 0 10px;
			height: 25px;
			line-height: 25px;
		}
	}
	
	
	.artsecound{
		margin: 15px 0;
		display: flex;
		justify-content: space-between;
		.artsecoundson{
			padding: 30px 15px;
			width: 23%;
			display: flex;
			.artcon div:nth-of-type(1){
				color: #ccc;
				font-size: 14px;
				margin:10px 0 10px;
			}
			.artcon div:nth-of-type(2){
				font-size: 16px;
			}
			img{
				margin-right: 10px;
				width:60px;
				height: 60px;
			}
		}
		
	}
	
	
	.artthird{
		margin-bottom: 20px;
		border: 1px solid #ccc;
		padding-bottom: 10px;
		.arttitle{
			padding-left: 20px;
			height: 50px;
			line-height: 50px;
			background:#F3F3F3;
			font-size: 14px;
			font-weight: 700;
		}
		.artcon{
				display: flex;
			}
		.artitem{
			padding: 0 30px;
			font-size: 14px;
			.artitems{
				width: 300px;
				display: flex;
				padding: 20px 10px;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				&:hover{
					color: green;
				}
				em{
					color: red;
				}
			}
		}
		
	}
	
	.artforth{
		display: flex;
		justify-content: space-between;
		padding-bottom: 10px;
		.artone{
			width: 49%;
			border: 1px solid #ccc;
		}
		.arttitle{
			padding-left: 20px;
			height: 50px;
			line-height: 50px;
			background:#F3F3F3;
			font-size: 14px;
			font-weight: 700;
			
		}
		.artitems{
			margin: 30px 0;
			display: flex;
			padding: 20px 10px;
			justify-content: space-around;
			.artred{
				font-size: 12px;
				&>div{
					color: red;
					width: 35px;
					text-align: center;
					font-size: 20px;
					margin-bottom: 10px;
				}
				
			}
		}
	}
</style>
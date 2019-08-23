<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="artborder artfirst">
    	 <span class='arttitle'>今日汇率：</span>
    	 <span class="artnumber">0.063</span>
    	 <span class="artmoney">1日元兑换{{}}人民币</span>
    	 <span class="artgreen">查看历史汇率</span>
    	 <span class="artRefresh">刷新</span>
    </div>
    <!-- secound -->
    <div class="artsecound">
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/avatar.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日订单总数</div>
    	 	 	<div>{{200}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/avatar.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日订单总数</div>
    	 	 	<div>{{200}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/avatar.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日订单总数</div>
    	 	 	<div>{{200}}</div>
    	 	 </div>
    	 </div>
    	 <div class="artborder artsecoundson">
    	 	 <img src="@/assets/img/avatar.png" alt="" />
    	 	 <div class="artcon">
    	 	 	<div>今日订单总数</div>
    	 	 	<div>{{200}}</div>
    	 	 </div>
    	 </div>
    </div>
    <!-- third-->
    <div class="artthird">
    	<div class="arttitle">待处理事务</div>
    	<div class="artcon">
	    	<div class="artitem">
	    		<div class="artitems">
	    			待处理订单<span>（<em>10</em>）</span>
	    		</div>
	    		<div class="artitems">
	    			待处理订单<span>（<em>10</em>）</span>
	    		</div>
	    	</div>
	    	<div class="artitem">
	    		<div class="artitems">
	    			待处理订单<span>（<em>10</em>）</span>
	    		</div>
	    		<div class="artitems">
	    			待处理订单<span>（<em>10</em>）</span>
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
    					<div>100</div>
    					待上架
    				</div>
    				<div class="artred">
    					<div>100</div>
    					待上架
    				</div>
    				<div class="artred">
    					<div>100</div>
    					待上架
    				</div>
    				<div class="artred">
    					<div>100</div>
    					待上架
    				</div>
    			</div>
    	</div>
    	<div class="artone">
    		<div class="arttitle">用户总览</div>
    			<div class="artitems">
    				<div class="artred">
    					<div>100</div>
    					待上架
    				</div>
    			</div>
    	</div>
    </div>
    
  </el-card>
</template>

<script>
    
    export default {
        data () {
            return {
            }
        },
        components: {
        },
        watch:{
				},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
	.artborder{
		padding-left: 20px;
		border: 1px solid #ccc;
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
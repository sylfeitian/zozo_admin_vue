<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="商品ID：">
            <el-input v-model="dataForm.goodsId" placeholder="请输入商品ID" clearable maxlength="30" ></el-input>
        </el-form-item>
        <el-form-item label="商品名称：">
            <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button type="primary" @click="addActivity()" plain>添加商品</el-button>
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      @selection-change="dataListSelectionChangeHandle"
      border
	  style="width: 100%">
        <el-table-column 
            type="selection" 
            header-align="center" 
            align="center" 
            width="50">
        </el-table-column>
	    <!-- <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column> -->
		<el-table-column
		    prop="goodsId"
		    label="商品ID"
            align="center"
		    width="200">
		</el-table-column>
        <el-table-column
		    prop="sortNum"
            align="center"
		    label="排序">
		</el-table-column>
		<el-table-column
		    prop="goodsName"
		    label="商品名称">
            <template slot-scope="scope">
                <div class="words">{{scope.row.goodsName}}</div>
		    </template>
		</el-table-column>
		<el-table-column
		    prop="category"
            align="center"
		    label="所属分类">
		</el-table-column>
		<el-table-column
		    prop="price"
            align="center"
		    label="销售价格">
		</el-table-column>
        <el-table-column
		    prop="stock"
            align="center"
		    label="库存">
		</el-table-column>
	    <el-table-column
	   		prop="address"
            align="center"
	    	label="操作"
            width="180">
		    <template slot-scope="scope">
		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

    <!-- 商品弹框 -->
    <el-dialog
        title="添加商品"
        :visible.sync="goodsVisible"
        :close-on-click-modal = "false"
        :before-close="handleClose"
        width="60%">
        <el-form :inline="true" :model="goodsdataForm">
            <el-form-item label="商品名称：">
                <el-input v-model="goodsdataForm.storeId" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="选择分类：">
                <el-cascader
                    :options="classList"
                    v-model="selectedOptions"
                    change-on-select
                    :clearable="true"
                    :props="props"
                    @change="handleChangeOut">
                </el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getgoodsList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="goodsreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table

            :data="goodsdataList"
            v-loading="goodsdataListLoading"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="商品名称"
                width="240">
            </el-table-column>
            <el-table-column
                prop="idJp"
                label="商品ID">
            </el-table-column>
            <el-table-column
                prop="sellPrice"
                label="价格">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope" v-if="goodsdataList.length!=0">
                    <span v-if="(scope.$index+1+(parseInt(pages)-1)* parseInt(limits)-1) < goodsdataList.length">
                        <!-- {{goodsdataList[(scope.$index+1+(parseInt(pages)-1)* parseInt(limits)-1)].checked}} -->
                        <el-checkbox v-model="goodsdataList[(scope.$index+1+(parseInt(pages)-1)* parseInt(limits)-1)].checked" @change="gettem($event,scope.row,(scope.$index+1+(parseInt(pages)-1)* parseInt(limits)-1))"></el-checkbox>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="pageSize"
            @current-change="pageCurrent"
            :current-page="pages"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limits"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { goodsCarlist,goodsCarlistDelete } from '@/api/url'
    import { goodsListVisible,categoryCnList,addGoodscarList } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
        mixins: [mixinViewModule],
        components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: goodsCarlist,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/store/export',
                    deleteURL: goodsCarlistDelete,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                goodsdataList:[],
                buttonStatus:false,
                goodsVisible:false,
                goodsdataListLoading:false,
                dataForm: {
                    goodsName:'',
                    goodsId:'',
                },
                goodsdataForm:{
                    goodsName:'',
                    categoryId:'',
                },
                selectedOptions:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                classList:[],
                checkList:[],
                trueList:[],
                pages:1,
                limits:10,
                totals:0,
                breaddata: ["配置管理", "购物车推荐商品配置"],
            }
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataForm.goodsId':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataForm.goodsId = newV.replace(newV[i],"")
                    }
                }
            }
        },
        created(){
            this.getClassList();
            this.demo();
        },
        methods: {
            //重置
            reset() {
                this.dataForm = {};
                this.getDataList();
            },
            getData(){
                this.page =1;
                this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(id){
                this.goodsVisible = true;
                this.getgoodsList();
            },
            //商品弹框列表查询
            getgoodsList(){
                this.goodsdataListLoading = true;
                this.checkList = [];
                this.trueList = [];
                goodsListVisible({
                        params: {
                            page:this.pages,
                            limit:this.limits,
                            goodsName:this.goodsdataForm.goodsName,
                            categoryId:this.goodsdataForm.categoryId,
                        }
                    }).then((res)=>{
                    // console.log('数据',res)
                    if(res.code == 200){
                        this.goodsdataListLoading = false;
                        this.totals = Number(res.data.total);
                        this.goodsdataList = res.data.list;
                        this.goodsdataList.map(item=>{
                            item.checked = false;
                        })
                        console.log('数据',this.goodsdataList)

                    }
                })
            },
            //商品弹框重置
            goodsreset(){
                this.pages = 1;
                this.limits = 10;
                this.goodsdataForm = {
                    goodsName : '',
                    categoryId : ''
                };
                this.selectedOptions = [];
                this.getgoodsList()
            },
            //分类联动
            getClassList(){
                categoryCnList({}).then((res)=>{
                    if(res.code == 200){
                        this.classList = res.data;
                        let i,j;
                        for(i=0;i<this.classList.length;i++){
                            if(this.classList[i].list&&this.classList[i].list.length==0){
                                this.classList[i].list = null
                            }
                            if(this.classList[i].list&&this.classList[i].list.length>0){
                                let aa = this.classList[i].list;
                                for(j=0;j<aa.length;j++){
                            　　　　 if(aa[j].list&&aa[j].list.length==0){
                                        aa[j].list = null;
                                    }
                            　　}; 
                            }
                        };
                    }
                })
            },
            handleChangeOut(val){
                console.log(val)
                this.goodsdataForm.categoryId = val[val.length-1];
            },
            // 关闭弹框
            handleClose(done){
                if(this.trueList.length!=0){
                    let arry1 = [];
                    this.trueList.map(item=>{
                        arry1.push({goodsId:item.idJp,sortNum:255,goodsName:item.name,price:item.sellPrice,category:item.firstCategory+item.goodsTypeName})
                    })
                    addGoodscarList({list:JSON.stringify(arry1)}).then((res)=>{
                        console.log('添加结果',res)
                        if(res.code == 200){
                            this.$message.success('添加成功');
                            done();
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                }else{
                    done();
                }
                            done();

            },
            //单选商品项
            gettem($event,item,index){
                console.log($event,item,index)
                this.goodsdataList[index].checked = $event;
                this.goodsdataList = [].concat(this.goodsdataList) ;
                // this.$set(this.goodsdataList[index],"checked", $event);
                this.checkList.push(item);
                let i,j,flag
                if($event == true){
                    for(i=0;i<this.checkList.length;i++){
                        flag = true;
                    　　for(j=0;j<this.trueList.length;j++){
                    　　　　if(this.checkList[i].idJp == this.trueList[j].idJp){
                    　　　　　　flag = false;
                    　　　　};
                    　　}; 
                    　　if(flag){
                            this.trueList.push(this.checkList[i]);
                    　　};
                    };
                }else{
                    let aa = item.idJp;
                    this.trueList.map((item,index)=>{
                        if(item.idJp==aa){
                            this.trueList.splice(index,1); 
                        }
                    })
                }
                console.log(this.trueList)
            },
            // 弹框分页, 每页条数
            pageSize(val) {
                this.pages = 1
                this.limits = val
                this.getgoodsList()
            },
            // 弹框分页, 当前页
            pageCurrent(val) {
                this.page = val
                this.getgoodsList()
            },



            demo(){
                function placeholderPic(){
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize=w/20+'px';
                }
                    placeholderPic();
                window.onresize=function(){
                    placeholderPic();
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog{
    .el-input {
        width: 300px;
    }
}
/deep/ .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

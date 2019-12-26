<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="活动场次：">
            <el-input v-model.trim="dataForm.events" placeholder="请输入活动场次"></el-input>
        </el-form-item>
        <el-form-item label="活动时间：">
		        <el-date-picker
			        v-model="valuetime"
			        type="datetimerange"
			        align="right"
	      			unlink-panels
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd HH:mm:ss"
                	@blur='acttime'>
            </el-date-picker>
        </el-form-item>
        <el-form-item  label="活动状态：">
            <el-select v-model="dataForm.state" clearable  placeholder="请选择">
                <el-option
                    v-for="item in activitesstates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="店铺名称：">
			<el-select
			v-model="dataForm.storeId"
			filterable
			clearable
			placeholder="请输入店铺名称"
			:loading="loading"
			@change="changeStore"
			>
				<el-option
					v-for="(item,index) in selectStoreOption"
					:key="item.index"
					:label="item.storeName"
					:value="item.id"
				></el-option>
			</el-select>
		</el-form-item>
        <el-form-item label="商品ID：">
            <el-input v-model.trim="dataForm.spuIdJp" placeholder="请输入spuID" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称：">
			<el-select
			v-model="dataForm.brandId"
			filterable
			clearable
			placeholder="请输入品牌名称"
			:loading="loading"
			@change="changeBrand"
			>
				<el-option
					v-for="(item,index) in selectBrandOption"
					:key="item.id"
					:label="item.brandName"
					:value="item.id"
				></el-option>
			</el-select>
		</el-form-item>
        <!-- </el-scrollbar> -->
        <el-form-item>
            <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn" type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%;margin-top: 10px;">
	  <el-table-column
	    	type="index"
		    prop="$index"
			align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
          {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
        </template>
	    </el-table-column>
		<el-table-column
		    prop="events"
		    label="活动场次"
		    width="180"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.events}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    label="活动结束时间"
			width="280"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.startTime}}
					<span>~</span>
					{{scope.row.endTime}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="storeCnt"
		    label="活动店铺数"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.storeCnt}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="goodsCnt"
		    label="活动商品数（spu）"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.goodsCnt}}
				</div>
			</template>
		</el-table-column>
        <el-table-column
		    prop="state"
		    label="活动状态"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.state==0" type="info">未开始</el-tag>
				<el-tag v-if="scope.row.state==1" type="success">进行中</el-tag>
				<el-tag v-if="scope.row.state==2" type="warning">已结束</el-tag>
			</template>
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作"
			align="center"
			width="250">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="showDetail(scope.row)">查看商品</el-button>
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
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { getseckillJpUrl } from '@/api/url'
import { searchStoreName,searchBrandName } from '@/api/api'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: getseckillJpUrl,
          getDataListIsPage: true,
        //   exportURL: '/admin-api/store/export',
        //   deleteURL: deleteActivity,
          deleteIsBatch: false,
          deleteIsBatchKey: 'id'
      },
      dataForm: {
      	events:null,
      	startTime:null,
      	endTime:null,
      	state:null,
      	storeId:null,
      	spuIdJp:null,
      	brandId:null,
      },
      activitesstates: [{ id: '', name: "全部" },{ id: 0, name: "未开始" },{ id: 1, name: "进行中" },{ id: 2, name: "已结束" }],
      breaddata: ["营销管理", "限时折扣"],
      valuetime:[],
      selectStoreOption: [],
      selectBrandOption: [],
      loading: false,
    }
  },
  components:{
	Bread,
  },
  created(){
	this.backScan();
    this.backScan1();
  },
  watch: {
    // ID类搜索框仅可输入数字、英文，最多可输入30个字符
    "dataForm.spuIdJp": function(newV, oldV) {
      for (let i = 0; i < newV.length; i++) {
        if (!/[a-zA-Z0-9\s]/.test(newV[i])) {
          this.dataForm.spuIdJp = newV.replace(newV[i], "");
        }
      }
      if(newV.length>30){
        this.dataForm.spuIdJp = newV.substr(0,30)
      }
    },
    'dataForm.events':function(newV,oldV) {
      var chineseCount = 0,characterCount = 0;
      for (let i = 0; i < newV.length; i++) {
        if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
          chineseCount = chineseCount + 2;
        } else { //字符
          characterCount = characterCount + 1;
        }
        var count = chineseCount + characterCount;
        if (count > 300) { //输入字符大于300的时候过滤
          this.dataForm.events = newV.substr(0,(chineseCount/2+characterCount)-1)
        }
      }
    },
    'dataForm.brandId':function(newV,oldV) {
        var chineseCount = 0,characterCount = 0;
        for (let i = 0; i < newV.length; i++) {
            if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                chineseCount = chineseCount + 2;
            } else { //字符
                characterCount = characterCount + 1;
            }
            var count = chineseCount + characterCount;
            if (count > 300) { //输入字符大于300的时候过滤
                this.dataForm.brandId = newV.substr(0,(chineseCount/2+characterCount)-1)
            }
        }
	},
	'dataForm.storeId':function(newV,oldV) {
        var chineseCount = 0,characterCount = 0;
        for (let i = 0; i < newV.length; i++) {
            if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                chineseCount = chineseCount + 2;
            } else { //字符
                characterCount = characterCount + 1;
            }
            var count = chineseCount + characterCount;
            if (count > 300) { //输入字符大于300的时候过滤
                this.dataForm.storeId = newV.substr(0,(chineseCount/2+characterCount)-1)
            }
        }
	},
	valuetime(val){
      if(!val){
          this.dataForm.startTime = '';
          this.dataForm.endTime = '';
      }
	}
  },
  methods: {
	getData () {
		this.page =1;
		this.getDataList();
	},
	//回显
	backScan() {
		searchStoreName().then(res => {
			if (res.code == 200) {
			this.selectStoreOption = res.data;
			} else {
			}
		});
	},
	backScan1() {
		searchBrandName().then(res => {
			if (res.code == 200) {
			this.selectBrandOption = res.data;
			} else {
			}
		});
	},
	showDetail(row){
		this.$emit("showDetail",row);
	},
	// 重置
	reset() {
		this.dataForm.startTime = '';
		this.dataForm.endTime = '';
		this.dataForm.events = '';
		this.dataForm.state = '';
		this.dataForm.storeId = '';
		this.dataForm.spuIdJp  = '';
		this.dataForm.brandId  = '';
		this.valuetime = [];
		this.getData();
	},
	// 开始结束时间
	acttime(){
		this.dataForm.startTime = this.valuetime[0];
		this.dataForm.endTime = this.valuetime[1];
	},
	//下拉改变时触发
	changeStore(val) {
		this.$set(this.dataForm, "storeId", val);
		this.selectStoreOption = [].concat(this.selectStoreOption);
	},
	changeBrand(val) {
		this.$set(this.dataForm, "brandId", val);
		this.selectBrandOption = [].concat(this.selectBrandOption);
	},
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.cell div{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

</style>

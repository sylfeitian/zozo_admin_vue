<template>
  <div v-if="isList" class="goodssales">
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      class="grayLine topGapPadding"
      :model="dataForm"
    >
      <el-form-item label="会员账号：">
          <el-input v-model.trim="dataForm.memberName" placeholder="请输入会员账号" clearable></el-input>
      </el-form-item>

      <el-form-item label="订单号：">
          <el-input v-model.trim="dataForm.orderSn" placeholder="请输入订单号" clearable></el-input>
      </el-form-item>

      <el-form-item label="skuid：">
          <el-input v-model.trim="dataForm.goodsCsIdJp" placeholder="请输入skuid" clearable maxlength="30" ></el-input>
      </el-form-item>

      <el-form-item label="商品名称：">
          <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
      </el-form-item>

      <el-form-item label="尺码感受：">
           <el-select
		          v-model="dataForm.sizeFeeling"
		          placeholder="请选择"
		          loading-text="加载中···">
                <el-option label="全部" value=""></el-option>
                <el-option label="合适" value="0"></el-option>
                <el-option label="偏大" value="1"></el-option>
                <el-option label="偏小" value="2"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="评价时间：">
          <el-date-picker
            v-model="timeArr"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="left"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
      </el-form-item>

      <el-form-item label="订单评价：">
          <el-select
		          v-model="dataForm.access"
		          placeholder="请选择"
		          loading-text="加载中···">
              <el-option label="全部" value=""></el-option>
              <el-option label="超赞" value="0"></el-option>
              <el-option label="一般" value="1"></el-option>
              <el-option label="满意" value="2"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="质量星级：">
          <el-select
		          v-model="dataForm.qualityGrade"
		          placeholder="请选择"
		          loading-text="加载中···">
              <el-option label="全部" value=""></el-option>
              <el-option label="1星" value="1"></el-option>
              <el-option label="2星" value="2"></el-option>
              <el-option label="3星" value="3"></el-option>
              <el-option label="4星" value="4"></el-option>
              <el-option label="5星" value="5"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="颜值星级：">
         <el-select
		          v-model="dataForm.faceValueGrade"
		          placeholder="请选择"
		          loading-text="加载中···">
              <el-option label="全部" value=""></el-option>
              <el-option label="1星" value="1"></el-option>
              <el-option label="2星" value="2"></el-option>
              <el-option label="3星" value="3"></el-option>
              <el-option label="4星" value="4"></el-option>
              <el-option label="5星" value="5"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item>
        <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
        <el-button class="btn" type="primary" plain @click="reset()" >重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- <el-form>
    	<el-form-item style="display:block">
          <el-button class="btn" @click="deleteHandle()" type="danger" plain>批量删除</el-button>        
      </el-form-item>
    </el-form> -->
    <br>
     <el-table
      width="100%"
      :data="dataList"
      @selection-change="handleSelectionChange"
      v-loading="dataListLoading"
      ref="multipleTable"
      style="width: 100%;maigin-top:20px;"
    > 
     <el-table-column type="selection" width="70" align="center"></el-table-column>
      <el-table-column
	  		type='index'
	  	  prop="$index"
	    	label="序号"
				align="center"
	    	width="70">
	    	<template slot-scope="scope">
          {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
        </template>
	  	</el-table-column>      
      <el-table-column prop="memberName" label="会员账号" align="center">
          <template slot-scope="scope">
              <div :title="scope.row.memberName">
                  {{scope.row.memberName}}
              </div>
          </template>
      </el-table-column>
      <el-table-column prop="orderSn" label="订单号" align="center" min-width="150"></el-table-column>
      <el-table-column prop="memberName" label="商品主图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl | filterImgUrl"  style="width:60px;height:60px" alt="">
          </template>
      </el-table-column>
      <el-table-column prop="goodsCsIdJp" label="skuid"  align="center" width="200"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="155" align="center">
          <template slot-scope="scope">
              <div :title="scope.row.goodsName">
                  {{scope.row.goodsName}}
              </div>
          </template>
      </el-table-column>
      <el-table-column prop="goodsSpec" label="规格" align="center" ></el-table-column>
      <el-table-column prop="access"    label="订单评价" align="center" >
          <template slot-scope="scope">
            <span v-if="scope.row.access==0">超赞</span>
            <span v-else-if="scope.row.access==1">一般</span>
            <span v-else-if="scope.row.access==2">满意</span>
            

          </template>
      </el-table-column>

       <el-table-column prop="evaluateState" width="210" label="评价星级" align="center" >
          <template slot-scope="scope">
            <!--<span v-if="scope.row.sizeFeeling==0">合适</span>
            <span v-else-if="scope.row.sizeFeeling==1">偏大</span>
            <span v-else-if="scope.row.sizeFeeling==2">偏小</span>-->
           	<div>
           		<span style="float:left;">质量：</span>
           		<el-rate
						  v-model="scope.row.qualityGrade "
						  disabled
						  show-score
						  text-color="#ff9900">
						</el-rate>
           	</div>
           	<div>
           		<span style="float:left;">颜值：</span>
           		<el-rate
						  v-model="scope.row.faceValueGrade "
						  disabled
						  show-score
						  text-color="#ff9900">
						</el-rate>
           	</div>
           	<div>
           		<span style="float:left;">舒适度：</span>
           		<el-rate
						  v-model="scope.row.comfortGrade "
						  disabled
						  show-score
						  text-color="#ff9900">
						</el-rate>
           	</div>
            
          </template>
       </el-table-column>

       <el-table-column prop="sizeFeeling" label="尺码感受" align="center" >
           <template slot-scope="scope">
            <span v-if="scope.row.sizeFeeling==0">合适</span>
            <span v-else-if="scope.row.sizeFeeling==1">偏大</span>
            <span v-else-if="scope.row.sizeFeeling==2">偏小</span>
          </template>
      </el-table-column>

      <el-table-column prop="evaluateContent" label="评论内容" align="center" :show-overflow-tooltip="true" min-width="200"> 
      		<template slot-scope="scope">
      			{{scope.row.evaluateContent ? 'scope.row.evaluateContent' : '"此用户没有填写评论"'}}
      		</template>
      </el-table-column>

      <el-table-column prop="createDate" label="评论时间" width="155"  align="center">
          <template slot-scope="scope">
              <div :title="scope.row.createDate">
                  {{scope.row.createDate}}
              </div>
          </template>
      </el-table-column>

      <el-table-column label="操作" min-width="100" align="center" width="120">
        <template slot-scope="scope">
          <el-button class="artdanger" size="mini" type="text" @click="delEva( scope.row.id)">删除</el-button>
        </template>
      </el-table-column> 

    </el-table>
      <div class="bottomFun">
          <div class="bottomFunLeft">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-button @click="delEvas" style="margin-left: 20px;"  type="primary" >批量删除</el-button>
          </div>
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
  </div>
  <!-- <evaDet v-else @changeState="changeModel" :evaDetails="evaDetails"></evaDet> -->
</template>
<script>
import Bread from "@/components/bread";
// import evaDet from "./evaDet.vue";
import { goodseva, deleva } from "@/api/url";
import { msgReply, changeStatus, evaDets,evaDel,evaDels } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: goodseva,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: deleva,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      breaddata: ["订单管理", "评论管理"],
      dataForm: {
        memberName: "",//会员账号
        orderSn:'',//订单号
        goodsCsIdJp: "",//skuId
        goodsName: "",//商品名称
        sizeFeeling: "",//尺码感受 0合适 1偏大 2偏小
        startTime: "",//评价开始时间
        endTime: "",//评价结束时间
        qualityGrade: "",//	质量星级 1（1星） 2（2星） 3（3星） 4（4星） 5（5星）
        comfortGrade: "",//	舒适度星级 1（1星） 2（2星） 3（3星） 4（4星） 5（5星）
        faceValueGrade: "",//颜值星级 1（1星） 2（2星） 3（3星） 4（4星） 5（5星）
        access:'',//'订单评价(0超赞、1一般、2满意)',
      },
      evaDetails: "", //评价详情
      dataListLoading: false,
      totalPage: 0,
      isList: true, //列表页 false-详情页
      params: {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      },
      timeArr: "", //下单时间
      dataList: [],
        checkAll: false,
        multipleSelection:[],
    };
  },
  created() {},
  components: { 
    Bread, 
    // evaDet 
  },
    // ID类搜索框仅可输入数字、英文，最多可输入30个字符
    watch:{
        'dataForm.goodsCsIdJp':function(newV,oldV) {
            for(let i=0;i<newV.length;i++){
                if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                    this.dataForm.goodsCsIdJp = newV.replace(newV[i],"")
                }
            }
            if(newV.length>30){
                this.dataForm.goodsCsIdJp = newV.substr(0,30)
            }
        }
    },
  methods: {
    //详情
    handleEdit(index) {
      const obj = { id: index.id };
      evaDets(obj).then(res => {
        if (res.code == 200) {
          this.evaDetails = res.data;
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
      this.isList = false;
    },
    //返回上一级
    changeModel() {
      this.isList = !this.isList;
    },
    //条件查询
    getData() {
      this.dataForm.startDate = this.timeArr && this.timeArr[0];
      this.dataForm.endDate = this.timeArr && this.timeArr[1];
      this.page = 1;
      this.limit = 10;
      this.getDataList();
    },
    //重置
    reset() {
      this.timeArr = [];
      this.dataForm = {};
      this.page = 1;
      this.limit = 10;
      this.getDataList();
    },
    //评价回复
    reply(index) {
      this.$prompt("回复内容", "回复", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const obj = {
            id: index.id,
            content: value
          };
          msgReply(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "取消回复"
          // });
        });
    },
    //批量显示/显示
    changeShow(id) {
      if (id == undefined && this.dataListSelections.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择批量处理的数据"
        });
        return false;
      }
      const arrId = [];
      this.dataListSelections.forEach(function(val, index, arr) {
        arrId.push(val.id);
      });
      this.$confirm("您确认显示所有选中评价吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const obj = {
            ids: id == null ? arrId : [id],
            state: 0
          };
          changeStatus(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: "修改失败!"
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消"
          // });
        });
    },
    //批量隐藏/隐藏
    changeHide(id) {
      if (id == undefined && this.dataListSelections.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择批量处理的数据"
        });
        return false;
      }
      const arrId = [];
      this.dataListSelections.forEach(function(val, index, arr) {
        arrId.push(val.id);
      });
      this.$confirm("您确认隐藏所有选中评价吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const obj = {
            ids: id == null ? arrId : [id],
            state: 1
          };
          changeStatus(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: "修改失败!"
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消"
          // });
        });
    },
      delEva(id){
          var obj = {
              "id": id,
          }
          this.$confirm('是否删除该评论?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              evaDel(obj).then((res)=>{
                  if(res.code==200){
                      this.getDataList();
                      this.$message({
                          message:res.data,
                          type: 'success',
                          duration: 1500,
                      })
                  }else{
                      this.$message({
                          message:res.data,
                          type: 'error',
                          duration: 1500,
                      })
                  }
              })
          }).catch(() => {});
      },
      getIds(){
          var ids= [];
          this.multipleSelection.forEach((item,index)=>{
              if("object" == typeof(item)){
                  ids.push(item.id);
              }
          })
          return ids;
      },
      delEvas(){
          var ids = this.getIds();
          var obj = {
              "ids": ids,
          }
          this.$confirm('是否删除所选评论?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              evaDels({data:obj}).then((res)=>{
                  if(res.code==200){
                      this.getDataList();
                      this.$message({
                          message:res.data,
                          type: 'success',
                          duration: 1500,
                      })
                  }else{
                      this.$message({
                          message:res.data,
                          type: 'error',
                          duration: 1500,
                      })
                  }
              })
          }).catch(() => {});
      },
      handleSelectionChange(val) {
          this.multipleSelection = val;
          if(this.multipleSelection.length == this.dataList.length) this.checkAll = true;
          else this.checkAll = false;
      },
      handleCheckAllChange(val) {
          if(val) this.$refs.multipleTable.toggleAllSelection();
          else this.$refs.multipleTable.clearSelection();
      },
  }
};
</script>
<style lang="scss" scoped>
     /deep/ .cell{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /*/deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/
     .bottomFun {
         display: flex;
         justify-content: space-between;
         align-items: center;

         .bottomFunLeft {
             width: 450px;
             display: flex;
             align-items: center;
         }
     }
</style>

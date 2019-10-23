<template>
    <div class="addListGoodsPages">
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-form
            :inline="true"
            ref="dataForm"
            class="grayLine topGapPadding"
            :model="dataForm"
        >
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.name" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="选择分类：">
                <!-- <el-cascader
                        :show-all-levels="false"
                        :options="selectCategoryOption"
                        clearable
                        @change="handleChange"></el-cascader> -->
                <el-cascader
                  :options="selectCategoryOption"
                  v-model="classList"
                  change-on-select
                  :clearable="true"
                  :props="props"
                  @change="handleChange">
            </el-cascader>
            </el-form-item>
            <el-form-item label="商品货号：">
                <el-input v-model.trim="dataForm.id" placeholder="请输入spu编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model.trim="dataForm.storeName" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model.trim="dataForm.brandName" placeholder="请输入品牌名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button class="btn" type="primary" plain @click="reset()">重置</el-button>
            </el-form-item>
            <br>
            <el-form-item>
                <el-button type="primary" @click="showDetail(activityId)">查看商品</el-button>
                <!-- <el-button type="primary"   @click="editGoods('asassasasasasa')">修改</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="dataList" v-loading="dataListLoading" border="" style="width: 100%">
            <!-- <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
                {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
            </el-table-column>-->
            <el-table-column prop="goodsIdJp" label="商品id" width="180" align="center"></el-table-column>
            <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="sellPrice" label="销售价格" align="center"></el-table-column>
            <el-table-column prop="goodsTypeName" label="所属分类" align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" width="180" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="cartLimit" label="日本限购数量" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="cancelIt(scope.row.id,activityId)"
                        v-if="scope.row.selfActivityState==1 && scope.row.activityState ==1"
                    >取消选择</el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.selfActivityState==0 && scope.row.activityState ==0"
                        @click="editGoods(scope.row.id,'creat')"
                    >选择</el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.activityState==0"
                        @click="editGoods(scope.row.id,'update')"
                    >修改</el-button>
                    <span
                        v-if="scope.row.activityState==1  && scope.row.selfActivityState==0"
                    >与其他活动冲突</span>
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
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <!-- 修改弹框 -->
        <el-dialog
            :visible.sync="editVisible"
            :close-on-click-modal="false"
            :validate-on-rule-change="false"
            :show-close="false"
            class="editDialog"
            width="70%"
            @close="closeDialog"
        >
            <el-form :model="editDataForm" :rules="dataRule" ref="editDataForm" label-width="82px">
                <div class="goodsPresent">
                    <!-- <img :src="goodsMain.mainImageUrl" alt=""> -->
                    <img :src="goodsMain.mainImageUrl || defaultImg" :onerror="defaultImg">
                    <!-- <div slot="placeholder" class="image-slot">加载中
                            <span class="dot">...</span>
                    </div>-->
                    <div class="goodsPresentModle">
                        <div class="goodsTitle">{{goodsMain.name}}</div>
                        <div class="goodsmoney">￥{{goodsMain.sellPrice}}</div>
                        <div class="goodsClass">
                            <el-form-item class="number" label="秒杀价格：" prop="number">
                                <el-input
                                    v-model="editDataForm.number"
                                    :max="goodsMain.sellPrice*1"
                                    :min="0"
                                    type="number"
                                ></el-input>输入的价格将作为秒杀销售价
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-table
                    :data="editDataForm.goodsSpecList"
                    v-loading="dataListLoading"
                    @row-click="onRowClick"
                    border=""
                    style="width: 100%"
                >
                    <el-table-column prop="id" label="skuID" width="120" align="center"></el-table-column>
                    <el-table-column prop="specInfo" label="规格" width="180" align="center">
                    </el-table-column>
                    <el-table-column label="活动库存" width="180" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                class="specError"
                                :prop="'goodsSpecList.'+ scope.$index + '.activityQuantity' "
                                :rules="dataRule.activityQuantity"
                            >
                                <el-input
                                    v-model="scope.row.activityQuantity"
                                    @change="changeQuantity"
                                    @input="watchkc(scope.$index,$event)"
                                    :maxlength="6"
                                    :min="0"
                                    type="text"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cartLimit" label="日本限购数量" width="120" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                    class="specError japane"
                            >
                                <el-input
                                        v-model="scope.row.cartLimit"
                                        type="text"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="每人限购" width="220" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                class="specError"
                                :prop=" 'goodsSpecList.' + scope.$index + '.personLimit' "
                                :rules="dataRule.personLimit"
                            >
                                <el-input
                                    v-model="scope.row.personLimit"
                                    @change="changeLimit"
                                    @input="watchxg(scope.$index,$event)"
                                    :maxlength="6"
                                    :max="scope.row.cartLimit==0?'999999':scope.row.cartLimit"
                                    :min="0"
                                    type="text"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" min-width="120" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="changeAll(scope.row)"
                            >适用于全部规格</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noCheck('editDataForm')">取 消</el-button>
                <el-button type="primary" @click="subEdit('editDataForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { businessPageUrl } from "@/api/url";
import {
  getdatacategory,
  seckillProDet,
  seckillProSave,
  seckillProRemove,
  seckillProEdit
} from "@/api/api";
import { addSckillPro} from "@/api/url";
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  props: ["activityId"],
  components: { Bread },
  data() {
    var validnumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("必填项不能为空"));
      } else if (Number(value) > this.moneyNum) {
        callback(new Error("秒杀价格不能超过销售价"));
      } else {
        callback();
      }
    };
    var quantityNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("活动库存不能为空"));
      } else if (Number(value) == 0) {
        callback(new Error("活动库存不得为0"));
      } else if (Number(value) >= 1000000) {
        callback(new Error("活动库存不得大于999999"));
      } else {
        callback();
      }
    };
    var limitNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("每人限购不能为空"));
      } else if (Number(value) == 0) {
        callback(new Error("每人限购不得为0"));
      } else if (this.isLimit == 0) {
        if (Number(value) >= 1000000) {
          callback(new Error("每人限购不得大于999999"));
        } else {
          callback();
        }
      } else if (this.isLimit != 0 && Number(value) > this.isLimit) {
        callback(new Error("每人限购不得大于日本限购数量"));
      } else {
        callback();
      }
    };
    return {
      mixinViewModuleOptions: {
        getDataListURL: addSckillPro,
        activatedIsNeed: false, 
        getDataListIsPage: true,
        exportURL: "/admin-api/store/export",
        deleteURL: "/admin-api/store",
        deleteIsBatch: true
      },
      classList:[],
      selectCategoryOption: [], //选择分类集合
      defaultImg:
        'this.src="' + require("../../../../assets/img/default.png") + '"', //默认图地址
      dataForm: {
        name: "",//商品名称
        id: "",//商品货号
        brandName: "",//品牌名称
        categoryId: "",//分类id
        storeName: "" //店铺名称
      },
      isLimit: "", //当前选中行的日本限制数量
      multipleSelection: [],
      goodsMain: "", //商品主数据
      goodsSpecList: [], //商品sku集合
      breaddata: ["营销管理", "秒杀活动", "添加商品"],
      editVisible: false, //弹框状态
      buttonStatus: false,
      moneyNum: Number,
      action: "", //当前操作，create 选择  update 修改
      editDataForm: {
        number: "",
        activityQuantity: "",
        personLimit: "",
        goodsSpecList: ""
      },
      limit: 10,
      page: 1,
      props: {
            label:'name',
            value: 'id',
            children:'list'
      },
      dataRule: {
        number: [
          {
            required: true,
            message: "秒杀价格不能为空",
            trigger: ["blur", "change"]
          },
          { validator: validnumber, trigger: ["blur", "change"] }
        ],
        activityQuantity: [
          {
            required: true,
            message: "活动库存不能为空",
            trigger: ["blur", "change"]
          },
          { validator: quantityNumber, trigger: ["blur", "change"] }
        ],
        personLimit: [
          {
            required: true,
            message: "每人限购不能为空",
            trigger: ["blur", "change"]
          },
          { validator: limitNumber, trigger: ["blur", "change"] }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.getDatacategoryFn();
    this.getData();
    // this.demo();
  },
  methods: {
      watchkc(index,val){
          for(let j=0;j<3;j++){
              // 最大输入6位数 循环多遍达到删除非数字输入效果
              for(let i=0;i<val.length;i++){
                  // 删除非数字的输入
                  if(!/[0-9]/g.test(val[i])){
                      val= val.replace(val[i],"")
                  }
              }
          }
          this.goodsSpecList[index].activityQuantity= val
      },
      watchxg(index,val){
          for(let j=0;j<3;j++){
              // 最大输入6位数 循环3遍达到删除非数字输入效果
              for(let i=0;i<val.length;i++){
                  // 删除非数字的输入
                  if(!/[0-9]/g.test(val[i])){
                      val= val.replace(val[i],"")
                  }
              }
          }
          this.goodsSpecList[index].personLimit= val
      },
    closeDialog() {
      this.$refs.editDataForm.resetFields();
    },
    //同步列表所填数据
    changeAll(row) {
      console.log(row, "同步更改数据");
      if (row.activityQuantity && row.personLimit) {
        this.editDataForm.goodsSpecList.forEach(function(val, index, arr) {
          val.activityQuantity = row.activityQuantity;
          val.personLimit = row.personLimit;
        });
      } else {
        this.$message({
          type: "error",
          message: "活动库存和限购数量均不得为空!"
        });
        return;
      }
    },
    //取消当前商品选择
    cancelIt(id, activityId) {
      const obj = {
        data: {
          activityId: activityId,
          goodsIdList: [id]
        }
      };
      this.$confirm("此操作将取消该秒杀商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          seckillProRemove(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "取消成功!"
              });
              //   this.$ref
              this.getDataList();
            } else {
              this.$message({
                type: "error",
                message: "取消失败!"
              });
            }
          });
        })
        .catch(() => {});
    },
    //获取当前操作行
    onRowClick(row) {
      //   console.log(row.cartLimit, "日本限购");
      this.isLimit = row.cartLimit;
    },
    //获取商品分类集合
    getDatacategoryFn(){
        //获取中国分类
        getdatacategory().then((res)=>{
            if(res.code == 200){
                console.log(res);
                this.selectCategoryOption = res.data;
                this.selectCategoryOption.forEach((item,index)=>{
                    // item.label = item.name
                    // item.value = item.id
                    item.list && item.list.forEach((item2,index2)=>{
                        // item2.label = item2.name
                        // item2.value = item2.id
                        item2.list="";
                    })
                })
            }else{
                this.$message(res.msg);
            }
        }).catch(()=>{
            this.$message("服务器错误");
        })
    },
    // 获取数据
    getData(){
      this.page = 1;
      this.mixinViewModuleOptions.getDataListURL  = addSckillPro+ "" + this.activityId;
      this.getDataList();
    },
    //获取商品数据集合
    // getDataList() {
    //   const params = {
    //     limit: this.limit,
    //     activityId: this.activityId,
    //     page: this.page,
    //     name: this.dataForm.name,
    //     id: this.dataForm.id,
    //     storeName: this.dataForm.storeName,
    //     brandName: this.dataForm.brandName,
    //     categoryId: this.dataForm.categoryId
    //   };
    //   addSckillPro(params).then(res => {
    //     if (res.code == 200) {
    //       this.dataList = res.data.list;
    //       this.total = res.data.total;
    //     } else {
    //       console.log("error");
    //     }
    //   });
    // },
    //回调跳转查看商品页面
    showDetail(id) {
      this.$emit("detailistFun", id);
    },
    //重置
    reset() {
      this.$refs["dataForm"].resetFields();
      this.dataForm.categoryId = ""
      this.classList = []
      this.page = 1;
      this.getDataList();
    },
    //回调返回列表
    changePage() {
      this.$emit("addshowList");
    },
    //新建/修改弹框
    editGoods(id, type) {
      this.action = type;
      const obj = {
        goodsId: id,
        activityId: this.activityId
      };
      seckillProDet(obj).then(res => {
        if (res.code == 200) {
          this.goodsMain = res.data;
          this.moneyNum = Number(res.data.sellPrice);
          this.editDataForm.number = Number(res.data.activityPrice) || "";
          this.goodsSpecList = res.data.activityGoodsChoiceSkuVOList;
          this.editDataForm.goodsSpecList = this.goodsSpecList;
          //   console.warn(this.editDataForm, "-----更改数据格式");
          //   this.goodsSpecList[0].cartLimit=5;
          this.editVisible = true;
        }
      });
    },
    noCheck() {
      //   console.log(this.action, "操作类型");
      if (this.action == "creat") {
        this.editDataForm.number = "";
      }
      this.$refs["editDataForm"].clearValidate();
      this.editVisible = false;
    },
    //修改list数据
    changeLimit(val) {
      this.editDataForm.personLimit = val;
    },
    changeQuantity(val) {
      this.editDataForm.activityQuantity = val;
    },
    async subEdit() {
      this.$refs.editDataForm.validate(valid => {
        if (valid) {
          var activityGoodsList = [];
          this.goodsSpecList.forEach((item, index) => {
            activityGoodsList.push({
              activityQuantity: item.activityQuantity,
              id: item.id, // 商品id ,
              personLimit: item.personLimit // 每人限购数量
            });
          });
          var obj = {
            activityGoodsSkuVOList: activityGoodsList, //活动商品新增集合 ,
            activityId: this.activityId, //活动id ,
            activityPrice: this.editDataForm.number,
            id: this.goodsMain.id
          };
          this.saveLoading = true;
          //   console.log(this.action,'操作类型')
          if (this.action == "creat") {
            seckillProSave(obj).then(res => {
              this.saveLoading = false;
              let status = null;
              if (res.code == "200") {
                status = "success";
                this.visible = false;
                this.getDataList();
                this.editVisible = false;
              } else {
                status = "error";
              }
              this.$message({
                message: res.msg,
                type: status,
                duration: 1500
              });
            });
          } else {
            seckillProEdit(obj).then(res => {
              this.saveLoading = false;
              let status = null;
              if (res.code == "200") {
                status = "success";
                this.visible = false;
                this.getDataList();
                this.editVisible = false;
              } else {
                status = "error";
              }
              this.$message({
                message: res.msg,
                type: status,
                duration: 1500
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // demo() {
    //   function placeholderPic() {
    //     var w = document.documentElement.offsetWidth;
    //     document.documentElement.style.fontSize = w / 20 + "px";
    //   }
    //   placeholderPic();
    //   window.onresize = function() {
    //     placeholderPic();
    //   };
    // },
      handleChange(value) {
          // this.dataForm.categoryId = value[value.length-1]
          // console.log(this.dataForm.categoryId);

            if(this.classList.length!=0){
                  this.dataForm.categoryId = this.classList[this.classList.length-1]
              }else{
              this.dataForm.categoryId = "";//分类id

              }
      }
  }
};
</script>
<style lang="scss" scoped>
    .japane{
        /deep/.el-input {
            width: 100px !important;
            height: 40px;
        }
    }
.addListGoodsPages {
  /deep/.el-input {
    width: 150px;
    height: 40px;
  }
  .editDialog {
    /deep/.el-dialog__body {
      padding-top: 0;
    }
    /deep/.el-form-item {
      margin-bottom: 0 !important;
    }
    .goodsPresent {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
      /deep/ .el-image,
      /deep/.el-image__inner {
        text-align: center;
        width: 110px;
        height: 110px;
        line-height: 110px;
        object-fit: contain;
        margin-right: 20px;
      }
      img {
        text-align: center;
        width: 110px;
        height: 110px;
        line-height: 110px;
        object-fit: contain;
        margin-right: 20px;
      }
      .goodsPresentModle {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 6px 0;
        .goodsmoney {
          color: red;
        }
        .goodsClass {
          width: 100%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.el-table .specError {
  /deep/ .el-form-item__content {
    margin-left: 0px !important;
  }
  /deep/ .el-form-item__error {
    position: relative !important;
  }
}
</style>

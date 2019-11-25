<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
            :inline="true"
            class="grayLine topGapPadding"
            :model="dataForm"
            @keyup.enter.native="getDataList()"
        >
            <el-form-item label="商品ID：">
                <el-input v-model.trim="dataForm.goodsId" placeholder="请输入" clearable maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName" placeholder="请输入" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn" type="primary" plain @click="reset()">重置</el-button>
            </el-form-item>
            <el-form-item style="float:right;">
                <el-button type="primary" @click="addActivity()" plain>添加商品</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" :model="sortDataList">
            <el-table
                :data="sortDataList.list"
                v-loading="dataListLoading"
                @selection-change="dataListSelectionChangeHandle"
                border=""
                style="width: 100%"
                ref="multipleTable"
            >
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
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
                <el-table-column prop="goodsId" label="商品ID" align="center" width="200"></el-table-column>
                <el-table-column prop="sortNum" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input-number
                            v-model="scope.row.sortNum"
                            @change="changeSort(scope.row)"
                            :min="0"
                            :max="10000000"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称">
                    <template slot-scope="scope">
                        <div class="words">{{scope.row.goodsName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="category" align="center" label="所属分类"></el-table-column>
                <el-table-column prop="price" align="center" label="销售价格"></el-table-column>
                <el-table-column prop="stock" align="center" label="库存"></el-table-column>
                <el-table-column prop="address" align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                            class="artdanger"
                            type="text"
                            size="small"
                            @click="deleteHandle(scope.row.id)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <!-- 分页 -->
        <div class="footerBox">
            <div class="footerBtn">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button @click="deleteHandle()" style="margin-left: 20px;" type="primary">批量删除</el-button>
                <el-button @click="changeSortSave()" :loading="clicking" type="primary">保存排序</el-button>
            </div>
            <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>
        <!-- 商品弹框 -->
        <el-dialog
            title="添加商品"
            :visible.sync="goodsVisible"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="60%"
        >
            <el-form :inline="true" :model="goodsdataForm">
                <el-form-item label="商品名称：">
                    <el-input
                        v-model="goodsdataForm.goodsName"
                        placeholder="商品名称/商品货号"
                        clearable
                        maxlength="300"
                    ></el-input>
                </el-form-item>
                <el-form-item label="选择分类：">
                    <el-cascader
                        :options="classList"
                        v-model="selectedOptions"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChangeOut"
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn" type="primary" @click="getgoodsList()">搜索</el-button>
                    <el-button class="btn" type="primary" plain @click="goodsreset()">重置</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button class="btn" type="primary" plain @click="handleCheckAllAdd(dataFormList)">选择全选</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="dataFormList">
            <el-table
                :data="dataFormList.list"
                v-loading="goodsdataListLoading"
                border=""

                style="width: 100%"
            >
                <el-table-column prop="name" align="center" label="商品名称" width="240">
                    <template slot-scope="scope">
                        <div :title="scope.row.name">{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="idJp" align="center" label="商品ID"></el-table-column>
                <el-table-column prop="sellPrice" align="center" label="价格"></el-table-column>
                <el-table-column  label="操作" align="center">
                    <template slot-scope="scope" >
                            <el-checkbox
                                @change="gettem($event,scope.row,scope.$index)"
                            ></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            </el-form>
            <el-pagination
                @size-change="pageSize"
                @current-change="pageCurrent"
                :current-page="pages"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limits"
                :total="totals"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { goodsCarlist, goodsCarlistDelete } from "@/api/url";
import {
  goodsListVisible,
  categoryCnList,
  addGoodscarList,
  cartConfigSort
} from "@/api/api";
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  components: { Bread },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: goodsCarlist,
        getDataListIsPage: true,
        // exportURL: '/admin-api/store/export',
        deleteURL: goodsCarlistDelete,
        deleteIsBatch: true
        // deleteIsBatchKey: 'id'
      },

      dataFormList:{},
      goodsdataList: [],
      isIndeterminate:false,
      checkAll: false,
      buttonStatus: false,
      goodsVisible: false,
      goodsdataListLoading: false,
      dataForm: {
        goodsName: "",
        goodsId: ""
      },
      checkedCount:0,//当前选中条数
      sortDataList: {},
      goodsdataForm: {
        goodsName: "",
        categoryId: ""
      },
      selectedOptions: [],
      props: {
        label: "name",
        value: "id",
        children: "list"
      },
      sortList: [],
      dataListSelections: [], //批量选中
      classList: [],
      checkList: [],
      trueList: [],
      pages: 1,
      limits: 10,
      totals: 0,
      breaddata: ["配置管理", "购物车推荐商品配置"],
      clicking: false,
    };
  },
  // ID类搜索框仅可输入数字、英文，最多可输入30个字符
  watch: {
    "dataForm.goodsId": function(newV, oldV) {
      for (let i = 0; i < newV.length; i++) {
        if (!/[a-zA-Z0-9]/.test(newV[i])) {
          this.dataForm.goodsId = newV.replace(newV[i], "");
        }
      }
      if (newV.length > 30) {
        this.dataForm.goodsId = newV.substr(0, 30);
      }s
    },
    dataList(val) {
      console.log(val, "tableData");
      this.sortDataList = {
        list: val
      };
    }
  },
  created() {
    this.getClassList();
    this.demo();
  },
  methods: {
    //批量选中数据
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
        if(this.dataListSelections.length == this.dataList.length) this.checkAll = true;
        else this.checkAll = false;
    },
    //批量删除
    cotrolGoodsShow() {
      this.deleteHandle();
    },
    //保存排序
    changeSortSave() {
      if (this.sortList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择修改排序的数据"
        });
        return false;
      }
      const obj = this.sortList;
      this.clicking = true;
      cartConfigSort(obj).then(res => {
        if (res.code == 200) {
         this.clicking = false;
          this.$message({
            message: res.msg,
            type: "success",
            duration: 1500,
            onClose: () => {
                this.sortList = [];
              this.getDataList();
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 1500,
            onClose: () => {
                this.sortList = [];
              this.getDataList();
            }
          });
        }
      });
    },
    //全选
    handleCheckAllChange(val) {
      if (val) this.$refs.multipleTable.toggleAllSelection();
      else this.$refs.multipleTable.clearSelection();
    },
    //添加商品全选
    handleCheckAllAdd(val) {
        console.log(val)
        this.goodsVisible = false;
        let arry1 = [];
        val.list.map(item => {
            arry1.push({
                goodsId: item.idJp,
                sortNum: 255,
                goodsName: item.name,
                price: item.sellPrice,
                category: item.firstCategory + item.goodsTypeName
            });
        });
        addGoodscarList({ list: JSON.stringify(arry1) }).then(res => {
            console.log("添加结果", res);
            if (res.code == 200) {
                this.$message.success("添加成功");
                this.dataFormList = {};
                this.getDataList();
                done();
            } else {
                this.$message.error(res.msg);
            }
        });
    },
    //更改排序
    changeSort(row) {
      this.sortList.push(row);
    },
    //重置
    reset() {
      this.dataForm = {};
      this.getDataList();
    },
    getData() {
      this.page = 1;
      this.getDataList();
    },
    //打开新增编辑活动弹框
    addActivity(id) {
      this.goodsVisible = true;
      this.getgoodsList();
    },
    //商品弹框列表查询
    getgoodsList() {
      this.goodsdataListLoading = true;
      this.checkList = [];
      this.trueList = [];
      goodsListVisible({
        params: {
          page: this.pages,
          limit: this.limits,
          goodsName: this.goodsdataForm.goodsName,
          categoryId: this.goodsdataForm.categoryId
        }
      }).then(res => {
        // console.log('数据',res)
        if (res.code == 200) {
          this.goodsdataListLoading = false;
          this.totals = Number(res.data.total);
          console.log(res.data.list,'0000')
          this.goodsdataList = res.data.list;
          this.goodsdataList.map((item,index) => {
            // item.checked = false;
             this.goodsdataList[index].checked = false;
          });
          this.dataFormList={
              list:this.goodsdataList
          }
          console.log("数据", this.goodsdataList);
        }
      });
    },
    //商品弹框重置
    goodsreset() {
      this.pages = 1;
      this.limits = 10;
      this.goodsdataForm = {
        goodsName: "",
        categoryId: ""
      };
      this.selectedOptions = [];
      this.getgoodsList();
    },
    //分类联动
    getClassList() {
      categoryCnList({}).then(res => {
        if (res.code == 200) {
          this.classList = res.data;
          let i, j;
          for (i = 0; i < this.classList.length; i++) {
            if (this.classList[i].list && this.classList[i].list.length == 0) {
              this.classList[i].list = null;
            }
            if (this.classList[i].list && this.classList[i].list.length > 0) {
              let aa = this.classList[i].list;
              for (j = 0; j < aa.length; j++) {
                if (aa[j].list && aa[j].list.length == 0) {
                  aa[j].list = null;
                }
              }
            }
          }
        }
      });
    },
    handleChangeOut(val) {
      console.log(val);
      this.goodsdataForm.categoryId = val[val.length - 1];
    },
    // 关闭弹框
    handleClose(done) {
      if (this.dataFormList.list) {
        console.log(this.dataFormList.list)
        let arry1 = [];
        console.log(arry1.length)
          this.dataFormList.list.map(item => {
              if(item.checked) arry1.push({
            goodsId: item.idJp,
            sortNum: 255,
            goodsName: item.name,
            price: item.sellPrice,
            category: item.firstCategory + item.goodsTypeName
          });
        });

        if (arry1.length == 0) {
          done();
          return
        }
        addGoodscarList({ list: JSON.stringify(arry1) }).then(res => {
          console.log("添加结果", res);
          if (res.code == 200) {
            this.$message.success("添加成功");
            this.dataFormList = {};
            this.getDataList();
            done();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        done();
      }
      done();
    },
    gettem($event, item,index){
        console.log($event, item,index)
        if($event){
             this.dataFormList.list[index].checked=true;
            this.checkedCount++
        }else{
             this.dataFormList.list[index].checked=false;
            this.checkedCount--
        }
    console.log(this.checkedCount,'tiaoshu')
    this.dataFormList.list=this.dataFormList.list
    },
    //单选商品项
    // gettem($event, item) {
    //   console.log($event, item, index);
    //   this.goodsdataList[index].checked = $event;
    //   this.goodsdataList = [].concat(this.goodsdataList);
    //   // this.$set(this.goodsdataList[index],"checked", $event);
    //   this.checkList.push(item);
    //   let i, j, flag;
    //   if ($event == true) {
    //     for (i = 0; i < this.checkList.length; i++) {
    //       flag = true;
    //       for (j = 0; j < this.trueList.length; j++) {
    //         if (this.checkList[i].idJp == this.trueList[j].idJp) {
    //           flag = false;
    //         }
    //       }
    //       if (flag) {
    //         this.trueList.push(this.checkList[i]);
    //       }
    //     }
    //   } else {
    //     let aa = item.idJp;
    //     this.trueList.map((item, index) => {
    //       if (item.idJp == aa) {
    //         this.trueList.splice(index, 1);
    //       }
    //     });
    //   }
    //   console.log(this.trueList);
    // },
    // 弹框分页, 每页条数
    pageSize(val) {
      this.pages = 1;
      this.limits = val;
      this.getgoodsList();
    },
    // 弹框分页, 当前页
    pageCurrent(val) {
      this.page = val;
      this.getgoodsList();
    },

    demo() {
      function placeholderPic() {
        var w = document.documentElement.offsetWidth;
        document.documentElement.style.fontSize = w / 20 + "px";
      }
      placeholderPic();
      window.onresize = function() {
        placeholderPic();
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.footerBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog {
  .el-input {
    width: 300px;
  }
}
.cell div {
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
.el-input--default .el-form--inline .el-input .el-input__inner {
    height: 40px;
    line-height: 35px;
    width: 180px;
}
</style>

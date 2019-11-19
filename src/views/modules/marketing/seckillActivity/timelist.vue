<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-button
            style="float:right;margin-bottom:20px"
            type="primary"
            @click="addTime"
        >添加</el-button>
        <el-table :data="dataList" v-loading="dataListLoading" border="" style="width: 100%">
            <el-table-column type="index" prop="$index" align="center" label="序号" width="70">
                <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="秒杀时段名称" width="180" align="center"></el-table-column>
            <el-table-column prop="dayStartTime" label="每日开始时间" align="center"></el-table-column>
            <el-table-column prop="dayEndTime" label="每日结束时间" align="center"></el-table-column>
            <el-table-column prop="stopFlag " label="启用" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.stopFlag==0?false:true"
                        @change="changeSwitch($event,scope.row.id)"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editTime(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" @click="delTime(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <el-pagination
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>-->
        <!-- 修改弹框 -->
        <el-dialog
            :title="activiTitle"
            :visible.sync="activiVisible"
            :close-on-click-modal="false"
            :show-close="false"
            class="activiDialog"
            width="36%"
        >
            <el-form
                :model="activiDataForm"
                :rules="dataRule"
                ref="activiDataForm"
                label-width="120px"
            >
                <el-form-item label="秒杀时段名称：" prop="sgName">
                    <el-input
                        v-model="activiDataForm.sgName"
                        placeholder="请输入50字以内的标题"
                        :maxlength="50"
                    ></el-input>
                </el-form-item>
                <el-form-item label="每日开始时间：" prop="startTime">
                    <el-time-picker
                        v-model="activiDataForm.startTime"
                        value-format="HH:mm:ss"
                        :picker-options="{
                            start: '00:00',
                            step: '01:00',
                            end: '24:00'
                         }"
                        placeholder="选择每日开始时间"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item label="每日结束时间：" prop="endTime">
                    <el-time-picker
                        v-model="activiDataForm.endTime"
                        value-format="HH:mm:ss"
                        :picker-options="{
                            start: activiDataForm.startTime,
                            minTime: activiDataForm.startTime
                         }"
                        placeholder="选择每日开始时间"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio-group v-model="activiDataForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动限制：">
                    <el-checkbox-group v-model="activiDataForm.restrict">
                        <el-checkbox label="不可同时使用优惠券" name="type" disabled></el-checkbox>
                        <el-checkbox label="不可同时参加满减活动" name="type" disabled></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noCheck('activiDataForm')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="subActivity('activiDataForm')"
                    :loading="buttonStatus"
                >确 定</el-button>
            </span>
            <el-popover
                    placement="top-start"
                    width="200"
                    trigger="click"
                    content=" 场次启用后会自动帮您生成7天的秒杀活动场次，每过一天自动生成一场，若您关闭或删除该场次，不会再继续生成场次，但已生成的场次不可删除">
                <div class="ques" slot="reference">?</div>
            </el-popover>

        </el-dialog>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
// import { periodPage } from '@/api/url'
import {
  periodPage,
  newSeckillTime,
  seckillState,
  seckillTimeDel,
  periodDetail,
  periodEdit
} from "@/api/api";
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  components: { Bread },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: periodPage,
        getDataListIsPage: false,
        exportURL: "/admin-api/store/export",
        deleteURL: "/admin-api/store",
        deleteIsBatch: true
        // deleteIsBatchKey: 'id'
      },
      isAdd: true, //默认操作类型为添加
      buttonStatus: false,
      activiVisible: false,
      editId: "",
      activiDataForm: {
        sgName: "",
        startTime: "",
        endTime: "",
        status: 1,
        restrict: ["不可同时使用优惠券", "不可同时参加满减活动"]
      },
      activiTitle: "添加时间段",
      breaddata: ["营销管理", "秒杀活动", "秒杀时间段"]
    };
  },
  computed: {
    dataRule() {
      return {
        sgName: [
          { required: true, message: "秒杀时段名称不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "启用状态不能为空", trigger: "blur" }
        ]
      };
    }
  },
  created() {
    this.demo();
    this.getDataList();
    console.log(this.dataList, "集合");
  },
  methods: {
    //获取时间段数据集合
    getDataList() {
      periodPage().then(res => {
        if (res.code == 200) {
          this.dataList = res.data;
        }
      });
    },
    changePage() {
      this.$emit("timeshowList");
    },
    //修改时间段状态
    changeSwitch($event, id) {
      //$event：状态值false或true，id:要启用或禁用的时间段id   0未启用 1启用
      console.log("======", $event, id);
      const obj = {
        // data: {
        stopFlag: $event ? 1 : 0,
        id: id
        // }
      };
      seckillState(obj).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getDataList();
        } else {
          this.$message({
            type: "error",
            message: "修改失败!"
          });
        }
      });
    },
    addTime(){
       this.activiVisible = true
       this.buttonStatus = false;
       this.activiDataForm.sgName = ""
       this.activiDataForm.startTime = ""
       this.activiDataForm.endTime = ""
       this.activiDataForm.status = 1
    },
    //编辑时间段
    editTime(id) {
      this.buttonStatus = false;
      periodDetail({ id: id }).then(res => {
        if (res.code == 200) {
          console.log(res, "data");
          (this.isAdd = false), //false--编辑，true--添加
            (this.activiDataForm.sgName = res.data.title);
          this.activiDataForm.startTime = res.data.dayStartTime;
          this.activiDataForm.endTime = res.data.dayEndTime;
          this.activiDataForm.status = res.data.stopFlag;
          this.editId = res.data.id; //编辑的时间段id
          this.activiDataForm.restrict = [
            "不可同时参加满减活动",
            "不可同时使用优惠券"
          ];

          //需求---暂做死数据
          //   this.activiDataForm.restrict =
          //     res.data.reduceLimit == 0
          //       ? []
          //       : this.activiDataForm.restrict.push("不可同时参加满减活动");
          //   this.activiDataForm.restrict =
          //     res.data.couponsLimit == 0
          //       ? this.activiDataForm.restrict
          //       : this.activiDataForm.restrict.push("不可同时使用优惠券");
          this.activiVisible = true;
        } else {
          console.log("error");
        }
      });
    },
    //取消弹框
    noCheck(formName) {
      this.$refs[formName].resetFields();
      this.activiVisible = false;
    },
    //提交新增编辑活动
    subActivity(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.activiDataForm.restrict, "----");
          // return;
          const obj = {
            couponsLimit:
              this.activiDataForm.restrict.indexOf("不可同时使用优惠券") == -1
                ? 0
                : 1, //优惠 0 不共享 1 共享
            dayEndTime: this.activiDataForm.endTime,
            dayStartTime: this.activiDataForm.startTime,
            reduceLimit:
              this.activiDataForm.restrict.indexOf("不可同时参加满减活动") == -1
                ? 0
                : 1, //满减 0 不共享 1 共享
            stopFlag: this.activiDataForm.status == 1 ? 1 : 0,
            title: this.activiDataForm.sgName
          };
          if (this.isAdd) {
            this.buttonStatus = true;
            newSeckillTime(obj).then(res => {
              this.buttonStatus = false;
              this.$refs["activiDataForm"].resetFields();
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功!"
                });
                this.activiVisible = false;
                this.getDataList();
              } else {
                this.activiVisible = false;
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });
          } else {
            obj.id = this.editId;
            this.buttonStatus = true;
            periodEdit(obj).then(res => {
              this.buttonStatus = false;
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.activiVisible = false;
                this.getDataList();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });
          }
        }
      });
    },
    //删除时间段
    delTime(id) {
      this.$confirm("此操作将删除该时间段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          seckillTimeDel({ id: id }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDataList();
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });
        });
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
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog {
  .el-input {
    width: 200px;
  }
}
    .ques{
        display: inline-block;
        background: #666666;
        color: #ffffff;
        border-radius: 100%;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 10px;
        position: absolute;
        top: 23px;
        left: 120px;
        cursor: pointer;
    }
</style>

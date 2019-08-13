<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" style="margin-top: 20px;">
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="输入搜索：">
                <el-input v-model="dataForm.goodsName" placeholder="商品名称/商品货号" ></el-input>
            </el-form-item>
            <el-form-item  label="品牌：">
                <el-select v-model="dataForm.brandName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-select v-model="dataForm.storeName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类：">
                <el-select v-model="dataForm.conditionName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="状态：">
                <el-select v-model="dataForm.state" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>

        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">已备案</el-radio-button>
            <el-radio-button label="upper">待备案</el-radio-button>
<!--            <el-button @click="exportHandle()"  class="btn" type="primary" style="margin-left: 1342px;">导入商品信息</el-button>-->
        </el-radio-group>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
<!--            <el-table-column type="selection" width="70"></el-table-column>-->
            <el-table-column label="商品SKU ID" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.goodsId}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.goodsName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="规格" align="center" width="150">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center" width="150">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="品牌" align="center">
            <template slot-scope="scope">
                <div>
                    {{scope.row.store}}
                </div>
            </template>
        </el-table-column>
            <el-table-column prop="price" label="售价" align="center">
                <template slot-scope="scope">
                    <div class="price1">￥{{scope.row.specSellPrice}}</div>
                </template>
            </el-table-column>
<!--            <el-table-column label="售价类型" align="center" width="150">-->
<!--                <template slot-scope="scope">-->
<!--                    <div>-->
<!--                        {{scope.row.goodsName}}-->
<!--                    </div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="gcName" label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="状态"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="三级分类编码"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="海关备案号"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
<!--            <el-table-column label="操作" align="center" width="150">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button  @click="cotrolGoodsShow('singe',scope.row)" type="text" size="mini" >-->
<!--                        <span  v-if="scope.row.goodsShow==0">已上架</span>-->
<!--                        <span  v-if="scope.row.goodsShow==1" class="artclose">已下架</span>-->
<!--                        <span  v-if="scope.row.goodsShow==2"   style="color:#FF0000">未上架</span>-->
<!--                    </el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
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
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "备案商品管理"],
                activeName: "",
                dataForm: {
                    goodsName: "",//商品名称/商品货号
                    brandName: "",//品牌名称
                    conditionName: "",//分类名称
                    storeName: "",//店铺名称
                    goodsShow:"",//上下架状态:0下架;1上架
                },
                options: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '已售完'
                }, {
                    value: '选项3',
                    label: '未售完'
                }],
            }
        },
        components: {
            Bread,
            //orderDet
        },
        created() {
        },
        methods: {
            handleClick(tab) {
                if(tab== ""){
                    this.dataForm.goodsShow = ""
                }else if(tab== "upper"){
                    this.dataForm.goodsShow = "1"
                }
                this.getDataList();
            },
            reset() {
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.brandName = "";//品牌名称
                this.dataForm.conditionName = "";//分类名称
                this.dataForm.storeName = "";//店铺名称
                this.handleClick();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .grayLine{
        border-bottom: 0!important;
    }
</style>
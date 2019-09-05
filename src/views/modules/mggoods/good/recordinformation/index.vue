<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" style="margin-top: 20px;">
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataFormShow.goodsName" placeholder="商品名称" ></el-input>
            </el-form-item>
            <el-form-item label="商品sku ID：">
                <el-input v-model="dataFormShow.goodsCsIdJp" placeholder="商品skuid" ></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <el-select v-model="dataFormShow.firstCategory" placeholder="请选择">
                    <el-option
                            v-for="item in stateOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-input v-model="dataFormShow.storeName" placeholder="请输入店铺名称" ></el-input>
            </el-form-item>
            <el-form-item  label="品牌：">
                <el-input v-model="dataFormShow.brandName" placeholder="请输入品牌名称" ></el-input>
            </el-form-item>
            <el-form-item  label="状态：" v-if="dataFormShow.goodsShow==''">
                <el-select v-model="dataFormShow.transportFlag" placeholder="请选择">
                    <el-option
                            v-for="item in stateOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="备案状态：" v-if="dataFormShow.goodsShow=='1'">
                <el-select v-model="dataFormShow.tofileFlag" placeholder="请选择">
                    <el-option
                            v-for="item in alreadyOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">查询</el-button>
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
                style="width: 100%;margin-top:10px;"
        >
<!--            <el-table-column type="selection" width="70"></el-table-column>-->
            <el-table-column label="商品SKU ID" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.skuIdJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.imageUrl" alt=""/>
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
                        {{scope.row.csName}}
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
                    {{scope.row.brandName}}
                </div>
            </template>
        </el-table-column>
            <el-table-column prop="price" label="售价" align="center">
                <template slot-scope="scope">
                    <div class="price1">￥{{scope.row.sellPrice }}</div>
                </template>
            </el-table-column>
<!--            <el-table-column label="售价类型" align="center" width="150">-->
<!--                <template slot-scope="scope">-->
<!--                    <div>-->
<!--                        {{scope.row.goodsName}}-->
<!--                    </div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="firstCategory " label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.firstCategory }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="tofileFlag" label="状态"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.tofileFlag}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="jdThirdCategory" label="京东三级分类"  align="center" v-if="dataFormShow.goodsShow==''">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.jdThirdCategory}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="hsCode" label="HSCODE"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.hsCode}}
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
    import { registerUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: registerUrl,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "备案商品管理"],
                activeName: "",
                dataFormShow: {
                    goodsName: "",// 商品名称
                    goodsCsIdJp: "",// 商品sku ID
                    firstCategory: "",// 分类
                    storeName: "",// 店铺名称
                    brandName:"",// 品牌
                    tofileFlag:"",// 状态
                    transportFlag: ""
                },
                alreadyOptions: [{
                    id: '0',
                    label: '待备案'
                },{
                    id: '3',
                    label: '待重新备案'
                }],
                stateOptions: [{
                    id: '0',
                    label: '未下发'
                }, {
                    id: '1',
                    label: '已下发'
                }],
            }
        },
        components: {
            Bread,
            //orderDet
        },
        created() {
            this.dataFormShow.goodsShow = 0;
            this.getDataList();
        },
        methods: {
            handleClick(tab) {
                if(tab== ""){
                    this.dataFormShow.goodsShow = ""
                }else if(tab== "upper"){
                    this.dataFormShow.goodsShow = "1"
                }
                this.getDataList();
            },
            getData(){
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.goodsName = "";//商品名称/商品货号
                this.dataFormShow.brandName = "";//品牌名称
                this.dataFormShow.conditionName = "";//分类名称
                this.dataFormShow.storeName = "";//店铺名称
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

    img {
        width: 100px;
        height: 100px;
    }
</style>
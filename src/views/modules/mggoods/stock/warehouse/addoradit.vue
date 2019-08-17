<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'0'"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="id" label="仓库ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库名称：">
                <span>{{dataForm.warehouseName}}</span>
            </el-form-item>
            <el-form-item prop="addressInfo" label="仓库所在地：">
                <span>{{dataForm.addressInfo}}</span>
            </el-form-item>
            <el-form-item prop="type" label="仓库种类：">
                <span>{{dataForm.type}}</span>
            </el-form-item>
            <el-form-item prop="name" label="负责人：">
                <span>{{dataForm.name}}</span>
            </el-form-item>
            <el-form-item prop="phone" label="联系方式：">
                <span>{{dataForm.phone}}</span>
            </el-form-item>
            <el-form-item prop="isEnable" label="状态：">
                <span>{{dataForm.isEnable}}</span>
            </el-form-item>
            <br>
            <el-form-item prop="skuId" label="skuID：">
                <el-input v-model="dataForm.skuId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="storeName" label="所属店铺：" placeholder="请输入">
                <el-input v-model="dataForm.storeName" ></el-input>
            </el-form-item>
            <el-form-item prop="brandName" label="品牌：" placeholder="请输入">
                <el-input v-model="dataForm.brandName" ></el-input>
            </el-form-item>
            <el-form-item prop="categoryId" label="分类：">
                <el-select v-model="dataForm.categoryId" placeholder="请选择">
                    <el-option label="全部" value="">衣服</el-option>
                    <el-option label="1星" value="0">裤子</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-form-item>
                    <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                    <el-button class="btn" @click="reset('dataForm')" type="primary" plain>重置</el-button>
                    <el-button type="primary"  plain @click="exportHandle()">导出</el-button>
                </el-form-item>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;maigin-top:20px;"
        >
            <el-table-column prop="aftersaleSn" label="skuID" align="center"></el-table-column>
            <el-table-column prop="specSerial" label="图片" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="memberName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="spe" label="规格" align="center"></el-table-column>
            <el-table-column label="分类" align="center ">
                <template slot-scope="scope">
                    <span>{{dataForm.firstCategory}}</span>
                    <span>{{dataForm.secondCategory}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="商品售价" align="center"></el-table-column>
            <el-table-column prop="stockQuantity" label="库存数量" align="center"></el-table-column>
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
    import { skuGoods } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: skuGoods,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "仓库管理", "仓库详情"],
            }
        },
        components: {
            Bread
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
            },
            changePage(){
                this.goList();
            },
            goList(){
                this.$emit("showList");
            },
        }
    }
</script>

<style scoped>

</style>
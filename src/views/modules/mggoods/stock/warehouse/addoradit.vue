<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="memberId" label="仓库ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item prop="orderId" label="仓库名称：">
                <span>{{dataForm.number}}</span>
            </el-form-item>
            <el-form-item prop="memberId" label="仓库所在地：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item prop="orderId" label="仓库种类：">
                <span>{{dataForm.number}}</span>
            </el-form-item>
            <el-form-item prop="memberId" label="负责人：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item prop="orderId" label="联系方式：">
                <span>{{dataForm.number}}</span>
            </el-form-item>
            <el-form-item prop="memberId" label="状态：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <br>
            <el-form-item prop="memberId" label="skuID：">
                <el-input v-model="dataForm.memberId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="orderId" label="商品名称：">
                <el-input v-model="dataForm.orderId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="skuId" label="所属店铺：" placeholder="请输入">
                <el-input v-model="dataForm.skuId" ></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="品牌：" placeholder="请输入">
                <el-input v-model="dataForm.goodsName" ></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="分类：">
                <el-select v-model="dataForm.appearance" placeholder="请选择">
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
            <el-table-column prop="createDate" label="规格" align="center"></el-table-column>
            <el-table-column prop="refundAmount" label="分类" align="center "></el-table-column>
            <el-table-column prop="auditStatus" label="商品售价" align="center"></el-table-column>
            <el-table-column prop="auditResult" label="库存数量" align="center"></el-table-column>
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
            }
        }
    }
</script>

<style scoped>

</style>
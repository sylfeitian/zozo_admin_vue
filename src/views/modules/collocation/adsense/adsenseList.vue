<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="轮播图名称：">
            <el-input v-model.trim="dataForm.name" placeholder="请输入轮播图名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告位置：">
            <el-select v-model="dataForm.position" clearable  placeholder="请选择">
                <el-option
                    v-for="item in address"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
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
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
    </el-form>
    <el-form>
        <el-button type="primary" @click="addActivity()">添加轮播图</el-button>
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
		    prop="name"
            align="center"
		    label="轮播图名称"
		    width="240">
		</el-table-column>
		<el-table-column
		    prop="createDate"
            align="center"
		    label="创建时间">
		</el-table-column>
		<el-table-column
		    prop="state"
            align="center"
		    label="状态">
            <template slot-scope="scope">
                <span>{{scope.row.state==1?'启用':'禁用'}}</span>
            </template>
		</el-table-column>
		<el-table-column
		    prop="linkType "
            align="center"
		    label="链接类型">
            <template slot-scope="scope">
                <span v-if="scope.row.linkType == 0">无链接</span>
                <span v-if="scope.row.linkType == 1">站内链接</span>
                <span v-if="scope.row.linkType == 2">指定商品</span>
                <span v-if="scope.row.linkType == 3">自定义链接</span>
                <span v-if="scope.row.linkType == 4">指定分类</span>
                <span v-if="scope.row.linkType == 5">指定店铺</span>
                <span v-if="scope.row.linkType == 6">指定品牌</span>
                <span v-if="scope.row.linkType == 7">指定时尚杂志</span>
            </template>
		</el-table-column>
        <el-table-column
		    prop="position"
            align="center"
		    label="广告位置">
            <template slot-scope="scope">
                <span v-if="scope.row.position == 1">首页</span>
                <span v-if="scope.row.position == 2">限量</span>
                <span v-if="scope.row.position == 3">预售</span>
                <span v-if="scope.row.position == 4">秒杀</span>
                <span v-if="scope.row.position == 5">精选分类</span>
                <span v-if="scope.row.position == 6">单品折扣</span>
                <span v-if="scope.row.position == 7">首页弹窗</span>
                <span v-if="scope.row.position == 8">首页弹框背景</span>
            </template>
		</el-table-column>
        <el-table-column
		    prop="sort"
            align="center"
		    label="排序">
		</el-table-column>
	    <el-table-column
	   		prop="address"
            align="center"
	    	label="操作"
            width="200">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="addActivity(scope.row.id)">编辑</el-button>
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

    <!-- 新增编辑广告位弹框 -->
    <el-dialog
        :title="activiTitle"
        :visible.sync="activiVisible"
        :before-close="closeDialog"
        :close-on-click-modal = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item  label="广告位置："  prop="position">
                <el-select v-model="activiDataForm.position" clearable  placeholder="请选择广告位置">
                    <el-option
                        v-for="item in adsenses"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="轮播图名称：" prop="name">
                <el-input v-model.trim="activiDataForm.name" placeholder="请输入30字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="排序：">
            	 <el-input-number v-model="activiDataForm.sort" placeholder="数字越大排序越靠前"  :min="1" :max="99999" :step="1" label="数字越大排序越靠前"></el-input-number>
            </el-form-item>
            <el-form-item label="上传轮播图：" prop="fileList" class="imgConfig">
                <el-upload
                    v-loading="updateloading"
                    class="avatar-uploader"
                    action="3232"
                    :http-request="upLoad"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="activiDataForm.imageSrc" :src="activiDataForm.imageSrc | filterImgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <!-- adsenses:[
                    {id:'1',name:'首页'},
                    {id:'2',name:'限量'},
                    {id:'3',name:'预售'},
                    {id:'4',name:'秒杀'},
                    {id:'5',name:'精选分类'},
                    {id:'6',name:'单品折扣'},
                    {id:'7',name:'首页弹窗'},
                    {id:'8',name:'首页弹框背景'},
                ], -->
            <div v-if="activiDataForm.position == 1" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*420px</div>
            <div v-if="activiDataForm.position == 2" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*400px</div>
            <div v-if="activiDataForm.position == 3" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*400px</div>
            <div v-if="activiDataForm.position == 4" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*400px</div>
            <div v-if="activiDataForm.position == 5" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*250px</div>
            <div v-if="activiDataForm.position == 6" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*250px</div>
            <div v-if="activiDataForm.position == 7" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：300*500px</div>
            <div v-if="activiDataForm.position == 8" style="margin-left:120px;margin-bottom:20px;">只能上传jpg/png文件，且不超过5Mb，建议尺寸：375*812px</div>
            <el-form-item label="状态：" prop="state">
               <el-radio-group v-model="activiDataForm.state">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接类型：" prop="linkType">
               <el-radio-group v-model="activiDataForm.linkType"  @change="changeType" class="linktype-radio-group">
                    <el-radio :label="0">无链接</el-radio>
                    <el-radio :label="1">站内链接</el-radio>
                    <el-radio :label="2">指定商品</el-radio>
                    <el-radio :label="3">自定义链接</el-radio>
                    <el-radio :label="4">指定分类</el-radio>
                    <el-radio :label="5">指定店铺</el-radio>
                    <el-radio :label="6">指定品牌</el-radio>
                    <el-radio :label="7">指定时尚杂志</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接：" v-if="activiDataForm.linkType == '1'" prop="linkValue">
                <el-select v-model="activiDataForm.linkValue" clearable  placeholder="请选择广告位置">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="链接：" v-if="activiDataForm.linkType == '3'" prop="linkUrl">
                <!-- <el-input v-model.trim="activiDataForm.linkUrl"></el-input> -->
                <el-input
                    type="textarea"
                    placeholder="请输入链接"
                    v-model="activiDataForm.linkUrl"
                    maxlength="500"
                    clearable
                    show-word-limit
                    >
                    </el-input>
            </el-form-item>
            <el-form-item label="链接：" v-if="activiDataForm.linkType == '2' || activiDataForm.linkType == '5' || activiDataForm.linkType == '6' || activiDataForm.linkType == '7'" prop="linkValue">
                <div @click="toOpen()">{{checkItem}}</div>
            </el-form-item>
            <el-form-item label="分类：" v-if="activiDataForm.linkType == '4'" prop="linkValue" class="cascader-option">
                <el-cascader
                ref="cascaderClass"
                :options="classList"
                change-on-select
                :clearable="true"
                :props="props"
                v-model="classSelectedOptions"
                @change="classHandleChangeOut">
                ></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('activiDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('activiDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 商品弹框 -->
    <el-dialog
        title="添加商品"
        :visible.sync="goodsVisible"
        width="44%">
        <el-form :inline="true" :model="goodsdataForm">
            <el-form-item label="商品名称：">
                <el-input v-model.trim="goodsdataForm.goodsName" placeholder="商品名称/商品货号" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="选择分类：">
                <el-cascader
                    :options="classList"
                    change-on-select
                    :clearable="true"
                    :props="props"
                    v-model="selectedOptions"
                    @change="handleChangeOut">
                </el-cascader>
            </el-form-item>
            
            <el-form-item>
                <el-button class="btn" type="primary" @click="getGoodsDataList()">搜索</el-button>
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
                align="center"
                width="240">
                <template slot-scope="scope">
                    <div :title="scope.row.name">
                        {{scope.row.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idJp"
                align="center"
                label="商品ID">
            </el-table-column>
            <el-table-column
                prop="sellPrice"
                align="center"
                label="价格">
                <template slot-scope="scope">
                    <div v-if="scope.row.priceType == 'sale'">
                        {{scope.row.discountPrice}}
                    </div>
                    <div v-if="scope.row.priceType == 'proper'">
                        {{scope.row.sellPrice}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <div @click="gettem(scope.row)" :class="scope.row.id==checkFunStatus?'canClick':'checkFun'" class="checkFun"><span style="width: 5px;height: 5px;background: #fff;border-radius: 50%;"></span></div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="pageSizeChangeHandle1"
            @current-change="pageCurrentChangeHandle1"
            :current-page="goodsPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="goodsLimit"
            :total="goodsTotal"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
    <!-- 店铺弹框 -->
    <el-dialog
        title="添加店铺"
        :visible.sync="shopVisible"
        width="60%">
        <el-form :inline="true" :model="shopdataForm">
            <el-form-item label="店铺ID：">
                <el-input v-model.trim="shopdataForm.idJp" placeholder="请输入店铺ID" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model.trim="shopdataForm.name" placeholder="请输入店铺名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getshopDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="shopreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="shopdataList"
            v-loading="shopdataListLoading"
            border
            style="width: 100%">
            <el-table-column
                prop="idJp"
                label="店铺ID"
                align="center"
                width="80">
            </el-table-column>
            <el-table-column
                prop="nameJp"
                align="center"
                label="店铺日本名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="nameGlo"
                align="center"
                label="全球名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="nameCn"
                align="center"
                label="中文名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="operateFlag"
                align="center"
                label="营业状态">
                <template slot-scope="scope">
                    <div>{{operateFlagToCn(scope.row.operateFlag)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <div @click="selectShopOrBrand(scope.row)" :class="scope.row.id==checkFunStatus?'canClick':'checkFun'" class="checkFun"><span style="width: 5px;height: 5px;background: #fff;border-radius: 50%;"></span></div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="pageSizeChangeHandle2"
            @current-change="pageCurrentChangeHandle2"
            :current-page="shopPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="shopLimit"
            :total="shopTotal"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
    <!-- 品牌弹框 -->
    <el-dialog
        title="添加品牌"
        :visible.sync="brandVisible"
        width="60%">
        <el-form :inline="true" :model="branddataForm">
            <el-form-item label="品牌ID：">
                <el-input v-model.trim="branddataForm.idJp" placeholder="请输入品牌ID" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model.trim="branddataForm.name" placeholder="请输入品牌名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getbrandDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="brandreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="branddataList"
            v-loading="branddataListLoading"
            border
            style="width: 100%">
            <el-table-column
                prop="idJp"
                label="品牌ID"
                align="center"
                width="80">
            </el-table-column>
            <el-table-column
                prop="nameJp"
                align="center"
                label="品牌日本名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="nameGlo"
                align="center"
                label="全球名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="nameCn"
                align="center"
                label="中文名称"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <div @click="selectShopOrBrand(scope.row)" :class="scope.row.id==checkFunStatus?'canClick':'checkFun'" class="checkFun"><span style="width: 5px;height: 5px;background: #fff;border-radius: 50%;"></span></div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="pageSizeChangeHandle3"
            @current-change="pageCurrentChangeHandle3"
            :current-page="brandPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="brandLimit"
            :total="brandTotal"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
    <!-- 时尚弹框 -->
    <el-dialog
        title="添加时尚杂志"
        :visible.sync="fashionVisible"
        width="60%">
        <el-form :inline="true" :model="fashiondataForm">
            <el-form-item label="ID：">
                <el-input v-model.trim="fashiondataForm.idJp" placeholder="请输入编号" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="标题：">
                <el-input v-model.trim="fashiondataForm.title" placeholder="请输入标题" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="发布时间：">
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
            <el-form-item>
                <el-button class="btn" type="primary" @click="getfashionDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="fashionreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="fashiondataList"
            v-loading="fashiondataListLoading"
            border
            style="width: 100%">
            <el-table-column
                prop="idJp"
                label="ID"
                align="center"
                width="80">
            </el-table-column>
            <el-table-column
                prop="mainImageUrl"
                align="center"
                label="封面"
                width="180"> 
                <template slot-scope="scope">
                    <img v-if="scope.row.mainImageUrl" :src="getImgUrl(scope.row.mainImageUrl)" width="45" height="55" alt="封面">
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                align="center"
                label="标题"
                width="180"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="mediaName"
                align="center"
                label="发布人"
                width="180"
            </el-table-column>
            <el-table-column
                prop="publishTime"
                align="center"
                label="发布时间"
                width="180">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <div @click="selectFashion(scope.row)" :class="scope.row.id==checkFunStatus?'canClick':'checkFun'" class="checkFun"><span style="width: 5px;height: 5px;background: #fff;border-radius: 50%;"></span></div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="pageSizeChangeHandle4"
            @current-change="pageCurrentChangeHandle4"
            :current-page="fashionPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="fashionLimit"
            :total="fashionTotal"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { advList,advDelete } from '@/api/url'
    import { uploadPicBase64,zozogoodsPage,plainAdveAdd,plainAdveUpdate,adverDetail,categoryCnList,shopStoreAdvList,shopBrandAdvList,fashionAdvList } from '@/api/api'
    import Bread from "@/components/bread";
    import { getUrlBase64 } from '@/utils'
    export default {
        mixins: [mixinViewModule],
        components:{Bread},
        data () {
            return {
                checkItem:'',
                checkFunStatus:'',
                mixinViewModuleOptions: {
                    getDataListURL: advList,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/store/export',
                    deleteURL: advDelete,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                advId:'',
                dataListLoading:false,
                goodsdataListLoading:false,
                goodsdataList:[],
                goodsPage:1,
                goodsLimit:10,
                goodsTotal:0,
                buttonStatus:false,
                activiVisible:false,
                goodsVisible:false,
                // 商店
                shopdataListLoading:false,
                shopdataList:[],
                shopPage:1,
                shopLimit:10,
                shopTotal:0,
                shopVisible:false,
                // 品牌
                branddataListLoading:false,
                branddataList:[],
                brandPage:1,
                brandLimit:10,
                brandTotal:0,
                brandVisible:false,
                // 时尚
                fashiondataListLoading:false,
                fashiondataList:[],
                fashionPage:1,
                fashionLimit:10,
                fashionTotal:0,
                fashionVisible:false,
                timeArr: [],

                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                classList:[],
                activiTitle:'添加活动',
                activiDataForm:{
                    name:'',
                    position:'',
                    state:1,
                    sort:0,
                    linkType:0,
                    imageSrc:'',
                    fileList:[],
                    linkUrl:'',
                    linkValue:''
                },
                dataForm: {
                    name:'',
                    position:'',
                    state:''
                },
                goodsdataForm:{
                    goodsName:'',
                    categoryId:'',
                },
                shopdataForm:{
                    idJp: '',
                    name: '',
                },
                branddataForm:{
                    idJp: '',
                    name: '',
                },
                fashiondataForm:{
                    idJp: '',
                    title: '',
                    startTime: '',
                    endTime: '',
                },
                selectedOptions:[],
                classSelectedOptions:[],
                activitesstates: [
                    {id:'',name:'全部'},
                    {id:'1',name:'启用'},
                    {id:'0',name:'禁用'}
                ],
                address:[
                    {id:'',name:'全部'},
                    {id:'1',name:'首页'},
                    {id:'2',name:'限量'},
                    {id:'3',name:'预售'},
                    {id:'4',name:'秒杀'},
                    {id:'5',name:'精选分类'},
                    {id:'6',name:'单品折扣'},
                    {id:'7',name:'首页弹窗'},
                    {id:'8',name:'首页弹框背景'},
                ],
                adsenses:[
                    {id:'1',name:'首页'},
                    {id:'2',name:'限量'},
                    {id:'3',name:'预售'},
                    {id:'4',name:'秒杀'},
                    {id:'5',name:'精选分类'},
                    {id:'6',name:'单品折扣'},
                    {id:'7',name:'首页弹窗'},
                    {id:'8',name:'首页弹框背景'},
                ],
                typeList:[
                    {id:'1',name:'首页'},
                    {id:'2',name:'购物车'},
                    {id:'3',name:'分类'},
                    {id:'4',name:'领券中心'},
                    {id:'5',name:'秒杀'},
                    {id:'6',name:'限量预售'},
                    {id:'7',name:'精选分类'},
                    {id:'8',name:'单品折扣'},
                    {id:'9',name:'时尚纪实'},
                    {id:'10',name:'店铺新闻'},
                    {id:'11',name:'搭配集合'},
                ],
                breaddata: ["配置管理", "广告位配置"],
                updateloading: false
            }
        },
        computed:{
            dataRule(){
                return{
                    name : [
                        { required: true, message: '轮播图名称不能为空', trigger: 'blur' },
                    ],
                    position : [
                            { required: true, message: '广告位置不能为空', trigger: 'blur' },
                    ],
                    state: [
                            { required: true, message: '是否启用不能为空', trigger: 'blur' },
                    ],
                    linkType:  [
                            { required: true, message: '链接类型不能为空', trigger: 'blur' },
                    ],
                    fileList:[
                            { required: true, message: '轮播图不能为空', trigger: 'blur' },
                    ],
                    linkUrl:[
                            { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    linkValue:[
                            { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        watch: {
            'activiDataForm.name': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 60) { //输入字符大于60的时候过滤
                        this.activiDataForm.name = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'activiDataForm.linkUrl': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 500) { //输入字符大于500的时候过滤
                        this.activiDataForm.linkUrl = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
            'dataForm.name':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataForm.name = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            // 'activiDataForm.sort':function(newV,oldV) {
            //     newV=~~newV;
            //     for (let i = 0; i < newV.toString().length; i++) {
            //         if(!/[0-9]/.test(newV[i])){
            //             this.activiDataForm.sort = newV.toString().replace(newV[i],"")
            //         }
            //     }
            // },

            },
            created(){
            this.getClassList();
            this.demo();
        },
        methods: {
            //重置
            reset() {
                this.dataForm = {
                    page:1,
                    limit:10,
                    name:'',
                    position:'',
                    state:''
                };
                this.getDataList();
            },
            getData(){
                this.page =1;
                 this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(id){
                this.activiVisible = true;
                this.buttonStatus = false
                if(id){
                    this.advId = id;
                    this.activiTitle = '编辑轮播图';
                    this.getInfo(id);//判断是编辑情况下调详情方法
                }else{
                    this.activiTitle = '添加轮播图';
                    this.advId = '';
                }
            },
            //轮播图回显
            getInfo(id){
                adverDetail({id:id}).then((res)=>{
                    console.log('轮播详情',res)
                    if(res.code == 200){
                        Object.assign(this.activiDataForm,res.data);
                        this.activiDataForm.position =this.activiDataForm.position+"";
                        this.activiDataForm.fileList = [{name: '文件',url: res.data.imageSrc}];
                        if((res.data.linkType == 2 || res.data.linkType == 5 || res.data.linkType == 6 || res.data.linkType == 7)&&res.data.linkValueName){
                            this.checkItem = res.data.linkValueName;
                        }
                    }
                })
            },
            //取消弹框
            noCheck(formName){
                // this.$refs[formName].resetFields();
                this.activiDataForm.imageSrc = "";
                this.activiDataForm.position = "";
                this.activiDataForm.name = "";
                this.activiDataForm.sort = "";
                this.fileList = "";
                this.activiDataForm.state = 1;
                this.activiDataForm.linkType = 0;
                console.log(this.activiDataForm.fileList)
                this.activiVisible = false;
            },
            // 关闭弹窗
            closeDialog() {
                this.noCheck();
            },
            upLoad(file) {
                const that = this;
                
                //第一种
                let base64code = '';
                let reader = new FileReader()
                this.updateloading = true;
						    reader.readAsDataURL(file.file)
						    reader.onload  = function(event){
						    	console.log(this.result)
						    	base64code = this.result;
						    	uploadPicBase64({"imgStr": base64code}).then(res =>{
                                    that.updateloading = false;
	                    console.log(res)
	                    if(res.code == 200){
	                        that.activiDataForm.fileList = [{name: '文件',url:that.$imgDomain + res.data.url}]
	                        // that.activiDataForm.imageSrc = that.$imgDomain + res.data.url;
	                         that.activiDataForm.imageSrc = res.data.url;
	                    }else{
	                        that.$message.error('上传失败');
	                    }
	                })
						    }
	    				 	
		    				
//		    				//第二种
//              getUrlBase64(URL.createObjectURL(file.file),file.file.type,function (base) {
//                  console.log(base);
//                  uploadPicBase64({"imgStr": base}).then(res =>{
//                      console.log(res)
//                      if(res.code == 200){
//                          that.activiDataForm.fileList = [{name: '文件',url:that.$imgDomain + res.data.url}]
//                          // that.activiDataForm.imageSrc = that.$imgDomain + res.data.url;
//                           that.activiDataForm.imageSrc = res.data.url;
//                      }else{
//                          that.$message.error('上传失败');
//                      }
//                  })
//              })
            },
            beforeAvatarUpload(file) {
                console.log('3333333333',file.type)
                let isJPG = false;
                if(file.type == 'image/jpeg'||file.type=='image/png'){
                    isJPG = true;
                }
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG) {
                    this.activiDataForm.fileList = [];
                    this.$message.error('上传头像图片只能是jpg/png格式!');
                }
                if (!isLt2M) {
                    this.activiDataForm.fileList = [];
                    this.$message.error('上传头像图片大小不能超过5MB!');
                }
                return isJPG && isLt2M;
            },
            changeType(val){
                console.log(val)
                this.checkItem = '';
                this.checkFunStatus = '';
                this.activiDataForm.linkValue = '';
                this.activiDataForm.linkValueName = '';
                this.activiDataForm.linkUrl = '';
                this.classSelectedOptions = [];
                if(val == 2){
                    this.goodsVisible = true;
                    this.getGoodsDataList();
                    // this.getClassList();
                } else if(val == 5){
                    this.shopVisible = true;
                    this.getshopDataList();
                }else if(val == 6){
                    this.brandVisible = true;
                    this.getbrandDataList();
                }else if(val == 7){
                    this.fashionVisible = true;
                    this.getfashionDataList();
                }else{
                    this.goodsVisible = false;
                    this.shopVisible = false;
                    this.brandVisible = false;
                    this.fashionVisible = false;
                }
            },
            //提交新增编辑活动
            subActivity(formName){
                console.log(this.activiDataForm.linkUrl)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.buttonStatus = true;
                        if(!this.advId){
                            plainAdveAdd(this.activiDataForm).then((res)=>{
                                console.log('新增结果',res)
                                this.buttonStatus = false;
                                if(res.code == 200){
                                    this.$message.success('新增成功');
                                    this.$refs[formName].resetFields();
                                    this.activiDataForm.imageSrc = '';
                                    this.activiDataForm.linkValue = '';
                                    this.activiDataForm.linkValueName = '';
                                    this.activiVisible = false;
                                    this.checkItem = '';
                                    this.checkFunStatus = ''
                                    this.activiDataForm.sort = 0;
                                    this.getDataList();
                                }else{
                                    this.$message.error(res.msg);
                                }
                            })
                        }else{
                            plainAdveUpdate(this.activiDataForm).then((res)=>{
                                console.log('编辑结果',res)
                                this.buttonStatus = false;
                                if(res.code == 200){
                                    this.$message.success('编辑成功');
                                    this.$refs[formName].resetFields();
                                    this.activiDataForm.imageSrc = '';
                                    this.activiDataForm.linkValue = '';
                                    this.activiDataForm.linkValueName = '';
                                    this.activiVisible = false;
                                    this.checkItem = '';
                                    this.checkFunStatus = '';
                                    this.activiDataForm.sort = 0;
                                    this.getDataList();
                                }else{
                                    this.$message.error(res.msg);
                                }
                            })
                        }
                    }
                });
            },

            // 分页, 每页条数
            pageSizeChangeHandle1(val) {
                this.goodsPage = 1;
                this.goodsLimit = val;
                this.getGoodsDataList()
            },
            // 分页, 当前页
            pageCurrentChangeHandle1(val) {
                this.goodsPage = val;
                this.getGoodsDataList();
            },
            // 分页, 每页条数
            pageSizeChangeHandle2(val) {
                this.shopPage = 1;
                this.shopLimit = val;
                this.getshopDataList()
            },
            // 分页, 当前页
            pageCurrentChangeHandle2(val) {
                this.shopPage = val;
                this.getshopDataList();
            },
            // 分页, 每页条数
            pageSizeChangeHandle3(val) {
                this.brandPage = 1;
                this.brandLimit = val;
                this.getbrandDataList()
            },
            // 分页, 当前页
            pageCurrentChangeHandle3(val) {
                this.brandPage = val;
                this.getbrandDataList();
            },
            // 分页, 每页条数
            pageSizeChangeHandle4(val) {
                this.fashionPage = 1;
                this.fashionLimit = val;
                this.getfashionDataList()
            },
            // 分页, 当前页
            pageCurrentChangeHandle4(val) {
                this.fashionPage = val;
                this.getfashionDataList();
            },

            handleChangeOut(val){
                console.log(val)
                this.goodsdataForm.categoryId = val[val.length-1];
            },
            classHandleChangeOut(val) {
                this.activiDataForm.linkValueName = this.$refs.cascaderClass.currentLabels.join('/');
                this.activiDataForm.linkValue = val[val.length-1];
            },
            // 联动分类
            getClassList(){
                categoryCnList({}).then((res)=>{
                    console.log('联动分类',res.data)
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
            toOpen(){
                console.log('toOpen')
                switch (this.activiDataForm.linkType) {
                    case 2:
                        this.goodsVisible = true;
                        this.getGoodsDataList();
                        break;
                    
                    case 5:
                        this.shopVisible = true;
                        this.getshopDataList();
                        break;
                    
                    case 6:
                        this.brandVisible = true;
                        this.getbrandDataList();
                        break;

                    case 7:
                        this.fashionVisible = true;
                        this.getfashionDataList();
                        break;

                    default:
                        break;
                }
            },
            // 弹框商品列表查询
            getGoodsDataList(){
                this.goodsdataListLoading = true;
                zozogoodsPage({
                        params: {
                            page:this.goodsPage,
                            limit:this.goodsLimit,
                            goodsName:this.goodsdataForm.goodsName,
                            categoryId:this.goodsdataForm.categoryId,
                            showWeb:'1'
                        }
                    }).then((res)=>{
                    console.log('数据',res)
                    if(res.code == 200){
                        this.goodsdataListLoading = false;
                        this.goodsTotal = Number(res.data.total);
                        this.goodsdataList = res.data.list;
                    }
                })
            },
            //弹框商品列表重置
            goodsreset(){
                this.goodsPage = 1;
                this.goodsLimit = 10;
                this.goodsdataForm = {
                    goodsName : '',
                    categoryId : ''
                };
                this.selectedOptions = [];
                this.getGoodsDataList()
            },
            gettem(item){
                console.log(item)
                this.checkFunStatus = item.id;
                this.checkItem = item.name;//数据正常后改为中国商品名称
                this.activiDataForm.linkValue = item.id;
                this.activiDataForm.linkValueName = this.checkItem;
            },
            // 店铺列表
            getshopDataList(){
                this.shopdataListLoading = true;
                shopStoreAdvList({
                    params: {
                        page: this.shopPage,
                        limit: this.shopLimit,
                        idJp: this.shopdataForm.idJp,
                        name: this.shopdataForm.name
                    }
                }).then((res) => {
                    this.shopdataListLoading = false;
                    this.shopTotal = Number(res.data.total);
                    this.shopdataList = res.data.list;
                })
            },
            shopreset(){
                this.shopPage = 1;
                this.shopLimit = 10;
                this.shopdataForm = {
                    idJp : '',
                    name : ''
                };
                this.getshopDataList()
            },
            selectShopOrBrand(item) {
                this.checkFunStatus = item.id;
                this.checkItem = item.nameCn;//数据正常后改为中国商品名称
                this.activiDataForm.linkValue = item.id;
                this.activiDataForm.linkValueName = this.checkItem;
            },
            operateFlagToCn(operateFlag) {
                let operateStatusStr = '';
                switch (operateFlag) {
                    case 0:
                        operateStatusStr = '待营业';
                        break;

                    case 1:
                        operateStatusStr = '营业中';
                        break;
                    
                    case 2:
                        operateStatusStr = '已停业';
                        break;
                    
                    default:
                        operateStatusStr = '暂无信息';
                        break;
                }
                return operateStatusStr;
            },
            // 品牌
            getbrandDataList() {
                this.branddataListLoading = true;
                shopBrandAdvList({
                    params: {
                        idJp: this.branddataForm.idJp,
                        name: this.branddataForm.name,
                        page: this.brandPage,
                        limit: this.brandLimit,
                    }
                }).then((res) => {
                    this.branddataListLoading = false;
                    this.brandTotal = Number(res.data.total);
                    this.branddataList = res.data.list;
                })
            },
            brandreset(){
                this.brandPage = 1;
                this.brandLimit = 10;
                this.branddataForm = {
                    idJp : '',
                    name : ''
                };
                this.getbrandDataList();
            },
            // 时尚
            getfashionDataList() {
                this.fashiondataListLoading = true;
                this.fashiondataForm.startTime = this.timeArr && this.timeArr[0];
                this.fashiondataForm.endTime = this.timeArr && this.timeArr[1];
                fashionAdvList({
                    params: {
                        idJp: this.fashiondataForm.idJp,
                        title: this.fashiondataForm.title,
                        startTime: this.fashiondataForm.startTime,
                        endTime: this.fashiondataForm.endTime,
                        page: this.fashionPage,
                        limit: this.fashionLimit,
                    }
                }).then((res) => {
                    this.fashiondataListLoading = false;
                    this.fashionTotal = Number(res.data.total);
                    this.fashiondataList = res.data.list;
                })
            },
            fashionreset(){
                this.fashionPage = 1;
                this.fashionLimit = 10;
                this.fashiondataForm = {
                    idJp: '',
                    title: '',
                    startTime: '',
                    endTime: '',
                };
                this.getfashionDataList();
            },
            selectFashion(item) {
                this.checkFunStatus = item.id;
                this.checkItem = item.title;
                this.activiDataForm.linkValue = item.id;
                this.activiDataForm.linkValueName = this.checkItem;
            },
            getImgUrl(url) {
                if(url.includes('http')) {
                    return url;
                }
                return this.$imgDomain + url;
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
    img{
        object-fit: contain;
    }
    .el-input {
        width: 170px;
        height: 40px;
    }
    .activiDialog{
        .el-input {
            width: 300px;
        }
    }
    .imgConfig{
        /deep/.el-form-item__content{
            display: flex;
            .avatar-uploader{
                width: 100px;
                height: 100px;
                .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    display: block;
                }
            }
        }
    }
    /deep/.cell{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .checkFun{
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        border: 1px solid #999;
        border-radius: 50%;
    } 
    .canClick{
        border: none;
        border-radius: 50%;
        background: #2260D2;
    }
/*    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/
    /deep/ .cell{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .linktype-radio-group .el-radio {
        display: inline-block;
        margin: 5px;
    }
</style>

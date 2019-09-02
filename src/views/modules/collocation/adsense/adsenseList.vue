<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="轮播图名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入轮播图名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告位置：">
            <el-input v-model="dataForm.storeId" placeholder="请输入广告位置" clearable></el-input>
        </el-form-item>
        <el-form-item  label="活动状态：">
            <el-select v-model="dataForm.gradeId" clearable  placeholder="请选择">
                <el-option
                    v-for="item in activitesstates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button type="primary" @click="addActivity()">添加轮播图</el-button>
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
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
		    prop="id"
		    label="轮播图名称"
		    width="240">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="创建时间">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="状态">
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="链接类型">
		</el-table-column>
        <el-table-column
		    prop="createDate"
		    label="广告位置">
		</el-table-column>
        <el-table-column
		    prop="createDate"
		    label="排序">
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="addActivity(scope.row.id)">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small">删除</el-button>
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
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item  label="广告位置："  prop="adverce">
                <el-select v-model="activiDataForm.adverce" clearable  placeholder="请选择广告位置">
                    <el-option
                        v-for="item in adsenses"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="轮播图名称：" prop="sgName">
                <el-input v-model="activiDataForm.sgName" placeholder="请输入30字以内的名称" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="排序：">
                <el-input v-model="activiDataForm.sort" placeholder="数字越大排序越靠前" type="number" :maxlength="3"></el-input>
            </el-form-item>
            <el-form-item label="上传轮播图：" prop="fileList">
                <el-upload
                   class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-remove="handleRemove"
                    :limit="1"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :file-list="activiDataForm.fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5Mb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="状态：" prop="radio">
               <el-radio-group v-model="activiDataForm.radio">
                    <el-radio label="0">启用</el-radio>
                    <el-radio label="1">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接类型：" prop="type">
               <el-radio-group v-model="activiDataForm.type"  @change="changeType">
                    <el-radio label="0">无链接</el-radio>
                    <el-radio label="1">站内链接</el-radio>
                    <el-radio label="2">指定商品</el-radio>
                    <el-radio label="3">自定义链接</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接：" v-if="activiDataForm.type == '1'" prop="typeName">
                <el-select v-model="activiDataForm.typeName" clearable  placeholder="请选择广告位置">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="链接：" v-if="activiDataForm.type == '3'" prop="typeName">
                <el-input v-model="activiDataForm.typeName"></el-input>
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
        width="40%">
        <el-form :inline="true" :model="goodsdataForm">
            <el-form-item label="商品名称：">
                <el-input v-model="goodsdataForm.storeId" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getgoodsDataList()">查询</el-button>
                <el-button class="btn"  type="primary" plain @click="goodsreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="goodsdataForm.radio">
            <el-table
                :data="goodsdataList"
                v-loading="dataListLoading"
                border
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="商品名称"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="account"
                    label="商品ID">
                </el-table-column>
                <el-table-column
                    prop="gradeName"
                    label="价格">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row.id" @change="gettem($event,scope.row)">备选项</el-radio>
                    </template>
                </el-table-column>
            </el-table>
        </el-radio-group>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { zozogoodsPage } from '@/api/api'
    import Bread from "@/components/bread";
    import { getUrlBase64 } from '@/utils'
    
    export default {
        mixins: [mixinViewModule],
        components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: businessPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                goodsdataList:[],
                buttonStatus:false,
                activiVisible:false,
                goodsVisible:false,
                activiTitle:'添加活动',
                activiDataForm:{
                    sgName:'',
                    adverce:'',
                    radio:'0',
                    sort:0,
                    type:'0',
                    imageUrl:'',
                    fileList:[],
                    typeName:''
                },
                dataForm: {
                    gradeId:'',
                    storeType:'',
                },
                goodsdataForm:{
                    storeId:'',
                    radio:''
                },
                activitesstates: [
                    {id:'0',name:'启用'},
                    {id:'1',name:'禁用'}
                ],
                adsenses:[
                    {id:'1',name:'首页'},
                    {id:'2',name:'秒杀'},
                    {id:'3',name:'限量'},
                    {id:'4',name:'预售'},
                    {id:'5',name:'精选分类'},
                    {id:'6',name:'首页弹框'},
                ],
                typeList:[
                    {id:'0',name:'首页'},
                    {id:'1',name:'购物车'},
                    {id:'2',name:'分类'},
                    {id:'3',name:'领券中心'},
                    {id:'4',name:'限量预售'},
                    {id:'5',name:'精选分类'},
                    {id:'6',name:'单品折扣'},
                    {id:'7',name:'时尚纪实'},
                    {id:'8',name:'店铺新闻'},
                    {id:'9',name:'搭配集合'},

                ],
                breaddata: ["配置管理", "广告位配置"],
            }
        },
        computed:{
            dataRule(){
                return{
                    sgName : [
                        { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    ],
                    adverce : [
                            { required: true, message: '广告位置不能为空', trigger: 'blur' },
                    ],
                    radio: [
                            { required: true, message: '是否启用不能为空', trigger: 'blur' },
                    ],
                    type:  [
                            { required: true, message: '链接类型不能为空', trigger: 'blur' },
                    ],
                    fileList:[
                            { required: true, message: '轮播图不能为空', trigger: 'blur' },
                    ],
                    typeName:[
                            { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        created(){
            this.demo();
        },
        methods: {
            //重置
            reset() {
                this.dataForm = {};
                this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(id){
                this.activiVisible = true;
                if(id){
                    this.activiTitle = '编辑轮播图';
                    this.getInfo(id);//判断是编辑情况下调详情方法
                }else{
                    this.activiTitle = '添加轮播图';
                }
            },
            //取消弹框
            noCheck(formName){
                this.$refs[formName].resetFields();
                console.log(this.activiDataForm.fileList)
                this.activiVisible = false;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handleAvatarSuccess(res, file) {
                console.log('===???',file.raw.type,URL.createObjectURL(file.raw))
                getUrlBase64(URL.createObjectURL(file.raw),file.raw.type,function (base) {
                    console.log('ppppppp',base)
                })

            },
            beforeAvatarUpload(file) {
                console.log('3333333333',file.type)
                let isJPG = false;
                if(file.type == 'image/jpg'||file.type=='image/png'){
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
                if(val == 2){
                    this.goodsVisible = true;
                    zozogoodsPage({
                        page:1,
                        limit:10
                    }).then((res)=>{
                        console.log('数据',res)
                    })
                }else{
                    this.goodsVisible = false;
                }
            },
            //提交新增编辑活动
            subActivity(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        
                    }
                });
            },

            getgoodsDataList(){

            },
            goodsreset(){

            },
            gettem($event,item){
                console.log($event,item)
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
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog{
    .el-input {
        width: 300px;
    }
}

</style>

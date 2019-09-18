<template>
    <div>
      <!-- 商品数据组合表格 -->
      <el-table
        :data="dataForm.goodsSpecSaveDTOList"
        border
        style="width: 100%">    

        <el-table-column
            type="selection"
            width="70">
        </el-table-column>

        <el-table-column
          prop="specAttrName"
          label="主规格"
          align="center">
              <template slot-scope="scope">
                <!-- <span>{{scope.row.specName.replace(dataForm.goodsName,"")}}</span> -->
                  <span  v-if="scope.row.specAttrName.split(',').length>0">{{scope.row.specAttrName.split(',')[0]}}</span>
              </template>
        </el-table-column>

          <el-table-column
          v-if="choosedSpecLevel_2.length >1"
          prop="specAttrName"
          label="规格值"
          align="center">
              <template slot-scope="scope">
                  <span v-if="scope.row.specAttrName.split(',').length>1">{{scope.row.specAttrName.split(',')[1]}}</span>
              </template>
        </el-table-column>

        <el-table-column
          v-if="choosedSpecLevel_2.length >2"
          prop="specAttrName"
          label="规格值"
          align="center"> 
              <template slot-scope="scope">
                  <span v-if="scope.row.specAttrName.split(',').length>2">{{scope.row.specAttrName.split(',')[2]}}</span>
              </template>
        </el-table-column>

          <el-table-column
          prop="specSellPrice"
          label="销售价"
          align="center">
            <template slot-scope="scope">
			        <!-- <el-input v-model="scope.row.specSellPrice" maxlength="30" placeholder="请输入" show-word-limit ></el-input> -->
               <el-input-number v-model="scope.row.specSellPrice" :precision="2" :step="1"  controls-position="right" :min="0" @change="changeInput"  @input="changeInput" ></el-input-number>
            </template>
        </el-table-column>
        
          <el-table-column
          prop="specCostPrice"
          label="成本价"
          align="center">
            <template slot-scope="scope">
			        <!-- <el-input v-model="scope.row.specCostPrice" maxlength="30" placeholder="请输入" show-word-limit></el-input> -->
              <el-input-number v-model="scope.row.specCostPrice" :precision="2" :step="1"  controls-position="right" :min="0"  @change="changeInput"  @input="changeInput"></el-input-number>
            </template>
        </el-table-column>

        <el-table-column
          prop="specStorage"
          label="库存"
          align="center">
            <template slot-scope="scope">
			        <!-- <el-input v-model="scope.row.specStorage" maxlength="30" placeholder="请输入"  @change="changeInput"  @input="changeInput" show-word-limit></el-input> -->
               <el-input-number v-model="scope.row.specStorage" :precision="0" :step="1"  controls-position="right" :min="0"  @change="changeInput"  @input="changeInput"></el-input-number>
            </template>
        </el-table-column>
        
        <el-table-column
          prop="specSerial"
          label="商品编码"
          align="center">
            <template slot-scope="scope">
			        <!-- <el-input v-model="scope.row.specSerial" maxlength="30" placeholder="请输入"  @change="changeInput"  @input="changeInput" show-word-limit></el-input> -->
                <el-input-number v-model="scope.row.specSerial" :precision="0" :step="1"  controls-position="right" :min="0"  @change="changeInput"  @input="changeInput"></el-input-number>
            </template>
        </el-table-column>

        <!-- <el-table-column  header-align="center" align="center">
            <template slot-scope="scope">
            </template>
        </el-table-column> -->
      </el-table>
       <div style="margin-top:10px;margin-bottom:10px;" v-if="!goodsSpecSaveDTOList==0">
					<el-button @click="batch()"   type="primary"  size="mini">批量</el-button>
       </div>
    </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep'

export default {
  data () {
    return {
        goodsSpecSaveDTOList:[],
    }
  },
  props:["dataForm","choosedSpecLevel_1","choosedSpecLevel_2"],
  // watch:{
  //     'dataForm.goodsSpecSaveDTOList' (val) {
  //         this.savePreData();
  //     } 
  // },
  components: {
  },
  created () {
  },
  methods: {
        savePreData(){
          // var goodsSpecSaveDTOList = cloneDeep(goodsSpecSaveDTOList);
          // var goodsSpecSaveDTOList2  =  cloneDeep(this.dataForm.goodsSpecSaveDTOList);
          //   goodsSpecSaveDTOList.forEach((item,index)=>{
          //      goodsSpecSaveDTOList2.forEach(()=>{

          //       })
          //   })

            // this.goodsSpecSaveDTOList = cloneDeep(this.dataForm.goodsSpecSaveDTOList);
            //  this.goodsSpecSaveDTOList = this.dataForm.goodsSpecSaveDTOList;
            console.log(this.dataForm.goodsSpecSaveDTOList);
        },
        changeInput(){
           console.log(this.dataForm.goodsSpecSaveDTOList);
           let totalSpecStorage = 0 ;
           this.dataForm.goodsSpecSaveDTOList.forEach((item,index)=>{
                totalSpecStorage  +=  parseInt(item.specStorage)
           })
           if(totalSpecStorage) this.$parent.$parent.$parent.$parent.dataForm.specStorage = totalSpecStorage;
           this.$parent.$parent.goodsSpecSaveDTOList = cloneDeep(this.dataForm.goodsSpecSaveDTOList);
        },
        batch(){
           this.$confirm('是否批量设置销售价、成本价、库存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                  let totalSpecStorage = 0 ;
                  let  firstSpecSellPrice = 0;
                  let  firstSpecCostPrice = 0;
                  let  firstSpecStorage = 0;
                  this.dataForm.goodsSpecSaveDTOList.forEach((item,index)=>{
                        totalSpecStorage  +=  parseInt(item.specStorage)
                        if(index==0){
                            firstSpecSellPrice = item.specSellPrice
                            firstSpecCostPrice = item.specCostPrice
                            firstSpecStorage = item.specStorage
                        }else{
                            item.specSellPrice = firstSpecSellPrice
                            item.specCostPrice = firstSpecCostPrice
                            item.specStorage = firstSpecStorage
                        }
                  })
                  if(totalSpecStorage) this.$parent.$parent.$parent.$parent.dataForm.specStorage = totalSpecStorage;
                  this.$parent.$parent.goodsSpecSaveDTOList = cloneDeep(this.dataForm.goodsSpecSaveDTOList);
            }).catch(() => {});
         }
       

  }
}
</script>

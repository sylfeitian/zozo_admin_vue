import http from '@/utils/request'


let base = "/admin-api";
let requestType = { headers: { 'content-type': 'application/x-www-form-urlencoded' } };
//首页  
export const gethomepage = params => { return http.get(`${base}/homepage`, params).then(res => res.data); };
//广告--------------------------------------------------------------------------------------------------------------
//添加禁用词   
export const addadvertisingban = params => { return http.post(`${base}/advertisingban/add`, params).then(res => res.data); };



// 上传图片--------------------------------------------------------------------------------------------------------------------
//Base64上传图片
export const uploadPicBase64 = params => { return http.post(`${base}/picture/base64`, params).then(res => res.data); };

//基础--------------------------------------------------------------------------------------------------------------------------
// 新增/修改分类
export const updatasizeCn = params => { return http.put(`${base}/sizeCn`, params).then(res => res.data); };
//分类条件
export const gettagdatalist = params => { return http.get(`${base}/tag/page`, params).then(res => res.data); };
//分类条件编辑
export const uploadtag = params => { return http.put(`${base}/tag?name=${params.name}&id=${params.id}`, params).then(res => res.data); };
//日本尺码管理关联  
export const uploadsizejptag = params => { return http.put(`${base}/sizejp?cnSizeId=${params.cnSizeId}&id=${params.id}&name=${params.name}`, params).then(res => res.data); };
//获取中国尺码  
export const getsizecn = params => { return http.get(`${base}/sizejp/getsizecn`, params).then(res => res.data); };

//内容------------------------------------------------------------------------------------
//内容搭配查看  
export const getlookdetail = params => { return http.get(`${base}/look/${params.id}`, params).then(res => res.data); };
//取消发布  
export const putoperating = params => { return http.put(`${base}/look/publish/${params.operating}/${params.id}?operating=${params.operating}&id=${params.id}`, params).then(res => res.data); };
//搭配列表查看  
export const getlookfolderdetail = params => { return http.get(`${base}/look/folder/${params.id}`, params).then(res => res.data); };


//仓库管理--------------------------------------------------------------------------------------------------------
// 获取所有仓库
export const getallstockname = params => { return http.get(`${base}/wareHouse/odoGoods/houseName`, params).then(res => res.data); };
// 获取弹框仓库商品
export const getallstock = params => { return http.get(`${base}/wareHouse/odoGoods/stock/page`, params).then(res => res.data); };
// 保存商品  
export const addodoGoods = params => { return http.post(`${base}/wareHouse/odoGoods/add`, params).then(res => res.data); };

//中国分类管理--------------------------------------------------------------------------------------------------------------------
// 获取一级分类
export const categoryCn = params => { return http.get(`${base}/categoryCn`, params).then(res => res.data); };
// 删除分类接口
export const deleteCategoryCn = params => { return http.delete(`${base}/categoryCn/delete`, params).then(res => res.data); };
// 新增/修改分类
export const updataCategoryCn = params => { return http.put(`${base}/categoryCn/edit`, params).then(res => res.data); };
// 关联查询一级二级三级分类
export const categoryCnList = params => { return http.get(`${base}/categoryCn/listCorrelated`, params).then(res => res.data); };
// 分页查询分类
export const getdatalist = params => { return http.get(`${base}/categoryCn/page`, params).then(res => res.data); };
// 设为推荐
export const recommendCategoryCn = params => { return http.put(`${base}/categoryCn/recommend`, params).then(res => res.data); };
// 搜索用分类列表
export const searchCategoryCn = params => { return http.get(`${base}/categoryCn/search/list`, params).then(res => res.data); };
// 是否显示分类
export const showCategoryCn = params => { return http.put(`${base}/categoryCn/show`, params).then(res => res.data); };
// 修改排序号
export const categoryCnSort = params => { return http.put(`${base}/categoryCn/sort`, params).then(res => res.data); };
// 根据分类id查询中方分类
export const backScanCategoryCn = params => { return http.get(`${base}/categoryCn/${params.id}`, params).then(res => res.data); };





// 属性管理--------------------------------------------------------------------------------------------------------------------
//  列表模块(主要是下拉用)
export const attributeList = params => { return http.get(`${base}/attribute/page`, params, requestType).then(res => res.data); };

//添加属性
export const addAttribute = params => { return http.post(`${base}/attribute`, params).then(res => res.data); };
// 编辑回显
export const backScanAttribute = params => { return http.get(`${base}/attribute/${params.id}`).then(res => res.data); };
//编辑属性
export const updateAttribute = params => { return http.put(`${base}/attribute`, params).then(res => res.data); };

// 分组模块
//添加属性分组
export const addAttributegroup = params => { return http.post(`${base}/attributegroup`, params).then(res => res.data); };
// 编辑回显
export const backScanAttributegroup = params => { return http.get(`${base}/attributegroup/${params.id}`).then(res => res.data); };
// 编辑属性分组
export const updateAttributegroup = params => { return http.put(`${base}/attributegroup`, params).then(res => res.data); };

// 启用禁用属性分组
export const statusAttributegroup = params => { return http.post(`${base}/attributegroup/status`, params, requestType).then(res => res.data); };

//商品分类 --------------------------------------------------------------------------------------------------------------------
//  商品分类--------------------------------------------------------------------------------------------------------------------
// 商品分类级联查询
export const getGoodscalss = params => { return http.get(`${base}/goodsclass/child/${params.id}`, params).then(res => res.data); };
// 查询所有分类(分层级关系
export const allGoodsclass = params => { return http.get(`${base}/goodsclass/all/goodclass`, params).then(res => res.data); };
// 根据id查询分类所有信息
export const goodsclassById = params => { return http.get(`${base}/goodsclass/${params.params.gcId}`, params).then(res => res.data); }
//新建
export const addGoodsclass = params => { return http.post(`${base}/goodsclass`, params).then(res => res.data); }
//编辑
export const updataGoodsclass = params => { return http.put(`${base}/goodsclass`, params).then(res => res.data); }
// 根据分类id查询品牌信息
export const goodsclassBrandById = params => { return http.get(`${base}/goodsclass/brand/id`,params).then(res => res.data); }

// 查询全部一级分类/根据父级分类查出子级分类
// export const goodsclassPage = params => { return http.get(`${base}/goodsclass/page`,params).then(res => res.data); }

// 商品展示类目管理--------------------------------------------------------------------------------------------------------------------
//类目列表
// export const backstageList = params => { return http.get(`${base}/goods/classcustom/all`).then(res => res.data); }
//新建
export const addGoodsclasscustom = params => { return http.post(`${base}/goods/classcustom`, params).then(res => res.data); }
//编辑
export const updataGoodsclasscustom = params => { return http.put(`${base}/goods/classcustom`, params).then(res => res.data); }
// 根据id查询分类所有信息
export const goodsclasscustomById = params => { return http.get(`${base}/goods/classcustom/${params.params.gcId}`, params).then(res => res.data); }
//   启用/禁用展示类目
export const goodsclasscustomUpdateShow = params => { return http.get(`${base}/goods/classcustom/update/show`, params).then(res => res.data); }



// 查询规格分组及规格列表
// export const attributegroupListSpec = params => { return http.get(`${base}/attributegroup/list/spec`, params,requestType).then(res => res.data); };

// 商品管理--------------------------------------------------------------------------------------------------------------------
//添加商品
export const addGoods = params => { return http.post(`${base}/goods`, params).then(res => res.data); };
// 编辑商品，商品修改
export const updateGoods = params => { return http.put(`${base}/goods`, params).then(res => res.data); };
// 编辑回显
// export const backScanGoods = params => { return http.get(`${base}/goods/${params.id}`).then(res => res.data); }
// 编辑回显
export const backScanDetailGoods = params => { return http.get(`${base}/goods/detail/${params.id}`).then(res => res.data); }
// 商品上下架状态批量修改
// export const showBatchGoods = params => { return http.put(`${base}/goods/show?goodsShow=${params.goodsShow}`, params.ids).then(res => res.data); };
// 单个商品上下架状态修改
// export const showGoods = params => { return http.put(`${base}/goods/show/${params.id}`, params).then(res => res.data); };

// 商品审核--------------------------------------
//修改商品审核状态
// export const checkGoods = params => { return http.put(`${base}/goods/check`, params).then(res => res.data); };
//批量修改商品审核状态
export const checkBatchGoods = params => { return http.put(`${base}/goods/check/batch?goodsStatus=${params.goodsStatus}&rejectReason=${params.rejectReason}`, params.ids).then(res => res.data); };


// 商品规格管理------------------------------------------------------------------------------------------------------
// 分页查询商品SKU列表
// export const goodsSpecPage = params => { return http.post(`${base}/goods/spec/page`, params).then(res => res.data); };
// 商品规格上下架状态批量修改
export const goodsSpecShow = params => { return http.put(`${base}/goods/spec/show?specShow=${params.specShow}`, params.ids).then(res => res.data); };
// 商品规格回显
export const backScangoodsSpec = params => { return http.get(`${base}/goods/spec/${params.id}`).then(res => res.data); };
// 修改商品sku
export const updateGoodsSpecSku = params => { return http.put(`${base}/goods/spec/sku`, params).then(res => res.data); };

// 价格管理 价格修改记录管理--------------------------------------------------------------------------------------------------------------------
// 修改价格记录
export const updatePrice = params => { return http.post(`${base}/price/log`, params).then(res => res.data); };
// 根据ID获取信息
export const backScanPrice = params => { return http.get(`${base}/price/log/${params.id}`, params).then(res => res.data); };


// PUT /goods/spec/update/price
// 根据ID获取价格和库存信息
export const backScanPriceAndStorage = params => { return http.get(`${base}/goods/spec/price/storage/${params.id}`, params).then(res => res.data); };
// 批量修改价格
export const uptateprice = params => { return http.put(`${base}/goods/spec/update/price`, params).then(res => res.data); };
//批量修改库存
export const updataStorage = params => { return http.put(`${base}/goods/spec/update/storage`, params).then(res => res.data); };




// 库存管理 库存修改记录管理---------------------------------------------------------------------------------------------------------------------
// 修库存记录
export const updateStock = params => { return http.post(`${base}/stock/log`, params).then(res => res.data); };
// 根据ID获取信息
export const backScanStock = params => { return http.get(`${base}/stock/log/${params.id}`, params).then(res => res.data); };

// 售后模板---------------------------------------------------------------------------------------------------
//  列表模块(主要是下拉用)
export const aftertemplateList = params => { return http.get(`${base}/aftertemplate/list`, params).then(res => res.data); };
//保存售后模板
export const addAftertemplate = params => { return http.post(`${base}/aftertemplate`, params).then(res => res.data); };
//修改售后模板
export const updateAftertemplate = params => { return http.put(`${base}/aftertemplate`, params).then(res => res.data); };
// 根据id查询售后模板
export const backScanAftertemplate = params => { return http.get(`${base}/aftertemplate/${params.id}`, params).then(res => res.data); };

// 规格管理-------------------------------------------------------------------------------------------------------------------------------------
//  列表模块(主要是下拉用)
export const specList = params => { return http.get(`${base}/spec/page`, params, requestType).then(res => res.data); };

//添加规格
export const addSpec = params => { return http.post(`${base}/spec`, params).then(res => res.data); };
// 编辑回显
export const backScanSpec = params => { return http.get(`${base}/spec/${params.id}`).then(res => res.data); }
//编辑规格
export const updateSpec = params => { return http.put(`${base}/spec`, params).then(res => res.data); };

//添加规格分组
export const addSpecgroup = params => { return http.post(`${base}/specgroup`, params).then(res => res.data); };
// 编辑回显
export const backScanSpecgroup = params => { return http.get(`${base}/specgroup/${params.id}`).then(res => res.data); }
// 编辑规格分组
export const updateSpecgroup = params => { return http.put(`${base}/specgroup`, params).then(res => res.data); };

// 启用禁用规格分组
export const statusSpecgroup = params => { return http.post(`${base}//specgroup/status`, params, requestType).then(res => res.data); };



// 品牌管理--------------------------------------------------------------------------------------------------------------------
// 品牌列表（主要用于下拉）
// 编辑回显   不带分页
export const brandListPull = params => { return http.get(`${base}/brand/list`, params).then(res => res.data); }
// 品牌列表 带分页
export const brandList = params => { return http.get(`${base}/brand/page`, params).then(res => res.data); }
//添加品牌
export const addBrand = params => { return http.post(`${base}/brand`, params).then(res => res.data); };
// 编辑回显
export const backScanBrand = params => { return http.get(`${base}/brand/${params.id}`).then(res => res.data); }
//编辑品牌
export const updateBrand = params => { return http.put(`${base}/brand`, params).then(res => res.data); };



// 会员管理--------------------------------------------------------------------------------------------------------------------
// 会员启用与禁用
export const updateMembergrade = params => { return http.put(`${base}/member/state/${params.id}`, params).then(res => res.data); };
//会员编辑详情
export const memberDet = params => { return http.get(`${base}/member/edit/${params.id}`, params).then(res => res.data); };
//会员查看详情
export const memberDetTable = params => { return http.get(`${base}/member/${params.id}`, params).then(res => res.data); };
//会员地址
export const memberAdd = params => { return http.get(`${base}/address/${params.id}`, params).then(res => res.data); };
//设置默认地址
export const setDefault = params => { return http.put(`${base}/address/default/flag?id=${params.id}&defaultFlag=${params.defaultFlag}&memberId=${params.memberId}`, params).then(res => res.data); };
//会员等级详情
export const greadDet = params => { return http.get(`${base}/membergrade/${params.id}`, params).then(res => res.data); };
//获取密码
export const restPassword = params => { return http.put(`${base}/member/reset/passwd?id=${params.id}&mobile=${params.mobile}`, params).then(res => res.data); };
//修改会员等级
export const changeGrade = params => { return http.put(`${base}/membergrade`, params).then(res => res.data); };
//新建、保存会员等级
export const addSavaGrade = params => { return http.post(`${base}/membergrade`, params).then(res => res.data); };
//会员订单
export const memberOrders = params => { return http.get(`${base}/order/${params.id}`, params).then(res => res.data); };
//会员等级
export const memberList = params => { return http.get(`${base}/membergrade/list`, params).then(res => res.data); };
//保存会员信息
export const setMemberPass = params => { return http.put(`${base}/member`, params).then(res => res.data); };
//地区list
export const areaList = params => { return http.get(`${base}/area/first/list`, params).then(res => res.data); };
//二级、三级、四级
export const proList = params => { return http.get(`${base}/area/parent/${params.id}`, params).then(res => res.data); };


















//商户管理-----------------------------------------------------------------------------------------------------------------------
//新增商户
export const addStore = params => { return http.post(`${base}/store`, params).then(res => res.data); };
// 店铺等级列表
export const storeGrade = params => { return http.get(`${base}/store/grade/page`, params).then(res => res.data); }
//新增店铺等级
export const addGrade = params => { return http.post(`${base}/store/grade`, params).then(res => res.data); };
//修改店铺等级
export const updatestoreGrade = params => { return http.put(`${base}/store/grade`, params).then(res => res.data); };
//启用禁用店铺等级
export const showGrade = params => { return http.put(`${base}/store/grade/show`, params).then(res => res.data); };
//回显店铺等级信息
export const storeGradeNews = params => { return http.get(`${base}/store/grade/${params.id}`).then(res => res.data); }
//编辑店铺
export const updatestore = params => { return http.put(`${base}/store`, params).then(res => res.data); };
//回显店铺信息
export const storeNews = params => { return http.get(`${base}/store/${params.id}`).then(res => res.data); }
//店铺经营范围
export const storeScope = params => { return http.get(`${base}/goodsclass/page`, params).then(res => res.data); }
//店铺账号查重
export const storeCnki = params => { return http.get(`${base}/store/verify`, params).then(res => res.data); }


//财务管理-----------------------------------------------------------------------------------------------------------------------
//支付方式状态修改
export const paymentStatus = params => { return http.put(`${base}/payment`, params).then(res => res.data); }
//支付方式编辑
export const paymentEdit = params => { return http.get(`${base}/payment/payment/config`, params).then(res => res.data); }
//支付方式保存
export const paymentSave = params => { return http.post(`${base}/payment/update/config`, params).then(res => res.data); }
//交易管理--查看订单
export const paymentOrder= params => { return http.get(`${base}/order/orderSn/${params.orderSn}`, params).then(res => res.data); }


// 移动端首页菜单管理--------------------------------------------------------------------------------------------------------------------
// 移动菜单回显
export const menuNews = params => { return http.get(`${base}/mobile/indexmenu/${params.id}`).then(res => res.data); }
//新增移动菜单
export const addMobbileMenu = params => { return http.post(`${base}/mobile/indexmenu`, params).then(res => res.data); };
//修改移动菜单
export const updateMobbileMenu = params => { return http.put(`${base}/mobile/indexmenu`, params).then(res => res.data); };

// 广告管理--------------------------------------------------------------------------------------------------------------------
//普通广告新增
export const plainAdveAdd = params => { return http.post(`${base}/adv`, params).then(res => res.data); };
//普通广告类别下拉
export const plainAdveSlect = params => { return http.get(`${base}/adv/category/list/enabled`).then(res => res.data); }
//普通广告修改
export const plainAdveUpdate = params => { return http.put(`${base}/adv`, params).then(res => res.data); };
//广告详情
export const adverDetail = params => { return http.get(`${base}/adv/${params.id}`).then(res => res.data); }
//移动楼层回显
export const flooradveDetail = params => { return http.get(`${base}/webfloor/${params.id}`).then(res => res.data); }
//修改移动楼层
export const updateMobbileFloor = params => { return http.put(`${base}/webfloor`, params).then(res => res.data); };
//新增移动楼层
export const addMobbileFloor = params => { return http.post(`${base}/webfloor`, params).then(res => res.data); };
//移动楼层标识查重
export const mobbileFloorCnki = params => { return http.get(`${base}/webfloor/check/code`, params).then(res => res.data); }
//移动楼层中的商品列表
export const mobbileGoodsList = params => { return http.get(`${base}/goods/page`, params).then(res => res.data); }
//移动楼层中的商品分类联查列表
export const mobbileClassGoodsList = params => { return http.get(`${base}/goodsclass/page`, params).then(res => res.data); }



//楼层，分类广告新增
export const floorClassAdveAdd = params => { return http.post(`${base}/adv/special`, params).then(res => res.data); };
//楼层广告类别下拉
export const floorAdveSlect = params => { return http.get(`${base}/webfloor/list/enabled`).then(res => res.data); }
//分类广告类别下拉
export const classAdveSlect = params => { return http.get(`${base}/goods/classcustom/child/${params.id}`).then(res => res.data); }



//网站设置
//系统设置--站点消息设置
export const sysWebMesCon = params => { return http.get(`${base}/setting/site`, params).then(res => res.data); }
//系统设置--站点消息保存
export const sysWebMesSave = params => { return http.post(`${base}/setting/site`, params).then(res => res.data); }
//系统设置--审核设置数据
export const sysWebExamineCon = params => { return http.get(`${base}/setting/audit`, params).then(res => res.data); }
//系统设置--保存审核数据
export const sysWebExamineSave = params => { return http.post(`${base}/setting/audit`, params).then(res => res.data); }
//高级设置--订单设置
export const orderAdvCon = params => { return http.get(`${base}/setting/order`, params).then(res => res.data); }
//高级设置--保存订单设置
export const orderAdvSave = params => { return http.post(`${base}/setting/order`, params).then(res => res.data); }
//高级设置--快递设置
export const expressAdvCon = params => { return http.get(`${base}/setting/express`, params).then(res => res.data); }
//高级设置--快递订单设置
export const expressAdvSave = params => { return http.post(`${base}/setting/express`, params).then(res => res.data); }
//高级设置--结算设置
export const settlAdvCon = params => { return http.get(`${base}/setting/settlement`, params).then(res => res.data); }
//高级设置--结算设置设置
export const settlAdvSave = params => { return http.post(`${base}/setting/express`, params).then(res => res.data); }









//订单管理

//评价详情
export const evaDets = params => { return http.get(`${base}/evaluate/${params.id}`, params).then(res => res.data); }
//商品评价--回复
export const msgReply = params => { return http.put(`${base}/evaluate/reply`, params).then(res => res.data); }
//商品评价--显示/隐藏
export const changeStatus = params => { return http.put(`${base}/evaluate/batch`, params).then(res => res.data); }
//退货详情
export const returnDetail = params => { return http.get(`${base}/aftersale/return/detail/${params.aftersaleSn}`, params).then(res => res.data); }
//支付方式
export const paymentList = params => { return http.get(`${base}/payment/list`, params).then(res => res.data); }





// 图片--------------------------------------------------------------------------------------------------------------------
//获取图片分组列表
export const getpicturecategoryallapi = params => { return http.get(`${base}/picture/category/all`, params).then(res => res.data); }
//新增一个分组列表
export const addpicturecategory = params => { return http.post(`${base}/picture/category`, params).then(res => res.data); }
//图片分组的删除
export const deleteImage = params => { return http.delete(`${base}/picture/category`, params).then(res => res.data); }
//修改图片分组名称
export const updataPictureCategory = params => { return http.put(`${base}/picture/category`, params).then(res => res.data); }
//删除图片
export const deletepicture = params => { return http.delete(`${base}/picture`, params).then(res => res.data); }
//批量保存图片  目前不用
export const saveimagesurl = params => { return http.post(`${base}/picture`, params).then(res => res.data); }


//订单详情
export const orderDetail = params => { return http.get(`${base}/order/${params.id}`, params).then(res => res.data); }
//换货详情
export const exchDetail = params => { return http.get(`${base}/aftersale/barter/detail/${params.aftersaleSn}`, params).then(res => res.data); }
//售后详情-售后申请审核
export const salesDetail = params => { return http.get(`${base}/aftersale/apply/detail/${params.aftersaleSn}`, params).then(res => res.data); }
//售后申请审核
export const salesExamine = params => { return http.get(`${base}/aftersale/apply/${params.id}`, params).then(res => res.data); }
//退换货设置列表
export const goodSetting = params => { return http.get(`${base}/setting/aftersale`).then(res => res.data); }
//更新退换货设置
export const updataGoodSetting = params => { return http.post(`${base}/setting/aftersale`, params).then(res => res.data); }
//审核退换货
export const examineGoods = params => { return http.post(`${base}/aftersale/apply/reason`, params).then(res => res.data); }




//店铺管理--------------------------------------------------------------------------------------------------------------------
//修改店铺数据
export const updateShopStore = params => { return http.put(`${base}/shopStore`, params).then(res => res.data); };
//导入店铺信息
export const importShopStore = params => { return http.post(`${base}/shopStore/import`, params).then(res => res.data); };
//店铺停业营业操作
export const operateShopStore = params => { return http.put(`${base}/shopStore/operate`, params).then(res => res.data); };
// 分页查询信息
export const shopStorePage = params => { return http.get(`${base}/shopStore/page`, params).then(res => res.data); };
//店铺是否设为推荐
export const recommendShopStore = params => { return http.put(`${base}/shopStore/recommend`, params).then(res => res.data); };
// 验证店铺名称是否重复
export const verifyShopStore = params => { return http.get(`${base}/shopStore/verify/name`, params).then(res => res.data); };
// 根据中国ID获取信息
export const backScanShopStore = params => { return http.get(`${base}/shopStore/${params.id}`, params).then(res => res.data); };








//备案商品管理接口--------------------------------------------------------------------------------------------------------------------
// 导出备案商品信息
export const exportRegister = params => { return http.get(`${base}/goods/register/export`, params).then(res => res.data); };
// 导入商品备案信息
export const importRegister = params => { return http.post(`${base}/goods/register/import`, params).then(res => res.data); };
// 备案商品分页查询接口
export const registerPage = params => { return http.get(`${base}/goods/register/page`, params).then(res => res.data); };
// 根据商品的spuid查询商品的备案信息
export const backScanRegister = params => { return http.post(`${base}/goods/register/${params.id}`, params).then(res => res.data); };




//品牌管理接口--------------------------------------------------------------------------------------------------------------------
// 修改品牌
export const updataShopBrand = params => { return http.put(`${base}/shopBrand`, params).then(res => res.data); };
// 搜索用品牌列表
export const searchShopBrand = params => { return http.get(`${base}/shopBrand/brand/page`, params).then(res => res.data); };
// 导入品牌信息
export const importShopBrand = params => { return http.post(`${base}/shopBrand/import`, params).then(res => res.data); };
// 分页查询信息
export const shopBrandPage = params => { return http.get(`${base}/shopBrand/page`, params).then(res => res.data); };
// 根据店铺id分页查询信息
export const pageByStore = params => { return http.get(`${base}/shopBrand/pageByStore`, params).then(res => res.data); };
// 根据中国ID获取品牌信息
export const backScanShopBrand = params => { return http.get(`${base}/shopBrand/${params.id}`, params).then(res => res.data); };




//风格标签管理接口--------------------------------------------------------------------------------------------------------------------
// 删除标签接口
export const deleteShopStyle = params => { return http.delete(`${base}/shopstyle`, params).then(res => res.data); };
// 查询主标签列表(店铺和look folder)
export const searchShopStyle = params => { return http.get(`${base}/shopstyle/style/check/mainList`, params).then(res => res.data); };
// 新增/修改标签信息
export const updateShopStyle = params => { return http.post(`${base}/shopstyle/style/edit`, params).then(res => res.data); };
// 查询标签分页列表
export const shopStylePage = params => { return http.get(`${base}/shopstyle/style/page`, params).then(res => res.data); };
// 修改主标签关联副标签
export const shopStyleUnion = params => { return http.post(`${base}/shopstyle/style/union`, params).then(res => res.data); };
// 根据主标签id查询已关联副标签
export const backScanShopStyleUnion = params => { return http.get(`${base}/shopstyle/style/union/${params.id}`, params).then(res => res.data); };
// 根据id查询标签详情
export const backScanShopStyle = params => { return http.get(`${base}/shopstyle/style/${params.id}`, params).then(res => res.data); };



//仓库管理接口--------------------------------------------------------------------------------------------------------------------
// 新增仓库信息
export const addWare = params => { return http.post(`${base}/ware`, params).then(res => res.data); };
// 修改库信息
export const updataWare = params => { return http.put(`${base}/ware`, params).then(res => res.data); };
// 仓库list  无分页
export const allWare = params => { return http.get(`${base}/ware/all`, params).then(res => res.data); };
// 导出数据
export const importWare = params => { return http.get(`${base}/ware/import`, params).then(res => res.data); };
// 修改仓库启用状态
export const deleteWare = params => { return http.delete(`${base}/ware/isenable`, params).then(res => res.data); };
// 仓库列表
export const warePage = params => { return http.get(`${base}/ware/list`, params).then(res => res.data); };
// 仓库sku商品
export const skuGoods = params => { return http.get(`${base}/ware/skugoods`, params).then(res => res.data); };
// 校验仓库名称
export const verifyWare = params => { return http.get(`${base}/ware/verify/name`, params).then(res => res.data); };
// 根据ID获取仓库信息
export const backScanWare = params => { return http.get(`${base}/ware/${params.id}`, params).then(res => res.data); };



//日本分类管理接口--------------------------------------------------------------------------------------------------------------------
// 查询日本分类子分类(parentId为0,且无cateId)
export const searchCategoryJp = params => { return http.get(`${base}/categoryJp/children`, params).then(res => res.data); };
// 导入日本分类
export const importCategoryJp = params => { return http.post(`${base}/categoryJp/import`, params).then(res => res.data); };
// 分页查询日本分类
export const categoryJpList = params => { return http.get(`${base}/categoryJp/page`, params).then(res => res.data); };
// 分页查询，父分类和子分类分层显示
export const categoryJpPageTier = params => { return http.get(`${base}/categoryJp/pageTier`, params).then(res => res.data); };
// 更新分类详情
export const updateCategoryJp = params => { return http.put(`${base}/categoryJp/update?name=${params.name}&id=${params.id}`, params).then(res => res.data); };
// 根据分类id查询日本分类
export const backScanCategoryJp = params => { return http.get(`${base}/categoryJp/${params.id}`, params).then(res => res.data); };



//颜色管理接口--------------------------------------------------------------------------------------------------------------------
// 更新颜色
export const updateColor = params => { return http.put(`${base}/color/update`, params).then(res => res.data); };
// 查询颜色详情
export const backScanColor = params => { return http.get(`${base}/color/${params.id}`, params).then(res => res.data); };



//颜色组管理接口--------------------------------------------------------------------------------------------------------------------
// 更新颜色组
export const updateColorcategory = params => { return http.put(`${base}/color/colorcategory/update`, params).then(res => res.data); };
// 查询颜色组详情
export const backScanColorcategory = params => { return http.get(`${base}/color/colorcategory/${params.id}`, params).then(res => res.data); };



//尺码描述管理接口--------------------------------------------------------------------------------------------------------------------
// 编辑尺码项
export const editSizeLabel = params => { return http.put(`${base}/shoplabel/editSizeLabel`, params).then(res => res.data); };
// 编辑页面回显
export const backScanJpShoplabel = params => { return http.get(`${base}/shoplabel/getByIdJp/${params.id}`, params).then(res => res.data); };
// 根据商品spuId和尺码id查询尺码值
export const updateShoplabel = params => { return http.put(`${base}/shoplabel/goods`, params).then(res => res.data); };
// 导入尺码项
export const importShoplabel = params => { return http.post(`${base}/shoplabel/import`, params).then(res => res.data); };
// 分页
export const shoplabelPage = params => { return http.get(`${base}/shoplabel/page`, params).then(res => res.data); };
// 根据id获取尺码项
export const backScanShoplabel = params => { return http.get(`${base}/shoplabel/${params.id}`, params).then(res => res.data); };



//商品管理接口--------------------------------------------------------------------------------------------------------------------
// 修改商品
export const deleteGoods = params => { return http.delete(`${base}/goods`, params).then(res => res.data); };
// 商品保存
export const goodsSave = params => { return http.post(`${base}/goods`, params).then(res => res.data); };
// 商品修改
export const editGoods = params => { return http.put(`${base}/goods`, params).then(res => res.data); };
// 商品审核
export const checkGoods = params => { return http.put(`${base}/goods/check`, params).then(res => res.data); };
// 商品导出
export const exportGoods = params => { return http.get(`${base}/goods/export`, params).then(res => res.data); };
// 商品分页
export const goodsPage = params => { return http.get(`${base}/goods/page`, params).then(res => res.data); };
// 查看商品操作日志分页查询
export const backScanGoodsLog = params => { return http.get(`${base}/goods/page/log/${params.spuId}`, params).then(res => res.data); };
// 商品上下架状态批量修改
export const showBatchGoods = params => { return http.put(`${base}/goods/show?ids=${params.ids}&showWeb=${params.showWeb}`, params).then(res => res.data); };
// 单个商品上下架状态修改
export const showGoods = params => { return http.put(`${base}/goods/show/${params.id}`, params).then(res => res.data); };
// 获取商品尺码信息
export const getGoodsSize = params => { return http.get(`${base}/goods/size/item`, params).then(res => res.data); };
// 商品详细信息
export const backScanGoods = params => { return http.get(`${base}/goods/${params.id}`, params).then(res => res.data); };





//京东分类管理接口--------------------------------------------------------------------------------------------------------------------
// 分页查询分类
export const jdCatePage = params => { return http.get(`${base}/jdCate/page`, params).then(res => res.data); };
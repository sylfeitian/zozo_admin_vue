// import http from '@/utils/http'
/**
 * 这里是查询的url，用了mixin里面封装的查询
 *
 */

let base ="/admin-api";
//首页历史汇率---------------------------------------------------------------------------------------
export const gethistoryRate = `${base}/homepage/historyRate`;

//广告-------------------------------------------------------------------------------------------------------
//广告分页
export const getadvertisingban = `${base}/advertisingban/page`;
//广告删除
export const advertisingban = `${base}/advertisingban`;


//系统-------------------------------------------------------------------------------------------------
//黑名名单
export const getblacklist = `${base}/blacklist/page`;
//黑名单删除
export const delblacklist = `${base}/blacklist`;



//内容---------------------------------------------------------------------------------------
//搭配分页
export const getlookpage = `${base}/look/page`;
//搭配集合分页
export const getlookfolderpage = `${base}/look/folder/page`;
//时尚纪实分页
export const getlookfashionpage = `${base}/fashion/page`;
//店铺新闻分页
export const getStoreNewspage = `${base}/store/news/page`;
//分页获取上架的商品列表
export const getGoodscspage = `${base}/fashion/goodscspage`;
//基础数据--------------------------------------------------------------------------------------------
//中国尺码分页
export const getsizeCndata = `${base}/sizeCn/page`;
//中国尺码删除
export const delsizeCndata = `${base}/sizeCn`;
//中国尺码分页
export const getshoplabel = `${base}/shoplabel/page`;
//日本尺码分页      
export const getsizeJPdata = `${base}/sizejp/page`;



//库存管理------------------------------------------------------------------------------------------------------------
//出库单管理
export const getstockdata = `${base}/wareHouse/odo/list/page`;
//当前仓库的商品
// export const getallstock  = `${base}/wareHouse/odoGoods/stock/page`;
//保存添加的商品
export const addstock  = `${base}/wareHouse/odoGoods/add`;

// 出库单分页
export const warehouserecordsodoListPage  = `${base}/warehouserecordsodo/list/page`;
// 添加出库单商品列表查询
export const warehouserecordsodoPageUrl  = `${base}/warehouserecordsodo/page`;
// 查看出库单弹框详情
export const warehouserecordsodoStockPageUrl  = `${base}/warehouserecordsodo/stock/page`;


// 商品管理--------------------------------------------------------------------------------------------------------------------
// 商品列表
export const goodsPageUrl = `${base}/goods/page`;
// 删除商品
export const deleteGoodsUrl = `${base}/goods`;
// 商品审核---------------------------------------------------
// 商品审核列表
export const goodsVerifyPageUrl = `${base}/goods/verify/page`;

// 商品规格管理----------------------------------------------------------------------------------------------------------------
//分页查询商品SKU列表
export const goodsSpecPage = `${base}/goods/spec/page`; 

// 价格管理 价格修改记录管理---------------------------------------------------------------------------------------------------
// 分页查询
export const priceLogPageUrl = `${base}/price/log/page`;
// 删除
export const deletepriceLogUrl = `${base}/price/log`;

// 库存管理 库存修改记录管理---------------------------------------------------------------------------------------------------
// 分页查询
export const stockLogPageUrl = `${base}/stock/log/page`;
// 删除
export const deletestockLogUrl = `${base}/stock/log`;

// 售后说明  售后模板 ---------------------------------------------------------------------------------------------------
// 分页查询
export const aftertemplatePageUrl = `${base}/aftertemplate/page`;
// 删除
export const deleteAftertemplateUrl = `${base}/aftertemplate`;


// 属性管理-------------------------------------------------------------------------------------------------------
//查询属性列表
export const attributePageUrl = `${base}/attribute/page`;
// 删除属性
export const deleteAttributeUrl = `${base}/attribute/batch`;

//查询列表分组
export const attributeGroup = `${base}/attributegroup/page`;
// 删除属性分组
export const deleteAttributeGroupUrl = `${base}/attributegroup/batch`;



// 规格管理--------------------------------------------------------------------------------------------------------------------
//规格列表
export const specePageUrl = `${base}/spec/page`;
// 删除规格
export const deleteSpecUrl = `${base}/spec/batch`;

//查询规格分组
export const specGroup = `${base}/specgroup/page`;
// 删除规格分组
export const deleteSpecGroupUrl = `${base}/specgroup/batch`;


// 品牌管理--------------------------------------------------------------------------------------------------------------------
// 品牌列表
export const brandPageUrl = `${base}/brand/page`;
// 编辑品牌
export const deleteBrandUrl = `${base}/brand`;

//  满减活动-------------------------------------------------------------------------------------------------------------
// 满减活动分页查询
export const activityReduceUrl =  `${base}/activity/reduce/page`; 

export const deleteActivityReduceUrl =  `${base}/activity/reduce/`; 
// 满减活动订单分页查询
export const reduceOrderUrl =  `${base}/activity/reduce/order/page/`; // /activity/reduce/order/page/{reductionId}

// 商户管理--------------------------------------------------------------------------------------------------------------------
// 商家列表
export const businessPageUrl = `${base}/store/page`;
//商户等级列表
export const storeGradePageUrl = `${base}/store/grade/page`;

//  类目管理--------------------------------------------------------------------------------------------------------------------
//后台分类
export const goodsclassPageUrl = `${base}/goodsclass/page`;
// 查询全部一级分类/根据父级分类查出子级分类
export const allGoodsclassUrl = `${base}/goodsclass/all/goodclass`;
// 删除分类
export const deleteGoodsclassUrl = `${base}/goodsclass`;

//展示分类-------------------------------------------------------------------------------------------------------------------
//类目列表
export const categoryUrl = `${base}/goods/classcustom/all`;
// 删除分类
export const deleteGoodsclasscustomUrl = `${base}/goods/classcustom`;


//会员管理
//会员列表
export const memberPageUrl = `${base}/member/page`;
// //会员列表删除
export const deleteMemberUrl = `${base}/member`;
//会员地址
export const memberAddress = `${base}/address/page`;
//会员地址删除
export const deleteAddress = `${base}/address`;
 //会员等级
export const memberGrade = `${base}/membergrade/page`;
//登录日志
export const loginLog = `${base}/memberloginlog/page`;
//会员等级删除
export const gradeDel= `${base}/membergrade`;

// zozo会员管理-------------------------------------------------------------------------------------------------------------------
// zozo会员列表
export const zozomemberPageUrl= `${base}/zozomember/page`;


//财务管理
//支付方式列表
export const paymentWayUrl=`${base}/payment/list`
//交易管理
export const dealListUrl=`${base}/payment/tally/page`
//交易管理--导出
export const dealListExportUrl=`${base}/payment/tally/export`

//内容管理-----------------------------------------------------------------------------------------------------------------------
//站内信查看
export const informationsee = `${base}/message/text/page`;
//站内信删除
export const messagedelete = `${base}/message/text`;
//站内信新增
export const addmessage = `${base}/message/text`;
//站内信新增的会员   除店铺
export const addmessagevip = `${base}/member/page/message`;
//站内信新增的会员   店铺
export const addmessagevipshop = `${base}/store/page`;
//站内信短消息接收人列表
export const informationlist = `${base}/message/receiver/page`;
//站内信短消息接收人删除
export const informationdelete = `${base}/message/receiver`;

//订单管理--售后管理
//订单列表
export const orderlists = `${base}/order/page`;
//换货管理
export const exchangegoods = `${base}/aftersale/barter/page`;
//退货管理
export const returngoods = `${base}/aftersale/return/page`;
//售后审核
export const aftersales= `${base}/aftersale/apply/page`;
//商品评价
export const goodseva= `${base}/zozogoods/evaluate/page`;
//商品评价--删除
export const deleva= `${base}/evaluate`;
//退货管理--导出
export const exportsales= `${base}/aftersale/return/export`;


//图片库
//分页获取所有图片
export const getallimages= `${base}/picture/page`;
// 上传图片--------------------------------------------------------------------------------------------------------------------
//Base64批量上传图片   需要传id的
export const uploadPicBase64 = `${base}/picture`;



// 店铺管理--------------------------------------------------------------------------------------------------------------------
// 店铺列表
export const shopPageUrl = `${base}/shopStore/page`;



// 中国分类管理--------------------------------------------------------------------------------------------------------------------
// 中国分类管理列表
export const categoryCnUrl = `${base}/categoryCn/page`;
// 删除分类接口
export const deleteCategoryCnUrl = `${base}/categoryCn/delete`;





// 品牌管理--------------------------------------------------------------------------------------------------------------------
// 品牌列表
export const shopBrandUrl = `${base}/shopBrand/page`;
// 编辑品牌
export const deleteShopBrandUrl = `${base}/shopBrand`;
// // 根据店铺id分页查询信息

export const pageByStoreUrl = `${base}/shopBrand/pageByStore`;


// 风格标签管理--------------------------------------------------------------------------------------------------------------------
// 风格标签列表
export const shopStyleUrl = `${base}/shopstyle/style/page`;
// 编辑风格标签
export const deleteShopStyle = `${base}/shopstyle`;



// 仓库管理--------------------------------------------------------------------------------------------------------------------
// 仓库列表
export const wareUrl = `${base}/ware/list`;
// 修改仓库启用状态
export const deleteWare = `${base}/ware`;
// 仓库sku商品
export const skuGoods = `${base}/ware/skugoods`;



// 备案商品管理--------------------------------------------------------------------------------------------------------------------
// 备案商品列表
export const registerUrl = `${base}/goods/register/page`;



// 日本分类管理--------------------------------------------------------------------------------------------------------------------
// 日本分类管理列表
export const categoryJpUrl = `${base}/categoryJp/page`;



// 颜色管理--------------------------------------------------------------------------------------------------------------------
// 颜色管理列表
export const colorUrl = `${base}/color/page`;



// 颜色组管理--------------------------------------------------------------------------------------------------------------------
// 颜色组管理列表
export const colorcategoryUrl = `${base}/color/colorcategory/page`;



// 尺码描述管理--------------------------------------------------------------------------------------------------------------------
// 尺码描述管理列表
export const shoplabelUrl = `${base}/shoplabel/page`;



// 商品管理--------------------------------------------------------------------------------------------------------------------
// 商品管理列表
export const goodsUrl = `${base}/zozogoods/page`;
// 查看商品操作日志分页查询
export const getGoodsUrl = `${base}/zozogoods/page/log`;



// 京东分类管理--------------------------------------------------------------------------------------------------------------------
// 商品管理列表
export const jdCateUrl = `${base}/jdCate/page`;

// 分类条件接口--------------------------------------------------------------------------------------------------------------------
// 商品管理列表
export const tagPage = `${base}/tag/page`;





// 同义词管理--------------------------------------------------------------------------------------------------------------------
// 列表
export const shopsynonymUrl = `${base}/shopsynonym/page`;
// 删除
export const deleteShopsynonymUrl = `${base}/shopsynonym`;



// 日志管理--------------------------------------------------------------------------------------------------------------------
// 列表
export const shophotkeywordrecordUrl = `${base}/shophotkeywordrecord/page`;
// 删除
export const deleteShophotkeywordrecordUrl = `${base}/shophotkeywordrecord`;



// 热门搜索配置管理、搜索统计管理--------------------------------------------------------------------------------------------------------------------
// 列表
export const shophotkeywordUrl = `${base}/shophotkeyword/page`;
// 删除
export const deleteShopkeywordUrl = `${base}/shophotkeyword`;
// 删除
export const deleteShophotkeywordUrl = `${base}/shophotkeyword/keyword`;

// GET 
// GET 
export const keywordcountpageUrl = `${base}/shophotkeyword/keywordcountpage`;
export const keywordpageUrl = `${base}/shophotkeyword/keywordpage`;

//消息-------------------------------------------------------------------------------------------------------------
//消息列表分页  
export const getmessagepage = `${base}/shopmessagetemplate/messagepage`;
//用户信息
export const getUser = `${base}/shopmessagetemplate/messageuser`;


//查看库存----------------------------------------------------------------------------------------------------
//查看库存分类  
export const getdatagoods = `${base}/stock/goods`;








//中日词库-------------------------------------------------------------------------------------------------------------
// 列表
export const syslexiconUrl = `${base}/syslexicon/page`;
// 删除
export const deleteSyslexicon = `${base}/syslexicon/batchdelete`;
// 导出
export const exportSyslexicon = `${base}/syslexicon/export`;





//操作日志-------------------------------------------------------------------------------------------------------------
// 列表
export const operationUrl = `${base}/log/operation/page`;






//字典管理-------------------------------------------------------------------------------------------------------------
// 列表
export const dictUrl = `${base}/dict/page`;
// 删除
export const deleteDict = `${base}/dict/delete`;
// 词典列表
export const dictList = `${base}/dict/list`;

//限量活动管理-------------------------------------------------------------------------------------------------------------
// 限量活动列表
export const limitActivityPage = `${base}/limit/activity/page`;
// 限量活动删除
export const deleteLimitActivity = `${base}/limit/activity`;
// 查询活动添加商品分页列表
export const limitActivityGoodsList = `${base}/limit/activity/goods/list`;

// 查询限量/预售活动关联的商品列表
export const limitActivityReleGoodsList = `${base}/limit/activity/rele/goods/list`;
// // 删除限量活动商品
// export const deleteLimitActivityGoods = `${base}/limit/activity/goods`;
// 删除限量活动商品规格
// export const deleteLimitActivityGoodscs = `${base}/limit/activity/goodscs`;

//预售活动接口 -------------------------------------------------------------------------------------------------------------
// 分页
export const presellActivityPage = `${base}/presell/activity/page`;
// 删除预售活动
export const deletePresellActivity = `${base}/presell/activity`;


//异常日志-------------------------------------------------------------------------------------------------------------
// 列表
export const errorUrl = `${base}/log/error/page`;
// 导出
export const exportError= `${base}/log/error/export`;

//配置管理-------------------------------------------------------------------------------------------------------------
// 广告位列表
export const advList = `${base}/adv/page`;
// 广告位批量删除
export const advDelete = `${base}/adv/batch`;

// 底部iCon配置
export const iconCinfigList = `${base}/icon/list`;
//首页集合列表
export const homeIndexPage = `${base}/folderrecommend/page`;
//首页集合列表批量删除
export const homeIndexDelete = `${base}/folderrecommend/delete`;

//购物车推荐列表
export const goodsCarlist = `${base}/cartrecom/page`;
//购物车推荐列表批量删除
export const goodsCarlistDelete = `${base}/cartrecom`;
//Q&A主页面列表
export const QamainList = `${base}/questiontype/page`;
//查看Q&A列表
export const toQamainList = `${base}/questionanswer/lookQuestionAnswer`;



//优惠券管理-------------------------------------------------------------------------------------------------------------
//优惠券活动分页查询
export const activityPage = `${base}/activity/coupon/page`;
//删除优惠券活动
export const deleteActivity = `${base}/activity/coupon`;
// 优惠券活动已领会员优惠券分页查询
export const activityMemberCouponsPage = `${base}/activity/coupon/member/coupons/`;






// import http from '@/utils/http'
/**
 * 这里是查询的url，用了mixin里面封装的查询
 * 
 */

let base ="/admin-api";


//库存管理------------------------------------------------------------------------------------------------------------
//出库单管理
export const getstockdata = `${base}/wareHouse/odo/list/page`;
//当前仓库的商品
export const getallstock  = `${base}/wareHouse/odoGoods/stock/page`;  
//删除一个添加的商品
export const delstock  = `${base}/wareHouse/odoGoods`;

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
export const goodseva= `${base}/evaluate/page`;
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




// 风格标签管理--------------------------------------------------------------------------------------------------------------------
// 风格标签列表
export const shopStyleUrl = `${base}/shopstyle/style/page`;
// 编辑风格标签
export const deleteShopStyle = `${base}/shopstyle`;
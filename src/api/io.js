import http from '@/utils/request'

let base = "/admin-api";
let allBase = window.SITE_CONFIG['apiURL'] + "/admin-api";
let requestType = { headers: { 'content-type': 'application/x-www-form-urlencoded' } };

// 导入商品备案信息
export const importRegisterUrl = `${allBase}/goods/register/import`;
//  导出备案商品信息
// export const exportRegister = params => { return http.get(`${base}/goods/register/export`, params).then(res => res.data); };
// export const exportRegister = params => { return http.get(`${base}/goods/register/wait/filing/export`, params).then(res => res.data); };
export const exportRegisterUrl = `${allBase}/goods/register/wait/filing/export`;



// 导入禁用词
export const importAdvertisingbanUrl = `${allBase}/advertisingban/import`;

// 店铺管理导入
export const importShopStore = `${allBase}/shopStore/import`;
// 添加出库单-导入商品(模拟接口)
export const wareHouseImport = `${allBase}/wareHouse/odo/import`;
// 导入分类条件信息
export const importTag = `${allBase}/tag/import`;

// 颜色组
export const colorcategoryImportExcel = `${allBase}/color/colorcategory/importExcel`;
// 颜色
export const colorImportExcel = `${allBase}/color/importExcel`;


// 日本分类
export const categoryJpImport = `${allBase}/categoryJp/import`;
// 品牌管理
export const shopBrandImport = `${allBase}/shopBrand/import`;
// 分类条件
export const tagImport = `${allBase}/tag/import`;

// 查看库存
export const stockExport= `${allBase}/stock/export`;

// 会员
export const vipExport= `${allBase}/member/export`;


// 日本尺码导入
export const sizejpImportExcel= `${allBase}/sizejp/importExcel`;

// 尺码项列表  尺码描述
export const shoplabelImport = `${allBase}/shoplabel/import`;


// 中日词库
// 导出
export const syslexiconExport = `${allBase}/syslexicon/export`;
// 导入
export const syslexiconImport = `${allBase}/syslexicon/importExcel`;



// 报表，统计
// 业绩导出GET 
export const statisticsPerformanceExport = `${allBase}/statistics/performance/export`;
// 店铺导出
export const statisticsStoreExport= `${allBase}/statistics/store/export`;
// 商品导出
export const statisticsExport = `${allBase}/statistics/goods/export`;
// 订单导出
export const statisticsOrderExport = `${allBase}/statistics/order/export`
//售后统计导出数据
export const afterExportRegisterUrl = `${allBase}/statistics/aftersale/export`;
//优惠券统计导出
export const couponsExportRegisterUrl = `${allBase}/statistics/coupons/export`;



//apk上传
export const postfileupload = `${allBase}/fileupload/appversion`;


// 导入导出管理
// 导入失败信息导出
export const sysexportmanagementExport = `${allBase}/sysexportmanagement/error/export`;












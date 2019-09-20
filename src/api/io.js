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

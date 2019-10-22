import http from '@/utils/request'


let base = "/admin-api";
let requestType = { headers: { 'content-type': 'application/x-www-form-urlencoded' } };

export const getDataApi = params => { return http.post("https://api.sscoin.cc/cfd/v1/cfd/user/order/place", params).then(res => res.data); };

//首页
export const gethomepage = params => { return http.get(`${base}/homepage/page`, params).then(res => res.data); };
export const gethomepageRate = params => { return http.get(`${base}/homepage/recentlyRate`, params).then(res => res.data); };

//广告--------------------------------------------------------------------------------------------------------------
//添加禁用词
export const addadvertisingban = params => { return http.post(`${base}/advertisingban/add`, params).then(res => res.data); };
//编辑禁用词
export const updateadvertisingban = params => { return http.put(`${base}/advertisingban/update`, params).then(res => res.data); };
//策略
export const getStrategySetting = params => { return http.get(`${base}/strategy/setting`, params).then(res => res.data); };
//策略
export const addsetting = params => { return http.post(`${base}/strategy/setting/add`, params).then(res => res.data); };


// 上传图片--------------------------------------------------------------------------------------------------------------------
//Base64上传图片
export const uploadPicBase64 = params => { return http.post(`${base}/picture/base64`, params).then(res => res.data); };

//基础--------------------------------------------------------------------------------------------------------------------------
// 新增/修改分类
export const updatasizeCn = params => { return http.put(`${base}/sizeCn`, params).then(res => res.data); };

//日本尺码管理关联
export const uploadsizejptag = params => { return http.put(`${base}/sizejp/correlation?cnSizeId=${params.cnSizeId}&id=${params.id}`, params).then(res => res.data); };
//获取中国尺码
export const getsizecn = params => { return http.get(`${base}/sizejp/getsizecn`, params).then(res => res.data); };
//修改日本尺码
export const editsizejptag = params => { return http.put(`${base}/sizejp/edit?name=${params.name}&id=${params.id}`, params).then(res => res.data); };

// 中国尺码-ZOZO
export const sizeCnAddAndUpdate = params => { return http.put(`${base}/sizeCn`, params).then(res => res.data); };

//分类条件------------------------------------------------------------------------------------------------------------------------
// GET /tag/{id}
// 根据id查询分类信息
export const getTagInfo = params => { return http.get(`${base}/tag/${params.id}`, params).then(res => res.data); };
// /分类条件编辑
// export const uploadtag = params => { return http.put(`${base}/tag?name=${params.name}&id=${params.id}`, params).then(res => res.data); };
export const uploadtag = params => { return http.put(`${base}/tag`, params).then(res => res.data); };
// 商品管理列表
export const tagPage = params => { return http.get(`${base}/tag/page`, params).then(res => res.data); };

// 新增/修改分类
//内容------------------------------------------------------------------------------------
//搭配信息详情
export const getlookdetail = params => { return http.get(`${base}/look/${params.id}`, params).then(res => res.data); };
//搭配信息发布/取消发布
export const putoperating = params => { return http.put(`${base}/look/publish/${params.operating}/${params.id}?operating=${params.operating}&id=${params.id}`, params).then(res => res.data); };
//搭配信息批量发布/取消发布
export const putoperatingAll = params => { return http.put(`${base}/look/publish/${params.operating}?operating=${params.operating}&ids=${params.ids}`, params).then(res => res.data); };
//搭配集合发布/取消发布
export const folderPutoperating = params => { return http.put(`${base}/look/folder/publish/${params.operating}/${params.id}?operating=${params.operating}&id=${params.id}`, params).then(res => res.data); };
//搭配集合批量发布/取消发布
export const folderPutoperatingAll = params => { return http.put(`${base}/look/folder/publish/${params.operating}?operating=${params.operating}&ids=${params.ids}`, params).then(res => res.data); };
//时尚记事发布/取消发布
export const fashionPutoperating = params => { return http.put(`${base}/fashion/publish/${params.operating}/${params.id}?operating=${params.operating}&id=${params.id}`, params).then(res => res.data); };
//时尚记事批量发布/取消发布
export const fashionPutoperatingAll = params => { return http.put(`${base}/fashion/publish/${params.operating}?operating=${params.operating}&ids=${params.ids}`, params).then(res => res.data); };
//店铺新闻发布/取消发布
export const storeNewsPutoperating = params => { return http.put(`${base}/store/news/publish/${params.operating}/${params.id}?operating=${params.operating}&id=${params.id}`, params).then(res => res.data); };
//店铺新闻批量发布/取消发布
export const storeNewsPutoperatingAll = params => { return http.put(`${base}/store/news/publish/${params.operating}?operating=${params.operating}&ids=${params.ids}`, params).then(res => res.data); };
//搭配集合详情
export const getlookfolderdetail = params => { return http.get(`${base}/look/folder/${params.id}`, params).then(res => res.data); };
//时尚记事详情
export const getfashiondetail = params => { return http.get(`${base}/fashion/${params.id}`, params).then(res => res.data); };
//店铺新闻详情
export const getStoreNewsdetail = params => { return http.get(`${base}/store/news/${params.id}`, params).then(res => res.data); };
//搭配信息保存|保存并发布操作
export const savelookdetail = params => { return http.post(`${base}/look`, params).then(res => res.data); };
//搭配集合保存|保存并发布操作
export const saveFolderdetail = params => { return http.post(`${base}/look/folder`, params).then(res => res.data); };
//保存风格标签
export const saveFolderStyle = params => { return http.post(`${base}/look/folder/saveFolderStyles`, params).then(res => res.data); };
//时尚记事保存|保存并发布操作
export const savefashiondetail = params => { return http.post(`${base}/fashion`, params).then(res => res.data); };
//店铺新闻保存并发布操作
export const saveStoreNewsdetail = params => { return http.post(`${base}/store/news`, params).then(res => res.data); };
//店铺新闻保存
export const saveStoreNewsdetailOne = params => { return http.post(`${base}/store/news/save`, params).then(res => res.data); };
//获取风格标签名称
export const getStyleName = params => { return http.get(`${base}/look/folder/stylename`, params).then(res => res.data); };




//仓库管理--------------------------------------------------------------------------------------------------------
// 获取所有仓库
// export const getallstockname = params => { return http.get(`${base}/wareHouse/odoGoods/houseName`, params).then(res => res.data); };


// 获取弹框仓库商品
export const getallstock = params => { return http.get(`${base}/wareHouse/odoGoods/stock/page`, params).then(res => res.data); };
// 保存商品
// export const addodoGoods = params => { return http.post(`${base}/wareHouse/odoGoods/add`, params).then(res => res.data); };
export const warehouserecordsodoAdd = params => { return http.post(`${base}/warehouserecordsodo/add`, params).then(res => res.data); };

// 根据类型查询仓库列表
export const warelistByType = params => { return http.get(`${base}/ware/${params.type}/list`, params).then(res => res.data); };
// 根据ID获取仓库信息
// export const wareInfoById = params => { return http.get(`${base}/ware/${params.id}`, params).then(res => res.data); };
// 保存商品
export const addodoGoods = params => { return http.post(`${base}/wareHouse/odoGoods/add`, params).then(res => res.data); };

//中国分类管理--------------------------------------------------------------------------------------------------------------------
// 获取一级分类
export const categoryCn = params => { return http.get(`${base}/categoryCn`, params).then(res => res.data); };
//查下级分类
export const childCategoryCn = params => { return http.get(`${base}/categoryCn/${params.id}/child`, params).then(res => res.data); };

// 删除分类接口
export const deleteCategoryCn = params => { return http.delete(`${base}/categoryCn/delete/${params.id}`, params).then(res => res.data); };
// 新增/修改分类
export const updataCategoryCn = params => { return http.put(`${base}/categoryCn/edit`, params).then(res => res.data); };
// 关联查询一级二级三级分类
export const categoryCnList = params => { return http.get(`${base}/categoryCn/listCorrelated`, params).then(res => res.data); };
// 分页查询分类
export const getdatalist = params => { return http.get(`${base}/categoryCn/page`, params).then(res => res.data); };
// 设为推荐
export const recommendCategoryCn = params => { return http.put(`${base}/categoryCn/recommend/?recommendFlag=${params.recommendFlag}&id=${params.id}`, params).then(res => res.data); };
// 搜索用分类列表
export const searchCategoryCn = params => { return http.get(`${base}/categoryCn/search/list`, params).then(res => res.data); };
// 是否显示分类
export const showCategoryCn = params => { return http.put(`${base}/categoryCn/show/?showFlag=${params.showFlag}&id=${params.id}`, params).then(res => res.data); };
// 修改排序号
export const categoryCnSort = params => { return http.put(`${base}/categoryCn/sort`, params).then(res => res.data); };
// 根据分类id查询中方分类
export const backScanCategoryCn = params => { return http.get(`${base}/categoryCn/${params.id}`, params).then(res => res.data); };
// 校验中国分类名称是否重复
export const categoryCnVerifyName = params => { return http.put(`${base}/categoryCn/verifyName?name=${params.name}&parentId=${params.parentId}`, params).then(res => res.data); };




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
export const checkGoods = params => { return http.put(`${base}/goods/check`, params).then(res => res.data); };
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
// 修改库存
export const putScanStock = params => { return http.put(`${base}/stock/log/`, params).then(res => res.data); };

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
// 查询用户认证详细信息
export const memberDeatilInfo = params => { return http.get(`${base}/member/deatil/info`, params).then(res => res.data); };



// zozo会员管理--------------------------------------------------------------------------------------------------------------------
// 会员详情
export const zozomemberDetail = params => { return http.get(`${base}/zozomember/${params.id}`, params).then(res => res.data); };
// 会员编辑信息查询
export const zozomemberEditDetail= params => { return http.get(`${base}/zozomember/edit/${params.id}`, params).then(res => res.data); };
// 修改会员信息
export const updateZozomember= params => { return http.put(`${base}/zozomember`, params).then(res => res.data); };
// 修改用户状态
export const updateZozomemberState= params => { return http.put(`${base}/zozomember/state?memberStatus=${params.memberStatus}`, params.ids).then(res => res.data); };
// 会员认证信息查询  身份证正反面，身份证号
export const idCardInfo= params => { return http.get(`${base}/zozomember/auth/${params.id}`, params).then(res => res.data); };


// 用户登录日志表--------------------------------------------------------------------------------------------------------------------
// 查询用户日志
export const memberloginlogById= params => { return http.get(`${base}/memberloginlog`, params).then(res => res.data); };



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
//订单审核/order/audit/{operating}/{id}
export const auditOperating  = params => { return http.post(`${base}/order/audit/${params.operating}/${params.id}?remark=${params.remarks}`, params).then(res => res.data); }
// 修改订单运营备注
// export const managerRemark  = params => { return http.get(`${base}/order/${params.id}/manager/remark?remark=${params.remarks}`, params).then(res => res.data); }
export const managerRemark  = params => { return http.post(`${base}/order/manager/remark`, params).then(res => res.data); }
// 取消订单
export const orderCancel = params => { return http.post(`${base}/order/cancel/${params.id}`, params).then(res => res.data); }
// jd订单申报
export const orderRedeclareJd = params => { return http.post(`${base}/order/redeclare/${params.id}`, params).then(res => res.data); }
// lakala订单申报
export const orderRedeclareLakala = params => { return http.post(`${base}/order/lakala/redeclare`, params).then(res => res.data); }
// 清关失败
export const clearCustomFail = params => { return http.post(`${base}/order/${params.id}/clear/custom/fail`, params).then(res => res.data); }
// 填写物流信息
export const orderLogistics = params => { return http.post(`${base}/order/logistics?orderId=${params.orderId}&companyId=${params.companyId}&logisticsSn=${params.logisticsSn}`, params).then(res => res.data); }
// 订单列表顶部头信息
export const orderListTop = params => { return http.get(`${base}/order/list/top`).then(res => res.data); }
// 查询收货人详细信息
export const receiverDetail = params => { return http.get(`${base}/order/receiver/deatil?id=${params.id}&orderId=${params.orderId}`,params).then(res => res.data); }


// 物流公司--------------------------------------------------------------------------------------------------------------------
export const logisticsCompany = params => { return http.get(`${base}/logistics/company/all`).then(res => res.data); }

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
//单条评论删除
export const evaDel = params => { return http.delete(`${base}/zozogoods/evaluate/${params.id}`, params).then(res => res.data); }
//评论批量删除
export const evaDels = params => { return http.delete(`${base}/zozogoods/evaluate/batch`, params).then(res => res.data); }
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

// 根据物流单号查询订单物流信息
export const logisticsInfo = params => { return http.get(`${base}/order/logistics/${params.logisticsSn}`, params).then(res => res.data); }
// 修改收货人信息
export const orderReceiver = params => { return http.put(`${base}/order/receiver`, params).then(res => res.data); }

//店铺管理--------------------------------------------------------------------------------------------------------------------
//修改店铺数据
export const updateShopStore = params => { return http.put(`${base}/shopStore`, params).then(res => res.data); };
//导入店铺信息
export const importShopStore = params => { return http.post(`${base}/shopStore/import`, params).then(res => res.data); };
//店铺停业营业操作
export const operateShopStore = params => { return http.put(`${base}/shopStore/operate?operateFlag=${params.operateFlag}&storeId=${params.storeId}`, params).then(res => res.data); };
// 分页查询信息
export const shopStorePage = params => { return http.get(`${base}/shopStore/page`, params).then(res => res.data); };
//店铺是否设为推荐
export const recommendShopStore = params => { return http.put(`${base}/shopStore/recommend?recommendFlag=${params.recommendFlag}&storeId=${params.storeId}`, params).then(res => res.data); };
// 验证店铺名称是否重复
export const verifyShopStore = params => { return http.get(`${base}/shopStore/verify/name`, params).then(res => res.data); };
// 根据中国ID获取信息
export const backScanShopStore = params => { return http.get(`${base}/shopStore/${params.id}`, params).then(res => res.data); };
//
//地区管理--------------------------------------------------------------------------------------------------------------------
// 查询全部一级地区
export const areaFirst = params => { return http.get(`${base}/area/first/list`, params).then(res => res.data); };
// 根据父id查询地区
export const areaByParentId = params => { return http.get(`${base}/area/parent/${params.id}`, params).then(res => res.data); };








//备案商品管理接口--------------------------------------------------------------------------------------------------------------------
// 导出备案商品信息
// export const exportRegister = params => { return http.get(`${base}/goods/register/export`, params).then(res => res.data); };
// 导入商品备案信息
// export const importRegister = params => { return http.post(`${base}/goods/register/import`, params).then(res => res.data); };
// 备案商品分页查询接口
export const registerPage = params => { return http.get(`${base}/goods/register/page`, params).then(res => res.data); };
// 根据商品的spuid查询商品的备案信息
export const backScanRegister = params => { return http.post(`${base}/goods/register/${params.spuid}`, params).then(res => res.data); };




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
// export const pageByStore = params => { return http.get(`${base}/shopBrand/pageByStore`, params).then(res => res.data); };
// 根据中国ID获取品牌信息
export const backScanShopBrand = params => { return http.get(`${base}/shopBrand/${params.id}`, params).then(res => res.data); };




//风格标签管理接口--------------------------------------------------------------------------------------------------------------------
// 删除标签接口
export const deleteShopStyle = params => { return http.delete(`${base}/shopstyle`, params).then(res => res.data); };
// 查询主标签列表(店铺和look folder)
export const searchShopStyle = params => { return http.get(`${base}/shopstyle/style/check/mainList`, params).then(res => res.data); };
// 查询副标签列表(店铺和look folder)
export const searchShopStyleSubList = params => { return http.get(`${base}/shopstyle/style/check/subList`, params).then(res => res.data); };
// 新增/修改标签信息
export const updateShopStyle = params => { return http.post(`${base}/shopstyle/style/edit`, params).then(res => res.data); };
// 查询标签分页列表
export const shopStylePage = params => { return http.get(`${base}/shopstyle/style/page`, params).then(res => res.data); };
// 修改主标签关联副标签
export const shopStyleUnion = params => { return http.post(`${base}/shopstyle/style/union`, params).then(res => res.data); };
// 修改副标签关联主标签
export const shopStyleUnionSub = params => { return http.post(`${base}/shopstyle/style/union/sub`, params).then(res => res.data); };
// 根据主标签id查询已关联副标签
export const backScanShopStyleUnion = params => { return http.get(`${base}/shopstyle/style/union/${params.id}`, params).then(res => res.data); };
// 根据副标签id查询已关联主标签
export const backScanShopStyleSubUnion = params => { return http.get(`${base}/shopstyle/style/union/sub/${params.id}`, params).then(res => res.data); };
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
export const editWare = params => { return http.delete(`${base}/ware/isenable?id=${params.id}&isEnable=${params.isEnable}`, params).then(res => res.data); };
// 仓库列表
export const warePage = params => { return http.get(`${base}/ware/list`, params).then(res => res.data); };
// 仓库sku商品
export const skuGoods = params => { return http.get(`${base}/ware/skugoods`, params).then(res => res.data); };
// 校验仓库名称
export const verifyWare = params => { return http.get(`${base}/ware/verify/name`, params).then(res => res.data); };
// 根据ID获取仓库信息
export const backScanWare = params => { return http.get(`${base}/ware/${params.id}`, params).then(res => res.data); };
// 根据类型查询仓库列表
export const wareListByType = params => { return http.get(`${base}/ware/${params.type}/list`, params).then(res => res.data); };
// 删除
export const deleteWare = params => { return http.delete(`${base}/ware`, params).then(res => res.data); };




//日本分类管理接口--------------------------------------------------------------------------------------------------------------------
// 查询日本分类子分类(parentId为0,且无cateId)
// export const searchCategoryJp = params => { return http.get(`${base}/categoryJp/children`, params).then(res => res.data); };
export const searchCategoryJp = params => { return http.get(`${base}/categoryCn/jpchildren`, params).then(res => res.data); };

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
// 商品详细信息
export const backScanZozogoods = params => { return http.get(`${base}/zozogoods?id=${params.id}`, params).then(res => res.data); };
// 商品详细信息
export const backScanZozogoods2 = params => { return http.get(`${base}/zozogoods/goodsCsJpInfo?id=${params.id}`, params).then(res => res.data); };

// 商品保存
export const saveZozogoods = params => { return http.post(`${base}/zozogoods`, params).then(res => res.data); };
// 商品分页
export const zozogoodsPage = params => { return http.get(`${base}/zozogoods/page`, params).then(res => res.data); };
// 查看商品操作日志分页查询
// export const backScanZozogoodsLog = params => { return http.get(`${base}/zozogoods/page/log`, params).then(res => res.data); };
// 商品上下架状态批量修改
export const showBatchGoods = params => { return http.put(`${base}/zozogoods/show/?ids=${params.ids}&showWeb=${params.showWeb}`, params).then(res => res.data); };
// 单个商品上下架状态修改
export const showGoods = params => { return http.put(`${base}/zozogoods/show/${params.id}?showWeb=${params.showWeb}&shelfTime=${params.shelfTime}&showType=${params.showType}`, params).then(res => res.data); };
// 获取商品尺码信息
export const getZozogoodsSize = params => { return http.get(`${base}/zozogoods/size/item?spuId=${params.spuId}&sizeIdJp=${params.sizeIdJp}`, params).then(res => res.data); };
// 查询中国分类列表
export const backScanCategorys = params => { return http.get(`${base}/zozogoods/categorys`, params).then(res => res.data); };
// 查询品牌列表
export const searchBrandName = params => { return http.get(`${base}/zozogoods/brandname`, params).then(res => res.data); };
// 查询店铺列表
export const searchStoreName = params => { return http.get(`${base}/zozogoods/storename`, params).then(res => res.data); };






//同义词管理接口--------------------------------------------------------------------------------------------------------------------
// 删除
export const deleteShopsynonym = params => { return http.delete(`${base}/shopsynonym`, params).then(res => res.data); };
// 保存
export const shopsynonymSave = params => { return http.post(`${base}/shopsynonym`, params).then(res => res.data); };
// 修改
export const editShopsynonym = params => { return http.put(`${base}/shopsynonym`, params).then(res => res.data); };
// 分页
export const shopsynonymPage = params => { return http.get(`${base}/shopsynonym/page`, params).then(res => res.data); };
// 信息
export const backScanShopsynonym = params => { return http.get(`${base}/shopsynonym/${params.id}`, params).then(res => res.data); };





//搜索统计管理接口--------------------------------------------------------------------------------------------------------------------
// 删除
export const deleteShophotkeywordrecord = params => { return http.delete(`${base}/shophotkeywordrecord`, params).then(res => res.data); };
// 保存
export const shophotkeywordrecordSave = params => { return http.post(`${base}/shophotkeywordrecord`, params).then(res => res.data); };
// 修改
export const editShophotkeywordrecord = params => { return http.put(`${base}/shophotkeywordrecord`, params).then(res => res.data); };
// 分页
export const shophotkeywordrecordPage = params => { return http.get(`${base}/shophotkeywordrecord/page`, params).then(res => res.data); };
// 信息
export const backScanShophotkeywordrecord = params => { return http.get(`${base}/shophotkeywordrecord/${params.id}`, params).then(res => res.data); };





//热门搜索配置接口、搜索统计管理--------------------------------------------------------------------------------------------------------------------
// 删除
export const deleteShophotkeyword = params => { return http.delete(`${base}/shophotkeyword`, params).then(res => res.data); };
// 保存
export const shophotkeywordSave = params => { return http.post(`${base}/shophotkeyword`, params).then(res => res.data); };
// 修改
export const editShophotkeyword = params => { return http.put(`${base}/shophotkeyword/updateHotKeyword`, params).then(res => res.data); };
// 分页
export const shophotkeywordPage = params => { return http.get(`${base}/shophotkeyword/page`, params).then(res => res.data); };
// 信息
export const backScanShophotkeyword = params => { return http.get(`${base}/shophotkeyword/${params.id}`, params).then(res => res.data); };


//消息-------------------------------------------------------------------------------------------------------------
//模板分页列表
export const getmessagepage = params => { return http.get(`${base}/shopmessagetemplate/page`, params).then(res => res.data); };
//修改模板列表状态
export const putMessageState = params => { return http.put(`${base}/shopmessagetemplate`, params).then(res => res.data); };
//消息列表删除
export const deleteMessage = params => { return http.delete(`${base}/shopmessagetemplate`, params).then(res => res.data); };
//接收人保存
export const saveMessage = params => { return http.post(`${base}/shopmessagetemplate/recesave`, params).then(res => res.data); };
//模板标签信息
export const getShopmessagetemplate = params => { return http.get(`${base}/shopmessagetemplate/${params.id}`, params).then(res => res.data); };
//模板保存
export const saveShopmessagetemplate = params => { return http.post(`${base}/shopmessagetemplate`, params).then(res => res.data); };
//消息详情
export const getMessageDetail = params => { return http.get(`${base}/shopmessagetemplate/messageDetails/${params.id}`, params).then(res => res.data); };
// 消息类型
export const messageTypePage = params => { return http.get(`${base}/shopmessagetemplate/messagetypepage`, params).then(res => res.data); };




//京东分类-------------------------------------------------------------------------------------------------------------
//导入京东分类
export const importJdCate = params => { return http.post(`${base}/jdCate/import`, params).then(res => res.data); };
// 分页
export const jdCatePage = params => { return http.get(`${base}/jdCate/page`, params).then(res => res.data); };
// 根据父分类id查询子分类集合
export const jdCateSubcollection = params => { return http.get(`${base}/jdCate/subcollection/${params.id}`, params).then(res => res.data); };
//更新京东分类关联的中国分类
export const updateCategory = params => { return http.post(`${base}/jdCate/updateCategory?id=${params.id}`, params.ids).then(res => res.data); };
// 编辑页面信息回显
export const backScanJdCate = params => { return http.get(`${base}/jdCate/${params.id}`, params).then(res => res.data); };
// 查询中国分类，已经关联的中国分类不显示其中不包括该id关联的中国分
export const categoryListById = params => { return http.get(`${base}/jdCate/category/${params.id}`, params).then(res => res.data); };


// 售后-退货退款 仅退款 :-------------------------------------------------------------------------------------------------------------
// 售后详情
export const aftersaleReturnDetail = params => { return http.get(`${base}/aftersale/return/detail/${params.aftersaleSn}`, params).then(res => res.data); };
// 同意退款|拒绝退款
export const returnReimburse = params => { return http.put(`${base}/aftersale/return/reimburse`, params).then(res => res.data); };
// 确认收货|未收货
export const aftersaleComfirm = params => { return http.put(`${base}/aftersale/return/${params.isComfirm}/receipt/${params.sn}`, params).then(res => res.data); };
// 售后审核操作
export const aftersaleReturnVerify = params => { return http.put(`${base}/aftersale/return/verify`, params).then(res => res.data); };






//操作日志-------------------------------------------------------------------------------------------------------------
// 导出
export const exportOperation = params => { return http.get(`${base}/log/operation/export`, params).then(res => res.data); };
// 操作模块列表
export const listModule = params => { return http.get(`${base}/log/operation/listModule`, params).then(res => res.data); };
// 分页
export const operationPage = params => { return http.get(`${base}/log/operation/page`, params).then(res => res.data); };


//查看库存----------------------------------------------------------------------------------------------------
//查看库存分类
export const getdatagoods = params => { return http.get(`${base}/stock/goods`, params).then(res => res.data); };
//获取品牌列表
export const getdatabrands = params => { return http.get(`${base}/stock/brands`, params).then(res => res.data); };
//获取中国分类
export const getdatacategory = params => { return http.get(`${base}/stock/category`, params).then(res => res.data); };
//获取店铺列表
export const getdatastores = params => { return http.get(`${base}/stock/stores`, params).then(res => res.data); };




//中日词库-------------------------------------------------------------------------------------------------------------
// 保存
export const syslexiconSave = params => { return http.post(`${base}/syslexicon`, params).then(res => res.data); };
// 修改
export const editSyslexicon = params => { return http.put(`${base}/syslexicon`, params).then(res => res.data); };
// 导出
export const exportSyslexicon = params => { return http.get(`${base}/syslexicon/export`, params).then(res => res.data); };
// 分页
// export const syslexiconPage = params => { return http.get(`${base}/syslexicon/page`, params).then(res => res.data); };
// 删除
// export const deleteSyslexicon = params => { return http.delete(`${base}/syslexicon/${params.id}`, params).then(res => res.data); };
// 信息
export const backScanSyslexicon = params => { return http.get(`${base}/syslexicon/${params.id}`, params).then(res => res.data); };

// 校验词汇是否重复,包括中文和日文
export const syslexiconVerifyvocabulary = params => { return http.get(`${base}/syslexicon/verifyvocabulary`, params).then(res => res.data); };





//字典管理-------------------------------------------------------------------------------------------------------------
// 验证字典名称或字典编码已经存在
export const existsDict = params => { return http.get(`${base}/dict/exists`, params).then(res => res.data); };
// 字典分类数据
export const getDictList = params => { return http.get(`${base}/dict/list`, params).then(res => res.data); };
// 分页
export const dictPage = params => { return http.get(`${base}/dict/page`, params).then(res => res.data); };
// 新增数据
export const dictSave = params => { return http.post(`${base}/dict/save`, params).then(res => res.data); };
// 修改
export const updateDict = params => { return http.put(`${base}/dict/update`, params).then(res => res.data); };
// 根据ID查询信息
export const backScanDict = params => { return http.get(`${base}/dict/${params.id}`, params).then(res => res.data); };

// 修改底部Icon配置
export const iconEdit = params => { return http.put(`${base}/icon`, params).then(res => res.data); };
//查询所有配置
export const settingAll = params => { return http.get(`${base}/setting/all`).then(res => res.data); };
//保存默认搜索词配置
export const settingSearch = params => { return http.post(`${base}/setting/default/search/term`,params).then(res => res.data); };
//保存库存显示配置
export const settingStock = params => { return http.post(`${base}/setting/inventory/display`,params).then(res => res.data); };
//保存订单页面提示配置
export const settingPage = params => { return http.post(`${base}/setting/order/confirm/page`,params).then(res => res.data); };
//保存订单弹窗提示配置
export const settingPopup = params => { return http.post(`${base}/setting/order/confirm/popup`,params).then(res => res.data); };
//设置首页集合推荐
export const sethomeIndexPage = params => { return http.post(`${base}/folderrecommend/setrecommend`, params).then(res => res.data); };
//购物车添加商品
export const addGoodscarList = params => { return http.post(`${base}/cartrecom/add`, params).then(res => res.data); };
//添加商品未推荐列表
export const goodsListVisible = params => { return http.get(`${base}/cartrecom/goodslist`, params).then(res => res.data); };
//购物车修改
export const cartConfigSort = params => { return http.post(`${base}/cartrecom/update`, params).then(res => res.data); };
//修改排序
export const updateSortNum = params => { return http.post(`${base}/cartrecom/update`, params).then(res => res.data); };

//  满减活动-------------------------------------------------------------------------------------------------------------
// 新增满减活动
 export const activityReduceAdd = params => { return http.post(`${base}/activity/reduce`, params).then(res => res.data); };
//  满减活动编辑
 export const activityReduceEdit = params => { return http.put(`${base}/activity/reduce/edit`, params).then(res => res.data); };
//  满减活动详情
export const activityReduceDetailById = params => { return http.get(`${base}/activity/reduce/${params.id}`, params).then(res => res.data); };
// 满减活动审核
export const activityReduceAudit= params => { return http.put(`${base}/activity/reduce/audit?id=${params.id}&auditState=${params.auditState}`, params).then(res => res.data); };
// 满减活动停止
export const activityReduceStop = params => { return http.put(`${base}/activity/reduce/stop?id=${params.id}`, params).then(res => res.data); };
// DELETE /activity/reduce/{id}
// 满减活动删除



//异常日志-------------------------------------------------------------------------------------------------------------
// 操作模块列表
export const errorListModule = params => { return http.get(`${base}/log/error/listModule`, params).then(res => res.data); };

//黑名单管理表-------------------------------------------------------------------------------------------------------------
// 添加黑名单
export const addBlcaklist = params => { return http.post(`${base}/blacklist/add`, params).then(res => res.data); };


// 积分设置-------------------------------------------------------------------------------------------------------------
export const updatehoppointssettings = params => { return http.put(`${base}/shoppointssettings`, params).then(res => res.data); };

export const getShoppointssettings = params => { return http.get(`${base}/shoppointssettings`, params).then(res => res.data); };







//优惠券管理-------------------------------------------------------------------------------------------------------------
//优惠券活动审核
export const activityAudit = params => { return http.put(`${base}/activity/coupon/audit?id=${params.id}&auditState=${params.auditState}`, params).then(res => res.data); };
//新增新会员专享优惠券活动
export const addActivityNewMember = params => { return http.post(`${base}/activity/coupon/newmember`, params).then(res => res.data); };
// 编辑新会员专享优惠券活动
export const editActivityNewMember = params => { return http.put(`${base}/activity/coupon/newmember`, params).then(res => res.data); };
//新增普通优惠券活动
export const addActivityNormal = params => { return http.post(`${base}/activity/coupon/normal`, params).then(res => res.data); };
// 编辑普通优惠券活动
export const editActivityNormal = params => { return http.put(`${base}/activity/coupon/normal`, params).then(res => res.data); };
//新增积分专享优惠券活动
export const addActivityPoint = params => { return http.post(`${base}/activity/coupon/point`, params).then(res => res.data); };
// 编辑积分专享优惠券活动
export const editActivityPoint = params => { return http.put(`${base}/activity/coupon/point`, params).then(res => res.data); };
// 优惠券活动停止
export const stopActivity = params => { return http.put(`${base}/activity/coupon/stop?id=${params.id}`, params).then(res => res.data); };
// 修改
export const updateActivity = params => { return http.put(`${base}/activity/coupon/update`, params).then(res => res.data); };
// 优惠券活动详情
export const backScanActivity = params => { return http.get(`${base}/activity/coupon/${params.id}`, params).then(res => res.data); };


// 限量活动管理 ----------------------------------------------------------------------------------------------------------
// 新增
export const addLimitActivity = params => { return http.post(`${base}/limit/activity`, params).then(res => res.data); };
// 编辑
export const editLimitActivity = params => { return http.put(`${base}/limit/activity`, params).then(res => res.data); };
// 编辑回显限量活动
export const backScanLimitActivityDetail = params => { return http.get(`${base}/limit/activity/detail/${params.id}`, params).then(res => res.data); };
// 增加(编辑)限量活动商品
export const editLimitActivityGoods = params => { return http.post(`${base}/limit/activity/goods`, params).then(res => res.data); };
// 删除限量活动商品
export const deleteLimitActivityGoods = params => { return http.delete(`${base}/limit/activity/goods`, params).then(res => res.data); };

// 活动选择添加商品sku列表查询
export const limitActivitySkuChoice = params => { return http.get(`${base}/limit/activity/sku/choice`, params).then(res => res.data); };
// 删除限量活动商品规格
export const deleteLimitActivityGoodscs = params => { return http.delete(`${base}/limit/activity/goodscs`, params).then(res => res.data); };
// 修改限量活动商品排序
export const limitActivityGoodsSorts = params => { return http.put(`${base}/limit/activity/goods/sort`, params).then(res => res.data); };
// 审核限量活动
export const limitActivityAudit = params => { return http.put(`${base}/limit/activity/audit`, params).then(res => res.data); };
// 停止限量活动
export const limitActivityStop = params => { return http.put(`${base}/limit/activity/stop?id=${params.id}`, params).then(res => res.data); };

// 预售活动接口 ----------------------------------------------------------------------------------------------------------
// 保存预售活动
export const addPresellActivity = params => { return http.post(`${base}/presell/activity`, params).then(res => res.data); };
// 修改预售活动
export const editPresellActivity = params => { return http.put(`${base}/presell/activity`, params).then(res => res.data); };
// 编辑回显预售活动
export const backScanPresellActivityDetail = params => { return http.get(`${base}/presell/activity/detail/${params.id}`, params).then(res => res.data); };
// 增加预售活动商品
export const savePresellActivityGoods = params => { return http.post(`${base}/presell/activity/goods`, params).then(res => res.data); };
// 编辑限量活动商品
export const editPresellActivityGoods = params => { return http.put(`${base}/presell/activity/goods`, params).then(res => res.data); };
// 删除限量活动商品
export const deletePresellActivityGoods = params => { return http.delete(`${base}/presell/activity/goods`, params).then(res => res.data); };
// 删除预售活动商品规格
export const deletePresellActivityGoodscs = params => { return http.delete(`${base}/presell/activity/goodscs`, params).then(res => res.data); };

// 审核限量活动
export const presellActivityAudit = params => { return http.put(`${base}/presell/activity/audit`, params).then(res => res.data); };
// 停止限量活动
export const presellActivityStop = params => { return http.put(`${base}/presell/activity/stop?id=${params.id}`, params).then(res => res.data); };

// 精选分类 ----------------------------------------------------------------------------------------------------------
// 保存
export const categoryactivityAdd = params => { return http.post(`${base}/categoryactivity/add`, params).then(res => res.data); };
// 修改编辑
export const categoryactivityUpdate = params => { return http.put(`${base}/categoryactivity/update`, params).then(res => res.data); };
// 根据ID获取信息
export const backScanCategoryactivityDetail = params => { return http.get(`${base}/categoryactivity/${params.id}`, params).then(res => res.data); };

// 精选分类商品表 ----------------------------------------------------------------------------------------------------------
// 批量保存
export const categoryactivitygoodsBatch = params => { return http.post(`${base}/categoryactivitygoods/batch`, params).then(res => res.data); };
// 删除
export const  deleteCateActgoods= params => { return http.delete(`${base}/categoryactivitygoods`, params).then(res => res.data); };
// 批量修改
export const categoryactivitygoodsUpdateBach = params => { return http.put(`${base}/categoryactivitygoods/updateBach`, params).then(res => res.data); };



//Q&A----------------------------------------------------------------------------------------------------------
//问题类型删除
export const delQuestiontype = params => { return http.delete(`${base}/questiontype`, params).then(res => res.data); };
//问题类型保存
export const saveQuestiontype = params => { return http.post(`${base}/questiontype/add`, params).then(res => res.data); };
//问题类型修改
export const putQuestiontype = params => { return http.put(`${base}/questiontype/update`, params).then(res => res.data); };
//问题类型信息
export const getQuestiontype = params => { return http.get(`${base}/questiontype/${params.id}`, params).then(res => res.data); };
//Q&A删除
export const delQuestionanswer = params => { return http.delete(`${base}/questionanswer`, params).then(res => res.data); };
//Q&A保存
export const saveQuestionanswer = params => { return http.post(`${base}/questionanswer/add`, params).then(res => res.data); };
//Q&A修改
export const putQuestionanswer = params => { return http.put(`${base}/questionanswer/update`, params).then(res => res.data); };
//Q&A批量修改
export const updateBachQuestionanswer = params => { return http.put(`${base}/questionanswer/updateBach`, params).then(res => res.data); };
//Q&A详情页面修改排序
export const updateQuestionanswerSort = params => { return http.put(`${base}/questionanswer/sort`, params).then(res => res.data); };
//Q&A列表页面修改排序
export const updateQuestiontypeSort = params => { return http.put(`${base}/questiontype/sort`, params).then(res => res.data); };
//Q&A信息
export const getQuestionanswer = params => { return http.get(`${base}/questionanswer/${params.id}`, params).then(res => res.data); };




//秒杀活动
//秒杀关联商品
export const seckillProPage = params => { return http.get(`${base}/seckill/goods/choiced/page?activityId=${params.activityId}&page=${params.page}&limit=${params.limit}`, params).then(res => res.data); };
//关联商品详情
export const seckillProDet = params => { return http.get(`${base}/seckill/goods/sku/choice?goodsId=${params.goodsId}&activityId=${params.activityId}`, params).then(res => res.data); };
//秒杀场次审核
export const seckillActAudit = params => { return http.get(`${base}/seckill/activity/audit?id=${params.id}&auditState=${params.auditState}`, params).then(res => res.data); };
//秒杀添加商品列表
// export const addSckillPro = params => { return http.get(`${base}/seckill/goods/page/${params.activityId}?page=${params.page}&limit=${params.limit}&brandName=${params.brandName}&name=${params.name}&categoryId=${params.categoryId}&id=${params.id}&storeName=${params.storeName}`, params).then(res => res.data); };;
//编辑添加列表
export const seckillProUpdate = params => { return http.put(`${base}/seckill/goods/activity`, params).then(res => res.data); };
//保存添加商品规格
export const seckillProSave = params => { return http.post(`${base}/seckill/goods/activity`, params).then(res => res.data); };
//修改选中商品规格
export const seckillProEdit = params => { return http.put(`${base}/seckill/goods/activity`, params).then(res => res.data); };

//删除已选中秒杀商品
export const seckillProRemove = params => { return http.delete(`${base}/seckill/goods/activity`, params).then(res => res.data); };
//秒杀时间段列表
export const periodPage = params => { return http.get(`${base}/seckill/period/list/all`, params).then(res => res.data); };
//新建秒杀时间段
export const newSeckillTime = params => { return http.post(`${base}/seckill/period`, params).then(res => res.data); };
//修改秒杀时间段状态
export const seckillState = params => { return http.put(`${base}/seckill/period/stop?id=${params.id}&stopFlag=${params.stopFlag}`, params).then(res => res.data); };
//删除秒杀时间
export const seckillTimeDel = params => { return http.delete(`${base}/seckill/period/${params.id}`, params).then(res => res.data); };
//时间段详情
export const periodDetail = params => { return http.get(`${base}/seckill/period/${params.id}`, params).then(res => res.data); };
//编辑秒杀详情
export const periodEdit= params => { return http.put(`${base}/seckill/period`, params).then(res => res.data); };
//保存秒杀商品排序
export const seckillSortSave = params => { return http.put(`${base}/seckill/goods/sort`, params).then(res => res.data); };


//版本管理  
export const sysversionmangedetail = params => { return http.get(`${base}/sysversionmange/${params.id}`, params).then(res => res.data); };
//版本保存 
export const addfileupload = params => { return http.post(`${base}/sysversionmange/add`, params).then(res => res.data); };
//apk上传
export const postfileupload = params => { return http.post(`${base}/fileupload/appversion`, params).then(res => res.data); };




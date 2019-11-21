/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
/*
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
/**
 * 用户名（账号）
 * @param {*} s
 */
export function isUserName (s) {
	return /^[a-zA-Z0-9_^%&',;=?#@￥*+/"':~·|。…(){}<>《》【】$\x22]{1,20}$/.test(s)
}
/**
 * 昵称
 * @param {*}
 * 输入的只能是汉字和英文,数字，下划线
 */
export function isNickName (s) {
  return /^[\u0391-\uFFE5A-Za-z0-9_]+$/.test(s)
}

/**
 * 真实姓名
 * 1.可以是中文
 * 2.可以是英文，允许输入点（英文名字中的那种点），允许输入空格
 * 3.中文和英文不能同时出现
 * 4.长度在20个字符以内
 * @param {*} s
 */
export function isRealName (s) {
  return /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(s)
}
/**
 * 密码
 * @param {*} s
 */
export function isPassword (s) {
  return /^[a-zA-Z0-9]{6,16}$/.test(s)
}
/**
 * 密码 数字字母，和一些常用符号
 * @param {*} s
 */
export function  wordNumCharacter (s) {
  return /^[a-zA-Z0-9@#$%^&*()'.":;\\<>\/?<>]{1,16}$/.test(s)
}

/**
 * 身份证号
 * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
 * @param {*} s
 */
export function isIdCard (s) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(s)
}

export function isNum (s) {
  return /^((-\\d+)|(0+))$/.test(s);//非正整数（负整数 + 0）
}
export function isIntNum (s) {
  return   /^(0|[1-9]\d*)$/.test(s);//非负整数
}

/**
 * 链接地址限英文
 * @param {*} s
 */
export function isAddress (s) {
  return /^[a-zA-Z]+$/.test(s)
}
/*
	* 过滤器
*/

const vueFilter ={
	//时间戳处理
 	formDate: function (value, format) {
        var days = parseInt(value / 1000 / 60 / 60 / 24  , 10); //计算剩余的天数
        var hours = parseInt(value / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
        var minutes = parseInt(value / 1000 / 60 % 60, 10);//计算剩余的分钟
        var seconds = parseInt(value / 1000 % 60, 10);//计算剩余的秒数
        days = checkTime(days);
        hours = checkTime(hours);
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        function checkTime(i) { //将0-9的数字前面加上0，例1变为01
          if (i < 10) {
            i = "0" + i;
          }
          return i;
        };
        return `${days}天-${hours}小时-${minutes}分`;
  },
  dateToStr: function (datatime){   //获取当前时间
        var dateTime = datatime || new Date();
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;//js从0开始取
        var date = dateTime.getDate();
        var hour = dateTime.getHours();
        var minutes = dateTime.getMinutes();
        var second = dateTime.getSeconds();
 
        if(month<10){
            month = "0" + month;
        }
        if(date<10){
            date = "0" + date;
        }
        if(hour <10){
            hour = "0" + hour;
        }
        if(minutes <10){
            minutes = "0" + minutes;
        }
        if(second <10){
            second = "0" + second ;
        }
 
        return year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second;
    },
  formHMS: function (value, format) {
        var days = parseInt(value / 1000 / 60 / 60 / 24  , 10); //计算剩余的天数
        var hours = parseInt(value / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
        var minutes = parseInt(value / 1000 / 60 % 60, 10);//计算剩余的分钟
        var seconds = parseInt(value / 1000 % 60, 10);//计算剩余的秒数
        days = checkTime(days);
        hours = checkTime(hours);
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        function checkTime(i) { //将0-9的数字前面加上0，例1变为01
          if (i < 10) {
            i = "0" + i;
          }
          return i;
        };
        return `${hours}:${minutes}:${seconds}`;
  },
  filterImgUrl:function(value){
        if(!value){return "http://morefun.image.alimmdn.com/xiaoBai/default.png";}
        if(/http/.test(value)|| /data:image/.test(value)){
        //  如果是绝对地址，不用加前缀
        }else{
              value = window.SITE_CONFIG['imgURL'] + "" + value;
        }
        return value;
  },
  filterhrefUrl:function(value){
   
    return "https://www.baidu.com/";
  },
}
export default vueFilter
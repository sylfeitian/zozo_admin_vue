(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-89d9605c"],{"12b1":function(t,e,a){var i=a("dbbd"),n=a("9650"),s=a("fdf7"),r="Expected a function",o=Math.max,c=Math.min;function u(t,e,a){var u,l,d,h,f,p,m=0,g=!1,v=!1,b=!0;if("function"!=typeof t)throw new TypeError(r);function y(e){var a=u,i=l;return u=l=void 0,m=e,h=t.apply(i,a),h}function x(t){return m=t,f=setTimeout(_,e),g?y(t):h}function w(t){var a=t-p,i=t-m,n=e-a;return v?c(n,d-i):n}function k(t){var a=t-p,i=t-m;return void 0===p||a>=e||a<0||v&&i>=d}function _(){var t=n();if(k(t))return C(t);f=setTimeout(_,w(t))}function C(t){return f=void 0,b&&u?y(t):(u=l=void 0,h)}function T(){void 0!==f&&clearTimeout(f),m=0,u=p=l=f=void 0}function I(){return void 0===f?h:C(n())}function F(){var t=n(),a=k(t);if(u=arguments,l=this,p=t,a){if(void 0===f)return x(p);if(v)return clearTimeout(f),f=setTimeout(_,e),y(p)}return void 0===f&&(f=setTimeout(_,e)),h}return e=s(e)||0,i(a)&&(g=!!a.leading,v="maxWait"in a,d=v?o(s(a.maxWait)||0,e):d,b="trailing"in a?!!a.trailing:b),F.cancel=T,F.flush=I,F}t.exports=u},"15c2":function(t,e,a){"use strict";var i=a("db4b"),n=a("5fe5"),s=a("b146");t.exports=function(t){var e=i(this),a=s(e.length),r=arguments.length,o=n(r>1?arguments[1]:void 0,a),c=r>2?arguments[2]:void 0,u=void 0===c?a:n(c,a);while(u>o)e[o++]=t;return e}},"1c74":function(t,e,a){var i=a("b2f5");i(i.P,"Array",{fill:a("15c2")}),a("644a")("fill")},"939d":function(t,e,a){var i=a("c9aa"),n=a("46ce"),s="[object Symbol]";function r(t){return"symbol"==typeof t||n(t)&&i(t)==s}t.exports=r},9650:function(t,e,a){var i=a("8096"),n=function(){return i.Date.now()};t.exports=n},b27f:function(t,e,a){(function(t){var i="undefined"!==typeof t&&t||"undefined"!==typeof self&&self||window,n=Function.prototype.apply;function s(t,e){this._id=t,this._clearFn=e}e.setTimeout=function(){return new s(n.call(setTimeout,i,arguments),clearTimeout)},e.setInterval=function(){return new s(n.call(setInterval,i,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},s.prototype.unref=s.prototype.ref=function(){},s.prototype.close=function(){this._clearFn.call(i,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout((function(){t._onTimeout&&t._onTimeout()}),e))},a("de8a"),e.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof t&&t.clearImmediate||this&&this.clearImmediate}).call(this,a("5dde"))},c714:function(t,e,a){"use strict";var i=a("e62b"),n=a.n(i);n.a},cd49:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"aui-wrapper aui-page__login"},[a("canvasbg"),a("div",{staticClass:"aui-content__wrapper",staticStyle:{"pointer-events":"auto"}},[a("main",{staticClass:"aui-content logincontent"},[a("div",{staticClass:"login-header"},[a("h2",{staticClass:"login-brand"},[t._v(t._s(t.$t("brand.lg")))])]),a("div",{staticClass:"login-body"},[a("h3",{staticClass:"login-title"},[t._v(t._s(t.$t("login.title")))]),a("el-form",{ref:"dataForm",attrs:{model:t.dataForm,rules:t.dataRule,"status-icon":""},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.dataFormSubmitHandle()}}},[a("el-form-item",{attrs:{prop:"username"}},[a("el-input",{attrs:{placeholder:t.$t("login.username")},model:{value:t.dataForm.username,callback:function(e){t.$set(t.dataForm,"username",e)},expression:"dataForm.username"}},[a("span",{staticClass:"el-input__icon",attrs:{slot:"prefix"},slot:"prefix"},[a("svg",{staticClass:"icon-svg",attrs:{"aria-hidden":"true"}},[a("use",{attrs:{"xlink:href":"#icon-user"}})])])])],1),a("el-form-item",{attrs:{prop:"password"}},[a("el-input",{attrs:{type:"password",placeholder:t.$t("login.password")},model:{value:t.dataForm.password,callback:function(e){t.$set(t.dataForm,"password",e)},expression:"dataForm.password"}},[a("span",{staticClass:"el-input__icon",attrs:{slot:"prefix"},slot:"prefix"},[a("svg",{staticClass:"icon-svg",attrs:{"aria-hidden":"true"}},[a("use",{attrs:{"xlink:href":"#icon-lock"}})])])])],1),a("el-form-item",{attrs:{prop:"captcha"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:14}},[a("el-input",{attrs:{placeholder:t.$t("login.captcha")},model:{value:t.dataForm.captcha,callback:function(e){t.$set(t.dataForm,"captcha",e)},expression:"dataForm.captcha"}},[a("span",{staticClass:"el-input__icon",attrs:{slot:"prefix"},slot:"prefix"},[a("svg",{staticClass:"icon-svg",attrs:{"aria-hidden":"true"}},[a("use",{attrs:{"xlink:href":"#icon-safetycertificate"}})])])])],1),a("el-col",{staticClass:"login-captcha",attrs:{span:10}},[a("img",{attrs:{src:t.captchaPath},on:{click:function(e){return t.getCaptcha()}}})])],1)],1),a("el-form-item",[a("el-button",{staticClass:"w-percent-100",attrs:{loading:t.loading,type:"primary"},on:{click:function(e){return t.dataFormSubmitHandle()}}},[t._v(t._s(t.$t("login.title")))])],1)],1)],1)])])],1)},n=[],s=(a("34a3"),a("e04f")),r=a.n(s),o=a("12b1"),c=a.n(o),u=a("12cb"),l=a("ed08"),d=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{width:"100%",height:"100%",position:"absolute"}},[a("div",{staticClass:"plp-bg",staticStyle:{width:"100%",height:"100%"},attrs:{id:"plp-bg"}}),a("remote-script",{attrs:{src:"https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"},on:{load:t.okJq}}),t.jq?a("remote-script",{attrs:{src:"http://vrbuy.image.alimmdn.com/morefun/TaobaoInteraction/lib/jquery.cookie.js"},on:{load:t.okCookie}}):t._e()],1)},h=[],f=(a("0857"),a("1c74"),a("b27f"),{name:"canvasbg",data:function(){return{jq:!1}},mounted:function(){},methods:{okJq:function(){this.jq=!0},okCookie:function(){this.makeCanves()},makeCanves:function(){var t=function(t,e){this.canvas,this.ctx,this.x,this.y,this.r,this.a=e&&e>0&&e<=1?e:.8,this.speed=t&&t>0?t:2,this.sx,this.sy,this.isMouseDot=0};function e(e){var a=document.querySelector(e.el),i=document.createElement("canvas"),n=i.getContext("2d"),s=window.getComputedStyle(a,null),r=parseInt(s.width),o=parseInt(s.height),c=r*o,u="width: "+r+"px; height: "+o+"px;";i.setAttribute("style",u),i.width=(2*r).toString(),i.height=(2*o).toString(),a.appendChild(i);for(var l=[],d=e.dotsNumber||parseInt(c/5e3),h=2*d,f=0,p=e.lineMaxLength||250,m=0;m<d;m++){var g=new t(e.speed,e.dotsAlpha);m<d-1?g.init(i):g.init(i,0,0,1),l.push(g)}var v=e.clickWithDotsNumber||5;function b(a){var n=a.pageX,s=a.pageY;if(n>0&&n<r&&s>0&&s<o)for(var c=0;c<v;c++){var u=new t(e.speed,e.dotsAlpha);l.push(u),d+=1,u.init(i,n,s)}}function y(t){var e=t.pageX,a=t.pageY;g.init(i,e,a,1)}function x(t){var e=t.pageX,a=t.pageY;e>0&&e<r&&a>0&&a<o&&g.mouseDot(e,a)}function w(t){g.init(i)}document.addEventListener("click",b),i.addEventListener("mouseenter",y),i.addEventListener("mousemove",x),i.addEventListener("mouseleave",w);var k=requestAnimationFrame||webkitRequestAnimationFrame||oRequestAnimationFrame||msRequestAnimationFrame;function _(){n.clearRect(0,0,i.width,i.height),d>h&&(f=d-h);for(var t=f;t<d;t++)l[t]&&l[t].update();for(t=f;t<d;t++)for(var e=t+1;e<d;e++){var a=l[t].x-l[e].x,s=l[t].y-l[e].y,r=Math.sqrt(Math.pow(a,2)+Math.pow(s,2));r<p&&(n.beginPath(),n.moveTo(l[t].x,l[t].y),n.lineTo(l[e].x,l[e].y),n.strokeStyle="rgba(255,255,255,"+(p-r)/p+")",n.strokeWidth=1,n.stroke(),n.closePath())}k(_)}k(_)}t.prototype={init:function(t,e,a,i){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.x=2*e||Math.random()*this.canvas.width,this.y=2*a||Math.random()*this.canvas.height,this.r=6*Math.random(),i&&(this.isMouseDot=1),this.sx=i?0:Math.random()*this.speed*2-this.speed,this.sy=i?0:Math.random()*this.speed*2-this.speed,this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI),this.ctx.fillStyle="rgba(255,255,255,"+this.a+")",this.ctx.fill(),this.ctx.closePath()},update:function(){this.isMouseDot||(this.x=this.x+this.sx,this.y=this.y+this.sy,(this.x<0||this.x>this.canvas.width)&&this.init(this.canvas),(this.y<0||this.y>this.canvas.height)&&this.init(this.canvas),this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.r+.5,0,2*Math.PI),this.ctx.fillStyle="rgba(255,255,255,"+this.a+")",this.ctx.fill(),this.ctx.closePath())},mouseDot:function(t,e){this.x=2*t,this.y=2*e,this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.r+.5,0,2*Math.PI),this.ctx.fillStyle="rgba(255,255,255,"+this.a+")",this.ctx.fill(),this.ctx.closePath()}},1==$("#plp-bg").length&&new e({el:"#plp-bg",dotsNumber:100,lineMaxLength:300,dotsAlpha:.5,speed:1.5,clickWithDotsNumber:5})}}}),p=f,m=a("6691"),g=Object(m["a"])(p,d,h,!1,null,null,null),v=g.exports,b=a("61f7"),y={data:function(){return{loading:!1,i18nMessages:u["b"],captchaPath:"",captchaStatus:!0,dataForm:{username:"",password:"",uuid:"",captcha:""}}},components:{canvasbg:v},computed:{dataRule:function(){var t=this,e=function(t,e,a){if(!Object(b["e"])(e))return a(new Error("仅可输入英文、数字"));a()},a=function(t,e,a){if(!Object(b["f"])(e))return a(new Error("可输入英文、数字、常用符号（不包含空格）"));a()},i=function(e,a,i){if(!t.captchaStatus)return i(new Error("验证码不正确"));i()};return{username:[{required:!0,message:this.$t("validate.required"),trigger:"blur"},{validator:e,trigger:"blur"}],password:[{required:!0,message:this.$t("validate.required"),trigger:"blur"},{validator:a,trigger:"blur"}],captcha:[{required:!0,message:this.$t("validate.required"),trigger:"blur"},{validator:i,trigger:"blur"}]}}},created:function(){this.getCaptcha()},methods:{getCaptcha:function(){this.dataForm.uuid=Object(l["c"])(),this.captchaPath="".concat(window.SITE_CONFIG["apiURL"],"/auth/captcha?uuid=").concat(this.dataForm.uuid),console.log("验证码",this.captchaPath)},dataFormSubmitHandle:c()((function(){var t=this;this.loading||this.$refs["dataForm"].validate((function(e){if(!e)return!1;t.loading=!0,t.$http.post("/auth/login",t.dataForm).then((function(e){var a=e.data;if(t.loading=!1,200!=a.code)return t.getCaptcha(),10007==a.code&&(t.captchaStatus=!1,t.$refs["dataForm"].validate((function(e){t.captchaStatus=!0}))),t.$message.error(a.msg);r.a.set("token",a.data.token),t.$router.replace({name:"home"})})).catch((function(){}))}))}),1e3,{leading:!0,trailing:!1})}},x=y,w=(a("c714"),Object(m["a"])(x,i,n,!1,null,null,null));e["default"]=w.exports},de8a:function(t,e,a){(function(t,e){(function(t,a){"use strict";if(!t.setImmediate){var i,n=1,s={},r=!1,o=t.document,c=Object.getPrototypeOf&&Object.getPrototypeOf(t);c=c&&c.setTimeout?c:t,"[object process]"==={}.toString.call(t.process)?f():p()?m():t.MessageChannel?g():o&&"onreadystatechange"in o.createElement("script")?v():b(),c.setImmediate=u,c.clearImmediate=l}function u(t){"function"!==typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),a=0;a<e.length;a++)e[a]=arguments[a+1];var r={callback:t,args:e};return s[n]=r,i(n),n++}function l(t){delete s[t]}function d(t){var e=t.callback,i=t.args;switch(i.length){case 0:e();break;case 1:e(i[0]);break;case 2:e(i[0],i[1]);break;case 3:e(i[0],i[1],i[2]);break;default:e.apply(a,i);break}}function h(t){if(r)setTimeout(h,0,t);else{var e=s[t];if(e){r=!0;try{d(e)}finally{l(t),r=!1}}}}function f(){i=function(t){e.nextTick((function(){h(t)}))}}function p(){if(t.postMessage&&!t.importScripts){var e=!0,a=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=a,e}}function m(){var e="setImmediate$"+Math.random()+"$",a=function(a){a.source===t&&"string"===typeof a.data&&0===a.data.indexOf(e)&&h(+a.data.slice(e.length))};t.addEventListener?t.addEventListener("message",a,!1):t.attachEvent("onmessage",a),i=function(a){t.postMessage(e+a,"*")}}function g(){var t=new MessageChannel;t.port1.onmessage=function(t){var e=t.data;h(e)},i=function(e){t.port2.postMessage(e)}}function v(){var t=o.documentElement;i=function(e){var a=o.createElement("script");a.onreadystatechange=function(){h(e),a.onreadystatechange=null,t.removeChild(a),a=null},t.appendChild(a)}}function b(){i=function(t){setTimeout(h,0,t)}}})("undefined"===typeof self?"undefined"===typeof t?this:t:self)}).call(this,a("5dde"),a("4c39"))},e62b:function(t,e,a){},fdf7:function(t,e,a){var i=a("dbbd"),n=a("939d"),s=NaN,r=/^\s+|\s+$/g,o=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,l=parseInt;function d(t){if("number"==typeof t)return t;if(n(t))return s;if(i(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=i(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(r,"");var a=c.test(t);return a||u.test(t)?l(t.slice(2),a?2:8):o.test(t)?s:+t}t.exports=d}}]);
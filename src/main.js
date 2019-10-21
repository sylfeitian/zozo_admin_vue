import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/icons'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'
import http from '@/utils/request'
import { hasPermission } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import "@/utils/importJs.js"
//图片放大功能
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

// 过滤器
import vueFilter from '@/utils/filter'
for (let key in vueFilter){
  Vue.filter(key,vueFilter[key])
}

import VueDND from 'awe-dnd'

// function changeUrl(url){
//   // return url = window.location.hostname +":8080/"+ url.split("group1")[2];
//   console.log(window.location.hostname +":8080/"+ url) 
//   return url = window.location.hostname +":8080/"+ url
// }
// Vue.prototype.changeUrl = changeUrl
Vue.use(VueDND)
// Vue.prototype.$imgDomain = 'http://192.168.1.108:8888/'//图片前缀
Vue.prototype.$imgDomain = window.SITE_CONFIG['imgURL'] ;


let options = {
  fullscreenEl: false
};
Vue.use(preview, options)

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'default',
  i18n: (key, value) => i18n.t(key, value)
})

// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$hasPermission = hasPermission

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

Array.prototype.indexOf = function(val) {   //数组的下标
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {   //删除指定值的一项
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

window.vue = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'
import { mapMutations } from 'vuex'

// 导入网络请求的包
import { $http } from "@/api/request.js"

uni.$http = $http
// 请求根路径
$http.baseUrl = "http://xiaoxi-plan.shiyixi.icu"
// $http.baseUrl = "http://localhost:8090"
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
	console.log(uni.getStorageSync("jwt"));
    options.header = {
      'Authorization': "Bearer " + uni.getStorageSync('jwt') || ""
    }
}

// 封装弹窗的方法
uni.$showMsg = function(title = "数据请求失败", duration = 1500) {
	uni.showToast({
		title: title,
		duration: duration,
		icon: 'none'
	})
}

$http.afterRequest = function (res) {
	// 未登录状态
	if(res.data.code === 40100) {
		console.log("清空数据")
		// 清空数据
		uni.removeStorageSync('userName')
		uni.removeStorageSync('userId')
		uni.removeStorageSync('jwt')
		// 修改状态值
		uni.$store.commit('m_user/changeUserId',  "")
		// 展示信息
		uni.$showMsg(res.data.description)
		// 跳转到登录页面
		uni.navigateTo({
			url: '/subpkg/login/login'
		})
	// 除了成功的情况外
	}else if(res.data.code !== 0) {
		uni.$showMsg(res.data.description)
	}
}

Vue.config.productionTip = false
uni.$store = store

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
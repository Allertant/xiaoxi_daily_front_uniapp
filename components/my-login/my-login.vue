<template>
	<view>
		<uni-forms ref="baseForm" :modelValue="baseFormData" label-position="top">
			<uni-forms-item label="用户名" name="phoneOrUsername">
				<uni-easyinput type="text" v-model="baseFormData.phoneOrUsername" placeholder="请输入用户名或手机号" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput type="password" v-model="baseFormData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item label="验证码" name="vcode">
				<img @click='getCodePic' :src="vcode" alt="">
				<uni-easyinput type="text" v-model="baseFormData.vcode" placeholder="请输入验证码" />
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="login(baseFormData)">登录</button>
	</view>
</template>

<script>
	export default {
		name:"my-login",
		props: {
			vcode: {
				type: String,
				required: true,
			},
			getCodePic: {
				type: Function,
				required: true
			},
			login: {
				type: Function,
				required: true	
			},
			defaultData: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				baseFormData: {
					phoneOrUsername: '',
					password: '',
					vcode: ''
				}
			};
		},
		mounted() {
			// console.log('defaultData',this.defaultData)
			this.baseFormData.phoneOrUsername = this.defaultData.phoneOrUsername
			this.baseFormData.password = this.defaultData.password
		}

	}
</script>

<style>

</style>
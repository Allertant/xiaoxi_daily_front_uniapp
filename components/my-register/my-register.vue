<template>
	<view>
		<uni-forms ref="baseForm" :modelValue="baseFormData" label-position="top">
			<uni-forms-item label="手机号" name="phone">
				<uni-easyinput type="text" v-model="baseFormData.phone" placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput type="password" v-model="baseFormData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item label="重复密码" name="passwordRep">
				<uni-easyinput type="password" v-model="baseFormData.passwordRep" placeholder="请再次输入密码" />
			</uni-forms-item>
			<uni-forms-item label="验证码" name="vcode">
				<img @click='getCodePic' :src="vcode" alt="">
				<uni-easyinput type="text" v-model="baseFormData.vcode" placeholder="请输入验证码" />
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="register(baseFormData)">注册</button>
	</view>
</template>

<script>
	export default {
		name: 'my-register',
		props: {
			vcode: {
				type: String,
				required: true,
			},
			getCodePic: {
				type: Function,
				required: true
			},
			register: {
				type: Function,
				required: true	
			}
		},
		data() {
			return {
				baseFormData: {
					phone: '',
					password: '',
					passwordRep: '',
					vcode: ''
				}
			};
		}
	}
</script>

<style lang="less">

</style>

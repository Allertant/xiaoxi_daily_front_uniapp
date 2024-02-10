<template>
	<view class='login-container'>
		
		<!-- 登录注册选择器 -->
		<view class='login-or-register-selector'>
			<view @click='changeSelect(1)' :class="{'selector-on': select==1, 'selector-default': select==2}">登录</view>
			<view @click='changeSelect(2)' :class="{'selector-on': select==2, 'selector-default': select==1}">注册</view>
		</view>
		
		<!-- 登录后的框 -->
		<view v-if='userId'>
			<view class="user-text">当前用户：{{userName}}</view>
			<button type='primary' @click='logout'>退出登录</button>
		</view>
		
		<view v-else class='login-or-register'>
			
			<!-- 登录框 -->
			<view class="login-box" v-if='select==1'>
				<my-login :vcode="vcode"
				:login='login'
				:defaultData='defaultData'
				:getCodePic='getCodePic' />
			</view>
			
			<!-- 注册框 -->
			<view class='register-box' v-if='select==2'>
				<my-register :vcode="vcode" 
				:register='register'
				:getCodePic='getCodePic' />
			</view>
			
		</view>
		
		
		
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				vcode: '', // 四位图片前端验证码的base64编码
				select: 1, // 默认选中登录框
				routes: [
				        {
				          to: "/login",
				          name: "登录",
				        },
				        {
				          to: "/register",
				          name: "注册",
				        }
				      ],
				defaultData: {
					phoneOrUsername: '',
					password: ''
				}
			};
		},
		computed: {
			...mapState('m_user', ['userId', 'userName'])
		},
		methods: {
			...mapMutations("m_user", ['changeUserName', 'changeUserId', 'removeUser', 'changeJWT']),
			async login(form) {
				if(!form.phoneOrUsername) return uni.$showMsg('请输入用户名或手机号')
				if(!form.password) return uni.$showMsg('请输入密码')
				if(!form.vcode) return uni.$showMsg('请输入验证码')
				
				// 判断phoneOrUsername是用户名还是手机号
				var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				
				// 准备登录数据dto
				let loginData = {}
				loginData.password = form.password
				loginData.vcode = form.vcode
				if(reg_tel.test(form.phoneOrUsername)) {
					// 是手机号
					loginData.phone = form.phoneOrUsername
					loginData.isPhone = true
				}else {
					// 是用户名
					loginData.username = form.phoneOrUsername
					loginData.isPhone = false
				}
				
				// 发送请求
				const {data: res} = await uni.$http.post('/user/login', 
					loginData,
				)
				uni.$showMsg(res.msg)
				
				// 注册成功后，保存相关信息
				if(res.code === 1) {
					this.saveInfoToLocale(res, loginData, loginData.isPhone)
				}
				
			},
			async register(form) {
				// 校验数据框是否为空
				if(!form.phone) return uni.$showMsg("请输入手机号")
				if(!form.password) return uni.$showMsg("请输入密码")
				if(!form.passwordRep) return uni.$showMsg("请重复密码")
				if(!form.vcode) return uni.$showMsg("请输入验证码")
				if(form.password != form.passwordRep) return uni.$showMsg("密码不一致")
				
				// 发送请求
				const {data: res} = await uni.$http.post('/user/register', 
					{phone: form.phone, 
					password: form.password,
					vcode: form.vcode},
				)
				uni.$showMsg(res.msg)
				
				// 登录成功后，保存信息
				if(res.code === 1) {
					this.saveInfoToLocale(res, form, true)
				}
				
			},
			saveInfoToLocale(res, form, isPhone) {
				// 保存用户id、用户姓名和jwt字符串
				this.changeUserId(res.userId)
				this.changeUserName(res.userName)
				this.changeJWT(res.jwt)
				
				// 本地存储用户名和密码
				if(isPhone) {
					uni.setStorageSync("phoneOrUsername", form.phone)
				}else {
					uni.setStorageSync("phoneOrUsername", form.username)
				}
				uni.setStorageSync("password", form.password)
				
				// 跳转到主页
				this.gotoIndex()
			},
			logout() {
				this.removeUser()
			},
			changeSelect(arg) {
				// console.log('changeSelect')
				if(this.select == arg) return 
				this.select = arg
			},
			async getCodePic() {
				const {data: res} = await uni.$http.get('/common/vcode')
				if(res.code == 1) {
					this.vcode = res.data
				}
			},
			gotoIndex() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		},
		onShow() {
			// 加载本地的密码数据
			this.defaultData.phoneOrUsername = uni.getStorageSync("phoneOrUsername") || ""
			this.defaultData.password = uni.getStorageSync("password") || ""
			// 加载验证码图片数据
			this.getCodePic()
		}
	}
</script>

<style lang="scss">
	// 选择器开关相关样式
	.login-or-register-selector {
		display: flex;
		justify-content: space-around;
		.selector-on {
			background-color: rgb(0,122,255);
			color: white;
			padding: 20rpx;
			border-radius: 10px;
		}
		.selector-default {
			background-color: white;
			padding: 20rpx;
			border-radius: 10px;
		}
	}
	// 外部容器的样式
	.login-container {
		position: absolute;
		width: 70%;
		top: 10%;
		left: 10%;
		padding: 30rpx;
		// border: 1px solid black;
	}
	// 注册盒子和登录盒子的相关样式
	.login-box,.register-box {
		padding: 0 10rpx;
	}
	// 登录成功后的展示样式
	.user-text {
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}
	
</style>

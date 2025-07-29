<template>
	<view class='login-container'>
		<!-- 登录后的框 -->
		<view v-if='userData.username' class="user-container">
			<view class="user-info">
				<uni-card>
					<view class="user-name-show">
						<view class="user-text">当前用户：{{userData.username}}</view>
						<uni-icons @click="changeIsEdit" size="30" type="compose"></uni-icons>
					</view>
					<view v-if="isEdit" class="user-name-edit">
						<uni-easyinput type="text" v-model="username" placeholder="请输入" />
						<button @click="updateUserInfo" type="primary">修改</button>
					</view>
				</uni-card>
			</view>
			<view class="user-logout">
				<button type='primary' @click='logout'>退出登录</button>
			</view>
		</view>
		
		<view v-else class='login-or-register'>
			<!-- 登录注册选择器 -->
			<view class='login-or-register-selector'>
				<view @click='changeSelect(1)' :class="{'selector-on': select==1, 'selector-default': select==2}">登录</view>
				<view @click='changeSelect(2)' :class="{'selector-on': select==2, 'selector-default': select==1}">注册</view>
			</view>
			<!-- 登录框 -->
			<view class="login-box" v-if='select==1'>
				<my-login :vcode="vcode"
				:login='login'
				:defaultData='localeLoginData'
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
				localeLoginData: {
					phoneOrUsername: '',
					password: ''
				},
				isEdit: false,
				username: ""
			};
		},
		computed: {
			...mapState('m_user', ['userData'])
		},
		methods: {
			...mapMutations("m_user", ['changeUserData']),
			async login(form) {
				if(!form.phoneOrUsername) return uni.$showMsg('请输入用户名或手机号')
				if(!form.password) return uni.$showMsg('请输入密码')
				if(!form.vcode) return uni.$showMsg('请输入验证码')
				
				// 判断phoneOrUsername是用户名还是手机号
				var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				
				// 准备登录数据dto
				let isPhone = reg_tel.test(form.phoneOrUsername)
				let loginData = {
					password: form.password,
					vcode: form.vcode,
					isPhone: isPhone,
					phone: isPhone ? form.phoneOrUsername : "",
					username: !isPhone ? form.phoneOrUsername : ""
				}
				
				// 发送请求
				const {data: res} = await uni.$http.post('/user/login', 
					loginData,
				)
				uni.$showMsg(res.msg)
				
				// 注册成功后，保存相关信息
				await this.saveInfoToLocale(res.data, loginData, loginData.isPhone)
				
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
				await this.saveInfoToLocale(res.data, form, true)
			},
			async saveInfoToLocale(resData, form, isPhone) {
				console.log(resData, form, isPhone);
				// 1. 保存 jwt 信息
				uni.setStorageSync("jwt", resData.accessToken);
				
				// 2. 获取并保存用户信息到本地
				const {data: res} = await uni.$http.get('/user/info')
				this.changeUserData(res.data);
				
				// 3.存储用户名和密码到本地
				let localUserLoginInfo = {
					phoneOrUsername: isPhone ? form.phone : form.username,
					password: form.password
				}
				uni.setStorageSync("localUserLoginInfo", localUserLoginInfo);
				
				// 跳转到主页
				this.gotoIndex();
			},
			logout() {
				this.changeUserData({});
				// 重新触发数据更新
				this.localeLoginData = uni.getStorageSync("localUserLoginInfo") || {};
				this.getCodePic();
			},
			changeSelect(arg) {
				// console.log('changeSelect')
				if(this.select == arg) return 
				this.select = arg
			},
			async getCodePic() {
				const {data: res} = await uni.$http.get('/common/vcode')
				this.vcode = res.data	
			},
			gotoIndex() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			changeIsEdit() {
				this.isEdit = !this.isEdit
			},
			async updateUserInfo() {
				if(!this.username) return uni.$showMsg("请输入要修改的用户名")
				const {data: res} = await uni.$http.post("/user/update", {
					username: this.username
				})
				uni.$showMsg(res.msg)
				// 修改本地数据
				this.changeUserData({...this.userData, username: this.username})
				this.changeIsEdit() 
			}
		},
		onLoad() {
			console.log('onLoad')
			// 用户未登录
			if(!this.userData.username) {
				// 加载本地的密码数据
				this.localeLoginData = uni.getStorageSync("localUserLoginInfo") || {};
				// 加载验证码图片数据
				this.getCodePic();
			}else {
				// 用于已登录
				this.username = this.userData.username
			}
			
		}
	}
</script>

<style lang="scss">
	.login-or-register {
		position: absolute;
		width: 70%;
		top: 10%;
		left: 10%;
		padding: 30rpx;
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
		// 注册盒子和登录盒子的相关样式
		.login-box,.register-box {
			padding: 0 10rpx;
		}
		// 登录成功后的展示样式
		.user-text {
			font-size: 40rpx;
			margin-bottom: 30rpx;
		}
	}
	.user-container {
		
		.user-info {
			.user-name-show {
				display: flex;
				justify-content: space-between;
				padding-bottom: 10px;
			}
			.user-name-edit {
				display: flex;
				justify-content: space-between;
				button {
					display: flex;
					align-items: center;
					height: 35px;
					margin-left: 10px;
				}
			}
		}
		.user-logout {
			
		}
	}
	
</style>

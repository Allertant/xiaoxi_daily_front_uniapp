<template>
	<view class='login-container'>
		<view class='login-or-register-selector'>
			<view @click='changeSelect(1)' :class="{'selector-on': select==1, 'selector-default': select==2}">登录</view>
			<view @click='changeSelect(2)' :class="{'selector-on': select==2, 'selector-default': select==1}">注册</view>
		</view>
		<view class='login'>
			<view v-if='userId'>
				<view class="user-text">当前用户：{{userName}}</view>
				<button type='primary' @click='logout'>退出登录</button>
			</view>
			
			<view v-else class="login-box">
				<uni-forms ref="baseForm" :modelValue="baseFormData" label-position="top">
					<uni-forms-item label="姓名" name="name">
						<uni-easyinput type="text" v-model="baseFormData.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="密码" name="password">
						<uni-easyinput type="password" v-model="baseFormData.password" placeholder="请输入密码" />
					</uni-forms-item>
				</uni-forms>
				<button type="primary" @click="submit">提交</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
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
				baseFormData: {
					name: '',
					password: ''
				}
			};
		},
		computed: {
			...mapState('m_user', ['userId', 'userName'])
		},
		methods: {
			...mapMutations("m_user", ['changeUserName', 'changeUserId', 'removeUser', 'changeJWT']),
			async submit() {
				if(!this.baseFormData.name || !this.baseFormData.password) 
					return uni.$showMsg("请输入用户名或密码")
				
				// 发送请求
				const {data: res} = await uni.$http.post('/user/login', {username: this.baseFormData.name, password: this.baseFormData.password})
				uni.$showMsg(res.msg)
				if(res.code === 1) {
					this.changeUserId(res.userId)
					this.changeUserName(res.userName)
					this.changeJWT(res.jwt)
					// 本地存储密码
					uni.setStorageSync("name", this.baseFormData.name)
					uni.setStorageSync("password", this.baseFormData.password)
				}
				
			},
			logout() {
				this.removeUser()
			},
			changeSelect(arg) {
				if(this.select == arg) return 
				this.select = arg
			}
		},
		onShow() {
			// 加载本地的密码数据
			this.baseFormData.name = uni.getStorageSync("name") || ""
			this.baseFormData.password = uni.getStorageSync("password") || ""
		}
	}
</script>

<style lang="scss">
	.login-container {
		position: absolute;
		width: 70%;
		top: 20%;
		left: 10%;
		padding: 30rpx;
		border: 1px solid black;
	}
	.login-box {
		padding: 0 10rpx;
	}
	.user-text {
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}
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
</style>

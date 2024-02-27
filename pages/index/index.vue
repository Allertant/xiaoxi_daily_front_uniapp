<template>
	<view class="outter-wrapper">
		<view class="container" v-if="userData.userId">
			<!-- 头部显示栏 -->
			<index-bar 
			:gotoHistory='gotoHistory'
			:jumpToLogin='jumpToLogin'
			:gotoEnum='gotoEnum'
			:timeStr='timeStr' />
			<!-- 显示主体 -->
			<index-body 
			:list='list' 
			:beginTime='beginTime'
			:styles='styles' />
			
		</view>
		<view v-else class="jump-to-login" @click="jumpToLogin">
			<uni-icons type="staff-filled" size="60"></uni-icons>
			<view class='text'>请先登录</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				list: [],
				// userId: 1,
				timeStr: '',
				styles: {
					'1001': {
						backgroundColor: 'black',
						color: 'white'
					},
					'1002': {
						backgroundColor: 'blue',
						color: 'white'
					},
					'1003': {
						backgroundColor: 'orange',
						color: 'white'
					},
					'1004': {
						backgroundColor: 'red',
						color: 'white'
					},
					'1005': {
						backgroundColor: 'green',
						color: 'white'
					}
				}
			}
		},
		methods: {
			async beginTime(planDetailId) {
				const {data: res} = await uni.$http.get("/plan/begin", {planDetailId: planDetailId});
				if(res.code === 1) {
					uni.$showMsg("任务开始")
				}else if(res.code == 0) {
					uni.$showMsg(res.msg)
				}
				// console.log(res)
				// 涉及更新操作，需要重新获取数据
				this.getList()
			},
			async getList(cb) {
				if(this.userData.userId) {
					const {data: res} = await uni.$http.post("/plan/details");
					let count = 1
					res.data.forEach(item => {
						item.count = count ++
					})
					this.list = res.data
				}
				cb && cb()
			},
			jumpToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			onPullDownRefresh() {
				// reset data
				this.list = []
				this.getList(() => uni.stopPullDownRefresh())
			},
			getTimeStr() {
				let date = new Date();
				this.timeStr = date.getMonth()+1 + '月' + date.getDate() + '日'
			},
			gotoHistory() {
				uni.navigateTo({
					url: '/subpkg/history/history'
				})
			},
			gotoEnum() {
				uni.navigateTo({
					url: '/subpkg/plan/plan'
				})
			}
		},
		computed: {
			...mapState('m_user', ['userData'])
		},
		onShow() {
			this.getList()
			this.getTimeStr()
		},
		onLoad() {
			if(!this.userData.username) {
				this.jumpToLogin()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	
	
	.jump-to-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 300rpx;
		font-size: 60rpx;
		.text {
			padding-top: 30rpx;
		}
	}
	
</style>

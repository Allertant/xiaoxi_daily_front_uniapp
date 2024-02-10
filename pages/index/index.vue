<template>
	<view class="outter-wrapper">
		<view class="container" v-if="userId">
			<!-- 头部显示栏 -->
			<index-bar 
			:gotoHistory='gotoHistory'
			:jumpToLogin='jumpToLogin'
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
			async beginTime(arrangement) {
				const {data: res} = await uni.$http.get("/arrangement/add", {arrangement: arrangement});
				// if(res.code === '1') {
					uni.$showMsg("任务开始")
				// }
				// console.log(res)
				// 涉及更新操作，需要重新获取数据
				this.getList()
			},
			async getList(cb) {
				if(this.userId) {
					const {data: res} = await uni.$http.get("/arrangement/list");
					console.log(res)
					let count = 1
					res.forEach(item => {
						item.beginTime = item.beginTime.substring(0, item.beginTime.length-3)
						item.endTime = item.endTime.substring(0, item.endTime.length-3)
						item.count = count ++
					})
					this.list = res
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
			}
		},
		computed: {
			...mapState('m_user', ['userId'])
		},
		onShow() {
			this.getList()
			this.getTimeStr()
		},
		onLoad() {
			console.log(this.userId)
			console.log("hello")
			if(this.userId == "") {
				console.log(this.userId)
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

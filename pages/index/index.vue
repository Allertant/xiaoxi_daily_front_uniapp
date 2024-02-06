<template>
	<view class="outter-wrapper">
		<view class="container" v-if="userId">
			<!-- 头部显示栏 -->
			<view class="box-bar">
				<view class="time-show-area">
					{{timeStr}}
				</view>
				<view class="history-button">
					<uni-icons color="green" type="wallet-filled" size="30" @click="gotoHistory"></uni-icons>
				</view>
				<view class="profile-button">
					<uni-icons color="green" type="staff-filled" size="30" @click="jumpToLogin"></uni-icons>
				</view>
			</view>
			<!-- 显示主体 -->
			<view class="box-body">
				<view class="box-body-list">
					<view class="box-body-list-item" v-for="(item, index) in list" :key="index">
						<view style="font-size: 20px;">
							{{item.count}}
						</view>
						<view class="text">
							{{item.beginTime}} - {{item.endTime}}
						</view>
						<view class="item-button">
							<button class="btn" @click="beginTime(item.id)" :style="styles[item.code]" type="primary" :disabled="item.code != 1002">{{item.msg}}</button>
						</view>
					</view>
				</view>
			</view>
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
			gotoHistory() {
				console.log("history")
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
			jumpToLogin() {
				uni.navigateTo({
					url: '/subpkg/login/login'
				})
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
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	.box-bar {
		display: flex;
		justify-content: space-around;
		.time-show-area {
			font-size: 20px;
			font-weight: bold;
		}
		margin-bottom: 20px;
	}
	.box-body {
		.box-body-list {
			.box-body-list-item {
				border-radius: 20px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				background-color: yellowgreen;
				box-shadow: 4px 4px 3px forestgreen;
				margin-bottom: 20px;
				padding: 10px 0;
				.text {
					font-size: 20px;
				}
			}
		}
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
	.btn {
		border-radius: 15px;
	}
</style>

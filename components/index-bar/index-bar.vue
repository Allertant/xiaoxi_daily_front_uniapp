<template>
	<view>
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
	</view>
</template>

<script>
	export default {
		name:"index-bar",
		props: {
			timeStr: {
				type: String,
				required: true
			},
			gotoHistory: {
				type: Function,
				required: true
			},
			jumpToLogin: {
				type: Function,
				required: true
			}
		},
		data() {
			return {
				
			};
		},
	}
</script>

<style lang='less'>
.box-bar {
		display: flex;
		justify-content: space-around;
		.time-show-area {
			font-size: 20px;
			font-weight: bold;
		}
		margin-bottom: 20px;
	}
</style>
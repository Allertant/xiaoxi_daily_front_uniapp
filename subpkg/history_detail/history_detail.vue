<template>
	<view>
		<view class="info-head">
			<view class="info-head-date">
				{{info.day}}
			</view>
			<view class="info-head-grade">
				评级：{{info.grade}}
			</view>
		</view>
		<view class="info-box">
			<view class="info-item" v-for="item,index in info.arrangements" :key="index">
				<view>
					{{item.orderNum}}
				</view>
				<view class="info-duration">
					{{item.beginTime}}-{{item.endTime}}
				</view>
				<view class="info-time">
					打卡时间：{{item.createTime_timeStr}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad(options) {
			this.info = JSON.parse(decodeURIComponent(options.info));
			console.log(this.info)
		}
	}
</script>

<style lang="scss">
.info-head {
	display: flex;
	justify-content: space-around;
}
.info-box {
	.info-item {
		 border-radius: 10px;
		 display: flex;
		 justify-content: space-between;
		 padding: 20px 20px;
		 margin: 10px 10px;
		 background-color: lightpink;
		 box-shadow: 4px 4px 2px deeppink;
		 font-size: 17px;
	}
}
</style>

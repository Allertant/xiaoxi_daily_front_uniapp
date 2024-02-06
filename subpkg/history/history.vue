<template>
	<view>
		<view v-if="historyList.length !== 0">
			<view @click="jumpToDetail(index)" class="history-item" v-for="item, index in historyByDayList" :key="index">
				<view class="date-showing-box">
					{{item.day}}
				</view>
				<view class="grade-showing-box">
					<text :style="{color: item.gradeColor}">{{item.grade}}</text>
				</view>
			</view>
		</view>
		<view v-else>

		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				historyList: [],
				historyByDayList: []
			};
		},
		methods: {
			async getHistoryList(cb) {
				const {data: res} = await uni.$http.get("/record/history", {userId: this.userId})
				this.historyList = res.data
				// 处理时间
				this.historyList.forEach(item => {
					let dateTimeStr = item.createTime
					let dateTimeArr = dateTimeStr.split('T')
					let dateStr = dateTimeArr[0]
					let timeStr = dateTimeArr[1]
					let dateArr = dateStr.split('-')
					let timeArr = timeStr.split(':')
					item.createTime_dateStr = dateArr[1]+'月'+dateArr[2]+'日'
					item.createTime_timeStr = timeArr[0]+':'+timeArr[1]
					item.beginTime = item.beginTime.substring(0, item.beginTime.length-3)
					item.endTime = item.endTime.substring(0, item.endTime.length-3)
				}) 
				if(this.historyList.length===0) return 
				
				// 重新根据时间组装数组
				let lastDataStr = this.historyList[0].createTime_dateStr
				this.historyByDayList.push({day: lastDataStr, arrangements: []})
				this.historyList.forEach(item => {
					if(item.createTime_dateStr === lastDataStr) {
						this.historyByDayList[0].arrangements.push(item)
					}else {
						lastDataStr = item.createTime_dateStr
						this.historyByDayList.unshift({day: lastDataStr, arrangements: [item]})
					}
				})
				
				// 根据完成度赋予评级
				this.historyByDayList.forEach(item => {
					if(item.arrangements.length === 10) {
						item.grade = 'S'
						item.gradeColor = 'gold'
					}else if(item.arrangements.length >= 8) {
						item.grade = 'A'
						item.gradeColor = 'red'
					}else if(item.arrangements.length >= 6) {
						item.grade = 'B'
						item.gradeColor = 'green'
					}else if(item.arrangements.length >= 4) {
						item.grade = 'C'
						item.gradeColor = 'blue'
					}else {
						item.grade = 'D'
						item.gradeColor = 'gray'
					}
				})
				
				// 清除加载样式
				cb && cb()
			},
			jumpToDetail(index) {
				console.log(this.historyByDayList[Number(index)])
				uni.navigateTo({
					url: '/subpkg/history_detail/history_detail?info=' + encodeURIComponent(JSON.stringify(this.historyByDayList[Number(index)] || '{}'))
				})
			}
		},
		computed: {
			...mapState('m_user', ['userId'])
		},
		onLoad() {
			this.getHistoryList()
		},
		onPullDownRefresh() {
			// reset data
			this.historyList = []
			this.historyByDayList = []
			this.getHistoryList(() => uni.stopPullDownRefresh())
		},
	}
</script>

<style lang="scss">
	.history-item {
		border-radius: 20px;
		padding: 40px 10px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: palegreen;
		box-shadow: 4px 4px 3px darkgreen;
		margin:20px 15px;
		font-size: 20px;
		.grade-showing-box {
			font-size: 40px;
			font-family: Georgia, serif; 
			font-style: italic;
		}
	}
</style>

<template>
	<view class="item-box">
		<view class="picker-box">
			<view class="time-label">开始时间</view>
			<picker mode="time" :value="item.beginTime" start="00:00" end="23:59" @change="changeBeginTime">
				<view class="uni-input">{{item.beginTime}}</view>
			</picker>
		</view>
		<view class="picker-box">
			<view class="time-label">结束时间</view>
			<picker mode="time" :value="item.endTime" start="00:00" end="23:59" @change="changeEndTime">
				<view class="uni-input">{{item.endTime}}</view>
			</picker>
		</view>
		<button class="btn" size="big" type="primary" @click="commit(item)">确定</button>
		<!-- 弹窗信息 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"plan-detail-add",
		props: {
			addItem: {
				type: Function,
				required: true
			},
			updatingDetail: {
				type: Object,
				required: false
			},
			updateItem: {
				type: Function,
				required: false
			},
			isAdd: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				msgType: 'error',
				messageText: '检查你的设置',
				item: {
					id: Date.now(),
					beginTime: "06:00",
					endTime: "07:00",
					order: null
				},
				timeRules: [{
					required: true,
					errorMessage: '时间不能为空'
				}]
			};
		},
		methods: {
			checkTime(b, e) {
				let beginHour = Number(b.split(":")[0])
				let beginMinute = Number(b.split(":")[1])
				let endHour = Number(e.split(":")[0])
				let endMinute = Number(e.split(":")[1])
				if( (beginHour > endHour) || 
					(beginHour == endHour && beginMinute >= endMinute)) {
					// 数据不正确 —— 提示弹窗
					this.$refs.message.open()
					return false;
				}
				return true;
			},
			changeBeginTime(e) {
				// 校验数据合理性
				// let ans = this.checkTime(e.detail.value, this.item.endTime)
				this.item.beginTime = e.detail.value
			},
			changeEndTime(e) {
				// 校验数据合理性
				// let ans = this.checkTime(this.item.beginTime, e.detail.value)
				this.item.endTime = e.detail.value
				
			},
			
			commit(item){
				let ans = this.checkTime(this.item.beginTime, this.item.endTime)
				// 检查成功
				if(ans) {
					this.msgType = 'success'
					// 判断是何种操作
					if(this.isAdd){
						// 新增操作
						this.messageText = `添加成功`
						// 调用方法返回前台
						this.addItem(item)
					}else {
						this.messageText = `修改成功`
						// 调用方法返回前台
						this.updateItem(item)
					}
					this.$refs.message.open()
					
				}
			} 
		},
		mounted() {
			// 观察是否需要载入数据
			if(!this.isAdd){
				this.item = this.updatingDetail
			}
		}
	}
</script>

<style lang="scss">
.item-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	box-sizing: border-box;
	padding: 40px;
}
.picker-box {
	font-size: 20px;
	display: flex;
	justify-content: space-between;
	padding: 10px 10px;
	.time-label {
		margin-right: 30px;
	}
	.uni-input {
		font-size: 30px;
		color: blue;
	}
}
.btn {
	margin: 10px auto;
}
</style>
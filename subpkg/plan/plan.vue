<template>
	<view class="plan-container">
		<!-- 添加课程清单 -->
		<view class="plan-button" @click="gotoAddEnum">
			<uni-icons color="green" type="plusempty" size="30"></uni-icons>
		</view>
		<!-- 列表展示课程清单 -->
		<view v-for="(item, index) in planList" :key="index">
			<plan-item :plan='item' :checkItem="checkItem" :setPlanOn='setPlanOn' />
		</view>
		<!-- <button type="primary" size="default" >返回</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				planList: []
			};
		},
		methods: {
			// 跳转到计划添加页面
			gotoAddEnum() {
				// let info = encodeURIComponent(JSON.stringify('{}'))
				uni.navigateTo({	
					url: '/subpkg/plan_detail/plan_detail?isAdd=' + true
				})
			},
			// 获取计划列表
			async getPlanList(cb) {
				const {data: res} = await uni.$http.get('/plan/list')
				this.planList = res.data
				
				cb && cb()
			},
			// 跳转到更新页面
			checkItem(item) {
				uni.navigateTo({
					url: '/subpkg/plan_detail/plan_detail?isAdd=false&id=' + item.id
				})
			},
			async setPlanOn(id) {
				const {data: res} = await uni.$http.post("/plan/seton/" + id)
				uni.$showMsg(res.msg)
				// 涉及更新操作，重新获取数据
				this.getPlanList()
			}
		},
		onShow() {
			this.getPlanList()
		},
		onPullDownRefresh() {
			this.planList = []
			this.getPlanList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	.plan-container {
		margin: 20rpx;
		.plan-button {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60px;
			border: 1px dashed black;
		}
	}
	
</style>

<template>
	<view>
		<!-- 添加课程清单 -->
		<view class="enum-button" @click="gotoAddEnum">
			<uni-icons color="green" type="plusempty" size="30"></uni-icons>
		</view>
		<!-- 列表展示课程清单 -->
		<view v-for="(item, index) in planList" :key="index">
			<plan-item :plan='item' />
		</view>
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
			gotoAddEnum() {
				// let info = encodeURIComponent(JSON.stringify('{}'))
				uni.navigateTo({	
					url: '/subpkg/plan_detail/plan_detail?isAdd=' + true
				})
			},
			async getPlanList() {
				const {data: res} = await uni.$http.get('/plan/list')
				if(res.code == 1) {
					this.planList = res.data
				}
			}
		},
		onShow() {
			this.getPlanList()
		}
	}
</script>

<style lang="scss">
	.enum-button {
		margin: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
		border: 1px dashed black;
	}
</style>

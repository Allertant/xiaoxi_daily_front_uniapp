<template>
	<view class="item-box">
		<view>
			计划名称：{{plan.name}}
		</view>
		<view>
			创建时间：{{planCreateTime}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"plan-item",
		props: {
			plan: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				
			};
		},
		computed: {
			planCreateTime() {
				return this.plan.createTime.split("T")[0]
			}
		}
	}
</script>

<style lang="scss">
.item-box {
	height: 80px;
	margin: 10px;
	border: 1px solid red;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
</style>
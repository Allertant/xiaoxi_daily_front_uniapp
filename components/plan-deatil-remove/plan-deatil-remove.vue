<template>
	<view>
		<view class="removePopup-box">
			<view>
				<text class="tip">如果确认删除，则在下面的输入框中输入计划名称</text>
			</view>
			<view>
				<uni-easyinput v-model="confirmPlanName" placeholder="请输入计划名称" />
			</view>
			<view>
				<button type="primary" class="remove-btn" @click="validatePlanName(confirmPlanName)">删除</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"plan-deatil-remove",
		props: {
			validatePlanName: {
				type: Function,
				required: true
			}
		},
		data() {
			return {
				confirmPlanName: ''
			};
		}
	}
</script>

<style lang="scss">
.removePopup-box {
	margin: 20px;
	view {
		padding-bottom: 10px;
		.remove-btn {
			background-color: red;
		}
	};
}
</style>
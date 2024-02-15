<template>
	<view :class="['item-box', plan.isOn ? 'onset': '']">
		<view class="box-left"  @click="checkItem(plan)">
			<view>
				计划名称：{{plan.name}}
			</view>
			<view>
				创建时间：{{planCreateTime}}
			</view>
		</view>
		<view class='box-right'>
			<button :disabled="plan.isOn == true" type="primary" @click="setPlanOn(plan.id)" >{{plan.isOn ? '使用中' : '使用该计划'}}</button>
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
			},
			setPlanOn: {
				type: Function,
				required: true
			},
			checkItem: {
				type: Function,
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
		},
	}
</script>

<style lang="scss">
.item-box {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 80px;
	margin: 10px 0 ;
	border: 1px solid gray;
	padding: 10px;
	.box-left {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
}
.onset {
	border: 1px solid red;
	background-color: pink;
}
</style>
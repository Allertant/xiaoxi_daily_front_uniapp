<template>
	<view class='box-body-list-item'>
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
</template>

<script>
	export default {
		name:"index-body-item",
		props: {
			item: {
				type: Object,
				required: true
			},
			styles: {
				type: Object,
				required: true
			},
			beginTime: {
				type: Function,
				required: true
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

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

	.btn {
		border-radius: 15px;
	}
</style>
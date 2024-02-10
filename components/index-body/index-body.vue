<template>
	<view>
		<view class="box-body">
			<view class="box-body-list">
				<view v-for="(item, index) in list" :key="index">
					<index-body-item 
					:item='item' 
					:beginTime='beginTime'
					:styles='styles' />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"index-body",
		props: {
			list: {
				type: Array,
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
	.box-body {
		.box-body-list {

		}
	}
</style>
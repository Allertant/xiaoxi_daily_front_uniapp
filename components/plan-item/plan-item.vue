<template>
	<view>
		{{plan.name}}
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
		}
	}
</script>

<style lang="scss">

</style>
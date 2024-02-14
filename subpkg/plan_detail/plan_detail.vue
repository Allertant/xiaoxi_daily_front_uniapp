<template>
	<view>
		<uni-section title="基本信息" type="line">
			<view class="example">
				<uni-forms 
				ref="baseForm"
				:rules="formRules"
				:model="planObj" >
					<!-- 计划名称 -->
					<uni-forms-item required label="名称" name="name">
						<uni-easyinput v-model="planObj.name" placeholder="请输入计划名称" />
					</uni-forms-item>
					
					<view class="btn-box">
						<button type="primary" size="mini" @click="add">新增计划项</button>
						<button type="primary" size="mini" @click="submit('baseForm')">提交</button>
					</view>
					
					<!-- 计划项目展示 -->
					<view class="detail-list">
						<view class="detail-item" v-for="(item, index) in planObj.details" :key="item.id">
							<view>{{index+1}}</view>
							<view @click="update(item)">{{item.beginTime}} : {{item.endTime}}</view>
							<view class="up-down-selection">
								<view v-if="index!=0">
									<button type="default" size="mini" @click="changeItemPosition(item.id, 'up')">
										<uni-icons type="arrow-up" sizes="20" />
									</button>
								</view>
								<view v-if="index!=(planObj.details.length-1)">
									<button type="default" size="mini" @click="changeItemPosition(item.id, 'down')">
										<uni-icons type="arrow-down" sizes="20" />	
									</button>
								</view>
							</view>
							<view>
								<button type="default" size="mini" @click="del(item.id)">删除</button>
							</view>
						</view>
					</view>
					<!-- 计划项添加 —— 弹出层 -->
					<uni-popup ref="popup" background-color="#fff">
						<plan-detail-add :updatingDetail="updatingDetail" :updateItem="updateItem" :addItem="addItem" :isAdd="isAdd" />
					</uni-popup>
				</uni-forms>
			</view>
		</uni-section>
		<!-- 弹窗信息 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// 计划信息
				planObj: {
					name: '默认计划_'+Date.now(),
					details: []
				},
				// 是否处于添加课程状态
				isAdd: true,
				// 验证规则
				formRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "计划名称不能为空"
						}]
					}
				},
				// 待修改的对象
				updatingDetail: {},
				// 是否为添加操作
				isAdd: true,
				msgType: 'error',
				messageText: '计划项目至少有一个',
			};
		},
		methods: {
			// 如果是更新操作，则从远程加载数据
			async getPlanObj() {
				const {data: res} = await uni.$http.get("/plan/" + this.planObj.id)
				if(res.code == 1) {
					this.planObj = res.data
				}
			},
			addItem(item) {
				this.planObj.details.push(item)
				this.$refs.popup.close()
				// console.log(this.planObj.details)
			},
			updateItem(item) {
				let index = this.planObj.details.findIndex(v => v.id === item.id)
				this.planObj.details[index] = item
				// 关闭窗口
				this.$refs.popup.close()
			},
			add() {
				this.updatingDetail = {}
				this.isAdd = true
				this.$refs.popup.open('center')
			},
			update(item) {
				this.updatingDetail = item
				this.isAdd = false
				// console.log(this.updatingDetail)
				this.$refs.popup.open('center')
			},
			del(id) {
				// 找到对应的id位置
				let index = this.planObj.details.findIndex(v => v.id === id)
				// 删除该计划项
				this.planObj.details.splice(index, 1)
			},
			changeItemPosition(id, direction) {
				// 找到对应的id位置
				let index = this.planObj.details.findIndex(v => v.id === id)
				// 获取对应的计划项
				let planItem = this.planObj.details[index]
				// 改变位置
				this.planObj.details.splice(index, 1)
				if(direction == 'up') {
					this.planObj.details.splice(index-1, 0, planItem)
				}else if(direction == 'down') {
					this.planObj.details.splice(index+1, 0, planItem)
				}else {
					return 
				}
			},
			async submit(ref) {
				// 校验信息
				this.$refs[ref].validate().then(res => {
					// console.log('success', res);
					// uni.showToast({
					// 	title: `校验通过`
					// })
					// console.log(this.dynamicFormData)
					// 检查details数组是否为空
					if(this.planObj.details.length == 0) {
						// 弹窗警告
						this.msgType = 'error'
						this.messageText = `计划项至少有一个`
						this.$refs.message.open()
						return 
					}
				}).catch(err => {
					console.log('err', err);
					return 
				})
				// 整理数据
				let index = 1
				this.planObj.details.forEach(item => {
					item.orderNum = index++
				})
				// 提交数据
				const {data: res} = await uni.$http.post("/plan/add", this.planObj)
				if(res.code == 1) {
					// 弹窗提示
					this.msgType = 'success',
					this.messageText = `添加成功`
					this.$refs.message.open()
				}else {
					// 弹窗警告
					this.msgType = 'error',
					this.messageText = `服务器错误`
					this.$refs.message.open()
				}
			},
		},
		onShow() {
			if(!this.isAdd) {
				// 是查看信息，需要访问远程获取数据
				// 获取
				this.getPlanObj()
			}
		},
		onLoad(options) {
			// 获取传递过来的isAdd信息
			this.isAdd = JSON.parse(options.isAdd)
			if(!this.isAdd) {
				// 如果是查看信息，则将传过来的id绑定到对象身上
				this.planObj.id = Number(options.id)
			}
		}
	}
</script>

<style lang="scss">
.example {
	padding: 15px;
	background-color: #fff;
	.btn-box {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.detail-list {
		.detail-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.up-down-selection {
				width: 30%;
				display: flex;
				justify-content: space-around;
			}
		}
	}
}
.form-item {
	display: flex;
	align-items: center;
}

.button {
	display: flex;
	align-items: center;
	height: 35px;
	margin-left: 10px;
}
.plan-item {
	font-size: 5px;
	//display: flex;
	justify-content: space-between;
	align-items: center;
}

</style>

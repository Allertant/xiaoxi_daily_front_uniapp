export default {
	namespaced: true,
	state: () => ({
			userId: uni.getStorageSync('userId') || "",
			userName: uni.getStorageSync('userName') || "",
			jwt: uni.getStorageSync('jwt') || ""
	}),
	
	mutations: {
		changeUserId(state, userId) {
			uni.setStorageSync('userId', userId)
			state.userId = userId
		},
		changeUserName(state, userName) {
			uni.setStorageSync('userName', userName)
			state.userName = userName
		},
		changeJWT(state, jwt) {
			uni.setStorageSync('jwt', jwt)
			state.jwt = jwt
		},
		removeUser(state) {
			uni.removeStorageSync('userName')
			uni.removeStorageSync('userId')
			uni.removeStorageSync('jwt')
			state.userId = ""
			state.userName = ""
			state.jwt = ""
		}
	},
	
	getters: {
		getUserId(state) {
			return state.userId
		}
	}
}
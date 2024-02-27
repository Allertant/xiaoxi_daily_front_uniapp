export default {
	namespaced: true,
	state: () => ({
			userData: uni.getStorageSync('userData') || {},
	}),
	
	mutations: {
		changeUserData(state, userData) {
			uni.setStorageSync('userData', userData)
			state.userData = userData
		}
	}
}
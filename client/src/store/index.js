import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: false,
    userName: "Default User",
    isAdmin: false,
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    userName: state => state.userName,
    isAdmin: state => state.isAdmin,
  },
  mutations: {
    SET_IS_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
    },
    SET_IS_ADMIN(state, value) {
      state.isAdmin = value;
    },
  },
  actions: {
    setIsLoggedIn({ commit }, value){
      commit('SET_IS_LOGGED_IN', value)
    },
    setIsAdmin({ commit }, value){
      commit('SET_IS_ADMIN', value)
    }
  },
  modules: {
  }
})

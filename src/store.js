import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      token: 'null',
    }
  },
  mutations: {
    login(state, token) {
      state.token = token
    },
    logout(state) {
      state.token = null
    }
  }
})

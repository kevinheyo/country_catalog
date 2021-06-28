import { createStore } from 'vuex'

export default createStore({
  state: {
    dialogVisible: false,
    dialogCode: ''
  },
  mutations: {
    showDialog(state, code) {
      console.log('showDialog', code)
      state.dialogVisible = true;
      state.dialogCode = code;
    },
    hideDialog(state) {
      console.log('hideDialog')
      state.dialogVisible = false;
    },
  },
  actions: {
  },
  modules: {
  }
})

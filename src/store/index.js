import { createStore } from 'vuex'

export default createStore({
  state: {
    geos: [],
    result: undefined,
  },
  mutations: {
    setGeos(state, geos) {
      state.geos = geos
    },
    setResult(state, result) {
      state.result = result
    }
  },
  actions: {
  },
  modules: {
  }
})

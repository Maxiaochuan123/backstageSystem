import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: false //菜单状态
  },
  mutations: {
    collapseChange: (state) => state.isCollapse = !state.isCollapse
  }
})
import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面框架基础参数
    isCollapse: false, //菜单状态
    isSetupPanel: false, //设置面板状态
    isLockScreen: false, //锁屏状态
    rememberPwd: JSON.parse(localStorage.getItem('rememberPwd')) || false, //记住密码

    // 基础数据
  },
  mutations: {
    // 页面框架基础方法
    collapseChange: (state) => state.isCollapse = !state.isCollapse,
    setupPanelChange: (state) => state.isSetupPanel = !state.isSetupPanel,
    lockScreenChange_ok: (state) => state.isLockScreen = true,
    lockScreenChange_no: (state) => state.isLockScreen = false,
    setupPanelClose: (state) => state.isSetupPanel = false,

    // 基础方法
  }
})
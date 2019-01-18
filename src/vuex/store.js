import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面框架基础参数
    isCollapse: false, //菜单状态
    isSetupPanel: true, //设置面板状态
    isLockScreen: false, //锁屏状态
    rememberPwd: JSON.parse(localStorage.getItem('rememberPwd')) || false, //记住密码

    // 基础数据
    mechanismList: [], //机构数据
    largeAreaList: [], //大区数据
    relationResList: [], //角色关联资源
    userRoleList: [], //用户角色
  },
  mutations: {
    // 页面框架基础方法
    collapseChange: (state) => state.isCollapse = !state.isCollapse,
    setupPanelChange: (state) => state.isSetupPanel = !state.isSetupPanel,
    lockScreenChange_ok: (state) => state.isLockScreen = true,
    lockScreenChange_no: (state) => state.isLockScreen = false,
    setupPanelClose: (state) => state.isSetupPanel = false,

    // 基础方法
    setMechanismList: (state, data) => state.mechanismList = data,
    setLargeAreaList: (state, data) => state.largeAreaList = data,
    setRelationResList: (state, data) => state.relationResList = data,
    setUserRoleList: (state, data) => state.userRoleList = data,
  }
})
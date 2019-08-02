import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面框架基础参数
    isCollapse: false, //菜单状态
    isSetupPanel: false, //设置面板状态
    isLockScreen: false, //锁屏状态
    currentPath: JSON.parse(sessionStorage.getItem('currentPath')) || '', //当前高亮路径
    tabsMenuList: JSON.parse(sessionStorage.getItem('tabsMenuList')) || [], //tabs 页签导航
    themeColor: JSON.parse(localStorage.getItem('activeColorBlock')) || {index:5, color:'4380d3'}, //默认主题颜色
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
    currentPathAdd: (state, data) => state.currentPath = data,
    tabsMenuListAdd: (state, data) => state.tabsMenuList = data,
    tabsMenuListRemove: (state, data) => state.tabsMenuList = data,
    themeColorChange: (state, params) => {
      state.themeColor.index = params.index;
      state.themeColor.color = params.color;
      localStorage.setItem('activeColorBlock', JSON.stringify({index:params.index, color:params.color}));
    },
    
    // 基础方法
  }
})
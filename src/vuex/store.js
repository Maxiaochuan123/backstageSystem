import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面框架基础参数
    isCollapse: false, //菜单状态
    isSetupPanel: false, //设置面板状态
    isLockScreen: false, //锁屏状态
    themeColor: JSON.parse(localStorage.getItem('activeColorBlock')) || {index:5, color:'4380d3'}, //默认主题颜色
    rememberPwd: JSON.parse(localStorage.getItem('rememberPwd')) || false, //记住密码

    // 基础数据
    mechanismList: [], //机构数据
    companyList: [],  //公司数据
    largeAreaList: [], //大区数据
    relationResList: [], //角色关联资源
    userRoleList: [], //用户角色
    asideList: [] //用户菜单
  },
  mutations: {
    // 页面框架基础方法
    collapseChange: (state) => state.isCollapse = !state.isCollapse,
    setupPanelChange: (state) => state.isSetupPanel = !state.isSetupPanel,
    lockScreenChange_ok: (state) => state.isLockScreen = true,
    lockScreenChange_no: (state) => state.isLockScreen = false,
    setupPanelClose: (state) => state.isSetupPanel = false,
    themeColorChange: (state, params) => {
      state.themeColor.index = params.index;
      state.themeColor.color = params.color;
      localStorage.setItem('activeColorBlock', JSON.stringify({index:params.index, color:params.color}));
    },
    
    // 基础方法
    setMechanismList: (state, data) => {state.mechanismList = []; state.mechanismList = data;},
    setCompanyList: (state, data) => {
      state.companyList = [];
      data.forEach(item => {
        state.companyList.push({label:item.areaName,value:item.id,isEnable:item.isEnable});
      });
    },
    setLargeAreaList: (state, data) => {
      state.largeAreaList = [];
      data.forEach(item => {
        item.children.forEach(item2 => {
          state.largeAreaList.push({label:item2.areaName,value:item2.id,isEnable:item2.isEnable});
        })
      });
    },
    setRelationResList: (state, data) => {state.relationResList = []; state.relationResList = data},
    setUserRoleList: (state, data) => {state.userRoleList = []; state.userRoleList = data},
    setAsideList: (state, data) => {state.asideList = []; state.asideList = data},
  }
})
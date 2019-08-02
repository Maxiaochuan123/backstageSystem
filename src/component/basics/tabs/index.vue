<template>
  <div class="tabs">
    <el-tabs v-model="activeTab" type="card" :closable="true" @tab-click="tabClick" @tab-remove="tabRemove">
      <el-tab-pane :label="tab.title" :name="tab.name" v-for="tab in tabsMenuList" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <el-row>
</el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
 export default {
  name: "",
  data(){
    return {
      activeTab: this.storage.sessionGet('activeTab') || ''
    }
  },
  computed: {
    ...mapState(["tabsMenuList"])
  },
  watch: {
    '$route' (to, from){
      this.activeTab = to.name;
      this.storage.sessionSet('activeTab',to.name);
      
      let temp = this.tabsMenuList.findIndex((item) => {
        return item.path == to.path;
      });
      if(temp == -1){
        this.tabsMenuList.push({title:to.meta.title, name:to.name, path:to.path})
      }
      this.$store.commit('tabsMenuListAdd', this.tabsMenuList);
      this.storage.sessionSet('tabsMenuList',this.tabsMenuList);
    }
  },
  methods:{
    ...mapMutations(['tabsMenuListAdd','tabsMenuListRemove', 'currentPathAdd']),
    
    tabClick(tab, event) {
      this.$router.push({name: this.activeTab});
      this.$store.commit('currentPathAdd', this.activeTab);
      this.storage.sessionSet("currentPath", this.activeTab);
    },
    
    tabRemove(targetName){
      let tabs = this.tabsMenuList;
      let activeName = this.activeTab;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.activeTab = activeName;
      this.$router.push({name:activeName});

      this.storage.sessionSet('activeTab', activeName);
      this.$store.commit('currentPathAdd',activeName);
      this.storage.sessionSet('currentPath', activeName);
      
      let tempList = [];
      tempList = tabs.filter(tab => tab.name !== targetName);
      this.$store.commit('tabsMenuListRemove',tempList);
      this.storage.sessionSet('tabsMenuList',tempList);

      if(tempList.length == 0){
        this.$router.push({path:'/'});
      };
    }
  },
}
</script>
<style lang="scss" scoped>
 .tabs{
    height: 100%;
    margin-left: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .el-tabs__header{
      margin: 0;
    }
    .el-tabs--card>.el-tabs__header{
      border: none;
      .el-tabs__nav{
        border: none;
      }
    }
    .el-tabs__item{
      height: 34px;
      line-height: 34px;
    }
  }
</style>
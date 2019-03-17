<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <!-- <keep-alive> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
export default {
  name: "App",
  created(){
    // this.getMechanism();
    // this.getRegion();
    // this.getRelationRes();
    // this.getRole();
  },
  methods:{
    // ...mapMutations['setMechanismList','setCompanyList','setLargeAreaList','setUserRoleList']
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  overflow: hidden;
  // .el-table td{
  //   padding: 10px 0;
  // }
}
</style>

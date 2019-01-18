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
import { mapMutations } from 'vuex'
export default {
  name: "App",
  created(){
    // 加载一些公共的 数据
    // 获取 机构
    this.api.getMechanism().then(res=>{
      if(res.code == '200'){
        this.$store.commit('setMechanismList',res.data);
      }else{
        setTimeout(()=>{ this.$message.error('机构列表加载失败'); },500);
      }
    }).catch(err=>{
      this.$message.error('机构列表加载失败');
    })

    // 获取 大区
    this.api.getRegion().then(res=>{
      if(res.code == '200'){
        let largeAreaList = [];
        res.data.forEach(item => {
          item.children.forEach(item2 => {
            largeAreaList.push({label:item2.areaName,value:item2.id});
          })
        });
        this.$store.commit('setLargeAreaList',largeAreaList);
      }else{
        setTimeout(()=>{ this.$message.error('大区列表加载失败'); },500);
      }
    }).catch(err=>{
      this.$message.error('大区列表加载失败');
    })
    
    // 获取角色关联资源
    this.api.getRelationRes().then(res=>{
      if(res.code == '200'){
        this.$store.commit('setRelationResList', res.data);
      }else{
        setTimeout(()=>{ this.$message.error('角色关联资源加载失败'); },500);
      }
    }).catch(err=>{
      this.$message.error('角色关联资源加载失败');
    })

     // 获取 用户角色
    this.api.getRole().then(res=>{
      if(res.code == '200'){
        let userRoleList = [];
        res.data.result.forEach(item => {
          userRoleList.push({label:item.roleName,value:item.id});
        });
        this.$store.commit('setUserRoleList',userRoleList);
      }else{
        setTimeout(()=>{ this.$message.error('用户角色列表加载失败'); },500);
      }
    }).catch(err=>{
      this.$message.error('用户角色列表加载失败');
    })
  },
  methods:{
    ...mapMutations['setMechanismList','setLargeAreaList','setRelationResList','setUserRoleList']
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

  overflow: hidden;
}
</style>

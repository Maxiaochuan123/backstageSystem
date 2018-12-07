<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      requestData: {
        type: "5",
        isState: "2",
        dataType: "0",
        pageSize: 10,
        pageIndex: 1
      },
      loginForm: {
        username: "cd0024",
        password: "123456"
      }
    };
  },
  created() {
    this.api.login(this.loginForm).then(res => {
      // console.log('res：',res)
    });
    this.api.getList(this.requestData).then(res => {
      // console.log('res：',res)
      // console.log(this.storage)
    });
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
}
</style>

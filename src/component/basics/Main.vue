<template>
  <el-main>
    <div id="switchPage"></div>

    <div id="contentBox">
      <el-row>
        <el-col :span="24">
          <transition name="el-zoom-in-top">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          </transition>
          <transition name="el-zoom-in-top">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </transition>
        </el-col>
      </el-row>
    </div>
  </el-main>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  created() {},

  methods: {}
};
</script>
<style lang="less">
.el-main {
  background-color: #f1f2f7;
  text-align: center;
  height: calc(100vh - 60px);
  padding: 8px;

  #switchPage {
    height: 40px;
    background-color: #fff;
  }

  #contentBox {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 10px;
    overflow-y: scroll;
    background-color: rgb(85, 146, 204);

    ul li {
      line-height: 50px;
    }
  }

  #contentBox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
  }

  #contentBox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c0c0c0;
  }

  #contentBox::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }
}
</style>
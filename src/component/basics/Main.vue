<template>
  <el-main>
    <div id="contentBox" @click="closeSetupPanel">
      <el-row>
        <el-col :span="24">
          <!-- <keep-alive> -->
          <el-collapse-transition>
            <router-view></router-view>
          </el-collapse-transition>
          <!-- </keep-alive> -->
          <!-- <transition name="el-zoom-in-top">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </transition>-->
        </el-col>
      </el-row>
    </div>

    <!-- 设置面板 -->
    <SetupPanel></SetupPanel>
  </el-main>
</template>

<script>
import { mapMutations } from "vuex";
import SetupPanel from "./SetupPanel";
export default {
  components: { SetupPanel },
  data() {
    return {
      
    };
  },

  methods: {
    ...mapMutations(["setupPanelClose"]),
    
    closeSetupPanel() {
      this.$store.commit("setupPanelClose");
    }
  }
};
</script>
<style lang="scss">
.el-main {
  background-color: #f1f2f7;
  text-align: center;
  height: calc(100vh - 60px);
  padding: 6px !important;
  position: relative;
  overflow: hidden !important;
  
  #contentBox {
    width: 100%;
    // height: calc(100% - 40px);
    height: 100%;
    overflow-y: scroll;
    // background-color: #fff;
    // box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
    overflow: scroll;

    .el-row {
      height: 100%;
      .el-col {
        height: 100%;
      }
    }
  }

  #contentBox::-webkit-scrollbar {
    /*隐藏滚动条*/
    width: 0;
    display: none;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c0c0c0;
  }

  .el-table__body-wrapper::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }
}
</style>
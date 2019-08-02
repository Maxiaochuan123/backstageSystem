<template>
  <el-main>
    
    <div id="contentBox" @click="closeSetupPanel">
      <el-row>
        <el-col :span="24">
          <!-- <keep-alive> -->
            <router-view></router-view>
          <!-- </keep-alive> -->

          <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        </el-col>
      </el-row>
    </div>

    <!-- 设置面板 -->
    <SetupPanel></SetupPanel>
  </el-main>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SetupPanel from "./setupPanel/SetupPanel";
export default {
  components: { SetupPanel },
  data() {
    return {
      
    };
  },

  computed: {
    ...mapState(["isSetupPanel"])
  },

  methods: {
    ...mapMutations(["setupPanelClose"]),
    
    closeSetupPanel() {
      if(this.isSetupPanel){
        this.$store.commit("setupPanelClose");
      }
    }
  }
};
</script>
<style lang="scss">
.el-main {
  background-color: #f1f2f7;
  text-align: center;
  height: calc(100vh - 60px);
  padding: 0px !important;
  position: relative;
  overflow: hidden !important;
  
  #contentBox {
    width: 100%;
    height: 100%;
    padding: 6px !important;
    box-sizing: border-box;

    .el-row {
      height: 100%;
      .el-col {
        height: 100%;
      }
    }
  }
}
</style>
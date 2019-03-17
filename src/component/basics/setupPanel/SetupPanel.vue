<template>
  <transition name="setupPanel">
    <div class="setupPanel" v-if="isSetupPanel">
      <div class="close" @click="closePanel"><i class="iconfont icon-cuowu"></i></div>
      
      <!-- 主题 -->
      <ThemColor></ThemColor>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ThemColor from "./themColor";
export default {
  data() {
    return {
      
    };
  },
  components:{ ThemColor },
  computed: {
    ...mapState(["isSetupPanel","themeColor"])
  },
  mounted(){
    this.tool.toggleClass(document.body, 'custom-' + this.themeColor.color);
  },
  methods:{
    closePanel(){
      this.$store.commit('setupPanelClose');
    }
  }
};
</script>
<style lang="scss">
.setupPanel {
  z-index: 20;
  padding: 14px 23px;
  box-sizing: border-box;
  position: absolute;
  width: 300px;
  height: calc(100vh - 60px);
  top: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #f1f2f7;
  box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);

  .close{
    text-align: right;
    cursor: pointer;
    i{
      font-size: 26px;
    }
    :hover{
      color: #F5222D;
    }
  }
}

// 定义进入动画和退出动画的过程
.setupPanel-enter-active,
.setupPanel-leave-active {
  transition: right 0.2s linear;
}
// 进入动画的初始状态
.setupPanel-enter {
  right: -300px;
}
// 进入动画的结束状态
.setupPanel-enter-to {
  right: 0;
}
// 离开动画的初始状态
.setupPanel-leave {
  right: 0;
}
// 离开动画的结束状态
.setupPanel-leave-to {
  right: -300px;
}
</style>
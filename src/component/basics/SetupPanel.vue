<template>
  <transition name="setupPanel">
    <div class="setupPanel" v-if="isSetupPanel"></div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["isSetupPanel"])
  }
};
</script>
<style lang="scss">
.setupPanel {
  z-index: 20;
  position: absolute;
  width: 300px;
  height: calc(100vh - 60px);
  top: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #f1f2f7;
  box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
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
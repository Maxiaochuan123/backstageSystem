<template>
  <el-header>
    <div class="sysInfo">
      <div class="sysIcon">
        <i class="iconfont icon-tubiao"></i>
      </div>
      <div class="sysText">XXX系统</div>
      <div class="navMenuBtn" @click="$store.commit('collapseChange')">
        <i :class="isCollapse ? 'iconfont icon-zhankai' : 'iconfont icon-shouqi'"></i>
      </div>
    </div>
    <div class="info">
      <div class="fullScreen" @click="fullScreenChange">
        <i :class="!isfullScreen ? 'iconfont icon-fangda' : 'iconfont icon-suoxiao' "></i>
      </div>
      <el-dropdown trigger="click" placement="top">
        <div class="userInfo">
          <div class="userImg">
            <img :src="headPortrait" alt="头像">
          </div>
          <div class="userName">
            <p onselectstart="return false">马晓川</p>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 110px;">
          <el-dropdown-item
            v-for="(item ,index) in dropdownMenuList"
            :key="index"
            :disabled="item.disabled"
            @click.native="dropdownMenu(item.text)"
          >
            <i :class="['iconfont', item.icon]" style="display:inline-block; width: 30px;"></i>
            <span>{{ item.text }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      headPortrait: this.imagesPath.headPortrait,
      dropdownMenuList: [
        { icon: "icon-shezhi", text: "设置", disabled: false },
        { icon: "icon-suoping", text: "锁屏", disabled: false },
        { icon: "icon-tuichu", text: "退出", disabled: false }
      ],
      isfullScreen: false
    };
  },
  computed: {
    ...mapState(["isCollapse"])
  },

  methods: {
    ...mapMutations(["collapseChange", "setupPanelChange", "setupPanelClose"]),
    dropdownMenu(res) {
      switch (res) {
        case "设置":
            this.$store.commit('setupPanelChange');
          break;
        case "锁屏":
            this.$router.push("lockScreen");
            this.$store.commit('setupPanelClose');
          break;
        case "退出":
            this.storage.sessionRemove('token');
            this.$router.push("login");
            this.$store.commit('setupPanelClose');
          break;
      }
    },
    fullScreenChange() {
      this.tool.fullScreen(this);
    }
  }
};
</script>
<style lang="scss">
.el-header {
  background-color: #fff;
  text-align: center;
  width: 100%;
  height: 60px;
  padding: 0;
  display: flex;
  justify-content: space-between;
  z-index: 20;
  box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.1);

  .sysInfo {
    width: 290px;
    height: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    display: flex;
    background-color: #4380d3;
    .sysIcon {
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-tubiao {
        color: #fff;
        font-size: 30px;
      }
    }
    .sysText {
      width: 160px;
      height: 100%;
      line-height: 60px;
      text-align: left;
      padding-left: 10px;
      color: #fff;
    }

    .navMenuBtn {
      width: 40px;
      height: 100%;
      cursor: pointer;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-zhankai {
        color: #606266;
      }
    }
  }

  .info {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #fff;

    .fullScreen {
      width: 30px;
      height: 100%;
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 26px;
        color: #5a5d62;
      }
    }

    .userInfo {
      min-width: 120px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .userName {
        margin-left: 10px;
        p {
          color: #606266;
        }
      }

      .userImg {
        width: 40px;
        height: 40px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
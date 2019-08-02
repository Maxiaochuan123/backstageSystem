<template>
  <el-header>
    <div class="sysInfo">
      <div :class="['sysIcon',`custome-${themeColor.color}`]">
        <div class="sysText">
          <span>*******</span>
          <span>** *******</span>
        </div>
      </div>
      <div class="navMenuBtn" @click="$store.commit('collapseChange')">
        <i :class="isCollapse ? 'iconfont icon-zhankai' : 'iconfont icon-shouqi'"></i>
      </div>

      <!-- tabs -->
      <Tabs></Tabs>
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
            <!-- <p onselectstart="return false">{{userInfo.name}}</p> -->
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
import Tabs from '../basics/tabs/index';
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      // userInfo:this.storage.sessionGet('userInfo'),
      headPortrait: this.imagesPath.headPortrait,
      dropdownMenuList: [
        { icon: "icon-shezhi", text: "设置", disabled: false },
        { icon: "icon-suoping", text: "锁屏", disabled: false },
        { icon: "icon-tuichu", text: "退出", disabled: false }
      ],
      isfullScreen: false,
    };
  },
  components: {
    Tabs
  },
  computed: {
    ...mapState(["isCollapse", "themeColor"])
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
            this.$store.state.currentPath = '';
            this.$store.state.tabsMenuList = [];
            this.apiMethod.loginOut(this);
          break;
      }
    },
    fullScreenChange() {
      this.tool.fullScreen(this);
    },

    getTabsList() {
      // 设置当前点击的 菜单,防止刷新丢失
      this.$store.commit('currentPathAdd', this.$route.name);
      this.storage.sessionSet("currentPath", this.$route.name);
    },
  },
  watch: {
    $route(to, from) {
      this.getTabsList();
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
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  z-index: 20;
  box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.1);

  .tabs{
    background-color: #fff;
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

  .sysInfo {
    // width: 432px;
    height: 100%;
    box-sizing: border-box;
    // padding-left: 30px;
    display: flex;
    // .themeColor{

    // }

    .sysIcon {
      width: 250px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #4380d3;

      .icon-tubiao {
        color: #fff;
        font-size: 30px;
      }
    }
    .sysText {
      width: 160px;
      height: 100%;
      text-align: left;
      color: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      span{
        font-size: 18px;
       line-height: 30px;
      }
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

    .switchPage {
      height: 100%;
      margin-left: 20px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      align-items: center;
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
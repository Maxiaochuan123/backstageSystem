<template>
  <el-header>
    <div class="sysInfo">
      <div class="sysIcon">
        <div class="sysText">
          <span>众汇车服</span>
          <span>用户权限管理系统</span>
        </div>
      </div>
      <div class="navMenuBtn" @click="$store.commit('collapseChange')">
        <i :class="isCollapse ? 'iconfont icon-zhankai' : 'iconfont icon-shouqi'"></i>
      </div>
      <div class="switchPage">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in currentBreadcrumb" :key="index">
            <router-link :to="item.path">{{item.meta.title}}</router-link>
          </el-breadcrumb-item>
        </el-breadcrumb>
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
        { icon: "icon-shezhi", text: "设置", disabled: true },
        { icon: "icon-suoping", text: "锁屏", disabled: false },
        { icon: "icon-tuichu", text: "退出", disabled: false }
      ],
      isfullScreen: false,
      currentBreadcrumb: this.storage.sessionGet("currentBreadcrumb") || []
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
    },

    getBreadcrumb() {
      let currentBreadcrumbList = this.$route.matched.map(item => {
        if (item.name == "Home") {
          item.path = "/";
        }
        return { meta: item.meta, path: item.path };
      });
      // 设置面包屑 菜单,防止刷新丢失
      this.storage.sessionSet("currentBreadcrumb", currentBreadcrumbList);
      this.currentBreadcrumb = this.storage.sessionGet("currentBreadcrumb");

      // 设置当前点击的 菜单,防止刷新丢失
      this.storage.sessionSet("currentPath", this.$route.name);
    },
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
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
    width: 432px;
    height: 100%;
    box-sizing: border-box;
    // padding-left: 30px;
    display: flex;

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
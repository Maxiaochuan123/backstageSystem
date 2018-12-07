<template>
  <el-header>
    <div class="sysInfo">
      <div class="sysIcon">
        <i class="iconfont icon-tubiao"></i>
      </div>
      <div class="sysText">XXX系统</div>
      <div class="navMenuBtn" @click="collapseChange">
        <i :class="['iconfont', {'icon-shouqi' : !isCollapse, 'icon-zhankai' : isCollapse}]"></i>
      </div>
    </div>
    <div class="info">
      <el-dropdown trigger="click" placement="top">
        <div class="userInfo">
          <div class="userImg">
            <img src="../../assets/images/touxiang.png" alt="头像">
          </div>
          <div class="userName">
            <p onselectstart="return false">马晓川</p>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="infoDropdown" style="width: 130px;">
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
  name: "hader",
  data() {
    return {
      dropdownMenuList: [
        { icon: "icon-shezhi", text: "设置", disabled: true },
        { icon: "icon-suoping", text: "锁屏", disabled: false },
        { icon: "icon-tuichu", text: "退出", disabled: false }
      ]
    };
  },
  computed: {
    ...mapState(["isCollapse"])
  },

  methods: {
    ...mapMutations(["collapseChange"]),
    dropdownMenu(res) {
      switch (res) {
        case "设置":
          //
          break;
        case "锁屏":
          this.$router.push("lockScreen");
          break;
        case "退出":
          this.$router.push("login");
          break;
      }
    }
  }
};
</script>
<style lang="less">
.el-header {
  background-color: #fff;
  text-align: center;
  width: 100%;
  height: 60px;
  padding: 0;
  display: flex;
  justify-content: space-between;

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
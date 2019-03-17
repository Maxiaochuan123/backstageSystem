<template>
  <div class="lockScreen">
    <el-container>
      <div class="lockScreenBox">
        <div class="lockScreenItem">
          <div class="content">
            <div class="logoBox">
              <div class="logo">
                <img :src="companyLogo" alt>
              </div>
              <div class="logoName">用户权限管理系统</div>
            </div>

            <div class="lockScreenForm">
              <el-form ref="form" :model="form" :rules="rules">
                <div class="passWord">
                  <el-form-item prop="passWord">
                    <el-input
                      placeholder="请输密码"
                      v-model.trim="form.passWord"
                      type="password"
                      clearable
                      @keyup.enter.native="onSubmit"
                    >
                      <template slot="prepend">
                        <i class="iconfont icon-suoping"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="submit">
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">
                      <i :class=" isLock ? 'iconfont icon-kaisuo' : 'iconfont icon-guansuo' "></i>
                    </el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="banner">
          <Swiper :autoPlay="true" :showIndicator="false" interval="3000" duration="800">
            <Slide v-for="(item, index) in bannerList" :key="index">
              <img :src="item" alt="banner">
            </Slide>
          </Swiper>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { Swiper, Slide } from "vue-swiper-component";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Swiper,
    Slide
  },
  data() {
    return {
      isLock: false,
      companyLogo: this.imagesPath.companyLogo,
      bannerList: this.imagesPath.lockScreenBanner,
      form: {
        passWord: ""
      },
      rules: {
        passWord: { required: true, message: "请输入密码", trigger: "blur" }
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    if(this.isLockScreen){
      next();
    }else{
      next('/lockScreen');
    }
  },
  computed: {
    ...mapState(["isLockScreen"])
  },
  methods: {
    ...mapMutations(["lockScreenChange_ok", "lockScreenChange_no"]),
    onSubmit() {
      this.isLock = true;

      let unlockPwdStr = this.storage.localGet("unlockPwd");
      unlockPwdStr = this.tool.decAse192(unlockPwdStr, "unlockPwd");

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (unlockPwdStr == this.form.passWord) {
            this.$store.commit('lockScreenChange_ok');
            setTimeout(() => {
              this.$router.push("/");
              this.$store.commit('lockScreenChange_no');
            }, 200);
          } else {
            this.$store.commit('lockScreenChange_no');
            this.isLock = false;
            this.$message.error("密码错误");
          }
        } else {
          this.isLock = false;
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.lockScreen {
  width: 100vw;
  height: 100vh;
  background-color: #f6f7f9;
  position: relative;

  .lockScreenBox {
    width: 1200px;
    height: 600px;
    border-radius: 4px;
    margin: calc((100vh - 600px) / 2) auto 0;
    box-shadow: 0px 0px 20px 4px #dedede;
    display: flex;

    .lockScreenItem {
      width: 400px;
      height: 100%;
      padding: 50px;
      background-color: #fff;
      box-sizing: border-box;

      .content {
        width: 100%;
        height: 100%;

        .logoBox {
          width: 100%;
          height: 50px;
          margin-top: 30px;
          background-color: #fff;
          display: flex;

          .logo {
            img {
              width: 30px;
              height: 30px;
            }
          }
          .logoName {
            color: #606266;
            padding-left: 10px;
            line-height: 30px;
          }
        }

        .lockScreenForm {
          width: 100%;
          height: 300px;
          margin-top: 100px;
          background-color: #fff;

          .userName,
          .password {
            margin-bottom: 20px;
          }

          .el-form-item__error {
            left: 38px;
          }

          .el-input-group__prepend {
            background-color: #fff;
            padding: 8px;

            .icon-suoping {
              font-size: 18px;
            }
          }

          .submit {
            display: flex;
            justify-content: center;
            margin-top: 30px;

            .iconfont {
              font-size: 28px;
            }
            .el-button--primary {
              width: 250px;
              padding: 4px 20px;

              border: none;
              border-radius: 2px;
              box-shadow: 0px 0px 4px 0px #4886ff;
            }
            .el-button--primary:active {
              background-color: #71a0fb;
            }
          }
        }
      }
    }
    .banner {
      width: 800px;
      height: 100%;

      .wh_content {
        height: 100%;
        .wh_swiper {
          height: 100% !important;
          .wh_slide {
            height: 100%;
            img {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
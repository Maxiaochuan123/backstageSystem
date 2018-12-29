<template>
  <div class="login">
    <el-container>
      <div class="loginBox">
        <div class="loginItem">
          <div class="content">
            <div class="logoBox">
              <div class="logo">
                <img :src="companyLogo" alt>
              </div>
              <div class="logoName">xxx 系统</div>
            </div>

            <div class="loginForm">
              <el-form ref="form" :model="form" :rules="rules">
                <div class="username">
                  <el-form-item prop="username">
                    <el-input placeholder="请输用户名" v-model.trim="form.username" clearable>
                      <template slot="prepend">
                        <i class="iconfont icon-yonghu"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="password">
                  <el-form-item prop="password">
                    <el-input placeholder="请输密码" v-model.trim="form.password" type="password" clearable @keyup.enter.native="onSubmit">
                      <template slot="prepend">
                        <i class="iconfont icon-guansuo"></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="submit">
                  <div class="rememberPwd">
                    <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
                  </div>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="isLogin">Login</el-button>
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
import { mapState } from "vuex";
export default {
  components: {
    Swiper,
    Slide
  },
  data() {
    return {
      isLogin: false,
      companyLogo: this.imagesPath.companyLogo,
      bannerList: this.imagesPath.loginBanner,
      form: {
        username: this.storage.localGet("userName") || "",
        password: ""
      },
      rules: {
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" }
      }
    };
  },
  computed: {
    ...mapState(["rememberPwd"]),
    rememberPwd: {
      //由于 v-model 与 vuex 机制冲突会报错, 所以需要写成  get / set 的形式
      get() {
        // 记住密码
        if (this.$store.state.rememberPwd) {
          let userName = this.storage.localGet("userName");
          let passWord = this.storage.localGet("unlockPwd");
          passWord = passWord ? this.tool.decAse192(passWord, "unlockPwd") : '';

          if (userName && passWord) {
            if (!this.form.password) {
              this.form.username = userName;
              this.form.password = passWord;
            }
          }
        }
        return this.$store.state.rememberPwd;
      },
      set(newValue) {
        if(this.form.username && this.form.password){
          this.$store.state.rememberPwd = newValue;
          this.storage.localSet("rememberPwd", newValue);
        }
      }
    }
  },
  methods: {
    onSubmit() {
      this.isLogin = true;

      let unlockPwdStr = this.tool.encAse192(this.form.password, "unlockPwd");
      this.storage.localSet("userName", this.form.username); //用于记住密码使用
      this.storage.localSet("unlockPwd", unlockPwdStr); //用于记住密码 / 锁屏密码使用

      // 用于 welcome 页欢迎语, 区分是否第一次登陆
      let loginTag = this.storage.localGet("loginTag");
      if (loginTag >= 0) {
        this.storage.localSet("loginTag", ++loginTag);
      } else {
        this.storage.localSet("loginTag", 0);
      }

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.api.login(this.form).then(res => {
            if (res.code != "SYS.200") {
              this.$message.error(res.message);
              setTimeout(() => (this.isLogin = false), 500);
            } else {
              this.$router.push("/");
            }
          });
        } else {
          this.isLogin = false;
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background-color: #f6f7f9;
  position: relative;

  .loginBox {
    width: 1200px;
    height: 600px;
    border-radius: 4px;
    margin: calc((100vh - 600px) / 2) auto 0;
    box-shadow: 0px 0px 20px 4px #dedede;
    display: flex;

    .loginItem {
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

        .loginForm {
          width: 100%;
          height: 300px;
          margin-top: 100px;
          background-color: #fff;

          .username,
          .password {
            margin-bottom: 20px;
          }

          .el-form-item__error {
            left: 38px;
          }

          .el-input-group__prepend {
            background-color: #fff;
            padding: 8px;
            width: 20px;
            position: relative;

            .iconfont {
              position: absolute;
              top: 8px;
              left: 6px;
            }
            .icon-yonghu {
              font-size: 22px;
            }
            .icon-guansuo {
              top: 4px;
              left: 4px;
              font-size: 28px;
            }
          }

          .submit {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;

            .rememberPwd {
              line-height: 40px;
              padding-left: 10px;

              .el-checkbox {
                color: #999;
                .el-checkbox__label {
                  font-size: 12px;
                }
              }
            }
            .el-button--primary {
              width: 100px;

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
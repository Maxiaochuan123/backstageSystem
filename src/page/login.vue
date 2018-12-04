<template>
  <div class="login">

    <el-container>
      <div class="loginBox">
        <div class="loginItem">
          <div class="content">
            <div class="logoBox">
              <div class="logo"><img src="../../src/assets/images/touxiang.png" alt=""></div>
              <div class="logoName">xxx 系统</div>
            </div>

            <div class="loginForm">
              <el-form ref="form" :model="form" :rules="rules">
                <div class="userName">
                  <el-form-item prop="userName">
                    <el-input placeholder="请输用户名" v-model.trim="form.userName" clearable>
                      <template slot="prepend"><i class="iconfont icon-suoping"></i></template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="passWord">
                  <el-form-item prop="passWord">
                    <el-input placeholder="请输密码" v-model.trim="form.passWord" type="password" clearable>
                      <template slot="prepend"><i class="iconfont icon-suoping"></i></template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="submit">
                  <div class="forgetPassWord">Forget PassWord？</div>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit"  :loading="isLogin">Login</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="banner">
          <Swiper :autoPlay='true' :showIndicator='false'  interval="3000" duration="800">
              <Slide v-for="(item, index) in bannerList" :key="index"><img :src="item" alt="banner"></Slide>
          </Swiper>
        </div>
      </div>

    </el-container>
  </div>
</template>

<script>
  import { Swiper, Slide } from 'vue-swiper-component';

 export default {
   name: "login",
   components: {
      Swiper,
      Slide
  },
   data(){
      return {
        isLogin: false,
        bannerList:['../../static/banner/image.jpg', '../../static/banner/image2.jpg', '../../static/banner/image3.jpg'],
        form:{
          userName: 'admin',
          passWord:'admin'
        },
        rules:{
          userName:{required: true, message: '请输入用户名', trigger: 'blur'},
          passWord:{required: true, message: '请输入密码', trigger: 'blur'}
        }
     }
   },
   methods:{
     onSubmit(){
      this.isLogin = true;
       this.$refs['form'].validate((valid) => {
        if (valid) { 
          setTimeout(()=>{
            if(1 == 1) this.$router.push('/')
          }, 0)
        } else {
          this.isLogin = false;
          return false;
        }
      })
     }
   }
 }
</script>
<style lang="less">
 .login{
  width: 100vw;
  height: 100vh;
  background-color: #F6F7F9;
  position: relative;

  .bottomBanner{
      width: 500px;
      height: 100vh;
      position: absolute;
      // background-color: #71a0fb;
      // overflow: hidden;
    img{
      width: 550px;
      height: 180px;
      position: absolute;
    }
    img:nth-child(1){
      top: 174px;
      left: 60px;
    }
    img:nth-child(2){
      top: 380px;
      left: 60px;
    }
    img:nth-child(3){
      bottom: 170px;
      left: 60px;
    }
  }

  .loginBox{
    z-index: 2;

    width: 1200px;
    height: 600px;
    border-radius: 4px;
    margin: calc( (100vh - 600px) / 2)  auto 0;
    box-shadow: 0px 0px 20px 4px #dedede;
    display: flex;

    .loginItem{
      width: 400px;
      height: 100%;
      padding: 50px;
      background-color: #fff;
      box-sizing: border-box;

      .content{
        width: 100%;
        height: 100%;
        // background-color: rgb(8, 69, 116);

        .logoBox{
          width: 100%;
          height: 50px;
          margin-top: 30px;
          background-color: #fff;
          display: flex;

          .logo{
            img{
              width: 50px;
              height: 50px;
            }
          }
          .logoName{
            line-height: 50px;
          }
        }

        .loginForm{
          width: 100%;
          height: 300px;
          margin-top: 100px;
          background-color: #fff;

          .userName , .password{
            margin-bottom: 20px;
          }
          
          .el-form-item__error{
            left: 38px;
          }

          .el-input-group__prepend{
            background-color: #fff;
            padding: 10px;
          }

          .submit{
            display: flex;
            justify-content: space-between;
            margin-top: 30px;

            .forgetPassWord{
              color: #999;
              font-size: 12px;
              line-height: 40px;
              padding-left: 10px;
            }
            .el-button--primary{
              // display: block;
              // margin: 0 auto;
              width: 100px;
              

              // background-color: #4886FF;
              border: none;
              border-radius: 2px;
              box-shadow: 0px 0px 4px 0px #4886FF;

            }
            .el-button--primary:active{
                background-color: #71a0fb;
              }
          }
        }


      }
    }
    .banner{
      width: 800px;
      height: 100%;
      // background-color: #4A74A3;

      .wh_content{
        height: 100%;
        .wh_swiper{
          height: 100% !important;
          .wh_slide{
            height: 100%;
            img{
              height: 100%;
            }
          }
        }
        
      }
    }
  }
 }
</style>
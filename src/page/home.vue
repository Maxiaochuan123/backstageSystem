<template>
  <!-- 锁屏，退出 -->
  <div id="home">
    <el-container>
      <el-header>
        <div class="sysInfo">
          <div class="sysIcon">
            <i class="iconfont icon-tubiao"></i>
          </div>
          <div class="sysText">XXX系统</div>
          <div class="navMenuBtn" @click="isCollapse = !isCollapse">
            <i :class="['iconfont', {'icon-shouqi' : !isCollapse, 'icon-zhankai' : isCollapse}]"></i>
          </div>
        </div>
        <div class="info">
          <el-dropdown trigger="click" placement="top">
            <div class="userInfo">
              <div class="userImg">
                <img src="../assets/images/touxiang.png" alt="头像">
              </div>
              <div class="userName">
                <p>马晓川</p>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown" class="infoDropdown" style="width: 130px;">
              <el-dropdown-item><i class="iconfont icon-shezhi" style="display:inline-block; width: 30px;"></i><span>设置</span></el-dropdown-item>
              <el-dropdown-item><i class="iconfont icon-suoping" style="display:inline-block; width: 30px;"></i><span>锁屏</span></el-dropdown-item>
              <el-dropdown-item><i class="iconfont icon-tuichu" style="display:inline-block; width: 30px;"></i><span>退出</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          

          <!-- <div class="sysTool">
            <i class="iconfont icon-shezhi"></i>
          </div> -->
        </div>
      </el-header>

      <el-container>
        <el-aside>
          <el-menu default-active="1-4-1" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">导航一</span>
              </template>
              <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="login">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <span slot="title">选项4</span>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <div id="switchPage"></div>

          <div id="contentBox">
            <el-row>
              <el-col :span="24">
                <!-- <ul>
                  <li v-for="(item, index) in 100" :key="index">{{item}}</li>
                </ul> -->
                <transition name="el-fade-in-linear">
                  <router-view/>
                </transition>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
  export default {
   name: "home",
   data(){
      return {
        isCollapse: false, //菜单状态
     }
   },
    created(){

   },
   methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
 }
</script>
<style lang="less" scoped>
@import url('../../static/package/css/basic.less');

 #home{
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    height: 100%;
    text-align: left;
  }

  .el-menu--collapse{
    height: 100%;
  }
   
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  
  .el-header {
    background-color: #fff;
    text-align: center;
    height: 60px;
    padding: 0;
    display: flex;
    justify-content: space-between;

    .sysInfo{
      width: 290px;
      height: 100%;
      box-sizing: border-box;
      padding-left: 30px;
      display: flex;
      background-color: #4380D3;
      .sysIcon{
        width: 50px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-tubiao{
          color: #fff;
          font-size: 30px;
        }
      }
      .sysText{
        width: 160px;
        height: 100%;
        line-height: 60px;
        text-align: left;
        padding-left: 10px;
        color: #fff;
        // background-color: #FF6600;
      }

      .navMenuBtn{
        width: 40px;
        height: 100%;
        cursor: pointer;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-zhankai{
          color: #606266;
        }
      }
    }

    .info{
      width: auto;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .userInfo{
        min-width: 120px;
        // height: 60px;
        // border-radius: 50%;
        margin-right: 10px;
        // background-color: #FF6600;
        display: flex;
        justify-content: center;
        align-items: center;

        .userName{
          margin-left: 10px;
          p{
            color: #606266;
          }
        }

        .userImg{
          width: 40px;
          height: 40px;

          img{
            width:100%;
            height:100%;
          }
        }
        
      }
    }
  }

  .el-aside {
    background-color: #D3DCE6;
    text-align: center;
    width: auto !important;
    height: calc(100vh - 60px);
  }

  .el-main {
    background-color: #F1F2F7;
    text-align: center;
    height: calc(100vh - 60px);
    padding: 8px;

    #switchPage{
      height: 40px;
      background-color: #fff;
    }

    #contentBox{
      width: 100%;
      height: calc(100% - 50px);
      margin-top: 10px;
      overflow-y: scroll;
      background-color: rgb(85, 146, 204);

      ul li{
        line-height: 50px;
      }
    }

    #contentBox::-webkit-scrollbar {/*滚动条整体样式*/
      width: 6px;
    }

    #contentBox::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 4px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #C0C0C0;
    }

    #contentBox::-webkit-scrollbar-track {/*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #EDEDED;
    }
  }

 }
</style>
<template>
  <transition name="setupPanel">
    <div class="setupPanel" v-if="isSetupPanel">
      <div class="close"><i class="iconfont icon-cuowu"></i></div>
      <div class="themeBox">
        <p>主题色</p>
        <div class="colorBlock">
          <div :style="{backgroundColor:`#${color}`}" v-for="(color,index) in colorBlockList" :key="index" @click="checkColorBlock(index,color)">
            <i class="el-icon-check" v-show="parseInt(activeColorBlock.index) == index"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import '../../../static/package/css/theme/chuanwulan/index.css'; //船坞蓝
import '../../../static/package/css/theme/jsthong/index.css'; //杰斯特红
export default {
  data() {
    return {
      activeColorBlock: this.storage.localGet('activeColorBlock') || {index:0,color:'#A6002C'},
      colorBlockList:['A6002C','5285C4']
      // ,'#FE7D00','#FE6F54','#0639A2','#F8A00A','#F13B23','#557490'
    };
  },
  computed: {
    ...mapState(["isSetupPanel"])
  },
  mounted(){
    this.toggleClass(document.body, 'custom-' + 'A6002C');
  },
  methods:{
    checkColorBlock(index, color){
      this.activeColorBlock.index = index;
      this.storage.localSet('activeColorBlock',{index:index, color:color});
      this.toggleClass(document.body, 'custom-' + color);
      // this.changeTheme(color);
    },

    // 换肤添加class函数
    toggleClass(element, className) {
      if (!element || !className) {
        return
      }
      element.className = className
    },
    // 切换主题函数
    // changeTheme(themeValue) {
    //   // 需要移到单独的文件存放
    //   const cssArray = this.themeArray
    //   for (let i = 0, len = cssArray.length; i < len; i++) {
    //     const itemPath = './' + themeValue.toLowerCase() + '/' + cssArray[i].toLowerCase() + '.css'
    //     loadCss(itemPath)
    //   }
    //   function loadCss(path) {
    //     const head = document.getElementsByTagName('head')[0]
    //     const link = document.createElement('link')
    //     link.href = path
    //     link.rel = 'stylesheet'
    //     link.type = 'text/css'
    //     head.appendChild(link)
    //   }
    // }
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
    // border-bottom: 1px solid #e8e8e8;
    i{
      font-size: 26px;
    }
  }

  .themeBox{
    margin-top: 20px;
    p{
      text-align: left;
      color: #606266;
      margin-bottom: 16px;
    }
    .colorBlock{
      display: flex;
      div{
        width: 20px;
        height: 20px;
        cursor: pointer;
        border-radius: 2px;
        color: #fff;
        margin-right: 10px;
        i{
          line-height: 22px;
        }
      }
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
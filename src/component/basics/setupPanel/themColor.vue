<template>
  <div class="themeBox">
    <p>主题色</p>
    <div class="colorBlock">
      <div v-for="(item,index) in colorBlockList" :key="index">
        <el-tooltip :content="item.describe" placement="top" effect="light">
          <div :style="{backgroundColor:`#${item.color}`}"  @click="checkColorBlock(index,item.color)">
            <i class="el-icon-check" v-show="themeColor.index == index"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import '../../../../static/package/css/theme/bomu/index.css'; //薄暮
// import '../../../../static/package/css/theme/huoshan/index.css'; //火山
// import '../../../../static/package/css/theme/rimu/index.css'; //日暮
// import '../../../../static/package/css/theme/mingqing/index.css'; //明青
// import '../../../../static/package/css/theme/jiguanglv/index.css'; //极光绿
import '../../../../static/package/css/theme/chuanwulan/index.css'; //船坞蓝
// import '../../../../static/package/css/theme/jikelan/index.css'; //极客蓝
// import '../../../../static/package/css/theme/jiangzi/index.css'; //酱紫
import '../../../../static/package/css/common.scss';
export default {
  data() {
    return {
      colorBlockList:[
        {color:'F5222D',describe:'薄暮'},{color:'FA541C',describe:'火山'},
        {color:'FAAD14',describe:'日暮'},{color:'13C2C2',describe:'明青'},
        {color:'52C41A',describe:'极光绿'},{color:'4380d3',describe:'船坞蓝'},
        {color:'2F54EB',describe:'极客蓝'},{color:'722ED1',describe:'酱紫'}
      ]
    };
  },
  computed: {
    ...mapState(["themeColor"])
  },
  watch:{
    themeColor:{
      handler(newVal){
        this.tool.toggleClass(document.body, "custom-" + newVal.color);
      },
      deep: true
    }
  },
  methods:{
    ...mapMutations(["themeColorChange","setupPanelClose"]),
    checkColorBlock(index, color){
      this.$store.commit("themeColorChange",{index:index, color:color})
    }
  }
};
</script>
<style lang="scss">
  .themeBox{
    margin-top: 20px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e8e8e8;
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
</style>
<template>
  <el-aside class="aside">
    <el-menu :default-active="currentPath" class="el-menu-vertical-demo" router :default-openeds="['system']" :collapse="isCollapse">
      <!-- children' in aside 如果存在 子节点才渲染  -->
      <el-submenu index="1" v-if="aside.children.length > 0" v-for="(aside, i) in asideList" :key="i">
        <template slot="title">
          <i :class="aside.icon"></i>
          <span slot="title">{{aside.name}}</span>
        </template>

        <!-- 二级菜单 -->
        <div v-for="(aside_2, i2) in aside.children" :key="i2">
          <!-- <el-submenu index="2" v-if="aside_2.children.length > 0">
            <span slot="title">{{aside_2.name}}</span>
            <el-menu-item :index="aside_3.url" v-for="(aside_3, i3) in aside_2.children" :key="i3">
              {{aside_3.name}}
            </el-menu-item>
          </el-submenu> -->
          <el-menu-item :index="aside_2.url">{{aside_2.name}}</el-menu-item>
        </div>
      </el-submenu>
      <!--不存在 子节点 直接渲染  -->
      <el-menu-item :index="aside.url" v-else>{{aside.name}}</el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "",
  data() {
    return {
      currentPath: this.storage.sessionGet("currentPath"),
      // upMenu: this.storage.localGet('upMenu'),
      asideList:[
        {
          name:'系统管理',
          url:'system',
          icon:'iconfont icon-shezhi',

          children:[{
            name:'区域管理',
            url:'region',
            icon:'iconfont icon-quyupaixu'
          },{
            name:'机构管理',
            url:'mechanism',
            icon:'iconfont icon-zuzhi'
          },{
            name:'角色管理',
            url:'role',
            icon:'iconfont icon-jiaoseguanli1'
          },{
            name:'用户管理',
            url:'user',
            icon:'iconfont icon-jiaoseguanli'
          },{
            name:'菜单管理',
            url:'menu',
            icon:'iconfont icon-caidan'
          }]
        }
      ]
    };
  },
  computed: {
    ...mapState(["isCollapse"])
    // , "asideList"
  },
  methods: {

  },
  created() {
    this.getUserMenu();
  }
};
</script>
<style lang="scss">
.aside {
  overflow-y: auto;
  height: calc(100vh - 60px);

  .el-menu{
    border-right: none !important;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    height: 100%;
    text-align: left;
  }

  .el-menu--collapse {
    height: 100%;
  }
  .iconfont {
    font-size: 18px;
  }
  .children {
    .iconfont {
      font-size: 16px;
    }
  }
  .aside .el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 100%px;
  }
}
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #dadbe2;
  }

.el-aside {
  text-align: center;
  width: auto !important;
  z-index: 20;
  box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
}
</style>
<template>
  <el-aside class="aside">
    <el-menu :default-active="currentPath" class="el-menu-vertical-demo" router :default-openeds="['1']" :collapse="isCollapse">
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
      <el-menu-item :index="aside.url" v-else>
        <i :class="aside.icon"></i>
        <span slot="title">{{aside.name}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      asideList:[
        {
          name:'上传图像',
          url:'uploadImage',
          icon:'iconfont icon-quyupaixu',
          children:[]
        }
      ]
    };
  },
  computed: {
    ...mapState(["isCollapse", "currentPath"])
  },
  methods: {
  },
  created() {
    
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

.el-aside {
  text-align: center;
  width: auto !important;
  z-index: 20;
  box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
}
</style>
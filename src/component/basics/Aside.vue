<template>
  <el-aside>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" router :collapse="isCollapse">
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
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "",
  data() {
    return {
      num1:1,
      num2:15
    };
  },
  computed:{
    ...mapState(['isCollapse'])
  },
  methods: {}
};
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  height: 100%;
  text-align: left;
}

.el-menu--collapse {
  height: 100%;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.el-aside {
  background-color: #d3dce6;
  text-align: center;
  width: auto !important;
  height: calc(100vh - 60px);
}
</style>
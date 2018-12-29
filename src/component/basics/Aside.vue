<template>
  <el-aside>
    <el-menu :default-active="currentPath" class="el-menu-vertical-demo" router :collapse="isCollapse">
        <!-- children' in aside 如果存在 子节点才渲染  -->
        <el-submenu :index="aside.routerName" v-if="'children' in aside" v-for="(aside, i) in asideList" :key="i"> 
          <template slot="title">
            <i :class="aside.icon"></i>
            <span slot="title">{{aside.name}}</span>
          </template>
          <div v-for="(aside_1, i2) in aside.children" :key="i2">
            <el-menu-item :index="aside_1.routerName" >{{aside_1.name}}</el-menu-item>

            <el-submenu :index="aside_1_1.routerName" v-for="(aside_1_1, i3) in aside_1.children" :key="i3">
              <span slot="title">{{aside_1_1.name}}</span>
              <el-menu-item :index="aside_1_1.routerName">{{aside_1_1.name}}</el-menu-item>
            </el-submenu>

          </div>
        </el-submenu>

        <!--不存在 子节点 直接渲染  -->
        <el-menu-item :index="aside.routerName" v-else>
          <i :class="aside.icon"></i>
          <span slot="title">{{aside.name}}</span>
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
      currentPath: this.storage.sessionGet('currentPath'),
      asideList:[{
        name:'导航一',
        routerName:'cw',
        icon:'el-icon-location',
        permission:['cw'],
        children:[{
          name:'财务',
          routerName:'cw',
          permission:['cw']
        },{
          name:'物流',
          routerName:'wl',
          permission:['wl']
        },{
          name:'其他',
          routerName:'qt',
          permission:['qt'],
          children:[{
            name:'children1',
            routerName:'children1',
            permission:['children1']
          }]
        }]
      },{
        name:'导航二',
        routerName:'ss',
        icon:'el-icon-menu',
        permission:['wl']
      },{
        name:'导航三',
        routerName:'ww',
        icon:'el-icon-setting',
        permission:['wl']
      }]
    };
  },
  computed:{
    ...mapState(['isCollapse'])
  },
  methods: {}
};
</script>
<style lang="scss">
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
  z-index: 20;
  box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
}
</style>
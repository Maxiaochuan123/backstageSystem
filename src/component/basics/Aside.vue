<template>
  <el-aside class="aside">
    <el-menu :default-active="currentPath" class="el-menu-vertical-demo" router :collapse="isCollapse">
        <!-- children' in aside 如果存在 子节点才渲染  -->
        <el-submenu :index="aside.routerLink" v-if="'children' in aside" v-for="(aside, i) in asideList" :key="i"> 
          <template slot="title">
            <i :class="aside.icon "></i>
            <span slot="title">{{aside.name}}</span>
          </template>
          <div v-for="(aside_1, i2) in aside.children" :key="i2" class="children">
            <!-- 一级 children -->
            <el-menu-item :index="aside_1.routerLink" >
              <i :class="aside_1.icon "></i>
              <span>{{aside_1.name}}</span>
            </el-menu-item>
            <!-- 二级 children -->
            <el-submenu :index="aside_1_1.routerLink" v-for="(aside_1_1, i3) in aside_1.children" :key="i3">
              <span slot="title">{{aside_1_1.name}}</span>
              <el-menu-item :index="aside_1_1.routerLink">{{aside_1_1.name}}</el-menu-item>
            </el-submenu>

          </div>
        </el-submenu>

        <!--不存在 子节点 直接渲染  -->
        <el-menu-item :index="aside.routerLink" v-else>
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
      // asideList:[{
      //   name:'导航一',
      //   routerLink:'cw',
      //   icon:'el-icon-location',
      //   permission:['cw'],
      //   children:[{
      //     name:'财务',
      //     routerLink:'cw',
      //     permission:['cw']
      //   },{
      //     name:'物流',
      //     routerLink:'wl',
      //     permission:['wl']
      //   },{
      //     name:'其他',
      //     routerLink:'qt',
      //     permission:['qt'],
      //     children:[{
      //       name:'children1',
      //       routerLink:'children1',
      //       permission:['children1']
      //     }]
      //   }]
      // },{
      //   name:'导航二',
      //   routerLink:'ss',
      //   icon:'el-icon-menu',
      //   permission:['wl']
      // },{
      //   name:'导航三',
      //   routerLink:'ww',
      //   icon:'el-icon-setting',
      //   permission:['wl']
      // }]
      asideList:[{
        name:'系统管理',
        routerLink:'region',
        icon:'iconfont icon-shezhi',

        children:[{
          name:'区域管理',
          routerLink:'region',
          icon:'iconfont icon-quyupaixu'
        },{
          name:'组织架构',
          routerLink:'organization',
          icon:'iconfont icon-zuzhi'
        },{
          name:'角色管理',
          routerLink:'role',
          icon:'iconfont icon-jiaoseguanli1'
        },{
          name:'用户管理',
          routerLink:'user',
          icon:'iconfont icon-jiaoseguanli'
        }]
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
.aside{
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    height: 100%;
    text-align: left;
  }

  .el-menu--collapse {
    height: 100%;
  }
  .iconfont{
    font-size: 18px;
  }
  .children{
    .iconfont{
      font-size: 16px;
    }
  }
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
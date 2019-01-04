import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 页面框架
const Home = () => import("../page/basics/home");
const Login = () => import("../page/basics/login");
const LockScreen = () => import("../page/basics/lockScreen");
const NotFound = () => import("../page/basics/notFound");
const Welcome = () => import("../page/basics/welcome");

// 管理
const Region = () => import("../page/administration/region"); //区域管理
const Organization = () => import("../page/administration/organization"); //组织架构
const Role = () => import("../page/administration/role"); //角色管理
const User = () => import("../page/administration/user"); //用户管理

// keepAlive:true
// permission 菜单访问权限
// privilege 按钮操作权限

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/welcome",
      name: "Home",
      component: Home,
      meta: {
        title: "首页"
      },
      children: [
        {
          path: "/welcome",
          name: "Welcome",
          component: Welcome,
          meta: {
            title: "欢迎"
          }
        },
        {
          path: "/region",
          name: "region",
          component: Region,
          meta: {
            title: "区域管理"
          }
        },
        {
          path: "/organization",
          name: "organization",
          component: Organization,
          meta: {
            title: "组织架构"
          }
        },
        {
          path: "/role",
          name: "role",
          component: Role,
          meta: {
            title: "角色管理"
          }
        },
        {
          path: "/user",
          name: "user",
          component: User,
          meta: {
            title: "用户管理"
          }
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/lockScreen",
      name: "LockScreen",
      component: LockScreen
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem("token")) {
    next();
  } else {
    if (to.path == "/login") {
      //多判断一次路径 避免 死循环
      next();
    } else {
      next("/login");
    }
  }
});

export default router;

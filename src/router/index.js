import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 路由懒加载
const Home = () => import("../page/basics/home");
const Login = () => import("../page/basics/login");
const LockScreen = () => import("../page/basics/lockScreen");
const NotFound = () => import("../page/basics/notFound");
const Welcome = () => import("../page/basics/welcome");

// cw
const Cw = () => import("../page/caiwu/cw");
const Wl = () => import("../page/caiwu/wl");
const UpImage = () => import("../component/upload/UpImage");

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
          path: "/cw",
          name: "cw",
          component: Cw,
          meta: {
            title: "财务表"
          }
        },
        {
          path: "/wl",
          name: "wl",
          component: Wl,
          meta: {
            title: "物流表"
          }
        },
        {
          path: "/upimage",
          name: "upimage",
          component: UpImage,
          meta: {
            title: "UpImage"
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
